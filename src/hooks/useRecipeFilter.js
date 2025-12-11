import { useState, useEffect } from 'react';

export const useRecipeFilter = (
  allRecipes,
  activeCategory,
  searchQuery,
  sortOption = 'newest'
) => {
  const [displayedRecipes, setDisplayedRecipes] = useState([]);

  useEffect(() => {
    if (!allRecipes || allRecipes.length === 0) {
      setDisplayedRecipes([]);
      return;
    }

    let result = [...allRecipes];

    // -----------------------------------------------------
    // 1. SEARCH FILTER
    // -----------------------------------------------------
    if (searchQuery.trim() !== '') {
      result = allRecipes.filter((r) =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // -----------------------------------------------------
    // 2. CATEGORY FILTER
    // -----------------------------------------------------
    else {
      // PERWAKILAN MENU → tampilkan 9 resep terbaru
      if (activeCategory === 'Perwakilan') {
        result = [...allRecipes]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 9);
      }

      // ALL → tampil semua resep
      else if (activeCategory === 'All') {
        result = [...allRecipes];
      }

      // KATEGORI BIASA → tampil semua resep kategori tersebut
      else {
        result = allRecipes.filter((r) => r.category === activeCategory);
      }
    }

    // -----------------------------------------------------
    // 3. SORTING
    // -----------------------------------------------------
    switch (sortOption) {
      case 'a-z':
        result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        break;

      case 'z-a':
        result = [...result].sort((a, b) => b.title.localeCompare(a.title));
        break;

      case 'oldest':
        // default order (no reverse)
        break;

      case 'newest':
      default:
        result = [...result].reverse();
        break;
    }

    setDisplayedRecipes(result);
  }, [allRecipes, activeCategory, searchQuery, sortOption]);

  return displayedRecipes;
};