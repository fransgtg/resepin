import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { supabase } from '../supabaseClient'; 

// Gambar default jika resep tidak punya gambar
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop";

export const useRecipes = () => {
  const [allRecipes, setAllRecipes] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  
  // State trigger untuk memicu useEffect loadData ulang (jika diperlukan)
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Helper: Menentukan kategori berdasarkan nama file CSV
  const getCategoryName = (fileName) => {
    const name = fileName.toLowerCase();
    if (name.includes('ayam')) return "Olahan Ayam";
    if (name.includes('ikan')) return "Olahan Ikan";
    if (name.includes('kambing')) return "Olahan Kambing";
    if (name.includes('sapi')) return "Olahan Sapi";
    if (name.includes('tahu')) return "Olahan Tahu";
    if (name.includes('telur')) return "Olahan Telur";
    if (name.includes('tempe')) return "Olahan Tempe";
    if (name.includes('udang')) return "Olahan Udang";
    return "Aneka Resep";
  };

  // Fungsi Refresh Manual (untuk dipanggil dari komponen lain setelah Add Recipe)
  const refreshRecipes = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // --- FUNGSI HAPUS RESEP ---
  const deleteRecipe = async (id) => {
    // 1. Cek apakah ini resep CSV (bawaan)?
    // ID CSV formatnya string panjang: "dataset-ayam-0", dsb.
    const strId = String(id);
    if (strId.includes('dataset')) {
      alert("Maaf, resep bawaan (CSV) tidak bisa dihapus.");
      return false;
    }

    // 2. Jika bukan CSV, hapus dari Supabase
    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id); // ID angka langsung dipakai

      if (error) throw error;

      // 3. SUKSES HAPUS
      alert("Resep berhasil dihapus.");
      
      // [TRIK PENTING] Update State Lokal Langsung!
      // Ini membuat resep hilang seketika dari layar tanpa menunggu reload dari server.
      setAllRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== id));
      
      return true;

    } catch (error) {
      console.error("Gagal hapus:", error);
      alert("Gagal menghapus: " + error.message);
      return false;
    }
  };

  // --- LOAD DATA (CSV + DATABASE) ---
  useEffect(() => {
    const loadData = async () => {
      setLoadingData(true);
      const combinedRecipes = [];

      // A. LOAD DATA CSV
      const files = [
        '/data/dataset-ayam.csv', '/data/dataset-ikan.csv', '/data/dataset-kambing.csv',
        '/data/dataset-sapi.csv', '/data/dataset-tahu.csv', '/data/dataset-telur.csv',
        '/data/dataset-tempe.csv', '/data/dataset-udang.csv'  
      ];

      try {
        const csvPromises = files.map(async (file) => {
          try {
            const response = await fetch(file);
            if (!response.ok) return [];
            const text = await response.text();
            return new Promise((resolve) => {
              Papa.parse(text, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                  const category = getCategoryName(file);
                  const cleanName = file.split('/').pop().replace('.csv', '');
                  
                  // Mapping data CSV
                  const data = results.data
                    .filter(r => r.Title) 
                    .map((item, idx) => ({
                      id: `${cleanName}-${idx}`, // ID CSV tetap String unik
                      title: item.Title,
                      ingredients: item.Ingredients ? item.Ingredients.split('--') : [],
                      steps: item.Steps ? item.Steps.split('--') : [],
                      url: item.URL,
                      img: DEFAULT_IMAGE,
                      category: category,
                      isStatic: true // Penanda bahwa ini resep statis
                    }));
                  resolve(data);
                }
              });
            });
          } catch (err) { return []; }
        });

        const csvData = await Promise.all(csvPromises);
        csvData.forEach(d => combinedRecipes.push(...d));

        // B. LOAD DATA SUPABASE
        const { data: dbRecipes, error } = await supabase
          .from('recipes')
          .select('*')
          .order('created_at', { ascending: true }); // Urutkan dari terlama ke terbaru (opsional)

        if (dbRecipes) {
          const formattedDb = dbRecipes.map(item => ({
            id: item.id, // [PENTING] ID tetap Angka murni dari DB
            title: item.title,
            ingredients: item.ingredients ? item.ingredients.split('--') : [],
            steps: item.steps ? item.steps.split('--') : [],
            url: item.url, 
            img: item.image_url || DEFAULT_IMAGE, 
            category: item.category,
            user_id: item.user_id,
            created_at: item.created_at,
            isStatic: false // Penanda bahwa ini resep dinamis (bisa dihapus/komen)
          }));
          combinedRecipes.push(...formattedDb);
        }

        if (error) console.error("Supabase load error:", error);

        setAllRecipes(combinedRecipes);
      } catch (err) {
        console.error("Error loading recipes:", err);
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, [refreshTrigger]); // Effect jalan ulang jika refreshTrigger berubah

  return { allRecipes, loadingData, refreshRecipes, deleteRecipe };
};