import { useState, useEffect, useRef } from 'react';

export const useRecipeNavigation = (allRecipes) => {
  const [activeCategory, setActiveCategory] = useState('All'); 
  const [searchQuery, setSearchQuery] = useState(''); 
  const [showFilterMenu, setShowFilterMenu] = useState(false); 

  const [sortOption, setSortOption] = useState('newest');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isLoginPage, setIsLoginPage] = useState(false);
  const [isArticlePage, setIsArticlePage] = useState(false);
  const [isAddRecipePage, setIsAddRecipePage] = useState(false);

  const recipeSectionRef = useRef(null);

  const updateUrl = (params) => {
    const url = new URL(window.location);
    if (params.reset) {
      url.searchParams.delete('resep');
      url.searchParams.delete('page');
      url.searchParams.delete('kategori');
    }
    Object.keys(params).forEach(key => {
      if (key !== 'reset') url.searchParams.set(key, params[key]);
    });
    window.history.pushState({}, '', url);
  };

  useEffect(() => {
    if (allRecipes.length === 0) return;
    
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get('kategori');
    const recipeIdParam = params.get('resep');
    const pageParam = params.get('page');

    if (pageParam === 'artikel') {
      setIsArticlePage(true); setSelectedRecipe(null); setIsLoginPage(false); setIsAddRecipePage(false);
    } else if (pageParam === 'tambah-resep') {
      setIsAddRecipePage(true); setIsArticlePage(false); setSelectedRecipe(null); setIsLoginPage(false);
    } else if (recipeIdParam) {
      const foundRecipe = allRecipes.find(r => r.id === recipeIdParam);
      if (foundRecipe) setSelectedRecipe(foundRecipe);
    }
    
    if (categoryParam) {
      const isValid = allRecipes.some(r => r.category === categoryParam);
      if (isValid || categoryParam === 'All') setActiveCategory(categoryParam);
    }
  }, [allRecipes]);

  const handleOpenRecipe = (item) => {
    setSelectedRecipe(item);
    updateUrl({ reset: true, resep: item.id });
  };

  const handleCloseDetail = () => {
    setSelectedRecipe(null);
    const url = new URL(window.location);
    url.searchParams.delete('resep');
    window.history.pushState({}, '', url);
    setTimeout(() => {
      if (recipeSectionRef.current) recipeSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleFilterClick = (category) => {
    setActiveCategory(category);
    setSearchQuery('');
    setShowFilterMenu(false);
    updateUrl({ reset: true, kategori: category });
  };

  const handleSortClick = (option) => {
    setSortOption(option);
    setShowSortMenu(false);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) setActiveCategory('All');
  };

  const goHome = () => {
    setSelectedRecipe(null); setIsLoginPage(false); setIsArticlePage(false); setIsAddRecipePage(false); setActiveCategory('All');
    window.history.pushState({}, '', window.location.pathname);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToRecipes = () => {
    setSelectedRecipe(null); setIsLoginPage(false); setIsArticlePage(false); setIsAddRecipePage(false);
    const url = new URL(window.location);
    url.searchParams.delete('page'); url.searchParams.delete('resep');
    window.history.pushState({}, '', url);
    setTimeout(() => {
      if (recipeSectionRef.current) recipeSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const goToArticle = () => {
    setIsArticlePage(true); setSelectedRecipe(null); setIsLoginPage(false); setIsAddRecipePage(false);
    updateUrl({ reset: true, page: 'artikel' });
  };

  const goToAddRecipe = () => {
    setIsAddRecipePage(true); setIsArticlePage(false); setSelectedRecipe(null); setIsLoginPage(false);
    updateUrl({ reset: true, page: 'tambah-resep' });
  };

  return {
    activeCategory, setActiveCategory,
    searchQuery, setSearchQuery,
    showFilterMenu, setShowFilterMenu,
    sortOption, setSortOption, 
    showSortMenu, setShowSortMenu,
    
    selectedRecipe, setSelectedRecipe,
    isLoginPage, setIsLoginPage,
    isArticlePage, setIsArticlePage,
    isAddRecipePage, setIsAddRecipePage,
    recipeSectionRef,

    handleOpenRecipe,
    handleCloseDetail,
    handleFilterClick,
    handleSortClick, 
    handleSearch,
    goHome,
    goToRecipes,
    goToArticle,
    goToAddRecipe
  };
};