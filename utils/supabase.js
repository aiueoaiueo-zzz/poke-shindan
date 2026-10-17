import { createClient } from '@supabase/supabase-js';

// .env.local に書いた合鍵を読み込む
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// アプリ全体で使い回すSupabaseの接続プラグを作成
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
