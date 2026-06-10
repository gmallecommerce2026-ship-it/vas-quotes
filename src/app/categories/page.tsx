"use client"
import { useState } from "react";
import { FolderTree, Trash2, FolderPlus } from "lucide-react";
import { useLocalDatabase } from "@/hooks/useLocalDatabase"; // Thay đổi đường dẫn này nếu thư mục hooks của bạn nằm chỗ khác

export default function CategoriesPage() {
  const { db, saveDb, isLoaded } = useLocalDatabase();
  const [inputCategory, setInputCategory] = useState("");

  // Kiểm tra trạng thái isLoaded để tránh lỗi Hydration Mismatch của Next.js
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-64 text-slate-400 text-sm">
        Đang tải dữ liệu...
      </div>
    );
  }

  const categories = db?.categories || [];

  const handleAddCategory = () => {
    const trimmed = inputCategory.trim();
    if (!trimmed) {
      return alert("Vui lòng nhập tên danh mục!");
    }
    if (categories.includes(trimmed)) {
      return alert("Danh mục này đã tồn tại!");
    }
    
    // Lưu thẳng vào Local Database thay vì gọi API
    saveDb({ ...db, categories: [...categories, trimmed] });
    setInputCategory("");
  };

  const handleRemoveCategory = (catName: string) => {
    if (confirm(`Xóa danh mục "${catName}"?`)) {
      saveDb({ ...db, categories: categories.filter(c => c !== catName) });
    }
  };

  return (
    <div className="px-4 space-y-6 pt-4 pb-24">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Danh mục</h1>
        <p className="text-slate-500 text-sm">Quản lý nhóm hàng hóa</p>
      </header>

      {/* Thêm mới danh mục */}
      <div className="bg-white p-3.5 rounded-2xl shadow-sm border flex gap-2 items-center">
        <input 
          type="text" 
          placeholder="Nhập tên danh mục... (VD: Đèn Vách)" 
          value={inputCategory}
          onChange={(e) => setInputCategory(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl text-sm px-3 py-2.5 outline-none focus:border-blue-500"
        />
        <button 
          onClick={handleAddCategory}
          className="bg-blue-600 text-white p-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-1 hover:bg-blue-500 transition-colors shrink-0"
        >
          <FolderPlus size={18} /> <span className="hidden sm:inline">Thêm</span>
        </button>
      </div>

      {/* Danh sách danh mục */}
      <div className="bg-white rounded-2xl shadow-sm border divide-y divide-slate-100 overflow-hidden">
        {categories.length > 0 ? (
          categories.map((cat, index) => (
            <div key={index} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
                  <FolderTree size={16} />
                </div>
                <span className="font-semibold text-slate-700">{cat}</span>
              </div>
              <button 
                onClick={() => handleRemoveCategory(cat)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors active:scale-95"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-slate-400 text-sm italic">
            Chưa có danh mục nào. Hãy thêm mới!
          </div>
        )}
      </div>
    </div>
  );
}