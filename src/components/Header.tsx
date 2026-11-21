import React from 'react';
import { Utensils, Plus, BookOpen, Cloud, RefreshCw, Sun, Moon } from 'lucide-react';
import type { Theme } from '../types';

interface HeaderProps {
  onOpenAddRestaurant: () => void;
  onOpenDishes: () => void;
  onOpenSync: () => void;
  isCloud: boolean;
  onRefresh: () => void;
  isRefreshing: boolean;
  theme: Theme;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddRestaurant,
  onOpenDishes,
  onOpenSync,
  isCloud,
  onRefresh,
  isRefreshing,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-zinc-800 shadow-xs transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
        {/* Logo & App Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-orange-500 to-amber-400 dark:from-emerald-500 dark:to-green-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 dark:shadow-emerald-500/30 transition-all duration-200">
            <Utensils className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight leading-none">
                Food Finder
              </h1>
              <span
                onClick={onOpenSync}
                className={`cursor-pointer inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[11px] font-medium transition-colors ${
                  isCloud
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-400 hover:bg-emerald-200'
                    : 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-slate-200'
                }`}
                title={isCloud ? 'Đang kết nối Supabase Cloud' : 'Đang lưu trữ trên thiết bị'}
              >
                <Cloud className="w-3 h-3" />
                {isCloud ? 'Cloud' : 'Local'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 hidden sm:block">Tra cứu quán ngon & món ăn</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* NÚT CHUYỂN ĐỔI GIAO DIỆN SÁNG / TỐI */}
          <button
            onClick={onToggleTheme}
            aria-label="Đổi giao diện sáng/tối"
            className="p-2 text-slate-600 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-emerald-400 bg-slate-100 dark:bg-zinc-900 hover:bg-orange-50 dark:hover:bg-zinc-800 rounded-xl transition-all cursor-pointer border border-transparent dark:border-zinc-800"
            title={theme === 'dark' ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-300" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600 animate-in spin-in-180 duration-300" />
            )}
          </button>

          {/* Refresh button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            aria-label="Làm mới dữ liệu"
            className="p-2 text-slate-600 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-emerald-400 hover:bg-orange-50 dark:hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-orange-600 dark:text-emerald-400' : ''}`} />
          </button>

          {/* Dish list manager button */}
          <button
            onClick={onOpenDishes}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 dark:text-zinc-200 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-zinc-800/80 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded-xl transition-all cursor-pointer"
            title="Danh sách món ăn"
          >
            <BookOpen className="w-4 h-4 text-slate-600 dark:text-zinc-400" />
            <span className="hidden xs:inline">Món ăn</span>
          </button>

          {/* Add Restaurant button (CAM ở Light, XANH LÁ ở Dark) */}
          <button
            onClick={onOpenAddRestaurant}
            className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-white bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 dark:from-emerald-600 dark:to-green-600 dark:hover:from-emerald-500 dark:hover:to-green-500 rounded-xl shadow-md shadow-orange-500/20 dark:shadow-emerald-600/25 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Thêm quán</span>
          </button>
        </div>
      </div>
    </header>
  );
};
