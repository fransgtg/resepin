import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { supabase } from '../supabaseClient'; 

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop";

export const useRecipes = () => {
  const [allRecipes, setAllRecipes] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  
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

  const refreshRecipes = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // [BARU] Fungsi Hapus Resep
  const deleteRecipe = async (id) => {
    // ID dari database formatnya "db-123", kita butuh angkanya saja "123"
    if (!id.startsWith('db-')) return false; // Jangan hapus data CSV
    
    const realId = id.replace('db-', '');
    
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', realId);

    if (error) {
      console.error("Gagal menghapus:", error);
      alert("Gagal menghapus resep.");
      return false;
    } else {
      alert("Resep berhasil dihapus.");
      refreshRecipes(); // Refresh otomatis setelah hapus
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
            
            const reader = response.body.getReader();
            const result = await reader.read(); 
            const decoder = new TextDecoder('utf-8');
            const csv = decoder.decode(result.value); 
            
            return new Promise((resolve) => {
              Papa.parse(csv, {
                header: true, 
                skipEmptyLines: true,
                complete: (results) => {
                  const categoryName = getCategoryName(file);
                  const cleanFileName = file.split('/').pop().replace('.csv', '');

                  const parsed = results.data.map((item, index) => ({
                    id: `${cleanFileName}-${index}`, 
                    title: item.Title,      
                    ingredients: item.Ingredients ? item.Ingredients.split('--') : [],
                    steps: item.Steps ? item.Steps.split('--') : [],
                    loves: item.Loves,      
                    url: item.URL,          
                    img: DEFAULT_IMAGE, 
                    category: categoryName,
                    isStatic: true // Penanda bahwa ini dari CSV (tidak bisa dihapus)
                  }));
                  
                  const validData = parsed.filter(r => r.title && r.title.trim() !== "");
                  resolve(validData);
                }
              });
            });
          } catch (err) {
            console.error(`Error file ${file}:`, err);
            return [];
          }
        });

        const csvResults = await Promise.all(csvPromises);
        csvResults.forEach(data => combinedRecipes.push(...data));

        // --- 2. LOAD DATA DARI SUPABASE ---
        const { data: dbRecipes, error } = await supabase
          .from('recipes')
          .select('*')
          .order('created_at', { ascending: true });

        if (!error && dbRecipes) {
          const formattedDbRecipes = dbRecipes.map(item => ({
            id: `db-${item.id}`, 
            title: item.title,
            ingredients: item.ingredients ? item.ingredients.split('--') : [],
            steps: item.steps ? item.steps.split('--') : [],
            loves: item.loves || 0,
            url: item.url, 
            img: DEFAULT_IMAGE,
            category: item.category,
            created_at: item.created_at,
            user_id: item.user_id, // [PENTING] Masukkan user_id agar bisa dicek kepemilikannya
            isStatic: false
          }));
          
          combinedRecipes.push(...formattedDbRecipes);
        }

        setAllRecipes(combinedRecipes);
        setLoadingData(false);
        
      } catch (error) {
        console.error("Gagal load data:", error);
        setLoadingData(false);
      }
    };

    loadData();
  }, [refreshTrigger]); 

  // Export deleteRecipe juga
  return { allRecipes, loadingData, refreshRecipes, deleteRecipe };
};