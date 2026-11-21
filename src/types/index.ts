export interface Dish {
  id: string;
  name: string;
  createdAt: string;
}

export interface RestaurantDish {
  dishId: string;
  dishName: string;
  price: number;
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  mapUrl?: string; // Optional: Google Maps link or coordinates
  menuImages: string[]; // List of image URLs or Base64 strings
  dishes: RestaurantDish[];
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export type FilterMode = 'AND' | 'OR';

export interface SearchFilterState {
  selectedDishIds: string[];
  filterMode: FilterMode;
  searchKeyword: string;
}
