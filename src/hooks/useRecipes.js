import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { supabase } from '../supabaseClient'; 

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop";

export const useRecipes = () => {
  const [allRecipes, setAllRecipes] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  
  // [PENTING] State ini berfungsi sebagai "saklar" untuk memuat ulang data
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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

  // Fungsi untuk memicu reload data dari luar
  const refreshRecipes = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const deleteRecipe = async (id) => {
    if (!id.toString().startsWith('db-')) {
      alert("Maaf, resep bawaan (CSV) tidak bisa dihapus.");
      return false;
    }
    
    const realId = id.replace('db-', '');
    const { error } = await supabase.from('recipes').delete().eq('id', realId);

    if (error) {
      alert("Gagal menghapus: " + error.message);
      return false;
    } else {
      alert("Resep berhasil dihapus.");
      refreshRecipes(); // Reload data otomatis setelah hapus
      return true;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoadingData(true);
      const combinedRecipes = [];

      // --- 1. LOAD DATA DARI CSV ---
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
                  const data = results.data
                    .filter(r => r.Title) 
                    .map((item, idx) => ({
                      id: `${cleanName}-${idx}`,
                      title: item.Title,
                      ingredients: item.Ingredients ? item.Ingredients.split('--') : [],
                      steps: item.Steps ? item.Steps.split('--') : [],
                      loves: item.Loves,
                      url: item.URL,
                      img: DEFAULT_IMAGE,
                      category: category,
                      isStatic: true
                    }));
                  resolve(data);
                }
              });
            });
          } catch (err) { return []; }
        });

        const csvData = await Promise.all(csvPromises);
        csvData.forEach(d => combinedRecipes.push(...d));

        // --- 2. LOAD DATA DARI SUPABASE ---
        const { data: dbRecipes, error } = await supabase
          .from('recipes')
          .select('*')
          .order('created_at', { ascending: true });

        if (dbRecipes) {
          const formattedDb = dbRecipes.map(item => ({
            id: `db-${item.id}`,
            title: item.title,
            ingredients: item.ingredients ? item.ingredients.split('--') : [],
            steps: item.steps ? item.steps.split('--') : [],
            loves: item.loves || 0,
            url: item.url, 
            // Gunakan gambar dari database jika ada, jika tidak pakai default
            img: item.image_url || DEFAULT_IMAGE, 
            category: item.category,
            user_id: item.user_id,
            created_at: item.created_at,
            isStatic: false
          }));
          combinedRecipes.push(...formattedDb);
        }

        setAllRecipes(combinedRecipes);
      } catch (err) {
        console.error("Error loading recipes:", err);
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, [refreshTrigger]); // [PENTING] Effect jalan ulang jika refreshTrigger berubah

  return { allRecipes, loadingData, refreshRecipes, deleteRecipe };
};