import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

interface MenuImageViewerProps {
  images: string[];
  restaurantName: string;
  onClose: () => void;
}

export const MenuImageViewer: React.FC<MenuImageViewerProps> = ({
  images,
  restaurantName,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scale, setScale] = useState(1);

  if (!images || images.length === 0) return null;

  const currentImage = images[currentIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale(1);
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale(1);
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const zoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale(prev => Math.min(prev + 0.3, 3));
  };

  const zoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale(prev => Math.max(prev - 0.3, 0.7));
  };

  return (
    <div 
      className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Top Bar */}
      <div 
        className="flex items-center justify-between text-white max-w-4xl mx-auto w-full z-10"
        onClick={e => e.stopPropagation()}
      >
        <div className="truncate pr-4">
          <div className="text-xs text-slate-400">Ảnh Menu</div>
          <div className="text-sm sm:text-base font-bold truncate">{restaurantName}</div>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <button
            onClick={zoomOut}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer"
            title="Thu nhỏ"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={zoomIn}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer"
            title="Phóng to"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-rose-600 rounded-full text-white transition-colors ml-2 cursor-pointer"
            title="Đóng ảnh"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image View */}
      <div 
        className="flex-1 flex items-center justify-center relative overflow-hidden my-4"
        onClick={e => e.stopPropagation()}
      >
        <img
          src={currentImage}
          alt={`Menu ${currentIndex + 1}`}
          style={{ transform: `scale(${scale})`, transition: 'transform 0.15s ease' }}
          className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl select-none"
        />

        {/* Prev / Next buttons if multiple images */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/80 text-white rounded-full transition-all cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/80 text-white rounded-full transition-all cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Bottom Counter & Thumbnails */}
      <div 
        className="text-center text-white text-xs max-w-md mx-auto w-full z-10 space-y-2"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-black/50 px-3 py-1 rounded-full inline-block backdrop-blur-xs">
          Trang {currentIndex + 1} / {images.length}
        </div>

        {images.length > 1 && (
          <div className="flex items-center justify-center gap-2 overflow-x-auto py-1">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setScale(1);
                  setCurrentIndex(idx);
                }}
                className={`w-10 h-10 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                  idx === currentIndex ? 'border-orange-500 scale-105' : 'border-transparent opacity-60'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
