import type { Dish, Restaurant } from '../types';

export const INITIAL_DISHES: Dish[] = [
  { id: 'dish-1', name: 'Phở bò tái nạm', createdAt: new Date().toISOString() },
  { id: 'dish-2', name: 'Bún chả Hà Nội', createdAt: new Date().toISOString() },
  { id: 'dish-3', name: 'Bún đậu mắm tôm đầy đủ', createdAt: new Date().toISOString() },
  { id: 'dish-4', name: 'Cơm tấm sườn bì chả', createdAt: new Date().toISOString() },
  { id: 'dish-5', name: 'Nem nướng Nha Trang', createdAt: new Date().toISOString() },
  { id: 'dish-6', name: 'Bánh mì chảo đặc biệt', createdAt: new Date().toISOString() },
  { id: 'dish-7', name: 'Gà rán sốt cay', createdAt: new Date().toISOString() },
  { id: 'dish-8', name: 'Trà sữa ô long nướng', createdAt: new Date().toISOString() },
  { id: 'dish-9', name: 'Trà đào cam sả', createdAt: new Date().toISOString() },
  { id: 'dish-10', name: 'Cà phê muối', createdAt: new Date().toISOString() },
];

export const INITIAL_RESTAURANTS: Restaurant[] = [
  {
    id: 'res-1',
    name: 'Phở Bò Gia Truyền Bát Đàn',
    address: '49 Bát Đàn, Cửa Đông, Hoàn Kiếm, Hà Nội',
    mapUrl: 'https://maps.app.goo.gl/BatDanExample',
    menuImages: [
      'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&auto=format&fit=crop&q=80',
    ],
    dishes: [
      { dishId: 'dish-1', dishName: 'Phở bò tái nạm', price: 65000 },
      { dishId: 'dish-10', dishName: 'Cà phê muối', price: 25000 },
    ],
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
  },
  {
    id: 'res-2',
    name: 'Bún Đậu Mẹt Hương Quê',
    address: 'Ngõ 130 Xuân Thủy, Cầu Giấy, Hà Nội',
    // ĐỂ TRỐNG ĐỊNH VỊ ĐỂ KIỂM TRA NÚT GOOGLE MAP BỊ XÁM / KHÔNG NHẤN ĐƯỢC
    mapUrl: '',
    menuImages: [
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
    ],
    dishes: [
      { dishId: 'dish-3', dishName: 'Bún đậu mắm tôm đầy đủ', price: 45000 },
      { dishId: 'dish-5', dishName: 'Nem nướng Nha Trang', price: 50000 },
      { dishId: 'dish-9', dishName: 'Trà đào cam sả', price: 20000 },
    ],
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  },
  {
    id: 'res-3',
    name: 'Cơm Tấm Ba Ghiền',
    address: '84 Đặng Văn Ngữ, Phú Nhuận, TP. Hồ Chí Minh',
    mapUrl: '10.793740, 106.671391',
    menuImages: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
    ],
    dishes: [
      { dishId: 'dish-4', dishName: 'Cơm tấm sườn bì chả', price: 75000 },
      { dishId: 'dish-9', dishName: 'Trà đào cam sả', price: 22000 },
    ],
    createdAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
  },
  {
    id: 'res-4',
    name: 'Trà Sữa & Đồ Ăn Vặt Ding Tea Corner',
    address: '26 Nguyễn Phong Sắc, Cầu Giấy, Hà Nội',
    // QUÁN NÀY CŨNG KHÔNG CÓ ĐỊNH VỊ
    mapUrl: '',
    menuImages: [],
    dishes: [
      { dishId: 'dish-7', dishName: 'Gà rán sốt cay', price: 55000 },
      { dishId: 'dish-8', dishName: 'Trà sữa ô long nướng', price: 38000 },
      { dishId: 'dish-9', dishName: 'Trà đào cam sả', price: 32000 },
    ],
    createdAt: new Date().toISOString(),
  },
];
