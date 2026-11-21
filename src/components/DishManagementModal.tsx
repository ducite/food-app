import React, { useState } from 'react';
import type { Dish, Restaurant } from '../types';
import { X, Plus, Search, Trash2, Utensils, AlertCircle } from 'lucide-react';

interface DishManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  dishes: Dish[];
  restaurants: Restaurant[];
  onAddDish: (name: string) => Promise<Dish | null>;
  onDeleteDish: (id: string) => void;
}

export const DishManagementModal: React.FC<DishManagementModalProps> = ({
  isOpen,
  onClose,
  dishes,
  restaurants,
  onAddDish,
  onDeleteDish,
}) => {
  if (!isOpen) return null;

  const [newDishName, setNewDishName] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getRestaurantCountForDish = (dishId: string) => {
    return restaurants.filter(r => r.dishes.some(d => d.dishId === dishId)).length;
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName.trim() || isSubmitting) return;

    const exists = dishes.some(
      d => d.name.toLowerCase() === newDishName.trim().toLowerCase()
    );
    if (exists) {
      alert(`Món "${newDishName.trim()}" đã có trong danh sách!`);
      return;
    }

    setIsSubmitting(true);
    await onAddDish(newDishName.trim());
    setNewDishName('');
    setIsSubmitting(false);
  };

  const handleDelete = (dish: Dish) => {
    const count = getRestaurantCountForDish(dish.id);
    let confirmMsg = `Bạn có chắc muốn xóa món "${dish.name}" không?`;
    if (count > 0) {
      confirmMsg += ` Hiện có ${count} quán đang phục vụ món này.`;
    }

    if (window.confirm(confirmMsg)) {
      onDeleteDish(dish.id);
    }
  };

  const filteredDishes = dishes.filter(d =>
    d.name.toLowerCase().includes(searchKeyword.toLowerCase().trim())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200 text-slate-800 dark:text-zinc-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 dark:bg-emerald-950/70 dark:text-emerald-400 flex items-center justify-center">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-zinc-100">Danh mục Món ăn ({dishes.length})</h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Quản lý toàn bộ danh sách món ăn trong ứng dụng</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 dark:text-zinc-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Form thêm món: CAM ở Light, XANH LÁ ở Dark */}
          <form onSubmit={handleAddSubmit} className="flex gap-2">
            <input
              type="text"
              value={newDishName}
              onChange={e => setNewDishName(e.target.value)}
              placeholder="Nhập tên món ăn mới (VD: Bún riêu cua)..."
              className="flex-1 px-3.5 py-2 text-sm bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 rounded-xl focus:bg-white dark:focus:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-emerald-500/20 focus:border-orange-500 dark:focus:border-emerald-500 transition-all"
            />
            <button
              type="submit"
              disabled={!newDishName.trim() || isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Thêm món</span>
            </button>
          </form>

          {/* Search box for dishes */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
            <input
              type="text"
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
              placeholder="Tìm kiếm món trong danh sách..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 rounded-xl focus:bg-white dark:focus:bg-zinc-800 focus:outline-none"
            />
          </div>

          {/* List of existing dishes */}
          <div className="border border-slate-200/80 dark:border-zinc-800 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-zinc-800 bg-slate-50/20 dark:bg-zinc-950/40 max-h-72 overflow-y-auto">
            {filteredDishes.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 dark:text-zinc-500 flex flex-col items-center gap-1">
                <AlertCircle className="w-5 h-5 text-slate-300 dark:text-zinc-600" />
                <span>Không có món ăn nào khớp với từ khóa tìm kiếm</span>
              </div>
            ) : (
              filteredDishes.map(dish => {
                const count = getRestaurantCountForDish(dish.id);
                return (
                  <div
                    key={dish.id}
                    className="p-3 flex items-center justify-between gap-3 hover:bg-white dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-zinc-200">{dish.name}</div>
                      <div className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">
                        {count > 0 ? (
                          <span className="text-orange-600 dark:text-emerald-400 font-medium">Được phục vụ tại {count} quán</span>
                        ) : (
                          'Chưa có quán nào phục vụ'
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(dish)}
                      className="p-1.5 text-slate-400 dark:text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                      title="Xóa món này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-zinc-950 border-t border-slate-100 dark:border-zinc-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
