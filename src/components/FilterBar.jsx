import React from 'react';
import './FilterBar.css'; // Pastikan CSS ini ada

const FilterIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
  </svg>
);

const SortIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
  </svg>
);

const FilterBar = ({ 
  activeCategory, 
  showFilterMenu, 
  setShowFilterMenu, 
  categoriesList, 
  onFilterClick,
  recipeSectionRef,
  // [BARU] Props untuk Sort
  sortOption,
  showSortMenu,
  setShowSortMenu,
  onSortClick
}) => {

  const getSortLabel = (opt) => {
    switch(opt) {
      case 'newest': return 'Terbaru';
      case 'oldest': return 'Terlama';
      case 'a-z': return 'Abjad A-Z';
      case 'z-a': return 'Abjad Z-A';
      default: return 'Urutkan';
    }
  };

  return (
    <div className="filters" ref={recipeSectionRef} style={{ position: 'relative', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
      
      {/* 1. BUTTON FILTER KATEGORI */}
      <div style={{ position: 'relative' }}>
        <button 
          className={`btn-filter ${showFilterMenu ? 'active' : ''}`}
          onClick={() => { setShowFilterMenu(!showFilterMenu); setShowSortMenu(false); }}
          style={{ minWidth: '200px', justifyContent: 'space-between' }}
        >
          {activeCategory === 'All' ? 'Filter Kategori' : activeCategory}
          <FilterIcon />
        </button>

        {showFilterMenu && (
          <div className="filter-dropdown">
            {categoriesList.map((cat, idx) => (
              <div 
                key={idx} 
                className={`filter-item ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => onFilterClick(cat)}
              >
                {cat === 'All' ? 'Tampilkan Perwakilan Menu' : cat}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. [BARU] BUTTON SORTING */}
      <div style={{ position: 'relative' }}>
        <button 
          className={`btn-filter ${showSortMenu ? 'active' : ''}`}
          onClick={() => { setShowSortMenu(!showSortMenu); setShowFilterMenu(false); }}
          style={{ 
            minWidth: '160px', 
            justifyContent: 'space-between',
            backgroundColor: 'white', 
            color: '#f97316', 
            border: '2px solid #f97316' 
          }}
        >
          {getSortLabel(sortOption)}
          <SortIcon />
        </button>

        {showSortMenu && (
          <div className="filter-dropdown" style={{ minWidth: '160px' }}>
            <div className={`filter-item ${sortOption === 'newest' ? 'active' : ''}`} onClick={() => onSortClick('newest')}>
              Terbaru (Default)
            </div>
            <div className={`filter-item ${sortOption === 'oldest' ? 'active' : ''}`} onClick={() => onSortClick('oldest')}>
              Terlama
            </div>
            <div className={`filter-item ${sortOption === 'a-z' ? 'active' : ''}`} onClick={() => onSortClick('a-z')}>
              Abjad A-Z
            </div>
            <div className={`filter-item ${sortOption === 'z-a' ? 'active' : ''}`} onClick={() => onSortClick('z-a')}>
              Abjad Z-A
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default FilterBar;