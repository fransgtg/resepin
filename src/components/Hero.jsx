import React, { useState } from 'react';

// Ikon Panah
const ChevronLeft = () => (<svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>);
const ChevronRight = () => (<svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>);

const Hero = () => {
  const slides = [
    { 
      url: "nasigoreng.jpg", 
      title: "Nasi Goreng Spesial" 
    },
    { 
      url: "ayamgeprek.jpg", 
      title: "Ayam Geprek" 
    },
    { 
      url: "nasigoreng.jpg", 
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

  return (
    <section className="hero">
      <div className="hero-img-wrapper">
        <img 
          src={slides[currentIndex].url} 
          alt={slides[currentIndex].title} 
          loading="lazy"
          style={{ transition: 'opacity 0.5s ease-in-out' }}
        />
        
        <button className="nav-btn prev" onClick={prevSlide}>
          <ChevronLeft />
        </button>
        <button className="nav-btn next" onClick={nextSlide}>
          <ChevronRight />
        </button>
        
        <div className="dots">
          {slides.map((_, idx) => (
            <span 
              key={idx} 
              className={`dot ${currentIndex === idx ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
              style={{ cursor: 'pointer' }}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;