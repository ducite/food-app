import React, { useState, useEffect } from 'react';
import { 
  X, 
  Cloud, 
  Check, 
  Copy, 
  Download, 
  Upload, 
  RotateCcw, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { 
  getSavedSupabaseConfig, 
  saveSupabaseConfig, 
  clearSupabaseConfig, 
  SUPABASE_SETUP_SQL 
} from '../services/supabase';
import type { Dish, Restaurant } from '../types';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  dishes: Dish[];
  restaurants: Restaurant[];
  onDataImported: (dishes: Dish[], restaurants: Restaurant[]) => void;
  onResetData: () => void;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  isOpen,
  onClose,
  dishes,
  restaurants,
  onDataImported,
  onResetData,
}) => {
  if (!isOpen) return null;

  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const config = getSavedSupabaseConfig();
    if (config) {
      setUrl(config.url);
      setAnonKey(config.anonKey);
    }
  }, [isOpen]);

  const handleSaveConfig = () => {
    if (!url.trim() || !anonKey.trim()) {
      alert('Vui lòng nhập đầy đủ Supabase URL và Anon Key');
      return;
    }
    saveSupabaseConfig(url.trim(), anonKey.trim());
    setStatusMessage('Đã lưu cấu hình Supabase! Vui lòng tải lại trang.');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleDisconnect = () => {
    if (window.confirm('Bạn muốn ngắt kết nối Supabase và chuyển về dữ liệu trên máy?')) {
      clearSupabaseConfig();
      setUrl('');
      setAnonKey('');
      window.location.reload();
    }
  };

  const copySql = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleExportJSON = () => {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      dishes,
      restaurants,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = href;
    a.download = `food_finder_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(href);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        if (Array.isArray(parsed.dishes) && Array.isArray(parsed.restaurants)) {
          onDataImported(parsed.dishes, parsed.restaurants);
          alert(`Nhập thành công ${parsed.dishes.length} món và ${parsed.restaurants.length} quán!`);
          onClose();
        } else {
          alert('Tệp sao lưu không đúng định dạng!');
        }
      } catch (err) {
        alert('Lỗi đọc tệp JSON: ' + err);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const isConnected = Boolean(getSavedSupabaseConfig());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 text-slate-600 dark:text-zinc-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-zinc-100">Đồng bộ & Chia sẻ dữ liệu</h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Dùng chung dữ liệu giữa PC và điện thoại bạn bè</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 dark:text-zinc-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Status banner */}
          <div className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
            isConnected 
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300' 
              : 'bg-amber-50 dark:bg-zinc-800/80 border-amber-200 dark:border-zinc-700 text-amber-800 dark:text-amber-400'
          }`}>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <div>
                <div className="font-bold">
                  {isConnected ? 'Đang kết nối Supabase Cloud' : 'Đang dùng bộ nhớ cục bộ (Local)'}
                </div>
                <div className="text-[11px] opacity-80 mt-0.5">
                  {isConnected 
                    ? 'Dữ liệu được tự động đồng bộ realtime giữa các thiết bị.' 
                    : 'Dữ liệu chỉ lưu trên máy này. Kết nối Supabase để chia sẻ cho bạn bè.'}
                </div>
              </div>
            </div>
            {isConnected && (
              <button
                type="button"
                onClick={handleDisconnect}
                className="px-2.5 py-1 text-[11px] font-semibold bg-white dark:bg-zinc-800 text-rose-600 dark:text-rose-400 rounded-lg shadow-xs hover:bg-rose-50 dark:hover:bg-zinc-700 cursor-pointer"
              >
                Ngắt kết nối
              </button>
            )}
          </div>

          {/* Section 1: Supabase Configuration */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 dark:text-zinc-100 text-sm flex items-center gap-1.5">
              <span>Cách 1: Đồng bộ qua Supabase (Miễn phí 100%)</span>
              <a 
                href="https://supabase.com" 
                target="_blank" 
                rel="noreferrer"
                className="text-orange-600 dark:text-emerald-400 inline-flex items-center gap-0.5 hover:underline text-xs"
              >
                <span>Tạo tài khoản</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </h4>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-zinc-300 uppercase mb-1">
                Project URL
              </label>
              <input
                type="text"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="VD: https://xyzcompany.supabase.co"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 border border-slate-200 dark:border-zinc-700 rounded-xl text-xs focus:bg-white dark:focus:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-zinc-300 uppercase mb-1">
                Anon Public Key
              </label>
              <input
                type="password"
                value={anonKey}
                onChange={e => setAnonKey(e.target.value)}
                placeholder="VD: eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 border border-slate-200 dark:border-zinc-700 rounded-xl text-xs focus:bg-white dark:focus:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleSaveConfig}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Lưu cấu hình & Kết nối
              </button>
              <button
                type="button"
                onClick={copySql}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 font-semibold rounded-xl transition-all cursor-pointer"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'Đã copy mã SQL!' : 'Copy mã tạo bảng SQL'}</span>
              </button>
            </div>
            {statusMessage && <p className="text-emerald-600 dark:text-emerald-400 font-medium">{statusMessage}</p>}
          </div>

          <hr className="border-slate-100 dark:border-zinc-800" />

          {/* Section 2: Quick JSON Backup */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 dark:text-zinc-100 text-sm">
              Cách 2: Chia sẻ nhanh bằng tệp tin JSON (Không cần cấu hình)
            </h4>
            <p className="text-slate-500 dark:text-zinc-400">
              Bạn có thể xuất toàn bộ quán & món thành 1 file để gửi qua Zalo/Telegram cho bạn bè nhập vào app của họ.
            </p>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleExportJSON}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 font-semibold rounded-xl cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Xuất file sao lưu</span>
              </button>

              <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 font-semibold rounded-xl cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Nhập file sao lưu</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <hr className="border-slate-100 dark:border-zinc-800" />

          {/* Section 3: Reset data */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-slate-400 dark:text-zinc-500">Khôi phục về dữ liệu mẫu ban đầu</span>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Bạn có chắc muốn khôi phục về dữ liệu mẫu không? Mọi quán mới thêm sẽ bị xóa.')) {
                  onResetData();
                  onClose();
                }
              }}
              className="inline-flex items-center gap-1 text-rose-500 dark:text-rose-400 hover:underline font-medium cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi phục mẫu</span>
            </button>
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
