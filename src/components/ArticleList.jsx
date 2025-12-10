import React from 'react';
import './ArticleList.css'; 

const ArticleList = ({ currentUser, onLoginClick }) => {
  
  // --- KONTEN TERKUNCI ---
  if (!currentUser) {
    return (
      <div className="locked-wrapper">
        <div className="lock-icon">🔒</div>
        <h2 className="locked-title">Konten Terkunci</h2>
        <p className="locked-text">Maaf, bagian Artikel hanya dapat diakses oleh member yang sudah login.</p>
        <button className="btn-login-redirect" onClick={onLoginClick}>
          Login Sekarang
        </button>
      </div>
    );
  }

  // --- ARTIKEL ---
  return (
    <div className="article-wrapper">
      <h1 className="page-main-title">Artikel Pilihan</h1>
      
      <div className="article-card">
        
        {/* Gambar Header */}
        <div className="article-img-header">
          <img 
            src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop" 
            alt="Makanan Sehat" 
          />
        </div>

        {/* Konten Teks */}
        <div className="article-body">
          <h2 className="content-headline">
            Panduan Lengkap Hidup Sehat: Pengertian, Pola Makan, dan Manfaat
          </h2>

          <p className="content-paragraph">
            <strong>Makanan sehat</strong> adalah makanan yang mengandung zat gizi lengkap dan seimbang yang dibutuhkan oleh tubuh, 
            meliputi karbohidrat, protein, lemak sehat, vitamin, mineral, dan serat. 
            Makanan sehat juga harus bebas dari bahan berbahaya seperti zat aditif berlebihan, 
            pengawet berbahaya, dan kontaminan lainnya.
          </p>
          <p className="content-paragraph">
            Menurut ahli, prinsip utama makanan sehat adalah <strong>gizi seimbang</strong>, 
            yaitu mengandung zat gizi dalam jumlah yang sesuai dengan kebutuhan tubuh, tidak kurang dan tidak berlebih.
          </p>

          <div className="content-section">
            <h3>Memahami Pola Makan Sehat</h3>
            <p className="content-paragraph">
              Pola makan sehat adalah aturan hidup sehat dalam mengonsumsi makanan sesuai dengan kebutuhan gizi harian. 
              Sederhananya, ini adalah kebiasaan baik yang dibangun dengan mengonsumsi lemak sehat, menghindari lemak jenuh, 
              serta memperbanyak asupan serat dari sayuran, buah, dan gandum utuh.
            </p>
          </div>

          <div className="quote-box">
            "Asupan gizi setiap orang bervariasi tergantung pada usia, jenis kelamin, gaya hidup, dan aktivitas fisik. 
            Konsultasikan dengan dokter spesialis gizi untuk mengetahui kebutuhan nutrisi yang tepat bagi kondisi Anda."
          </div>

          <div className="content-section">
            <h3>Pola Makan Sehat Menurut Ahli Gizi</h3>
            <ol>
              <li><strong>Mengonsumsi makanan yang bergizi:</strong> Pastikan piring berisi variasi makanan pokok, lauk, sayuran, dan buah.</li>
              <li><strong>Kurangi garam, gula, dan minyak:</strong> Batasi bumbu ini untuk kesehatan jangka panjang.</li>
              <li><strong>Biasakan sarapan pagi:</strong> Energi awal untuk memulai hari.</li>
              <li><strong>Penuhi cairan tubuh:</strong> Minum air putih cukup (8 gelas/hari).</li>
              <li><strong>Tambah asupan protein:</strong> Penting untuk perbaikan sel.</li>
              <li><strong>Konsumsi lemak baik:</strong> Pilih alpukat atau kacang-kacangan.</li>
            </ol>
          </div>

          <div className="content-section">
            <h3>Manfaat Makanan Sehat</h3>
            <ul>
              <li><strong>Meningkatkan Energi:</strong> Bahan bakar optimal untuk aktivitas.</li>
              <li><strong>Memelihara Jantung:</strong> Menjaga fungsi jantung tetap sehat.</li>
              <li><strong>Sistem Imun Kuat:</strong> Menangkal berbagai penyakit.</li>
              <li><strong>Berat Badan Ideal:</strong> Mengontrol nafsu makan.</li>
              <li><strong>Meningkatkan Fungsi Otak:</strong> Mendukung daya ingat.</li>
            </ul>
          </div>

          <div className="alert-box">
            <div className="alert-header">
              <span>⚠️</span> Makanan yang Perlu Dibatasi
            </div>
            <p className="content-paragraph no-margin">
              Ahli gizi menyarankan membatasi <strong>daging olahan</strong>, 
              <strong> gula tambahan</strong>, serta <strong>makanan cepat saji</strong>. 
              Konsumsi berlebihan meningkatkan risiko penyakit kronis.
            </p>
          </div>

          <div className="source-footer">
            <strong>Sumber Referensi:</strong>
            <ul className="source-list">
              <li>• <a href="https://www.halodoc.com" target="_blank" rel="noreferrer">Halodoc - Kesehatan Makanan Sehat</a></li>
              <li>• <a href="https://kemkes.go.id" target="_blank" rel="noreferrer">Kementerian Kesehatan RI - Pola Makan Sehat</a></li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ArticleList;