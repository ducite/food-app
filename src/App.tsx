import { useState, useEffect, useMemo } from 'react';
import type { Dish, Restaurant, FilterMode } from './types';
import {
  fetchAllData,
  createDish,
  deleteDish,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  saveLocalDishes,
  saveLocalRestaurants,
  resetToSampleData,
} from './services/storage';
import { Header } from './components/Header';
import { DishFilter } from './components/DishFilter';
import { RestaurantCard } from './components/RestaurantCard';
import { RestaurantDetailModal } from './components/RestaurantDetailModal';
import { RestaurantFormModal } from './components/RestaurantFormModal';
import { DishManagementModal } from './components/DishManagementModal';
import { MenuImageViewer } from './components/MenuImageViewer';
import { CloudSyncModal } from './components/CloudSyncModal';
import { Search, UtensilsCrossed, Plus } from 'lucide-react';

export default function App() {
  // Data states
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isCloud, setIsCloud] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Search & Filter states
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [selectedDishIds, setSelectedDishIds] = useState<string[]>([]);
  const [filterMode, setFilterMode] = useState<FilterMode>('AND');
  const [isDishSearchActive, setIsDishSearchActive] = useState<boolean>(false);

  // Modal states
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [isDishesModalOpen, setIsDishesModalOpen] = useState<boolean>(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState<boolean>(false);
  const [menuViewerData, setMenuViewerData] = useState<{
    images: string[];
    restaurantName: string;
  } | null>(null);

  // Load initial data
  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const data = await fetchAllData();
      setDishes(data.dishes);
      setRestaurants(data.restaurants);
      setIsCloud(data.isCloud);
    } catch (e) {
      console.error('Lỗi khi tải dữ liệu:', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter Restaurants logic
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter(restaurant => {
      // 1. Text search by restaurant name or address
      if (searchKeyword.trim()) {
        const query = searchKeyword.toLowerCase().trim();
        const matchName = restaurant.name.toLowerCase().includes(query);
        const matchAddress = restaurant.address.toLowerCase().includes(query);
        if (!matchName && !matchAddress) {
          return false;
        }
      }

      // 2. Dish filter
      if (isDishSearchActive && selectedDishIds.length > 0) {
        const restaurantDishIds = new Set(restaurant.dishes.map(d => d.dishId));

        if (filterMode === 'AND') {
          // Restaurant must have ALL selected dishes
          const hasAll = selectedDishIds.every(id => restaurantDishIds.has(id));
          if (!hasAll) return false;
        } else {
          // Restaurant must have AT LEAST ONE of selected dishes
          const hasAny = selectedDishIds.some(id => restaurantDishIds.has(id));
          if (!hasAny) return false;
        }
      }

      return true;
    });
  }, [restaurants, searchKeyword, isDishSearchActive, selectedDishIds, filterMode]);

  // Dish selection handler
  const handleSelectDish = (dishId: string) => {
    setSelectedDishIds(prev => {
      const exists = prev.includes(dishId);
      const next = exists ? prev.filter(id => id !== dishId) : [...prev, dishId];
      if (next.length === 0) {
        setIsDishSearchActive(false);
      }
      return next;
    });
  };

  // Clear dish selection
  const handleClearSelectedDishes = () => {
    setSelectedDishIds([]);
    setIsDishSearchActive(false);
  };

  // Trigger search by dish
  const handleApplyDishSearch = () => {
    if (selectedDishIds.length > 0) {
      setIsDishSearchActive(true);
    } else {
      setIsDishSearchActive(false);
    }
  };

  // CRUD Actions
  const handleSaveRestaurant = async (
    data: Omit<Restaurant, 'id' | 'createdAt'>,
    editingId?: string
  ) => {
    if (editingId) {
      const current = restaurants.find(r => r.id === editingId);
      if (current) {
        const updated = await updateRestaurant({
          ...current,
          ...data,
        });
        setRestaurants(prev => prev.map(r => (r.id === updated.id ? updated : r)));
        if (selectedRestaurant?.id === updated.id) {
          setSelectedRestaurant(updated);
        }
      }
    } else {
      const created = await createRestaurant(data);
      setRestaurants(prev => [created, ...prev]);
    }
  };

  const handleDeleteRestaurant = async (id: string) => {
    await deleteRestaurant(id);
    setRestaurants(prev => prev.filter(r => r.id !== id));
    if (selectedRestaurant?.id === id) {
      setSelectedRestaurant(null);
    }
  };

  const handleAddDish = async (name: string): Promise<Dish | null> => {
    try {
      const created = await createDish(name);
      setDishes(prev => [...prev, created]);
      return created;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const handleDeleteDish = async (id: string) => {
    await deleteDish(id);
    setDishes(prev => prev.filter(d => d.id !== id));
    setSelectedDishIds(prev => prev.filter(item => item !== id));
  };

  const handleResetData = () => {
    const res = resetToSampleData();
    setDishes(res.dishes);
    setRestaurants(res.restaurants);
    setSelectedDishIds([]);
    setIsDishSearchActive(false);
  };

  const handleDataImported = (newDishes: Dish[], newRestaurants: Restaurant[]) => {
    saveLocalDishes(newDishes);
    saveLocalRestaurants(newRestaurants);
    setDishes(newDishes);
    setRestaurants(newRestaurants);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pb-16">
      {/* 1. App Header */}
      <Header
        onOpenAddRestaurant={() => {
          setEditingRestaurant(null);
          setIsFormOpen(true);
        }}
        onOpenDishes={() => setIsDishesModalOpen(true)}
        onOpenSync={() => setIsSyncModalOpen(true)}
        isCloud={isCloud}
        onRefresh={loadData}
        isRefreshing={isRefreshing}
      />

      {/* Main Container */}
      <main className="max-w-4xl mx-auto w-full px-4 pt-4 flex-1">
        {/* 2. Tra cứu bằng món (DishFilter) */}
        <DishFilter
          dishes={dishes}
          selectedDishIds={selectedDishIds}
          filterMode={filterMode}
          onSelectDish={handleSelectDish}
          onClearSelected={handleClearSelectedDishes}
          onToggleFilterMode={setFilterMode}
          onApplySearch={handleApplyDishSearch}
          onOpenAddDish={() => setIsDishesModalOpen(true)}
          isFilterActive={isDishSearchActive}
        />

        {/* 3. Search Bar by Restaurant Name/Address */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchKeyword}
            onChange={e => setSearchKeyword(e.target.value)}
            placeholder="Tìm theo tên quán hoặc địa chỉ..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200/90 rounded-2xl shadow-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-400"
          />
          {searchKeyword && (
            <button
              onClick={() => setSearchKeyword('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-md cursor-pointer"
            >
              Xóa
            </button>
          )}
        </div>

        {/* Section Title & Status Indicator */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-800">
              {isDishSearchActive
                ? `Kết quả tra cứu món (${filteredRestaurants.length} quán)`
                : `Danh sách quán ăn (${filteredRestaurants.length})`}
            </h2>
            {isDishSearchActive && (
              <span className="text-[11px] font-semibold text-orange-600 bg-orange-100/80 px-2 py-0.5 rounded-full">
                {filterMode === 'AND' ? 'Khớp đủ món' : 'Khớp ≥ 1 món'}
              </span>
            )}
          </div>

          {isDishSearchActive && (
            <button
              onClick={handleClearSelectedDishes}
              className="text-xs font-medium text-slate-500 hover:text-orange-600 transition-colors cursor-pointer"
            >
              Hiện tất cả quán
            </button>
          )}
        </div>

        {/* 4. Danh sách Quán (Restaurant Cards) */}
        {filteredRestaurants.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 text-center shadow-xs flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">
              <UtensilsCrossed className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Không tìm thấy quán nào</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                {isDishSearchActive
                  ? 'Không có quán nào phục vụ các món bạn vừa chọn. Thử chọn chế độ "Có ít nhất 1 món" hoặc thêm quán mới.'
                  : 'Chưa có quán ăn nào khớp với từ khóa tìm kiếm.'}
              </p>
            </div>
            <button
              onClick={() => {
                setEditingRestaurant(null);
                setIsFormOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Thêm quán mới ngay</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredRestaurants.map(restaurant => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onClick={() => setSelectedRestaurant(restaurant)}
                isDishSearchActive={isDishSearchActive}
                selectedDishIds={selectedDishIds}
              />
            ))}
          </div>
        )}
      </main>

      {/* 5. Modals */}
      {/* Chi tiết quán */}
      <RestaurantDetailModal
        restaurant={selectedRestaurant}
        onClose={() => setSelectedRestaurant(null)}
        onEdit={restaurant => {
          setSelectedRestaurant(null);
          setEditingRestaurant(restaurant);
          setIsFormOpen(true);
        }}
        onDelete={handleDeleteRestaurant}
        onViewMenuImages={(images, restaurantName) => {
          setMenuViewerData({ images, restaurantName });
        }}
      />

      {/* Form thêm & sửa quán */}
      <RestaurantFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingRestaurant(null);
        }}
        onSave={handleSaveRestaurant}
        editingRestaurant={editingRestaurant}
        availableDishes={dishes}
        onQuickAddDish={handleAddDish}
      />

      {/* Quản lý danh mục món ăn */}
      <DishManagementModal
        isOpen={isDishesModalOpen}
        onClose={() => setIsDishesModalOpen(false)}
        dishes={dishes}
        restaurants={restaurants}
        onAddDish={handleAddDish}
        onDeleteDish={handleDeleteDish}
      />

      {/* Đồng bộ & chia sẻ đám mây (Supabase / JSON) */}
      <CloudSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        dishes={dishes}
        restaurants={restaurants}
        onDataImported={handleDataImported}
        onResetData={handleResetData}
      />

      {/* Xem ảnh Menu phóng to (Lightbox) */}
      {menuViewerData && (
        <MenuImageViewer
          images={menuViewerData.images}
          restaurantName={menuViewerData.restaurantName}
          onClose={() => setMenuViewerData(null)}
        />
      )}
    </div>
  );
}
