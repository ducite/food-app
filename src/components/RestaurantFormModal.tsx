import React, { useState, useEffect } from 'react';
import type { Restaurant, Dish, RestaurantDish } from '../types';
import { 
  X, 
  Navigation, 
  Plus, 
  Search, 
  Trash2, 
  Upload, 
  HelpCircle 
} from 'lucide-react';

interface RestaurantFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Restaurant, 'id' | 'createdAt'>, editingId?: string) => void;
  editingRestaurant: Restaurant | null;
  availableDishes: Dish[];
  onQuickAddDish: (name: string) => Promise<Dish | null>;
}

export const RestaurantFormModal: React.FC<RestaurantFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingRestaurant,
  availableDishes,
  onQuickAddDish,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [mapUrl, setMapUrl] = useState('');
  const [menuImages, setMenuImages] = useState<string[]>([]);
  const [selectedDishesMap, setSelectedDishesMap] = useState<Record<string, number>>({});
  const [dishSearch, setDishSearch] = useState('');
  const [newDishName, setNewDishName] = useState('');
  const [isAddingNewDish, setIsAddingNewDish] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; address?: string }>({});

  // Populate data when editing
  useEffect(() => {
    if (editingRestaurant) {
      setName(editingRestaurant.name);
      setAddress(editingRestaurant.address);
      setMapUrl(editingRestaurant.mapUrl || '');
      setMenuImages(editingRestaurant.menuImages || []);
      
      const dishMap: Record<string, number> = {};
      editingRestaurant.dishes.forEach(d => {
        dishMap[d.dishId] = d.price;
      });
      setSelectedDishesMap(dishMap);
    } else {
      setName('');
      setAddress('');
      setMapUrl('');
      setMenuImages([]);
      setSelectedDishesMap({});
    }
    setErrors({});
  }, [editingRestaurant, isOpen]);

  // Handle image upload from file input (converts to base64 for offline portability)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chỉ chọn tệp hình ảnh');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert(`Ảnh "${file.name}" vượt quá kích thước 5MB. Vui lòng chọn ảnh nhẹ hơn.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setMenuImages(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setMenuImages(prev => prev.filter((_, i) => i !== index));
  };

  const toggleDishSelection = (dishId: string) => {
    setSelectedDishesMap(prev => {
      const next = { ...prev };
      if (dishId in next) {
        delete next[dishId];
      } else {
        next[dishId] = 0;
      }
      return next;
    });
  };

  const handlePriceChange = (dishId: string, val: string) => {
    const cleanNumber = parseInt(val.replace(/\D/g, ''), 10) || 0;
    setSelectedDishesMap(prev => ({
      ...prev,
      [dishId]: cleanNumber,
    }));
  };

  const handleCreateNewDishInline = async () => {
    if (!newDishName.trim()) return;
    const created = await onQuickAddDish(newDishName.trim());
    if (created) {
      setSelectedDishesMap(prev => ({
        ...prev,
        [created.id]: 0,
      }));
      setNewDishName('');
      setIsAddingNewDish(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; address?: string } = {};

    if (!name.trim()) newErrors.name = 'Vui lòng nhập tên quán';
    if (!address.trim()) newErrors.address = 'Vui lòng nhập địa chỉ quán';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const dishesList: RestaurantDish[] = Object.entries(selectedDishesMap).map(([dishId, price]) => {
      const dishObj = availableDishes.find(d => d.id === dishId);
      return {
        dishId,
        dishName: dishObj ? dishObj.name : 'Món đã chọn',
        price: Number(price) || 0,
      };
    });

    onSave(
      {
        name: name.trim(),
        address: address.trim(),
        mapUrl: mapUrl.trim() || undefined,
        menuImages,
        dishes: dishesList,
      },
      editingRestaurant ? editingRestaurant.id : undefined
    );

    onClose();
  };

  const filteredDishes = availableDishes.filter(d =>
    d.name.toLowerCase().includes(dishSearch.toLowerCase().trim())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-zinc-900 w-full max-w-xl rounded-3xl shadow-2xl border border-slate-100 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 text-slate-800 dark:text-zinc-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100">
            {editingRestaurant ? 'Sửa thông tin quán' : 'Thêm quán ăn mới'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 dark:text-zinc-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {/* 1. Tên quán */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Tên quán <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={e => {
                setName(e.target.value);
                if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
              }}
              placeholder="VD: Phở Thìn Lò Đúc, Cơm tấm Cali..."
              className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-zinc-800 border rounded-xl focus:bg-white dark:focus:bg-zinc-800 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-emerald-500/20 transition-all ${
                errors.name ? 'border-rose-400 ring-2 ring-rose-100' : 'border-slate-200 dark:border-zinc-700 focus:border-orange-500 dark:focus:border-emerald-500'
              }`}
            />
            {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
          </div>

          {/* 2. Địa chỉ quán */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Địa chỉ <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={address}
              onChange={e => {
                setAddress(e.target.value);
                if (errors.address) setErrors(prev => ({ ...prev, address: undefined }));
              }}
              placeholder="VD: 13 Lò Đúc, Hai Bà Trưng, Hà Nội"
              className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-zinc-800 border rounded-xl focus:bg-white dark:focus:bg-zinc-800 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-emerald-500/20 transition-all ${
                errors.address ? 'border-rose-400 ring-2 ring-rose-100' : 'border-slate-200 dark:border-zinc-700 focus:border-orange-500 dark:focus:border-emerald-500'
              }`}
            />
            {errors.address && <p className="text-xs text-rose-500 mt-1">{errors.address}</p>}
          </div>

          {/* 3. Định vị Google Maps (Không bắt buộc) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
                <span>Định vị Google Maps</span>
                <span className="text-slate-400 dark:text-zinc-500 font-normal lowercase">(không bắt buộc)</span>
              </label>
              <div 
                className="group relative cursor-pointer text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300"
                title="Dán link chia sẻ từ Google Maps hoặc toạ độ. Nếu để trống, nút xem bản đồ sẽ bị xám."
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </div>
            </div>
            <input
              type="text"
              value={mapUrl}
              onChange={e => setMapUrl(e.target.value)}
              placeholder="Dán link Google Maps (VD: https://maps.app.goo.gl/...) hoặc để trống"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl focus:bg-white dark:focus:bg-zinc-800 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-emerald-500/20 focus:border-orange-500 dark:focus:border-emerald-500 transition-all"
            />
            <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1">
              * Nếu không điền mục này, khi xem quán nút mở Google Maps sẽ bị làm mờ (xám) và không nhấn được.
            </p>
          </div>

          {/* 4. Chọn món & nhập giá cho từng món */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
                Món ăn tại quán & Giá tiền ({Object.keys(selectedDishesMap).length} món đã chọn)
              </label>
              <button
                type="button"
                onClick={() => setIsAddingNewDish(!isAddingNewDish)}
                className="text-xs text-orange-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm món mới</span>
              </button>
            </div>

            {/* Inline quick add new dish */}
            {isAddingNewDish && (
              <div className="mb-3 p-3 bg-orange-50/70 dark:bg-emerald-950/40 border border-orange-200 dark:border-emerald-800 rounded-2xl flex items-center gap-2 animate-in fade-in">
                <input
                  type="text"
                  value={newDishName}
                  onChange={e => setNewDishName(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleCreateNewDishInline();
                    }
                  }}
                  placeholder="Nhập tên món ăn mới..."
                  className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 border border-orange-300 dark:border-emerald-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-emerald-500/20"
                />
                <button
                  type="button"
                  onClick={handleCreateNewDishInline}
                  disabled={!newDishName.trim()}
                  className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold disabled:opacity-50 cursor-pointer"
                >
                  Thêm
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingNewDish(false)}
                  className="p-1.5 text-slate-400 dark:text-zinc-400 hover:text-slate-600 dark:hover:text-zinc-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Search dish in checklist */}
            <div className="relative mb-2">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
              <input
                type="text"
                value={dishSearch}
                onChange={e => setDishSearch(e.target.value)}
                placeholder="Tìm món để chọn..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 rounded-xl focus:bg-white dark:focus:bg-zinc-800 focus:outline-none"
              />
            </div>

            {/* Checklist of dishes */}
            <div className="border border-slate-200 dark:border-zinc-800 rounded-2xl max-h-56 overflow-y-auto divide-y divide-slate-100 dark:divide-zinc-800 bg-slate-50/30 dark:bg-zinc-950/40">
              {filteredDishes.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400 dark:text-zinc-500">
                  Không tìm thấy món ăn nào phù hợp.
                </div>
              ) : (
                filteredDishes.map(dish => {
                  const isChecked = dish.id in selectedDishesMap;
                  const currentPrice = selectedDishesMap[dish.id] || 0;

                  return (
                    <div
                      key={dish.id}
                      className={`p-2.5 flex items-center justify-between gap-3 transition-colors ${
                        isChecked 
                          ? 'bg-orange-50/50 dark:bg-emerald-950/40' 
                          : 'hover:bg-white dark:hover:bg-zinc-800/50'
                      }`}
                    >
                      {/* Checkbox & Name */}
                      <label className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0 select-none">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleDishSelection(dish.id)}
                          className="w-4 h-4 text-orange-600 dark:text-emerald-500 rounded-md border-slate-300 dark:border-zinc-700 focus:ring-orange-500 dark:focus:ring-emerald-500 cursor-pointer"
                        />
                        <span className={`text-xs font-medium truncate ${
                          isChecked 
                            ? 'text-orange-950 dark:text-emerald-300 font-semibold' 
                            : 'text-slate-700 dark:text-zinc-300'
                        }`}>
                          {dish.name}
                        </span>
                      </label>

                      {/* Ô nhập giá món */}
                      {isChecked ? (
                        <div className="flex items-center gap-1.5 shrink-0">
                          <input
                            type="text"
                            inputMode="numeric"
                            value={currentPrice > 0 ? new Intl.NumberFormat('vi-VN').format(currentPrice) : ''}
                            onChange={e => handlePriceChange(dish.id, e.target.value)}
                            placeholder="Nhập giá (đ)"
                            className="w-24 px-2 py-1 text-xs text-right font-semibold text-orange-600 dark:text-emerald-400 bg-white dark:bg-zinc-800 border border-orange-300 dark:border-emerald-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-emerald-500/20"
                          />
                          <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">đ</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 dark:text-zinc-500 italic shrink-0">Chưa chọn</span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* 5. Tải lên ảnh Menu */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
              Ảnh Menu của quán ({menuImages.length} ảnh)
            </label>

            {/* Image Preview Grid */}
            {menuImages.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                {menuImages.map((img, idx) => (
                  <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-700">
                    <img src={img} alt={`Menu ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-rose-600 text-white rounded-full transition-colors cursor-pointer"
                      title="Xóa ảnh này"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 dark:border-zinc-700 hover:border-orange-400 dark:hover:border-emerald-500 bg-slate-50 dark:bg-zinc-800/40 hover:bg-orange-50/30 dark:hover:bg-zinc-800 rounded-2xl cursor-pointer transition-all">
              <Upload className="w-6 h-6 text-slate-400 dark:text-zinc-500 mb-1" />
              <span className="text-xs font-semibold text-slate-700 dark:text-zinc-200">Tải lên ảnh Menu từ máy hoặc chụp</span>
              <span className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">Hỗ trợ PNG, JPG, WEBP (Tối đa 5MB)</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </form>

        {/* Modal Footer (CAM ở Light, XANH LÁ ở Dark) */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-zinc-950 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 text-xs font-semibold text-white bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 dark:from-emerald-600 dark:to-green-600 dark:hover:from-emerald-500 dark:hover:to-green-500 rounded-xl shadow-md shadow-orange-500/20 dark:shadow-emerald-600/30 active:scale-95 transition-all cursor-pointer"
          >
            {editingRestaurant ? 'Lưu thay đổi' : 'Thêm quán ăn'}
          </button>
        </div>
      </div>
    </div>
  );
};
