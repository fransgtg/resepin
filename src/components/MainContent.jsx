import React from 'react';

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
  onRefreshRecipes, // [IMPORTANT] Receive refresh function
  onDeleteRecipe    // [IMPORTANT] Receive delete function
}) => {
  
  // Helper: List categories for dropdown filter
  const categoriesList = ['All', ...new Set(allRecipes.map(r => r.category))];

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
    return currentUser ? (
      <AddRecipeForm 
        onCancel={nav.goHome} 
        onSuccess={() => {
          nav.goHome();
          // Call refresh function so the latest data appears!
          if (onRefreshRecipes) onRefreshRecipes(); 
        }} 
        currentUser={currentUser} 
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
        // Pass delete function to RecipeDetail
        onDelete={() => {
          if (window.confirm("Apakah Anda yakin ingin menghapus resep ini?")) {
            // Delete recipe based on ID
            onDeleteRecipe(nav.selectedRecipe.id).then((success) => {
              if (success) nav.handleCloseDetail(); // Close detail if delete successful
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
      
      {/* Send sorting props to FilterBar */}
      <FilterBar 
        activeCategory={nav.activeCategory}
        showFilterMenu={nav.showFilterMenu}
        setShowFilterMenu={nav.setShowFilterMenu}
        categoriesList={categoriesList}
        onFilterClick={nav.handleFilterClick}
        recipeSectionRef={nav.recipeSectionRef}
        
        // New Sort Props
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
          // Connect navigation function to Grid so the "+" card works
          onAddRecipe={nav.goToAddRecipe} 
        />
      ) : (
        <LockedContent onLoginClick={() => nav.setIsLoginPage(true)} />
      )}
    </>
  );
};

export default MainContent;