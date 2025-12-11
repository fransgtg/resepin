import React from 'react';
import './Detail.css';
import CommentsSection from './CommentsSection';

const RecipeDetail = ({ recipe, onClose, currentUser, onDelete, isAdmin }) => {
  if (!recipe) return null;

  return (
    <div className="glass-overlay">
      <div className="glass-card">

        {/* CLOSE BUTTON */}
        <button onClick={onClose} className="glass-close-btn">&times;</button>

        {/* HEADER */}
        <div className="glass-header">
          <span className="glass-badge">{recipe.category || "Resep Lezat"}</span>
          <h1 className="glass-title">{recipe.title}</h1>
          <p className="glass-date">
            Diposting pada{" "}
            {new Date(recipe.created_at || Date.now()).toLocaleDateString(
              "id-ID",
              { dateStyle: "long" }
            )}
          </p>
        </div>

        {/* IMAGE */}
        <div className="glass-img-box">
          <img
            src={
              recipe.img ||
              recipe.image_url ||
              "https://via.placeholder.com/800x400?text=No+Image"
            }
            alt={recipe.title}
            onError={(e) =>
              (e.target.src =
                "https://via.placeholder.com/800x400?text=Image+Error")
            }
          />
        </div>

        {/* ADMIN */}
        {isAdmin && (
          <div className="glass-admin-box">
            <p className="admin-warning">⚠️ Area Admin</p>
            <button onClick={onDelete} className="glass-delete-btn">
              Hapus Resep Ini
            </button>
          </div>
        )}

        {/* CONTENT GRID */}
        <div className="glass-grid">
          {/* Ingredients */}
          <div className="glass-section">
            <h3 className="glass-section-title">Bahan-bahan</h3>
            <ul className="glass-list">
              {recipe.ingredients?.map((item, i) => (
                <li key={i} className="glass-list-item">• {item}</li>
              ))}
            </ul>
          </div>

          {/* Steps */}
          <div className="glass-section">
            <h3 className="glass-section-title">Cara Membuat</h3>
            <div className="glass-step-list">
              {recipe.steps?.map((step, i) => (
                <div key={i} className="glass-step-item">
                  <span className="glass-step-number">{i + 1}</span>
                  <p className="glass-step-text">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SOURCE */}
        {recipe.url && (
          <div className="glass-source-box">
            <a
              href={recipe.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-source-link"
            >
              Kunjungi Sumber Asli →
            </a>
          </div>
        )}

        {/* COMMENTS */}
        <div className="glass-comments">
          <CommentsSection
            recipeId={recipe.id}
            currentUser={currentUser}
            isAdmin={isAdmin}
          />
        </div>

      </div>
    </div>
  );
};

export default RecipeDetail;