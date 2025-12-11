import React from 'react';
import './ArticleList.css';

const ArticleList = ({ currentUser, onLoginClick }) => {

  // --- KONTEN TERKUNCI ---
  if (!currentUser) {
    return (
      <div className="locked-wrapper-magz">
        <div className="lock-icon-magz">🔒</div>
        <h2 className="locked-title-magz">Konten Terkunci</h2>
        <p className="locked-text-magz">
          Maaf, halaman artikel hanya untuk pengguna yang sudah login.
        </p>
        <button className="btn-login-magz" onClick={onLoginClick}>
          Login Sekarang
        </button>
      </div>
    );
  }

  return (
    <div className="article-wrapper-magz">
      <h1 className="article-main-title">Artikel Pilihan</h1>

      <article className="article-magz-card">

        <header className="article-magz-image">
          <img 
            src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop"
            alt="Makanan Sehat"
          />
        </header>

        <section className="article-magz-body">

          <h2 className="magz-headline">
            Panduan Lengkap Hidup Sehat: Pengertian, Pola Makan, dan Manfaat
          </h2>

          <p className="magz-paragraph">
            <strong>Makanan sehat</strong> adalah makanan yang mengandung zat gizi lengkap 
            dan seimbang seperti karbohidrat, protein, lemak sehat, vitamin, mineral, dan serat.
          </p>

          <p className="magz-paragraph">
            Prinsip utama makanan sehat adalah <strong>gizi seimbang</strong>, 
            yaitu gizi yang cukup sesuai kebutuhan tubuh.
          </p>

          <div className="magz-section">
            <h3 className="magz-section-title">Memahami Pola Makan Sehat</h3>
            <p className="magz-paragraph">
              Pola makan sehat membantu menjaga energi, konsentrasi, dan fungsi metabolisme.
            </p>
          </div>

          <blockquote className="magz-quote">
            “Asupan gizi seseorang berbeda-beda tergantung usia, jenis kelamin, 
            dan aktivitas. Konsultasikan dengan ahli gizi untuk pola terbaik.”
          </blockquote>

          <div className="magz-section">
            <h3 className="magz-section-title">Pola Makan Menurut Ahli Gizi</h3>
            <ol className="magz-list-number">
              <li>Makan makanan bergizi lengkap</li>
              <li>Kurangi garam, gula, minyak</li>
              <li>Sarapan setiap pagi</li>
              <li>Minum air putih cukup</li>
              <li>Tingkatkan konsumsi protein</li>
            </ol>
          </div>

          <div className="magz-alert">
            <div className="magz-alert-title">⚠ Makanan yang Perlu Dibatasi</div>
            <p className="magz-paragraph no-margin">
              Batasi <strong>daging olahan</strong>, <strong>minuman manis</strong>, dan makanan cepat saji.
            </p>
          </div>

          <footer className="magz-source">
            <strong>Sumber Referensi:</strong>
            <ul>
              <li>• Halodoc — Makanan Sehat</li>
              <li>• Kemenkes RI — Gizi Seimbang</li>
            </ul>
          </footer>

        </section>

      </article>

    </div>
  );
};

export default ArticleList;