import React from 'react';
import './CommonForms.css'; 
import './ArticleDetailPage.css'; 

const Artikel = ({ userName = 'Pengguna' }) => {
    
    const healthyDietTips = [
        "Mengonsumsi makanan yang bergizi",
        "Mengurangi konsumsi garam, gula, dan minyak",
        "Membiasakan sarapan pagi",
        "Penuhi kebutuhan cairan tubuh",
        "Tambah asupan protein",
        "Konsumsi lemak baik",
        "Konsumsi susu dan produk olahan susu"
    ];

    return (
        <div className="form-page-background"> {/* Menggunakan background yang konsisten */}
            {/* 1. Header Navigasi (Asumsi user sudah Login/terdapat tombol Log Out) */}
            <header className="header-top dark-header">
                <div className="logo">Resepin</div>
                
                {/* Search Bar di Tengah */}
                <div className="search-bar article-search-bar">
                    <input type="text" placeholder="Mau masak apa hari ini?" />
                    <button><i className="fas fa-search"></i></button>
                </div>
                
                {/* Navigasi Kanan */}
                <div className="nav-links">
                    <a href="#" className="nav-link-active">Artikel</a>
                    <a href="#">Resep <i className="fas fa-chevron-down" style={{fontSize: '10px'}}></i></a>
                    <a href="#" className="login-register-btn log-out-btn">Log Out</a>
                </div>
            </header>

            {/* 2. Konten Artikel Utama */}
            <div className="article-main-container">
                <h1 className="article-title">Artikel</h1>
                
                <div className="article-content-wrapper">
                    
                    {/* Kolom Kiri: Gambar Utama Artikel */}
                    <div className="article-image-section">
                        {/* Ganti URL/path gambar dengan gambar makanan sehat yang relevan */}
                        <img 
                            src="/images/healthy_food_flatlay.jpg" 
                            alt="Berbagai macam makanan sehat" 
                            className="article-main-image"
                        />
                    </div>
                    
                    {/* Kolom Kanan: Teks Artikel */}
                    <div className="article-text-section">
                        <p>
                            Makanan sehat adalah makanan yang mengandung **zat gizi lengkap dan seimbang**, meliputi karbohidrat, protein, lemak sehat, vitamin, mineral, dan serat.
                        </p>
                        <p>
                            Makanan sehat juga bebas dari bahan berbahaya seperti zat aditif berlebihan, pengawet berbahaya, dan kontaminan lainnya.
                        </p>
                        <p>
                            Menurut ahli, makanan sehat adalah makanan yang memenuhi prinsip **gizi seimbang**, yaitu mengandung zat gizi dalam jumlah yang sesuai dengan kebutuhan tubuh.
                        </p>
                        <p>
                            Adapun, pola makanan sehat adalah aturan hidup sehat dalam mengonsumsi makanan sesuai dengan kebutuhan gizi harian. Asupannya bervariasi, tergantung pada usia, jenis kelamin, gaya hidup, kegiatan, dan tempat tinggal. Berkaitan dengan jumlah nutrisinya, bisa didiskusikan langsung dengan dokter spesialis gizi. Dengan begitu, kita dapat mengetahui program dan langkah penanganan gizi yang tepat, terutama jika memiliki kondisi kesehatan tertentu.
                        </p>
                        
                        <p>
                            Sederhananya, pola makan yang sehat adalah salah satu **kebiasaan hidup sehat** yang bisa dilakukan dengan mengonsumsi lemak sehat dan menghindari asupan lemak jenuh. Selain itu, kita juga perlu memperbanyak asupan serat dari sayuran, buah, dan/atau gandum utuh. Perlu dipahami bahwa menerapkan pola makan yang tepat dengan asupan makanan sehat pada dasarnya adalah membangun salah satu kebiasaan baik.
                        </p>

                        <h3>Pola Makan Sehat Menurut Ahli Gizi</h3>
                        <ol className="health-tips-list">
                            {healthyDietTips.map((tip, index) => (
                                <li key={index}>{tip}</li>
                            ))}
                        </ol>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Artikel;