import React from 'react';
import './App.css';
import { useAuth } from './services/useAuth';
import { useRecipes } from './services/useRecipes';
import { useRecipeNavigation } from './hooks/useRecipeNavigation';
import { useRecipeFilter } from './hooks/useRecipeFilter';
import NavBar from './components/NavBar';
import MainContent from './components/MainContent'; 

function App() {
  // 1. DATA & AUTH
  const { currentUser, logout } = useAuth();

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
        <MainContent 
          nav={nav}
          currentUser={currentUser}
          loadingData={loadingData}
          displayedRecipes={displayedRecipes}
          allRecipes={allRecipes}

          onRefreshRecipes={refreshRecipes}

          onDeleteRecipe={deleteRecipe}
        />
      </main>
    </div>
  );
}

export default App;