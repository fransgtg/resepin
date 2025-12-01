import React, { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse'; 
import './App.css';

// --- IMPORT KOMPONEN UI ---
import NavBar from './components/NavBar';
import Hero from './components/Hero';
import RecipeCard from './components/RecipeCard';
import RecipeDetail from './components/RecipeDetail';
import AuthForm from './components/AuthForm';
import ArticleList from './components/ArticleList';

// --- GAMBAR DEFAULT ---
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop";

/* Ikon Filter */
const FilterIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
  </svg>
);

function App() {

  // STATE
  const [allRecipes, setAllRecipes] = useState([]);
  const [displayedRecipes, setDisplayedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState('All'); 
  const [searchQuery, setSearchQuery] = useState(''); 
  const [showFilterMenu, setShowFilterMenu] = useState(false); 

  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isLoginPage, setIsLoginPage] = useState(false);
  const [isArticlePage, setIsArticlePage] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const recipeSectionRef = useRef(null);


  // Menentukan kategori dari nama file
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


  // LOAD DATA CSV
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
                  const formattedData = results.data.map((item, index) => ({
                    id: `${file}-${index}`, 
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
        setLoading(false);

      } catch (error) {
        console.error("Gagal load CSV:", error);
        setLoading(false);
      }
    };

    loadCsvData();
  }, []);



  // FILTERING: berdasarkan kategori & search query
  useEffect(() => {
    if (allRecipes.length === 0) return;

    let result = allRecipes;

    // Filter Kategori
    if (activeCategory !== 'All') {
      result = result.filter(r => r.category === activeCategory);
    }

    // Filter Search
    if (searchQuery.trim() !== '') {
      result = result.filter(r => 
        r.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } 
    // Jika kategori All dan tidak ada search → tampilkan perwakilan
    else if (activeCategory === 'All') {
      const uniqueCategories = [...new Set(allRecipes.map(r => r.category))];
      result = uniqueCategories.map(cat => {
        return allRecipes.find(r => r.category === cat);
      }).filter(Boolean);
    }

    setDisplayedRecipes(result);

  }, [allRecipes, activeCategory, searchQuery]);


  // HANDLERS
  const handleFilterClick = (category) => {
    setActiveCategory(category);
    setShowFilterMenu(false);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (recipeSectionRef.current && currentUser) {
      recipeSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  };

  const goHome = () => {
    setSelectedRecipe(null);
    setIsLoginPage(false);
    setIsArticlePage(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToRecipes = () => {
    setSelectedRecipe(null);
    setIsLoginPage(false);
    setIsArticlePage(false);
    setTimeout(() => {
      recipeSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const goToArticle = () => {
    if (currentUser) {
      setIsArticlePage(true);
      setSelectedRecipe(null);
      setIsLoginPage(false);
    } else {
      setIsLoginPage(true);
      setSelectedRecipe(null);
      setIsArticlePage(false);
    }
  };

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    setIsLoginPage(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    goHome();
  };


  const categoriesList = ['All', ...new Set(allRecipes.map(r => r.category))];


  return (
    <div className="app-main">
      
      {/* NAVBAR */}
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
          
          /* PERBAIKAN: Menambahkan prop onClose */
          <RecipeDetail 
            recipe={selectedRecipe} 
            onClose={() => setSelectedRecipe(null)} 
          />
          
        ) : (
          <>
            <Hero />
            

            {/* FILTER AREA */}
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
                          onClick={() => setSelectedRecipe(item)} 
                        />
                      ))
                    ) : (
                      <p>Tidak ada resep ditemukan.</p>
                    )}
                  </div>
                </>
              )
            ) : (

              // LOCKED VIEW (belum login)
              <div className="locked-content" style={{ marginTop: '20px', textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🔐</div>
                <h3 style={{ color: '#151e32', marginBottom: '10px' }}>Koleksi Resep Terkunci</h3>
                <p style={{ color: '#666', marginBottom: '20px' }}>
                  Silakan login untuk mengakses ribuan resep nusantara secara gratis.
                </p>
                <button 
                  className="btn-login-redirect" 
                  onClick={() => setIsLoginPage(true)}
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