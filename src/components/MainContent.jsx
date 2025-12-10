import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

// Import components for display
import Hero from './Hero';
import RecipeDetail from './RecipeDetail';
import AuthForm from './AuthForm';
import ArticleList from './ArticleList';
import FilterBar from './FilterBar';
import RecipeGrid from './RecipeGrid';
import LockedContent from './LockedContent';
// Import Add Recipe Form
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

  // Helper: List categories for dropdown filter
  const categoriesList = ['All', ...new Set(allRecipes.map(r => r.category))];

  // --- CEK ROLE ADMIN ---
  useEffect(() => {
    const checkUserRole = async () => {
      if (currentUser) {
        // Ambil data role dari tabel 'profiles' berdasarkan ID user yang login
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', currentUser.id)
          .single();
        
        // Jika tidak error dan role-nya 'admin', set isAdmin jadi true
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
  }, [currentUser]); // Cek ulang setiap kali user login/logout

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

  // 3. ADD RECIPE View (Form Page)
  if (nav.isAddRecipePage) {
    // Keamanan Ganda: Jika bukan admin, tendang ke Home
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
          // Panggil refresh data dulu agar saat kembali ke Home, resep baru sudah ada
          if (onRefreshRecipes) await onRefreshRecipes(); 
          nav.goHome();
        }} 
      />
    ) : (
      <AuthForm onCancel={nav.goHome} onLoginSuccess={() => nav.setIsLoginPage(false)} />
    );
  }

  // 4. RECIPE DETAIL View
  if (nav.selectedRecipe) {
    return (
      <RecipeDetail 
        recipe={nav.selectedRecipe} 
        onClose={nav.handleCloseDetail} 
        currentUser={currentUser} 
        // Logika Hapus yang Lebih Aman
        onDelete={() => {
          const recipeId = nav.selectedRecipe.id;
          
          if (window.confirm(`Yakin ingin menghapus resep "${nav.selectedRecipe.title}"?`)) {
            onDeleteRecipe(recipeId).then((success) => {
              if (success) {
                nav.handleCloseDetail(); 
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
        
        // Sorting Props
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
          
          // [PENTING] Tombol "+ Tambah" hanya aktif jika user adalah ADMIN
          onAddRecipe={isAdmin ? nav.goToAddRecipe : null} 
        />
      ) : (
        <LockedContent onLoginClick={() => nav.setIsLoginPage(true)} />
      )}
    </>
  );
};

export default MainContent;