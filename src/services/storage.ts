import { INITIAL_DISHES, INITIAL_RESTAURANTS } from '../data/initialData';
import type { Dish, Restaurant } from '../types';
import { getSupabase } from './supabase';

const DISHES_STORAGE_KEY = 'food_app_dishes_v1';
const RESTAURANTS_STORAGE_KEY = 'food_app_restaurants_v1';

// --- Local Storage Helpers ---

export function getLocalDishes(): Dish[] {
  try {
    const raw = localStorage.getItem(DISHES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(DISHES_STORAGE_KEY, JSON.stringify(INITIAL_DISHES));
      return INITIAL_DISHES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Lỗi đọc dishes từ localStorage:', e);
    return INITIAL_DISHES;
  }
}

export function saveLocalDishes(dishes: Dish[]): void {
  localStorage.setItem(DISHES_STORAGE_KEY, JSON.stringify(dishes));
}

export function getLocalRestaurants(): Restaurant[] {
  try {
    const raw = localStorage.getItem(RESTAURANTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(RESTAURANTS_STORAGE_KEY, JSON.stringify(INITIAL_RESTAURANTS));
      return INITIAL_RESTAURANTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Lỗi đọc restaurants từ localStorage:', e);
    return INITIAL_RESTAURANTS;
  }
}

export function saveLocalRestaurants(restaurants: Restaurant[]): void {
  localStorage.setItem(RESTAURANTS_STORAGE_KEY, JSON.stringify(restaurants));
}

// --- Unified API (Local + Supabase Cloud Fallback) ---

export async function fetchAllData(): Promise<{ dishes: Dish[]; restaurants: Restaurant[]; isCloud: boolean }> {
  const supabase = getSupabase();

  if (supabase) {
    try {
      const [dishesRes, restRes] = await Promise.all([
        supabase.from('dishes').select('*').order('name'),
        supabase.from('restaurants').select('*').order('created_at', { ascending: false }),
      ]);

      if (!dishesRes.error && !restRes.error && dishesRes.data && restRes.data) {
        const cloudDishes: Dish[] = dishesRes.data.map(d => ({
          id: d.id,
          name: d.name,
          createdAt: d.created_at || new Date().toISOString(),
        }));

        const cloudRestaurants: Restaurant[] = restRes.data.map(r => ({
          id: r.id,
          name: r.name,
          address: r.address,
          mapUrl: r.map_url || '',
          menuImages: Array.isArray(r.menu_images) ? r.menu_images : [],
          dishes: Array.isArray(r.dishes) ? r.dishes : [],
          createdAt: r.created_at || new Date().toISOString(),
          updatedAt: r.updated_at,
        }));

        // Sync to local for offline caching
        saveLocalDishes(cloudDishes);
        saveLocalRestaurants(cloudRestaurants);

        return { dishes: cloudDishes, restaurants: cloudRestaurants, isCloud: true };
      }
    } catch (e) {
      console.warn('Không thể kết nối Supabase, chuyển sang dùng LocalStorage:', e);
    }
  }

  return {
    dishes: getLocalDishes(),
    restaurants: getLocalRestaurants(),
    isCloud: false,
  };
}

export async function createDish(name: string): Promise<Dish> {
  const newDish: Dish = {
    id: 'dish-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    name: name.trim(),
    createdAt: new Date().toISOString(),
  };

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('dishes').insert({
        id: newDish.id,
        name: newDish.name,
        created_at: newDish.createdAt,
      });
    } catch (e) {
      console.error('Lỗi thêm món lên Supabase:', e);
    }
  }

  const current = getLocalDishes();
  const updated = [...current, newDish];
  saveLocalDishes(updated);
  return newDish;
}

export async function deleteDish(id: string): Promise<void> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('dishes').delete().eq('id', id);
    } catch (e) {
      console.error('Lỗi xóa món trên Supabase:', e);
    }
  }

  const current = getLocalDishes();
  saveLocalDishes(current.filter(d => d.id !== id));
}

export async function createRestaurant(data: Omit<Restaurant, 'id' | 'createdAt'>): Promise<Restaurant> {
  const newRestaurant: Restaurant = {
    ...data,
    id: 'res-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    createdAt: new Date().toISOString(),
  };

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('restaurants').insert({
        id: newRestaurant.id,
        name: newRestaurant.name,
        address: newRestaurant.address,
        map_url: newRestaurant.mapUrl || null,
        menu_images: newRestaurant.menuImages || [],
        dishes: newRestaurant.dishes || [],
        created_at: newRestaurant.createdAt,
      });
    } catch (e) {
      console.error('Lỗi thêm quán lên Supabase:', e);
    }
  }

  const current = getLocalRestaurants();
  const updated = [newRestaurant, ...current];
  saveLocalRestaurants(updated);
  return newRestaurant;
}

export async function updateRestaurant(restaurant: Restaurant): Promise<Restaurant> {
  const updated: Restaurant = {
    ...restaurant,
    updatedAt: new Date().toISOString(),
  };

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('restaurants').update({
        name: updated.name,
        address: updated.address,
        map_url: updated.mapUrl || null,
        menu_images: updated.menuImages || [],
        dishes: updated.dishes || [],
        updated_at: updated.updatedAt,
      }).eq('id', updated.id);
    } catch (e) {
      console.error('Lỗi cập nhật quán trên Supabase:', e);
    }
  }

  const current = getLocalRestaurants();
  const nextList = current.map(r => r.id === updated.id ? updated : r);
  saveLocalRestaurants(nextList);
  return updated;
}

export async function deleteRestaurant(id: string): Promise<void> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('restaurants').delete().eq('id', id);
    } catch (e) {
      console.error('Lỗi xóa quán trên Supabase:', e);
    }
  }

  const current = getLocalRestaurants();
  saveLocalRestaurants(current.filter(r => r.id !== id));
}

// Reset data to initial sample data
export function resetToSampleData(): { dishes: Dish[]; restaurants: Restaurant[] } {
  localStorage.setItem(DISHES_STORAGE_KEY, JSON.stringify(INITIAL_DISHES));
  localStorage.setItem(RESTAURANTS_STORAGE_KEY, JSON.stringify(INITIAL_RESTAURANTS));
  return { dishes: INITIAL_DISHES, restaurants: INITIAL_RESTAURANTS };
}
