import React from 'react';
import { Utensils, Plus, BookOpen, Cloud, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onOpenAddRestaurant: () => void;
  onOpenDishes: () => void;
  onOpenSync: () => void;
  isCloud: boolean;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddRestaurant,
  onOpenDishes,
  onOpenSync,
  isCloud,
  onRefresh,
  isRefreshing,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
        {/* Logo & App Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
            <Utensils className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight leading-none">
                Food Finder
              </h1>
              <span
                onClick={onOpenSync}
                className={`cursor-pointer inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[11px] font-medium transition-colors ${
                  isCloud
                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                title={isCloud ? 'Đang kết nối Supabase Cloud' : 'Đang lưu trữ trên thiết bị'}
              >
                <Cloud className="w-3 h-3" />
                {isCloud ? 'Cloud' : 'Local'}
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">Tra cứu quán ngon & món ăn</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Refresh button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            aria-label="Làm mới dữ liệu"
            className="p-2 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-50"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-orange-600' : ''}`} />
          </button>

          {/* Dish list manager button */}
          <button
            onClick={onOpenDishes}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
            title="Danh sách món ăn"
          >
            <BookOpen className="w-4 h-4 text-slate-600" />
            <span className="hidden xs:inline">Món ăn</span>
          </button>

          {/* Add Restaurant button */}
          <button
            onClick={onOpenAddRestaurant}
            className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-white bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl shadow-md shadow-orange-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Thêm quán</span>
          </button>
        </div>
      </div>
    </header>
  );
};
