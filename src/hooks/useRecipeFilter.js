import { useState, useEffect } from 'react';

// [UPDATE] Terima sortOption sebagai parameter
export const useRecipeFilter = (allRecipes, activeCategory, searchQuery, sortOption = 'newest') => {
  const [displayedRecipes, setDisplayedRecipes] = useState([]);

  useEffect(() => {
    if (allRecipes.length === 0) return;

    let result = [];

    // 1. FILTERING
    if (searchQuery.trim() !== '') {
      // --- LOGIKA PENCARIAN ---
      // Cari di SELURUH data (CSV + Database) tanpa peduli kategori
      result = allRecipes.filter(r => 
        r.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else {
      // --- LOGIKA KATEGORI ---
      if (activeCategory === 'All') {
        const uniqueCategories = [...new Set(allRecipes.map(r => r.category))];
        
        result = uniqueCategories.map(cat => {
          // [PERBAIKAN PENTING DI SINI]
          // Jika user memilih "Terbaru", ambil resep PALING BARU (paling bawah di array) sebagai perwakilan
          if (sortOption === 'newest') {
             // reverse() sementara untuk mencari yang paling akhir/baru
             return [...allRecipes].reverse().find(r => r.category === cat);
          }
          // Jika "Terlama" atau "A-Z", ambil yang pertama ketemu (default)
          return allRecipes.find(r => r.category === cat);
        }).filter(Boolean);
        
      } else {
        // Filter sesuai kategori spesifik (Olahan Ayam, dll)
        result = allRecipes.filter(r => r.category === activeCategory);
      }
    }

    // 2. SORTING
    // Salin array dulu dengan [...result] agar aman
    switch (sortOption) {
      case 'a-z':
        result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'z-a':
        result = [...result].sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'oldest':
        // Biarkan urutan asli (index 0 = terlama)
        break;
      case 'newest':
      default:
        // Balik urutan agar yang baru (index terakhir) jadi di atas
        result = [...result].reverse();
        break;
    }
    
    setDisplayedRecipes(result);
  }, [allRecipes, activeCategory, searchQuery, sortOption]);

  return displayedRecipes;
};