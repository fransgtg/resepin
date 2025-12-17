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

    if (searchQuery.trim() !== '') {
      result = allRecipes.filter((r) =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    else {
      if (activeCategory === 'Perwakilan') {
        result = [...allRecipes]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 9);
      }

      else if (activeCategory === 'All') {
        result = [...allRecipes];
      }

      else {
        result = allRecipes.filter((r) => r.category === activeCategory);
      }
    }

    switch (sortOption) {
      case 'a-z':
        result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        break;

      case 'z-a':
        result = [...result].sort((a, b) => b.title.localeCompare(a.title));
        break;

      case 'oldest':
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