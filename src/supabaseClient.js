import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Pengecekan Keamanan: Pastikan variabel tidak kosong
if (!supabaseUrl || !supabaseKey) {
  console.error('🚨 ERROR FATAL: URL atau Key Supabase tidak ditemukan!');
  console.error('Pastikan Anda sudah membuat file .env di root folder dan me-restart terminal.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);