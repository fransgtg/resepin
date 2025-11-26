import React, { useState } from 'react';
import './App.css';

// --- IMPORT KOMPONEN UI ---
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import RecipeCard from './components/RecipeCard';
import RecipeDetail from './components/RecipeDetail';

/* Ikon Filter (Sisa satu icon spesifik halaman ini) */
const ChevronDown = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);
const FilterIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
  </svg>
);

function App() {
  // State untuk menyimpan resep yang sedang dipilih (Detail)
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // --- DATA RESEP (HANYA GAMBAR & INFO DASAR) ---
  // Detail langkah & bahan dihapus sementara untuk persiapan backend
  const recipes = [
    { 
      id: 1, 
      title: "Oseng Tempe", 
      img: "https://i.pinimg.com/1200x/9a/07/c4/9a07c403dfafb27273c4c82d8a419191.jpg", 
      time: "15 Menit",
      difficulty: "Mudah"
    },
    { 
      id: 2, 
      title: "Capcai Kuah", 
      img: "capcai.jpg"
    },
    { 
      id: 3, 
      title: "Sayur Asem", 
      img: "https://images.unsplash.com/photo-1604152135912-04a022e23696?q=80&w=800&auto=format&fit=crop"
    }
  ];

  return (
    <div className="app-main">
      {/* Navbar kirim fungsi reset ke Home */}
      <Navbar onGoHome={() => setSelectedRecipe(null)} />
      
      <main className="container">
        
        {/* LOGIKA PERPINDAHAN HALAMAN */}
        {selectedRecipe ? (
          
          /* 1. TAMPILAN DETAIL */
          <RecipeDetail recipe={selectedRecipe} />
          
        ) : (
          
          /* 2. TAMPILAN HOME */
          <>
            <Hero />
            
            <div className="filters">
               <button className="btn-filter">
                 Telusuri berdasarkan <ChevronDown />
               </button>
               <button className="btn-filter">
                 Show Filters <FilterIcon />
               </button>
            </div>

            <div className="recipe-grid">
              {recipes.map((item) => (
                <RecipeCard 
                  key={item.id} 
                  title={item.title} 
                  img={item.img} 
                  onClick={() => setSelectedRecipe(item)} 
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;