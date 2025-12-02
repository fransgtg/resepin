import React, { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse'; 
import { supabase } from './supabaseClient'; // [PENTING] Import koneksi Supabase
import './App.css';

// --- IMPORT KOMPONEN UI ---
import NavBar from './components/NavBar';
import Hero from './components/Hero';
import RecipeCard from './components/RecipeCard';
import RecipeDetail from './components/RecipeDetail';
import AuthForm from './components/AuthForm';
import ArticleList from './components/ArticleList';

// --- GAMBAR DEFAULT ---
const DEFAULT_IMAGE = "logoresepin.jpg";

/* Ikon Filter */
const FilterIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
  </svg>
);

function App() {
  // --- STATE ---
  const [allRecipes, setAllRecipes] = useState([]);
  const [displayedRecipes, setDisplayedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState('All'); 
  const [searchQuery, setSearchQuery] = useState(''); 
  const [showFilterMenu, setShowFilterMenu] = useState(false); 
  
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isLoginPage, setIsLoginPage] = useState(false);
  const [isArticlePage, setIsArticlePage] = useState(false);

  // --- STATE USER (SUPABASE AUTH) ---
  const [currentUser, setCurrentUser] = useState(null);

  const recipeSectionRef = useRef(null);

  // Helper Kategori
  const getCategoryName = (fileName) => {
    const name = fileName.toLowerCase();
    if (name.includes('ayam')) return "Olahan Ayam";
    if (name.includes('ikan')) return "Olahan Ikan";
    if (name.includes('kambing')) return "Olahan Kambing";
    if (name.includes('sapi')) return "Olahan Sapi";
    if (name.includes('tahu')) return "Olahan Tahu";
    if (name.includes('telur')) return "Olahan Telur";
    if (name.includes('tempe')) return "Olahan Tempe";
    if (name.includes('udang')) return "Olahan Udang";
    return "Aneka Resep";
  };

  // --- EFFECT 1: CEK LOGIN SUPABASE (Backend) ---
  useEffect(() => {
    // Fungsi untuk memformat data user dari session Supabase
    const formatUser = (user) => {
      if (!user) return null;
      return {
        id: user.id,
        email: user.email,
        // Ambil nama dari metadata (saat register) atau username dari email
        name: user.user_metadata?.full_name || user.email.split('@')[0]
      };
    };

    // 1. Cek sesi saat ini (saat pertama load/refresh)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setCurrentUser(formatUser(session.user));
      }
    };
    checkSession();

    // 2. Dengarkan perubahan login/logout secara real-time
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setCurrentUser(formatUser(session.user));
      } else {
        setCurrentUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // --- EFFECT 2: LOAD DATA CSV ---
  useEffect(() => {
    const loadCsvData = async () => {
      setLoading(true);
      const tempRecipes = [];
      
      const files = [
        '/data/dataset-ayam.csv', 
        '/data/dataset-ikan.csv', 
        '/data/dataset-kambing.csv',
        '/data/dataset-sapi.csv',
        '/data/dataset-tahu.csv',
        '/data/dataset-telur.csv',
        '/data/dataset-tempe.csv',
        '/data/dataset-udang.csv'  
      ];

      try {
        for (const file of files) {
          try {
            const response = await fetch(file);
            if (!response.ok) continue;
            
            const reader = response.body.getReader();
            const result = await reader.read(); 
            const decoder = new TextDecoder('utf-8');
            const csv = decoder.decode(result.value); 
            
            await new Promise((resolve) => {
              Papa.parse(csv, {
                header: true, 
                skipEmptyLines: true,
                complete: (results) => {
                  const categoryName = getCategoryName(file);
                  // Bersihkan ID dari karakter aneh agar URL dan Database aman
                  const cleanFileName = file.split('/').pop().replace('.csv', '');

                  const formattedData = results.data.map((item, index) => ({
                    id: `${cleanFileName}-${index}`, 
                    title: item.Title,      
                    ingredients: item.Ingredients ? item.Ingredients.split('--') : [],
                    steps: item.Steps ? item.Steps.split('--') : [],
                    loves: item.Loves,      
                    url: item.URL,          
                    img: DEFAULT_IMAGE, 
                    category: categoryName
                  }));
                  
                  const validData = formattedData.filter(r => r.title && r.title.trim() !== "");
                  tempRecipes.push(...validData);
                  resolve();
                }
              });
            });
          } catch (err) {
            console.error(`Error file ${file}:`, err);
          }
        }

        setAllRecipes(tempRecipes);
        
        const uniqueCategories = [...new Set(tempRecipes.map(r => r.category))];
        const representativeRecipes = uniqueCategories.map(cat => {
          return tempRecipes.find(r => r.category === cat);
        }).filter(Boolean);
        setDisplayedRecipes(representativeRecipes);

        setLoading(false);
        
      } catch (error) {
        console.error("Gagal load CSV:", error);
        setLoading(false);
      }
    };

    loadCsvData();
  }, []);

  // --- EFFECT 3: BACA URL (RESTORE POSISI) ---
  useEffect(() => {
    if (allRecipes.length === 0) return;

    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get('kategori');
    const recipeIdParam = params.get('resep');
    const pageParam = params.get('page');

    // 1. Restore Halaman Artikel
    if (pageParam === 'artikel') {
      setIsArticlePage(true);
      setSelectedRecipe(null);
      setIsLoginPage(false);
    } 
    // 2. Restore Detail Resep
    else if (recipeIdParam) {
      const foundRecipe = allRecipes.find(r => r.id === recipeIdParam);
      if (foundRecipe) {
        setSelectedRecipe(foundRecipe);
      }
    }

    // 3. Restore Kategori
    if (categoryParam) {
      const isValidCategory = allRecipes.some(r => r.category === categoryParam);
      if (isValidCategory || categoryParam === 'All') {
        setActiveCategory(categoryParam);
      }
    }
  }, [allRecipes]); 

  // --- LOGIKA FILTER & SEARCH ---
  useEffect(() => {
    if (allRecipes.length === 0) return;

    let result = allRecipes;

    if (searchQuery.trim() !== '') {
      result = result.filter(r => 
        r.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else {
      if (activeCategory === 'All') {
        const uniqueCategories = [...new Set(allRecipes.map(r => r.category))];
        result = uniqueCategories.map(cat => {
          return allRecipes.find(r => r.category === cat);
        }).filter(Boolean);
      } else {
        result = result.filter(r => r.category === activeCategory);
      }
    }
    setDisplayedRecipes(result);
  }, [searchQuery, activeCategory, allRecipes]);


  // --- HANDLERS ---
  
  const handleOpenRecipe = (item) => {
    setSelectedRecipe(item);
    const url = new URL(window.location);
    url.searchParams.set('resep', item.id);
    url.searchParams.delete('page'); 
    window.history.pushState({}, '', url);
  };

  const handleCloseDetail = () => {
    setSelectedRecipe(null);
    const url = new URL(window.location);
    url.searchParams.delete('resep');
    window.history.pushState({}, '', url);

    setTimeout(() => {
      if (recipeSectionRef.current) {
        recipeSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleFilterClick = (category) => {
    setActiveCategory(category);
    setSearchQuery('');
    setShowFilterMenu(false);

    const url = new URL(window.location);
    url.searchParams.set('kategori', category);
    url.searchParams.delete('resep');
    url.searchParams.delete('page');
    window.history.pushState({}, '', url);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) setActiveCategory('All');
  };

  const goHome = () => {
    setSelectedRecipe(null);
    setIsLoginPage(false);
    setIsArticlePage(false);
    setActiveCategory('All');
    
    window.history.pushState({}, '', window.location.pathname);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToRecipes = () => {
    setSelectedRecipe(null);
    setIsLoginPage(false);
    setIsArticlePage(false);
    
    const url = new URL(window.location);
    url.searchParams.delete('page');
    url.searchParams.delete('resep');
    window.history.pushState({}, '', url);

    setTimeout(() => {
      if (recipeSectionRef.current) {
        recipeSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const goToArticle = () => {
    setIsArticlePage(true);
    setSelectedRecipe(null);
    setIsLoginPage(false);

    const url = new URL(window.location);
    url.searchParams.set('page', 'artikel');
    url.searchParams.delete('resep');
    url.searchParams.delete('kategori');
    window.history.pushState({}, '', url);
  };

  const handleLoginSuccess = () => {
    // Tidak perlu set user manual, karena Listener Supabase di useEffect akan menangkapnya
    setIsLoginPage(false);
  };

  const handleLogout = async () => {
    // Logout dari Supabase
    await supabase.auth.signOut();
    goHome();
  };

  const categoriesList = ['All', ...new Set(allRecipes.map(r => r.category))];

  return (
    <div className="app-main">
      <NavBar 
        onGoHome={goHome} 
        onLoginClick={() => {
          setIsLoginPage(true);
          setSelectedRecipe(null);
          setIsArticlePage(false);
        }}
        onArticleClick={goToArticle}
        onRecipeClick={goToRecipes}
        onSearch={handleSearch} 
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      
      <main className="container">
        
        {isLoginPage ? (
          <AuthForm onCancel={goHome} onLoginSuccess={handleLoginSuccess} />
        ) : isArticlePage ? (
          currentUser ? (
            <ArticleList currentUser={currentUser} />
          ) : (
            <AuthForm onCancel={goHome} onLoginSuccess={handleLoginSuccess} />
          )
        ) : selectedRecipe ? (
          
          <RecipeDetail 
            recipe={selectedRecipe} 
            onClose={handleCloseDetail} 
            currentUser={currentUser} 
          />

        ) : (
          <>
            <Hero />
            
            <div className="filters" ref={recipeSectionRef} style={{ position: 'relative' }}>
               <button 
                 className={`btn-filter ${showFilterMenu ? 'active' : ''}`}
                 onClick={() => setShowFilterMenu(!showFilterMenu)}
                 style={{ minWidth: '200px', justifyContent: 'space-between' }}
               >
                 {activeCategory === 'All' ? 'Filter Kategori' : activeCategory}
                 <FilterIcon />
               </button>

               {showFilterMenu && (
                 <div className="filter-dropdown">
                   {categoriesList.map((cat, idx) => (
                     <div 
                       key={idx} 
                       className={`filter-item ${activeCategory === cat ? 'active' : ''}`}
                       onClick={() => handleFilterClick(cat)}
                     >
                       {cat === 'All' ? 'Tampilkan Perwakilan Menu' : cat}
                     </div>
                   ))}
                 </div>
               )}
            </div>

            {/* GRID RESEP */}
            {currentUser ? (
              loading ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                  <p style={{ fontSize: '1.2rem', color: '#666' }}>Sedang menyajikan resep...</p>
                </div>
              ) : (
                <>
                  <h3 style={{ marginBottom: '20px', color: '#151e32', fontFamily: 'Poppins, sans-serif' }}>
                    {searchQuery 
                      ? `Hasil Pencarian: "${searchQuery}"` 
                      : (activeCategory === 'All' ? 'Inspirasi Menu Hari Ini' : `Koleksi ${activeCategory}`)
                    }
                  </h3>

                  <div className="recipe-grid">
                    {displayedRecipes.length > 0 ? (
                      displayedRecipes.map((item) => (
                        <RecipeCard 
                          key={item.id} 
                          title={item.title} 
                          img={item.img} 
                          category={item.category} 
                          onClick={() => handleOpenRecipe(item)} 
                        />
                      ))
                    ) : (
                      <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '20px', color: '#888' }}>
                        <p>Tidak ada resep ditemukan untuk "{searchQuery}".</p>
                      </div>
                    )}
                  </div>
                </>
              )
            ) : (
              <div className="locked-content" style={{ marginTop: '20px', textAlign: 'center', padding: '40px', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: '20px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🔐</div>
                <h3 style={{ color: '#151e32', marginBottom: '10px' }}>Koleksi Resep Terkunci</h3>
                <p style={{ color: '#666', marginBottom: '20px' }}>
                  Silakan login untuk mengakses ribuan resep nusantara secara gratis.
                </p>
                <button 
                  className="btn-login-redirect" 
                  onClick={() => setIsLoginPage(true)}
                  style={{
                    backgroundColor: '#f97316', color: 'white', padding: '12px 30px', 
                    border: 'none', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer'
                  }}
                >
                  Login untuk Melihat Resep
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;