import React from 'react';
import './App.css';

// --- CUSTOM HOOKS (LOGIKA) ---
import { useAuth } from './hooks/useAuth';
import { useRecipes } from './hooks/useRecipes';
import { useRecipeNavigation } from './hooks/useRecipeNavigation';
import { useRecipeFilter } from './hooks/useRecipeFilter';

// --- KOMPONEN UI ---
import NavBar from './components/NavBar';
import MainContent from './components/MainContent'; 

function App() {
  // 1. DATA & AUTH
  const { currentUser, logout } = useAuth();
  
  // Ambil data resep beserta fungsi refresh dan delete
  const { allRecipes, loadingData, refreshRecipes, deleteRecipe } = useRecipes();

  // 2. NAVIGASI (URL & State Halaman)
  const nav = useRecipeNavigation(allRecipes);

  // 3. FILTERING & SORTING
  const displayedRecipes = useRecipeFilter(
    allRecipes, 
    nav.activeCategory, 
    nav.searchQuery,
    nav.sortOption
  );

  return (
    <div className="app-main">
      <NavBar 
        // 1. Navigasi Dasar
        onGoHome={nav.goHome} 
        onLoginClick={() => { 
          nav.setIsLoginPage(true); 
          nav.setSelectedRecipe(null); 
          nav.setIsArticlePage(false); 
        }}
        onArticleClick={nav.goToArticle}
        onRecipeClick={nav.goToRecipes}
        
        // 2. Pencarian
        onSearch={nav.handleSearch} 
        
        // 3. User & Logout
        currentUser={currentUser}
        onLogout={() => { logout(); nav.goHome(); }}
      />
      
      <main className="container">
        {/* Serahkan urusan konten ke MainContent */}
        <MainContent 
          nav={nav}
          currentUser={currentUser}
          loadingData={loadingData}
          displayedRecipes={displayedRecipes}
          allRecipes={allRecipes}
          
          // [PENTING] Kirim fungsi refresh agar data terupdate otomatis setelah nambah resep
          onRefreshRecipes={refreshRecipes}
          
          // [PENTING] Kirim fungsi hapus
          onDeleteRecipe={deleteRecipe}
        />
      </main>
    </div>
  );
}

export default App;