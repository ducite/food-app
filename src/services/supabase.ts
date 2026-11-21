import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const STORAGE_KEY_SUPABASE_URL = 'food_app_supabase_url';
const STORAGE_KEY_SUPABASE_ANON_KEY = 'food_app_supabase_anon_key';

/**
 * Tự động làm sạch URL Supabase:
 * Nếu người dùng lỡ copy dán cả `/rest/v1` hoặc dấu gạch chéo cuối thì hàm này sẽ tự cắt bỏ
 * VD: "https://xyz.supabase.co/rest/v1/" -> "https://xyz.supabase.co"
 */
export function sanitizeSupabaseUrl(rawUrl: string): string {
  let cleaned = rawUrl.trim();
  // Cắt bỏ dấu gạch chéo cuối cùng
  cleaned = cleaned.replace(/\/+$/, '');
  // Cắt bỏ /rest/v1 nếu người dùng copy từ mục Data API
  cleaned = cleaned.replace(/\/rest\/v1\/?$/i, '');
  // Cắt lại lần nữa nếu còn dấu gạch chéo
  cleaned = cleaned.replace(/\/+$/, '');
  return cleaned;
}

export function getSavedSupabaseConfig(): { url: string; anonKey: string } | null {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  const localUrl = localStorage.getItem(STORAGE_KEY_SUPABASE_URL) || envUrl;
  const localKey = localStorage.getItem(STORAGE_KEY_SUPABASE_ANON_KEY) || envKey;

  if (localUrl && localKey) {
    return { 
      url: sanitizeSupabaseUrl(localUrl), 
      anonKey: localKey.trim() 
    };
  }
  return null;
}

export function saveSupabaseConfig(url: string, anonKey: string): void {
  const cleanUrl = sanitizeSupabaseUrl(url);
  localStorage.setItem(STORAGE_KEY_SUPABASE_URL, cleanUrl);
  localStorage.setItem(STORAGE_KEY_SUPABASE_ANON_KEY, anonKey.trim());
  supabaseInstance = null; // reset client instance
}

export function clearSupabaseConfig(): void {
  localStorage.removeItem(STORAGE_KEY_SUPABASE_URL);
  localStorage.removeItem(STORAGE_KEY_SUPABASE_ANON_KEY);
  supabaseInstance = null;
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const config = getSavedSupabaseConfig();
  if (!config) return null;

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(config.url, config.anonKey);
    } catch (e) {
      console.error('Lỗi khởi tạo Supabase:', e);
      return null;
    }
  }
  return supabaseInstance;
}

/**
 * SQL script for user to copy-paste into Supabase SQL editor
 */
export const SUPABASE_SETUP_SQL = `-- Chạy đoạn mã này trong mục SQL Editor trên Supabase:

-- 1. Bảng danh sách món ăn
create table if not exists public.dishes (
  id text primary key,
  name text not null,
  created_at timestamptz default now()
);

-- 2. Bảng danh sách quán ăn
create table if not exists public.restaurants (
  id text primary key,
  name text not null,
  address text not null,
  map_url text,
  menu_images jsonb default '[]'::jsonb,
  dishes jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Cho phép tất cả mọi người đọc và ghi (Public - không cần đăng nhập)
alter table public.dishes enable row level security;
alter table public.restaurants enable row level security;

create policy "Cho phép tất cả đọc dishes" on public.dishes for select using (true);
create policy "Cho phép tất cả thêm/sửa dishes" on public.dishes for all using (true);

create policy "Cho phép tất cả đọc restaurants" on public.restaurants for select using (true);
create policy "Cho phép tất cả thêm/sửa restaurants" on public.restaurants for all using (true);

-- 4. Bật Realtime cho 2 bảng (tùy chọn)
alter publication supabase_realtime add table public.dishes;
alter publication supabase_realtime add table public.restaurants;
`;
