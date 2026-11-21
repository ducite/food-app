import React from 'react';
import type { Restaurant } from '../types';
import { MapPin, Image as ImageIcon, ChevronRight, Tag } from 'lucide-react';
import { formatVND, getPriceRange } from '../utils/formatters';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: () => void;
  isDishSearchActive: boolean;
  selectedDishIds: string[];
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onClick,
  isDishSearchActive,
  selectedDishIds,
}) => {
  const priceRange = getPriceRange(restaurant);
  const hasMenuImages = restaurant.menuImages && restaurant.menuImages.length > 0;

  // Find the searched dishes served by this restaurant
  const matchedDishes = isDishSearchActive
    ? restaurant.dishes.filter(d => selectedDishIds.includes(d.dishId))
    : [];

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className="group bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-slate-200/80 dark:border-zinc-800/90 shadow-xs hover:shadow-md hover:border-orange-300 dark:hover:border-emerald-500 transition-all cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-emerald-500/20"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Tên quán */}
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100 group-hover:text-orange-600 dark:group-hover:text-emerald-400 transition-colors truncate">
              {restaurant.name}
            </h3>
            {hasMenuImages && (
              <span
                className="shrink-0 inline-flex items-center gap-0.5 text-[11px] text-amber-700 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-400 px-1.5 py-0.5 rounded-md font-medium"
                title={`Có ${restaurant.menuImages.length} ảnh menu`}
              >
                <ImageIcon className="w-3 h-3 text-amber-500" />
                <span>{restaurant.menuImages.length}</span>
              </span>
            )}
          </div>

          {/* Địa chỉ quán */}
          <div className="flex items-start gap-1.5 mt-1.5 text-xs text-slate-500 dark:text-zinc-400">
            <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 shrink-0 mt-0.5" />
            <span className="line-clamp-1">{restaurant.address}</span>
          </div>

          {/* HIỂN THỊ KHI TRA CỨU BẰNG MÓN: Hiện tên quán, địa chỉ và GIÁ CỦA MÓN ĐÓ */}
          {isDishSearchActive && matchedDishes.length > 0 && (
            <div className="mt-3 pt-2.5 border-t border-dashed border-slate-100 dark:border-zinc-800 space-y-1.5">
              <div className="text-[11px] font-semibold text-orange-600 dark:text-emerald-400 flex items-center gap-1">
                <Tag className="w-3 h-3" />
                <span>Món tra cứu tại quán:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {matchedDishes.map(dish => (
                  <div
                    key={dish.dishId}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-50 dark:bg-emerald-950/60 border border-orange-200/80 dark:border-emerald-800/80 rounded-lg text-xs"
                  >
                    <span className="font-medium text-slate-800 dark:text-zinc-200">{dish.dishName}:</span>
                    <span className="font-bold text-orange-600 dark:text-emerald-400">{formatVND(dish.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* HIỂN THỊ KHI Ở CHẾ ĐỘ MẶC ĐỊNH (Không tra cứu món): Chỉ hiện tên quán và địa chỉ, có thể kèm khoảng giá tham khảo */}
          {!isDishSearchActive && priceRange && (
            <div className="mt-2 text-[11px] text-slate-400 dark:text-zinc-500 font-medium">
              Khoảng giá: <span className="text-slate-600 dark:text-zinc-300 font-semibold">{priceRange.text}</span>
            </div>
          )}
        </div>

        {/* Right Arrow icon */}
        <div className="self-center p-1.5 text-slate-300 dark:text-zinc-600 group-hover:text-orange-500 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
