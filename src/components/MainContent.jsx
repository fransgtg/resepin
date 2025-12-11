import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

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
  
  const [isAdmin, setIsAdmin] = useState(false);

  const categoriesList = ['All', ...new Set(allRecipes.map(r => r.category))];

  useEffect(() => {
    const checkUserRole = async () => {
      if (currentUser) {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', currentUser.id)
          .single();

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


  // 1. LOGIN PAGE
  if (nav.isLoginPage) {
    return (
      <AuthForm 
        onCancel={nav.goHome} 
        onLoginSuccess={() => nav.setIsLoginPage(false)} 
      />
    );
  }

  // 2. ARTICLE PAGE
  if (nav.isArticlePage) {
    return currentUser ? (
      <ArticleList currentUser={currentUser} />
    ) : (
      <AuthForm 
        onCancel={nav.goHome} 
        onLoginSuccess={() => nav.setIsLoginPage(false)} 
      />
    );
  }

  // 3. ADD RECIPE PAGE
  if (nav.isAddRecipePage) {
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
          if (onRefreshRecipes) await onRefreshRecipes();
          nav.goHome();
        }}
      />
    ) : (
      <AuthForm 
        onCancel={nav.goHome} 
        onLoginSuccess={() => nav.setIsLoginPage(false)} 
      />
    );
  }

  // 4. RECIPE DETAIL PAGE
  if (nav.selectedRecipe) {
    return (
      <RecipeDetail 
        recipe={nav.selectedRecipe}
        onClose={nav.handleCloseDetail}
        currentUser={currentUser}
        isAdmin={isAdmin}
        onDelete={() => {
          const recipeId = nav.selectedRecipe.id;

          if (window.confirm(`[ADMIN] Yakin ingin menghapus resep "${nav.selectedRecipe.title}" secara permanen?`)) {
            onDeleteRecipe(recipeId).then((success) => {
              if (success) {
                alert("Resep berhasil dihapus.");
                nav.handleCloseDetail();
              }
            });
          }
        }}
      />
    );
  }

  // 5. MAIN HOMEPAGE
  return (
    <>
      <Hero />

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

          activeSort={nav.sortOption}   // sorting dikirim ke RecipeGrid

          onRecipeClick={nav.handleOpenRecipe}
          onAddRecipe={isAdmin ? nav.goToAddRecipe : null}
        />
      ) : (
        <LockedContent 
          onLoginClick={() => nav.setIsLoginPage(true)} 
        />
      )}
    </>
  );
};

export default MainContent;