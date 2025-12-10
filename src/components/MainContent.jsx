import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

// Import semua komponen
import Hero from './Hero';
import RecipeDetail from './RecipeDetail';
import AuthForm from './AuthForm';
import ArticleList from './ArticleList';
import FilterBar from './FilterBar';
import RecipeGrid from './RecipeGrid';
import LockedContent from './LockedContent';
import AddRecipeForm from './AddRecipeForm';

const MainContent = ({ 
  nav, 
  currentUser, 
  loadingData, 
  displayedRecipes, 
  allRecipes, 
  onRefreshRecipes, 
  onDeleteRecipe    
}) => {
  
  // State untuk menyimpan status Admin
  const [isAdmin, setIsAdmin] = useState(false);

  // Helper: List kategori untuk filter
  const categoriesList = ['All', ...new Set(allRecipes.map(r => r.category))];

  // --- [ADMIN CHECK] Cek apakah user adalah Admin ---
  useEffect(() => {
    const checkUserRole = async () => {
      if (currentUser) {
        // Ambil data role dari tabel 'profiles' berdasarkan ID user yang login
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', currentUser.id)
          .single();
        
        // Jika role-nya 'admin', set isAdmin jadi true
        if (!error && data && data.role === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };

    checkUserRole();
  }, [currentUser]); 

  // 1. LOGIN View
  if (nav.isLoginPage) {
    return <AuthForm onCancel={nav.goHome} onLoginSuccess={() => nav.setIsLoginPage(false)} />;
  }

  // 2. ARTICLE View
  if (nav.isArticlePage) {
    return currentUser ? (
      <ArticleList currentUser={currentUser} />
    ) : (
      <AuthForm onCancel={nav.goHome} onLoginSuccess={() => nav.setIsLoginPage(false)} />
    );
  }

  // 3. ADD RECIPE View (Halaman Tambah Resep)
  if (nav.isAddRecipePage) {
    // Keamanan Frontend: Jika bukan admin, kembalikan ke Home
    if (!isAdmin) {
      alert("Maaf, hanya Admin yang boleh menambah resep.");
      nav.goHome();
      return null;
    }

    return currentUser ? (
      <AddRecipeForm 
        currentUser={currentUser} 
        onCancel={nav.goHome} 
        onSuccess={async () => {
          // Refresh data agar resep baru muncul di Grid
          if (onRefreshRecipes) await onRefreshRecipes(); 
          nav.goHome();
        }} 
      />
    ) : (
      <AuthForm onCancel={nav.goHome} onLoginSuccess={() => nav.setIsLoginPage(false)} />
    );
  }

  // 4. RECIPE DETAIL View (Detail Resep & Komentar)
  if (nav.selectedRecipe) {
    return (
      <RecipeDetail 
        recipe={nav.selectedRecipe} 
        onClose={nav.handleCloseDetail} 
        currentUser={currentUser} 
        
        // [PENTING] Kirim status Admin ke Detail agar tombol hapus muncul
        isAdmin={isAdmin} 

        // [DELETE LOGIC] Fungsi Hapus Resep Khusus Admin
        onDelete={() => {
          const recipeId = nav.selectedRecipe.id;
          
          // Konfirmasi ekstra untuk Admin
          if (window.confirm(`[ADMIN] Yakin ingin MENGHAPUS resep "${nav.selectedRecipe.title}" secara permanen?`)) {
            
            // Panggil fungsi hapus dari props (useRecipes hook)
            onDeleteRecipe(recipeId).then((success) => {
              if (success) {
                alert("Resep berhasil dihapus.");
                nav.handleCloseDetail(); // Tutup modal jika sukses
              }
            });
          }
        }}
      />
    );
  }

  // 5. MAIN DASHBOARD View (Hero + Filter + Grid)
  return (
    <>
      <Hero />
      
      {/* Filter & Sort Bar */}
      <FilterBar 
        activeCategory={nav.activeCategory}
        showFilterMenu={nav.showFilterMenu}
        setShowFilterMenu={nav.setShowFilterMenu}
        categoriesList={categoriesList}
        onFilterClick={nav.handleFilterClick}
        recipeSectionRef={nav.recipeSectionRef}
        
        sortOption={nav.sortOption}
        showSortMenu={nav.showSortMenu}
        setShowSortMenu={nav.setShowSortMenu}
        onSortClick={nav.handleSortClick}
      />

      {currentUser ? (
        <RecipeGrid 
          loading={loadingData}
          recipes={displayedRecipes}
          searchQuery={nav.searchQuery}
          activeCategory={nav.activeCategory}
          onRecipeClick={nav.handleOpenRecipe}
          
          // Tombol "+ Tambah" hanya aktif jika user adalah ADMIN
          onAddRecipe={isAdmin ? nav.goToAddRecipe : null} 
        />
      ) : (
        <LockedContent onLoginClick={() => nav.setIsLoginPage(true)} />
      )}
    </>
  );
};

export default MainContent;