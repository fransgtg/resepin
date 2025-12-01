import React from 'react';

const ArticleList = ({ currentUser, onLoginClick }) => {
  // --- JIKA BELUM LOGIN: TAMPILKAN KONTEN TERKUNCI ---
  if (!currentUser) {
    return (
      <div className="locked-content">
        <div className="lock-icon">🔒</div>
        <h2>Konten Terkunci</h2>
        <p>Maaf, bagian Artikel hanya dapat diakses oleh member yang sudah login.</p>
        <button className="btn-login-redirect" onClick={onLoginClick}>
          Login Sekarang
        </button>
      </div>
    );
  }

  // --- JIKA SUDAH LOGIN: TAMPILKAN ARTIKEL ---
  return (
    <div className="article-container">
      <h1 className="article-title">Artikel</h1>
      
      <div className="article-card-large">
        {/* Gambar Artikel */}
        <div className="article-image">
          <img 
            src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop" 
            alt="Makanan Sehat" 
          />
        </div>

        {/* Teks Artikel */}
        <div className="article-content">
          <h2 style={{ fontSize: '1.8rem', color: '#151e32', marginBottom: '20px', fontFamily: 'Poppins, sans-serif' }}>
            Panduan Lengkap Hidup Sehat: Pengertian, Pola Makan, dan Manfaat
          </h2>

          <p>
            <strong>Makanan sehat</strong> adalah makanan yang mengandung zat gizi lengkap dan seimbang yang dibutuhkan oleh tubuh, 
            meliputi karbohidrat, protein, lemak sehat, vitamin, mineral, dan serat. 
            Makanan sehat juga harus bebas dari bahan berbahaya seperti zat aditif berlebihan, 
            pengawet berbahaya, dan kontaminan lainnya.
          </p>
          <p>
            Menurut ahli, prinsip utama makanan sehat adalah <strong>gizi seimbang</strong>, 
            yaitu mengandung zat gizi dalam jumlah yang sesuai dengan kebutuhan tubuh, tidak kurang dan tidak berlebih.
          </p>

          <h3 style={{ marginTop: '30px', color: '#151e32', fontFamily: 'Poppins, sans-serif' }}>
            Memahami Pola Makan Sehat
          </h3>
          <p>
            Pola makan sehat adalah aturan hidup sehat dalam mengonsumsi makanan sesuai dengan kebutuhan gizi harian. 
            Sederhananya, ini adalah kebiasaan baik yang dibangun dengan mengonsumsi lemak sehat, menghindari lemak jenuh, 
            serta memperbanyak asupan serat dari sayuran, buah, dan gandum utuh.
          </p>
          <p className="highlight-text">
            Asupan gizi setiap orang bervariasi tergantung pada usia, jenis kelamin, gaya hidup, dan aktivitas fisik. 
            Konsultasikan dengan dokter spesialis gizi untuk mengetahui kebutuhan nutrisi yang tepat bagi kondisi Anda.
          </p>

          <div className="article-list-points">
            <h3>Pola Makan Sehat Menurut Ahli Gizi</h3>
            <ol>
              <li><strong>Mengonsumsi makanan yang bergizi:</strong> Pastikan piring Anda berisi variasi makanan pokok, lauk pauk, sayuran, dan buah.</li>
              <li><strong>Mengurangi konsumsi garam, gula, dan minyak:</strong> Batasi penggunaan bumbu-bumbu ini untuk kesehatan jangka panjang.</li>
              <li><strong>Membiasakan sarapan pagi:</strong> Memberikan energi awal untuk memulai hari.</li>
              <li><strong>Penuhi kebutuhan cairan tubuh:</strong> Minum air putih yang cukup (sekitar 8 gelas sehari).</li>
              <li><strong>Tambah asupan protein:</strong> Penting untuk perbaikan sel dan pertumbuhan.</li>
              <li><strong>Konsumsi lemak baik:</strong> Pilih sumber lemak tak jenuh seperti alpukat atau kacang-kacangan.</li>
              <li><strong>Konsumsi susu dan produk olahan susu:</strong> Sebagai sumber kalsium tambahan.</li>
            </ol>
          </div>

          <div className="article-list-points" style={{ marginTop: '40px' }}>
            <h3>Manfaat Makanan Sehat dan Bergizi</h3>
            <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
              <li><strong>Meningkatkan Energi:</strong> Menyediakan bahan bakar optimal untuk beraktivitas seharian.</li>
              <li><strong>Memelihara Kesehatan Jantung:</strong> Diet rendah lemak jenuh dan kolesterol menjaga fungsi jantung.</li>
              <li><strong>Meningkatkan Sistem Kekebalan Tubuh:</strong> Vitamin dan mineral memperkuat sistem imun menangkal penyakit.</li>
              <li><strong>Menjaga Berat Badan Ideal:</strong> Makanan padat nutrisi membantu mengontrol nafsu makan dan mencegah obesitas.</li>
              <li><strong>Meningkatkan Fungsi Otak:</strong> Nutrisi penting mendukung daya ingat dan konsentrasi.</li>
              <li><strong>Mencegah Penyakit Kronis:</strong> Mengurangi risiko diabetes, kanker, dan osteoporosis di masa depan.</li>
            </ul>
          </div>

          <div style={{ 
            marginTop: '40px', 
            padding: '20px', 
            backgroundColor: '#fff', 
            borderRadius: '15px', 
            border: '1px solid #eee' 
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#d97706' }}>⚠️ Makanan yang Perlu Dibatasi</h4>
            <p style={{ fontSize: '0.95rem', margin: 0 }}>
              Ahli gizi menyarankan untuk membatasi <strong>daging olahan</strong> (sosis, daging asap), 
              <strong>gula tambahan</strong> (kopi manis, kue, camilan kemasan), 
              serta <strong>makanan cepat saji</strong>. Konsumsi berlebihan dapat meningkatkan risiko 
              penyakit kardiovaskular, diabetes, dan ginjal.
            </p>
          </div>

          <div style={{ marginTop: '30px', fontSize: '0.85rem', color: '#666', borderTop: '1px solid #ddd', paddingTop: '15px' }}>
            <strong>Sumber Referensi:</strong>
            <ul style={{ listStyleType: 'none', paddingLeft: '0', marginTop: '5px' }}>
              <li>• <a href="https://www.halodoc.com/kesehatan/makanan-sehat" target="_blank" rel="noopener noreferrer" style={{ color: '#f97316', textDecoration: 'none' }}>Halodoc - Kesehatan Makanan Sehat</a></li>
              <li>• <a href="https://keslan.kemkes.go.id/view_artikel/3467/pola-makan-yang-sehat" target="_blank" rel="noopener noreferrer" style={{ color: '#f97316', textDecoration: 'none' }}>Kementerian Kesehatan (Kemkes) - Pola Makan yang Sehat</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleList;