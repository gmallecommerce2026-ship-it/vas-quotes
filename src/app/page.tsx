"use client"
import { useState } from "react";
import { Eye, Share2, ArrowLeft, Image as ImageIcon, Download, Copy, X, Trash2, Plus, Save, FileText, Calendar, Search } from "lucide-react";
import { useLocalDatabase } from "@/hooks/useLocalDatabase"; // Đảm bảo đường dẫn này trỏ đúng tới hook của bạn

export default function MasterQuotePage() {
  const { db, saveDb, isLoaded } = useLocalDatabase();

  const [view, setView] = useState<"dashboard" | "edit" | "preview">("dashboard");
  const [previewFrom, setPreviewFrom] = useState<"dashboard" | "edit">("dashboard");
  const [editingQuote, setEditingQuote] = useState<any>({
    id: "",
    name: "",
    products: []
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addSearchQuery, setAddSearchQuery] = useState("");

  // Kiểm tra trạng thái isLoaded để tránh lỗi Hydration Mismatch của Next.js
  if (!isLoaded) {
    return <div className="flex justify-center items-center h-screen text-slate-400 text-sm">Đang tải dữ liệu báo giá...</div>;
  }

  // Lấy dữ liệu trực tiếp từ Local Storage
  const masterCatalog = db?.products || [];
  const savedQuotes = db?.savedQuotes || [];

  const formattedDateString = `Ngày ${new Date().getDate().toString().padStart(2, '0')} tháng ${(new Date().getMonth() + 1).toString().padStart(2, '0')} năm ${new Date().getFullYear()}`;

  const handleCreateNewTemp = () => {
    setEditingQuote({
      id: "quote_" + Date.now(),
      name: "Bản báo giá mới " + new Date().toLocaleDateString('vi-VN'),
      products: JSON.parse(JSON.stringify(masterCatalog)) // Copy trực tiếp từ kho gốc
    });
    setView("edit");
  };

  const handleSelectSavedQuote = (quote: any) => {
    setEditingQuote(JSON.parse(JSON.stringify(quote)));
    setView("edit");
  };

  const handleDeleteSavedQuote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Bạn có chắc chắn muốn xóa bản báo giá tùy chỉnh này khỏi trang chủ?")) {
      const newQuotes = savedQuotes.filter((q: any) => q.id !== id);
      saveDb({ ...db, savedQuotes: newQuotes });
    }
  };

  const handleSaveToDashboard = () => {
    if (!editingQuote.name.trim()) {
      alert("Vui lòng nhập tên gợi nhớ hoặc tên khách hàng cho bản báo giá này!");
      return;
    }

    const isExisting = savedQuotes.some((q: any) => q.id === editingQuote.id);
    let newQuotes: any;

    if (isExisting) {
      newQuotes = savedQuotes.map((q: any) => q.id === editingQuote.id ? { ...editingQuote, date: new Date().toLocaleDateString('vi-VN') } : q);
    } else {
      newQuotes = [{ ...editingQuote, date: new Date().toLocaleDateString('vi-VN') }, ...savedQuotes];
    }

    saveDb({ ...db, savedQuotes: newQuotes });
    setView("dashboard");
  };

  const handleUpdateTempPrice = (id: number, newPriceStr: string) => {
    const num = parseInt(newPriceStr.replace(/\D/g, ''));
    const validPrice = isNaN(num) ? 0 : num;
    setEditingQuote({
      ...editingQuote,
      products: editingQuote.products.map((p: any) => p.id === id ? { ...p, price: validPrice } : p)
    });
  };

  const handleRemoveTempProduct = (id: number) => {
    setEditingQuote({
      ...editingQuote,
      products: editingQuote.products.filter((p: any) => p.id !== id)
    });
  };

  const handleAddTempProduct = (product: any) => {
    setEditingQuote({
      ...editingQuote,
      products: [...editingQuote.products, product]
    });
  };

  const handleNativeShare = (productsToShare: any[], title: string) => {
    let messageText = `✨ ${title.toUpperCase()} ✨\nVAS Lighting - 0793398668\n\n`;
    productsToShare.forEach((item, index) => {
      messageText += `${index + 1}. ${item.name} - ${item.price.toLocaleString('vi-VN')}đ/${item.unit}\n`;
    });
    messageText += `\nXin cảm ơn quý khách!`;

    if (navigator.share) {
      navigator.share({ title: title, text: messageText }).catch(err => console.log(err));
    } else {
      navigator.clipboard.writeText(messageText);
      alert("Đã sao chép nội dung báo giá! Bạn có thể dán (Paste) vào Zalo.");
    }
  };

  const availableProductsToInclude = masterCatalog.filter((p: any) => !editingQuote.products.some((tp: any) => tp.id === p.id));
  const filteredAddProducts = availableProductsToInclude.filter((p: any) => {
    if (!addSearchQuery) return true;
    const query = addSearchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(query) ||
      p.id.toString().includes(query) ||
      (p.specs && p.specs.toLowerCase().includes(query)) ||
      p.price.toString().includes(query) ||
      (p.unit && p.unit.toLowerCase().includes(query))
    );
  });

  // ==========================================================
  // VIEW 1: MÀN HÌNH XEM BẢN IN KHỔ A4
  // ==========================================================
  if (view === "preview") {
    return (
      <div className="bg-slate-100 min-h-screen py-4 print:bg-white print:p-0">
        <div className="max-w-[800px] mx-auto bg-white p-4 sm:p-8 shadow-sm print:shadow-none print:w-full">

          <div className="flex items-center justify-between border-b pb-4 mb-6 print:hidden">
            <button
              onClick={() => setView(previewFrom)}
              className="flex items-center gap-2 text-slate-600 bg-slate-100 px-4 py-2 rounded-xl font-medium hover:bg-slate-200 transition-colors"
            >
              <ArrowLeft size={18} /> {previewFrom === "edit" ? "Quay lại sửa" : "Quay lại trang chủ"}
            </button>
            <div className="flex gap-2">
              <button onClick={() => window.print()} className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-xl font-medium">
                <Download size={18} /> Tải PDF
              </button>
              <button onClick={() => handleNativeShare(editingQuote.products, editingQuote.name)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-medium shadow-lg">
                <Share2 size={18} /> Chia sẻ Zalo
              </button>
            </div>
          </div>

          <div className="text-black font-sans text-[13px] print:text-[12px] leading-relaxed">
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <h1 className="font-bold text-lg text-blue-800 print:text-black">VAS Lighting</h1>
                <p className="font-medium">Địa chỉ: Hai Bà Trưng-Hà Nội</p>
                <p className="font-medium">SĐT: 0793398668</p>
              </div>
              <div className="text-right flex flex-col items-end">
                <h2 className="font-bold text-xl uppercase tracking-wider mb-1">BẢNG BÁO GIÁ SẢN PHẨM</h2>
                <p className="italic text-sm">{formattedDateString}</p>
                <p className="text-xs text-slate-500 mt-1 font-bold print:hidden">({editingQuote.name})</p>
              </div>
            </div>

            <table className="w-full border-collapse text-[13px] text-center">
              <thead className="bg-slate-100 print:bg-slate-100 font-bold text-slate-700 print:text-black">
                <tr>
                  <th className="border border-slate-300 print:border-slate-400 p-2.5 w-[40px]">STT</th>
                  <th className="border border-slate-300 print:border-slate-400 p-2.5 w-[60px]">Hình ảnh</th>
                  <th className="border border-slate-300 print:border-slate-400 p-2.5 text-left w-[200px]">Tên vật tư, hàng hóa</th>
                  <th className="border border-slate-300 print:border-slate-400 p-2.5 text-left">Thông số</th>
                  <th className="border border-slate-300 print:border-slate-400 p-2.5 w-[50px]">ĐVT</th>
                  <th className="border border-slate-300 print:border-slate-400 p-2.5 text-right w-[100px]">Đơn giá</th>
                </tr>
              </thead>
              <tbody>
                {editingQuote.products.map((item: any, index: number) => (
                  <tr key={item.id} className="h-10 hover:bg-slate-50 print:hover:bg-transparent transition-colors">
                    <td className="border border-slate-300 print:border-slate-400 p-2 text-slate-600 print:text-black font-medium">{index + 1}</td>
                    <td className="border border-slate-300 print:border-slate-400 p-2">
                      <div className="w-9 h-9 border border-slate-200 rounded mx-auto flex items-center justify-center text-slate-300 bg-slate-50 print:border-slate-400 print:bg-transparent overflow-hidden">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon size={14} />
                        )}
                      </div>
                    </td>
                    <td className="border border-slate-300 print:border-slate-400 p-2 text-left font-semibold text-slate-800 print:text-black whitespace-normal">{item.name}</td>
                    <td className="border border-slate-300 print:border-slate-400 p-2 text-left whitespace-pre-line text-[11px] text-slate-500 print:text-black">{item.specs}</td>
                    <td className="border border-slate-300 print:border-slate-400 p-2 text-slate-600 print:text-black">{item.unit}</td>
                    <td className="border border-slate-300 print:border-slate-400 p-2 text-right font-bold text-blue-600 print:text-black">
                      {item.price.toLocaleString('vi-VN')}đ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================
  // VIEW 2: MÀN HÌNH CHỈNH SỬA / TÙY BIẾN BÁO GIÁ TẠM THỜI
  // ==========================================================
  if (view === "edit") {
    return (
      <div className="px-4 space-y-5 pb-48 animate-fadeIn relative">
        <header className="py-4 flex items-center gap-3 border-b">
          <button onClick={() => setView("dashboard")} className="p-1.5 bg-slate-100 rounded-xl text-slate-700">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Tùy chỉnh báo giá tạm</h1>
            <p className="text-xs text-slate-500">Thay đổi giá bán nhanh không sửa kho gốc</p>
          </div>
        </header>

        <div className="bg-white p-4 rounded-2xl shadow-sm border space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tên gợi nhớ / Tên khách hàng</label>
          <input
            type="text"
            value={editingQuote.name}
            onChange={(e) => setEditingQuote({ ...editingQuote, name: e.target.value })}
            placeholder="VD: Báo giá biệt thự anh Tuấn, Báo giá đại lý giảm 10%..."
            className="w-full text-base font-semibold bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:border-blue-500 focus:bg-white"
          />
        </div>

        <div className="space-y-3">
          <h2 className="font-bold text-slate-700 text-sm">Danh mục hàng hóa chỉnh sửa ({editingQuote.products.length})</h2>

          {editingQuote.products.map((item: any, idx: number) => (
            <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center gap-3">
              <div className="flex items-center gap-3 flex-1">
                <span className="text-xs font-bold text-slate-400 w-4">{idx + 1}</span>
                <div>
                  <h3 className="font-semibold text-slate-800 text-[13px] leading-tight">{item.name}</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{item.specs?.replace(/\n/g, ' ')}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="flex flex-col items-end">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={item.price === 0 ? '' : item.price.toLocaleString('vi-VN')}
                    onChange={(e) => handleUpdateTempPrice(item.id, e.target.value)}
                    className="w-24 text-right bg-blue-50 border-b-2 border-blue-200 focus:border-blue-500 outline-none text-sm font-bold text-blue-700 py-0.5 px-1 rounded"
                  />
                  <span className="text-[10px] text-slate-400">/{item.unit}</span>
                </div>
                <button
                  onClick={() => handleRemoveTempProduct(item.id)}
                  className="p-1.5 bg-red-50 text-red-400 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full mt-2 py-3.5 border-2 border-dashed border-blue-300 text-blue-600 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors"
          >
            <Plus size={18} /> Chọn thêm sản phẩm từ kho gốc
          </button>
        </div>

        <div className="fixed bottom-28 left-4 right-4 bg-slate-900 text-white p-3 rounded-2xl flex gap-2 shadow-2xl z-40 max-w-md mx-auto">
          <button onClick={() => setView("dashboard")} className="flex-1 bg-white/10 py-2.5 rounded-xl font-semibold text-xs flex flex-col items-center justify-center gap-1">
            <X size={16} /> Thoát
          </button>
          <button onClick={handleSaveToDashboard} className="flex-1 bg-emerald-600 hover:bg-emerald-500 py-2.5 rounded-xl font-bold text-xs flex flex-col items-center justify-center gap-1 shadow-lg shadow-emerald-500/20">
            <Save size={16} /> Lưu bản tạm
          </button>
          <button
            onClick={() => {
              setPreviewFrom("edit");
              setView("preview");
            }}
            className="flex-1 bg-blue-600 hover:bg-blue-500 py-2.5 rounded-xl font-bold text-xs flex flex-col items-center justify-center gap-1 shadow-lg shadow-blue-500/20"
          >
            <Eye size={16} /> Xem bản in
          </button>
        </div>

        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
              <div className="flex justify-between items-center p-4 border-b">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Kho sản phẩm gốc</h3>
                  <p className="text-xs text-slate-500">Chạm để thêm vào bản báo giá này</p>
                </div>
                <button onClick={() => { setIsAddModalOpen(false); setAddSearchQuery(""); }} className="p-2 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-full transition-colors"><X size={18} /></button>
              </div>
              <div className="p-3 border-b border-slate-100 bg-slate-50/50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" placeholder="Tìm tên, mã, thông số, giá bán..." value={addSearchQuery} onChange={(e) => setAddSearchQuery(e.target.value)} className="w-full bg-white border border-slate-200 shadow-sm pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                </div>
              </div>
              <div className="p-3 overflow-y-auto space-y-2 bg-slate-50 flex-1 custom-scrollbar">
                {filteredAddProducts.length > 0 ? filteredAddProducts.map((product: any) => (
                  <div key={product.id} onClick={() => handleAddTempProduct(product)} className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-100 cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all active:scale-[0.98]">
                    <div className="pr-4">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">#{product.id}</span>
                        <p className="text-sm font-bold text-slate-800 leading-tight">{product.name}</p>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-1">{product.specs?.replace(/\n/g, ' ')}</p>
                      <p className="text-xs text-blue-600 font-semibold mt-1">{product.price.toLocaleString('vi-VN')}đ <span className="text-[10px] text-slate-400 font-normal">/{product.unit}</span></p>
                    </div>
                    <div className="w-8 h-8 shrink-0 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><Plus size={16} /></div>
                  </div>
                )) : (
                  <div className="text-center py-10 flex flex-col items-center justify-center">
                    <Search size={32} className="text-slate-300 mb-2" />
                    <p className="text-sm font-semibold text-slate-600">Không tìm thấy sản phẩm!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================================
  // VIEW 3: GIAO DIỆN CHÍNH (DASHBOARD) - HIỂN THỊ TRANG CHỦ
  // ==========================================================
  return (
    <div className="px-4 space-y-6 pt-4 pb-48">
      <header className="py-2 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bảng báo giá</h1>
          <p className="text-slate-500 text-sm">Hệ thống lập báo giá VAS Lighting</p>
        </div>
      </header>

      {/* DANH SÁCH CÁC BẢN BÁO GIÁ ĐÃ LƯU TẠM THỜI */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Bản báo giá tùy chỉnh đã lưu ({savedQuotes.length})</h2>
        {savedQuotes.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {savedQuotes.map((quote: any) => (
              <div key={quote.id} onClick={() => handleSelectSavedQuote(quote)} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-200 cursor-pointer flex flex-col gap-3 active:scale-[0.99] transition-transform">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-0.5">
                    <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-1">{quote.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium"><Calendar size={12} /><span>Sửa cuối: {quote.date}</span><span>•</span><span>{quote.products.length} mặt hàng</span></div>
                  </div>
                  <button onClick={(e) => handleDeleteSavedQuote(quote.id, e)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"><Trash2 size={16} /></button>
                </div>
                <div className="flex gap-2 border-t border-slate-50 border-dashed pt-3 mt-0.5">
                  <button onClick={(e) => { e.stopPropagation(); setEditingQuote(quote); setPreviewFrom("dashboard"); setView("preview"); }} className="flex-1 bg-slate-50 border text-slate-700 text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1 hover:bg-slate-100 transition-all"><FileText size={14} /> Xem bản in PDF</button>
                  <button onClick={(e) => { e.stopPropagation(); handleNativeShare(quote.products, quote.name); }} className="flex-1 bg-blue-50 text-blue-600 text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1 hover:bg-blue-100 transition-all"><Share2 size={14} /> Chia sẻ (có Zalo)</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-100/50 border-2 border-dashed p-6 rounded-2xl text-center text-xs text-slate-400 italic">Chưa có bản báo giá tùy chỉnh nào được lưu. Bấm "Tạo bản tạm mới" phía dưới để tùy biến.</div>
        )}
      </div>

      {/* BẢNG GIÁ GỐC NIÊM YẾT - GIAO DIỆN TABLE ĐẦY ĐỦ TRỰC QUAN */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Bảng giá kho gốc niêm yết</h2>
        <div className="bg-white p-1 rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full border-collapse text-[13px] text-center min-w-[600px]">
              <thead className="bg-slate-100 font-bold text-slate-700">
                <tr>
                  <th className="border border-slate-200 p-2.5 w-[40px]">STT</th>
                  <th className="border border-slate-200 p-2.5 w-[60px]">Hình ảnh</th>
                  <th className="border border-slate-200 p-2.5 text-left w-[200px]">Tên vật tư, hàng hóa</th>
                  <th className="border border-slate-200 p-2.5 text-left">Thông số</th>
                  <th className="border border-slate-200 p-2.5 w-[50px]">ĐVT</th>
                  <th className="border border-slate-200 p-2.5 text-right w-[100px]">Đơn giá</th>
                </tr>
              </thead>
              <tbody>
                {masterCatalog.length > 0 ? masterCatalog.map((item: any, index: number) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="border border-slate-200 p-2 text-slate-500 font-medium">{index + 1}</td>
                    <td className="border border-slate-200 p-2">
                      <div className="w-9 h-9 border border-slate-200 rounded mx-auto flex items-center justify-center text-slate-300 bg-slate-50 overflow-hidden">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon size={14} />
                        )}
                      </div>
                    </td>
                    <td className="border border-slate-200 p-2 text-left font-semibold text-slate-800 whitespace-normal min-w-[150px]">{item.name}</td>
                    <td className="border border-slate-200 p-2 text-left whitespace-pre-line text-[11px] text-slate-500 min-w-[150px]">{item.specs}</td>
                    <td className="border border-slate-200 p-2 text-slate-600">{item.unit}</td>
                    <td className="border border-slate-200 p-2 text-right font-bold text-blue-600">{item.price.toLocaleString('vi-VN')}đ</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-slate-400 italic">Chưa có sản phẩm nào trong kho. Hãy thêm sản phẩm ở trang "Sản Phẩm".</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="fixed bottom-28 left-4 right-4 bg-slate-900 text-white p-3 rounded-2xl flex gap-3 shadow-2xl z-40 max-w-md mx-auto">
        <button onClick={() => handleNativeShare(masterCatalog, "Bảng báo giá niêm yết")} className="flex-1 bg-white/10 hover:bg-white/20 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-1.5 transition-colors"><Share2 size={16} /> Gửi giá gốc</button>
        <button onClick={handleCreateNewTemp} className="flex-[1.5] bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/30 transition-colors"><Copy size={16} /> Tạo bản tạm mới</button>
      </div>
    </div>
  );
}