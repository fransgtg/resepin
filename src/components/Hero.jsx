import React, { useState, useEffect } from 'react';
import './Hero.css'; // Pastikan file CSS-nya diimport

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Daftar Gambar Slider (Ganti URL ini jika punya gambar sendiri)
  const slides = [
    {
      id: 1,
      img: "https://i.pinimg.com/1200x/85/4f/68/854f6800fb759328529c00516cbdab66.jpg",
      alt: "Nasi Goreng Spesial"
    },
    {
      id: 2,
      img: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=1200&auto=format&fit=crop",
      alt: "Ayam Geprek"
    },
    {
      id: 3,
      img: "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=1200&auto=format&fit=crop",
      alt: "Nasi Kuning"
    }
  ];

  // Efek Auto-Slide setiap 5 detik
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(slideInterval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
  };

  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
  };

  return (
    <section className="hero">
      <div className="hero-img-wrapper">
        <img 
          src={slides[currentSlide].img} 
          alt={slides[currentSlide].alt} 
        />
        
        {/* Tombol Navigasi Kiri/Kanan */}
        <button className="nav-btn prev" onClick={prevSlide}>&#10094;</button>
        <button className="nav-btn next" onClick={nextSlide}>&#10095;</button>

        {/* Titik Indikator (Dots) */}
        <div className="dots">
          {slides.map((_, index) => (
            <span 
              key={index} 
              className={`dot ${currentSlide === index ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;