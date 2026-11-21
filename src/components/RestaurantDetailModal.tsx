import React from 'react';
import type { Restaurant } from '../types';
import { 
  X, 
  MapPin, 
  MapPinOff, 
  Navigation, 
  Image as ImageIcon, 
  Edit3, 
  Trash2, 
  DollarSign, 
  UtensilsCrossed 
} from 'lucide-react';
import { formatVND, getPriceRange, formatGoogleMapsUrl } from '../utils/formatters';

interface RestaurantDetailModalProps {
  restaurant: Restaurant | null;
  onClose: () => void;
  onEdit: (restaurant: Restaurant) => void;
  onDelete: (id: string) => void;
  onViewMenuImages: (images: string[], restaurantName: string) => void;
}

export const RestaurantDetailModal: React.FC<RestaurantDetailModalProps> = ({
  restaurant,
  onClose,
  onEdit,
  onDelete,
  onViewMenuImages,
}) => {
  if (!restaurant) return null;

  const priceRange = getPriceRange(restaurant);
  const hasMapUrl = Boolean(restaurant.mapUrl && restaurant.mapUrl.trim());
  const mapsHref = hasMapUrl ? formatGoogleMapsUrl(restaurant.mapUrl, restaurant.address) : null;
  const hasMenuImages = restaurant.menuImages && restaurant.menuImages.length > 0;

  const handleDelete = () => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa quán "${restaurant.name}" không?`)) {
      onDelete(restaurant.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="relative px-6 pt-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-4">
          <div className="pr-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
              Thông tin quán ăn
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-1 leading-snug">
              {restaurant.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* 1. Địa chỉ */}
          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="text-sm">
              <div className="font-semibold text-slate-700">Địa chỉ</div>
              <div className="text-slate-600 mt-0.5 leading-relaxed">{restaurant.address}</div>
            </div>
          </div>

          {/* 2. Khoảng giá của các món */}
          <div className="flex items-start gap-3 p-3 bg-amber-50/60 rounded-2xl border border-amber-100/80">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
              <DollarSign className="w-4 h-4" />
            </div>
            <div className="text-sm">
              <div className="font-semibold text-amber-900">Khoảng giá</div>
              <div className="text-amber-700 font-bold text-base mt-0.5">
                {priceRange ? priceRange.text : 'Chưa có thông tin giá'}
              </div>
            </div>
          </div>

          {/* 3. Danh sách các món và giá */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <UtensilsCrossed className="w-4 h-4 text-orange-500" />
                <span>Thực đơn & Giá món ({restaurant.dishes.length})</span>
              </h4>
            </div>

            {restaurant.dishes.length === 0 ? (
              <div className="text-center py-4 bg-slate-50 rounded-xl text-xs text-slate-400">
                Chưa có món nào được thêm vào quán này
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/30">
                {restaurant.dishes.map((dish, idx) => (
                  <div
                    key={dish.dishId || idx}
                    className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-white transition-colors"
                  >
                    <span className="font-medium text-slate-700">{dish.dishName}</span>
                    <span className="font-semibold text-orange-600 bg-orange-50/80 px-2.5 py-0.5 rounded-lg text-xs">
                      {formatVND(dish.price)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4. Hành động nhanh: Xem Ảnh Menu & Mở Google Maps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* NÚT XEM ẢNH MENU */}
            <button
              type="button"
              onClick={() => {
                if (hasMenuImages) {
                  onViewMenuImages(restaurant.menuImages, restaurant.name);
                }
              }}
              disabled={!hasMenuImages}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                hasMenuImages
                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer'
                  : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>
                {hasMenuImages
                  ? `Xem ảnh Menu (${restaurant.menuImages.length})`
                  : 'Chưa có ảnh Menu'}
              </span>
            </button>

            {/* NÚT CHUYỂN HƯỚNG GOOGLE MAP:
                YÊU CẦU ĐẶC BIỆT CỦA BẠN: "nếu quán nào chưa được thêm định vị thì khi xem quán, 
                nút chuyển hướng sang google map sẽ bị xám và không nhấn vào được"
            */}
            {hasMapUrl && mapsHref ? (
              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 active:scale-95 transition-all text-center cursor-pointer"
              >
                <Navigation className="w-4 h-4 stroke-[2.5]" />
                <span>Mở Google Maps</span>
              </a>
            ) : (
              <button
                type="button"
                disabled
                title="Quán này chưa được thêm liên kết định vị Google Maps"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold bg-slate-100 text-slate-400 border border-slate-200/80 cursor-not-allowed opacity-50 select-none pointer-events-none"
              >
                <MapPinOff className="w-4 h-4 text-slate-400" />
                <span>Chưa có định vị Maps</span>
              </button>
            )}
          </div>
        </div>

        {/* Modal Footer Actions: Edit and Delete */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xóa quán</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Đóng
            </button>
            <button
              type="button"
              onClick={() => onEdit(restaurant)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Sửa quán</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
