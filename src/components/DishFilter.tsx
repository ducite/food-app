import { useState } from 'react';
import type { Dish, FilterMode } from '../types';
import { Search, SlidersHorizontal, Check, X, Sparkles, Plus } from 'lucide-react';

interface DishFilterProps {
  dishes: Dish[];
  selectedDishIds: string[];
  filterMode: FilterMode;
  onSelectDish: (dishId: string) => void;
  onClearSelected: () => void;
  onToggleFilterMode: (mode: FilterMode) => void;
  onApplySearch: () => void;
  onOpenAddDish: () => void;
  isFilterActive: boolean;
}

export const DishFilter: React.FC<DishFilterProps> = ({
  dishes,
  selectedDishIds,
  filterMode,
  onSelectDish,
  onClearSelected,
  onToggleFilterMode,
  onApplySearch,
  onOpenAddDish,
  isFilterActive,
}) => {
  const [dishSearch, setDishSearch] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);

  const filteredDishes = dishes.filter(d =>
    d.name.toLowerCase().includes(dishSearch.toLowerCase().trim())
  );

  return (
    <div className={`bg-white dark:bg-zinc-900 rounded-2xl p-4 border transition-all mb-4 ${
      isFilterActive 
        ? 'border-orange-300 dark:border-emerald-500 ring-2 ring-orange-500/10 dark:ring-emerald-500/20 shadow-sm' 
        : 'border-slate-200/90 dark:border-zinc-800 shadow-xs'
    }`}>
      {/* Header of Filter section */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 dark:bg-emerald-950/70 dark:text-emerald-400 flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
              Tra cứu theo món ăn
              {selectedDishIds.length > 0 && (
                <span className="bg-orange-500 dark:bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                  Đã chọn {selectedDishIds.length}
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Chọn một hoặc nhiều món để lọc quán phục vụ món đó
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-medium text-orange-600 dark:text-emerald-400 hover:text-orange-700 dark:hover:text-emerald-300 bg-orange-50 dark:bg-zinc-800 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
        >
          {isExpanded ? 'Thu gọn' : 'Mở bộ lọc'}
        </button>
      </div>

      {isExpanded && (
        <div className="pt-3 space-y-3">
          {/* Controls: Search dish within filter & Mode Toggle */}
          <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
            {/* Quick search dish tag */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
              <input
                type="text"
                value={dishSearch}
                onChange={e => setDishSearch(e.target.value)}
                placeholder="Tìm tên món trong danh sách..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-zinc-800/80 focus:bg-white dark:focus:bg-zinc-800 text-slate-800 dark:text-zinc-100 border border-slate-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-emerald-500/20 focus:border-orange-500 dark:focus:border-emerald-500 transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-500"
              />
              {dishSearch && (
                <button
                  onClick={() => setDishSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-400 hover:text-slate-600 dark:hover:text-zinc-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Mode Selector (AND / OR) */}
            <div className="flex items-center bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl self-start sm:self-auto text-xs">
              <button
                type="button"
                onClick={() => onToggleFilterMode('AND')}
                className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  filterMode === 'AND'
                    ? 'bg-white dark:bg-zinc-700 text-orange-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                }`}
                title="Quán phải có ĐẦY ĐỦ tất cả các món được chọn"
              >
                Có đủ tất cả món (AND)
              </button>
              <button
                type="button"
                onClick={() => onToggleFilterMode('OR')}
                className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  filterMode === 'OR'
                    ? 'bg-white dark:bg-zinc-700 text-orange-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                }`}
                title="Quán chỉ cần có ÍT NHẤT 1 trong các món được chọn"
              >
                Có ít nhất 1 món (OR)
              </button>
            </div>
          </div>

          {/* Dish Chips / Tags List */}
          <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-1 border border-slate-100 dark:border-zinc-800 rounded-xl bg-slate-50/50 dark:bg-zinc-950/50">
            {filteredDishes.length === 0 ? (
              <div className="w-full py-4 text-center text-xs text-slate-400 dark:text-zinc-500 flex flex-col items-center gap-1.5">
                <span>Không tìm thấy món "{dishSearch}"</span>
                <button
                  type="button"
                  onClick={onOpenAddDish}
                  className="inline-flex items-center gap-1 text-orange-600 dark:text-emerald-400 font-semibold hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Thêm món này vào ứng dụng
                </button>
              </div>
            ) : (
              filteredDishes.map(dish => {
                const isSelected = selectedDishIds.includes(dish.id);
                return (
                  <button
                    key={dish.id}
                    type="button"
                    onClick={() => onSelectDish(dish.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all select-none active:scale-95 cursor-pointer ${
                      isSelected
                        ? 'bg-orange-500 dark:bg-emerald-600 text-white shadow-sm shadow-orange-500/25 dark:shadow-emerald-600/30 ring-2 ring-orange-500/20 dark:ring-emerald-500/20'
                        : 'bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200/80 dark:border-zinc-700/80 hover:border-orange-300 dark:hover:border-emerald-500 hover:bg-orange-50/40 dark:hover:bg-zinc-700'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                    <span>{dish.name}</span>
                  </button>
                );
              })
            )}
          </div>

          {/* Filter Action Bar */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="text-xs text-slate-500 dark:text-zinc-400">
              {selectedDishIds.length > 0 ? (
                <span>
                  Đang lọc theo <b>{selectedDishIds.length}</b> món ({filterMode === 'AND' ? 'Cần đủ món' : 'Ít nhất 1 món'})
                </span>
              ) : (
                <span className="text-slate-400 dark:text-zinc-500">Chưa chọn món nào</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {selectedDishIds.length > 0 && (
                <button
                  type="button"
                  onClick={onClearSelected}
                  className="px-2.5 py-1.5 text-xs text-slate-500 dark:text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-zinc-800 rounded-lg transition-colors font-medium cursor-pointer"
                >
                  Bỏ chọn tất cả
                </button>
              )}

              {/* NÚT TRA CỨU: CAM ở Light, XANH LÁ ở Dark */}
              <button
                type="button"
                onClick={onApplySearch}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-orange-600 hover:bg-orange-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Tra cứu quán</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
