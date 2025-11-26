import React, { useState } from 'react';

// --- BAGIAN IMPORT GAMBAR ---
// SAYA COMMENT DULU IMPORT LOKAL AGAR TIDAK ERROR
// Jika file sudah ada di folder 'src/assets/', hilangkan tanda // di baris import
// import AyamGeprekImg from '../assets/ayamgeprek.jpg';
// import NasiKuningImg from '../assets/nasikuning.jpg';

// --- IKON SVG LOKAL ---
const ChevronLeft = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);
const ChevronRight = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const Hero = () => {
  // Data Slider
  const slides = [
    { 
      // Link Online Nasi Goreng
      url: "https://i.pinimg.com/1200x/85/4f/68/854f6800fb759328529c00516cbdab66.jpg", 
      title: "Nasi Goreng Spesial" 
    },
    { 
      // Link Online Ayam Geprek (Ganti url ini jika sudah ada file lokal)
      // url: AyamGeprekImg, 
      url: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=1200&auto=format&fit=crop",
      title: "Ayam Geprek" 
    },
    { 
      // Link Online Nasi Kuning (Ganti url ini jika sudah ada file lokal)
      // url: NasiKuningImg, 
      url: "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=1200&auto=format&fit=crop",
      title: "Nasi Kuning" 
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <section className="hero">
      <div className="hero-img-wrapper">
        <img 
          src={slides[currentIndex].url} 
          alt={slides[currentIndex].title} 
          loading="lazy"
          style={{ transition: 'opacity 0.5s ease-in-out' }}
        />
        
        {/* Tombol Navigasi */}
        <button className="nav-btn prev" onClick={prevSlide}>
          <ChevronLeft />
        </button>
        <button className="nav-btn next" onClick={nextSlide}>
          <ChevronRight />
        </button>
        
        {/* Indikator Dots */}
        <div className="dots">
          {slides.map((_, idx) => (
            <span 
              key={idx} 
              className={`dot ${currentIndex === idx ? 'active' : ''}`}
              onClick={() => goToSlide(idx)}
              style={{ cursor: 'pointer' }}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;