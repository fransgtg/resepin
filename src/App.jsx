import React, { useState } from 'react';
import './App.css';

// --- IMPORT KOMPONEN UI ---
import NavBar from './components/NavBar'; // Pastikan nama filenya NavBar.jsx
import Hero from './components/Hero';
import RecipeCard from './components/RecipeCard';
import RecipeDetail from './components/RecipeDetail';
import AuthForm from './components/AuthForm';

/* Ikon Filter (Khusus halaman ini) */
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
  // --- STATE NAVIGASI ---
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isLoginPage, setIsLoginPage] = useState(false);
  
  // State untuk menyimpan User yang sedang login
  const [currentUser, setCurrentUser] = useState(null);

  // --- DATA RESEP SEDERHANA ---
  const recipes = [
    { 
      id: 1, 
      title: "Oseng Tempe", 
      img: "/tempeoseng.jpg", 
      time: "15 Menit",
      difficulty: "Mudah"
    },
    { 
      id: 2, 
      title: "Capcai Kuah", 
      img: "/capcai.jpg", 
      time: "20 Menit",
      difficulty: "Menengah"
    },
    { 
      id: 3, 
      title: "Sayur Asem", 
      img: "/sayurasem.jpg", 
      time: "30 Menit",
      difficulty: "Mudah"
    }
  ];

  // Fungsi Reset ke Home
  const goHome = () => {
    setSelectedRecipe(null);
    setIsLoginPage(false);
  };

  // Fungsi Saat Login Berhasil
  const handleLoginSuccess = (userData) => {
    console.log("User berhasil login:", userData);
    setCurrentUser(userData); // Simpan data user ke state utama
    setIsLoginPage(false);    // Tutup form login & kembali ke home
  };

  // Fungsi Saat Log Out
  const handleLogout = () => {
    console.log("User logout");
    setCurrentUser(null); // 1. Hapus data user (tombol jadi Login/Register lagi)
    goHome(); // 2. Kembalikan tampilan ke halaman utama (Home)
  };

  return (
    <div className="app-main">
      {/* Navbar: Mengirimkan semua fungsi dan data yang dibutuhkan */}
      <NavBar 
        onGoHome={goHome} 
        onLoginClick={() => {
          setIsLoginPage(true); // Buka halaman login
          setSelectedRecipe(null); // Pastikan detail resep tertutup
        }}
        currentUser={currentUser} // Kirim data user untuk cek status login
        onLogout={handleLogout}   // Kirim fungsi logout ke Navbar
      />
      
      <main className="container">
        
        {/* --- LOGIKA PERPINDAHAN HALAMAN (SWITCHING) --- */}
        
        {isLoginPage ? (
          
          /* TAMPILAN 1: HALAMAN LOGIN / REGISTER */
          /* Kirim fungsi handleLoginSuccess agar form bisa melapor kalau sukses */
          <AuthForm onCancel={goHome} onLoginSuccess={handleLoginSuccess} />
          
        ) : selectedRecipe ? (
          
          /* TAMPILAN 2: DETAIL RESEP */
          <RecipeDetail recipe={selectedRecipe} />
          
        ) : (
          
          /* TAMPILAN 3: HOME (DEFAULT) */
          <>
            {/* Slider Gambar Besar */}
            <Hero />
            
            {/* Tombol Filter */}
            <div className="filters">
               <button className="btn-filter">
                 Telusuri berdasarkan <ChevronDown />
               </button>
               <button className="btn-filter">
                 Show Filters <FilterIcon />
               </button>
            </div>

            {/* Grid Kartu Resep */}
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