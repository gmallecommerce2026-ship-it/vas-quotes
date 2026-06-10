"use client"
import { useState, useRef, useCallback, useEffect } from "react";
import { Search, Package, Plus, X, Edit3, Save, Camera, Move } from "lucide-react";
import { useLocalDatabase } from "@/hooks/useLocalDatabase"; // Đảm bảo đường dẫn này đúng với dự án của bạn

// ─── Image Cropper Component ──────────────────────────────────────────────────
function ImageCropper({ src, onCrop, onCancel }: { src: string; onCrop: (croppedDataUrl: string) => void; onCancel: () => void }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [imgSize, setImgSize] = useState({ w: 0, h: 0 });
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);
    const [cropSize, setCropSize] = useState(260); 

    const dragStart = useRef<{ px: number; py: number; ox: number; oy: number } | null>(null);
    const lastPinch = useRef<number | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        const img = new Image();
        img.onload = () => {
            imgRef.current = img;
            const containerW = containerRef.current?.clientWidth ?? 320;
            const containerH = containerRef.current?.clientHeight ?? 360;
            setCropSize(Math.min(containerW, containerH) * 0.72);
            const fitScale = Math.max(cropSize / img.naturalWidth, cropSize / img.naturalHeight);
            const s = Math.max(fitScale, 1);
            setScale(s);
            setImgSize({ w: img.naturalWidth * s, h: img.naturalHeight * s });
            setOffset({ x: (containerW - img.naturalWidth * s) / 2, y: (containerH - img.naturalHeight * s) / 2 });
        };
        img.src = src;
    }, [src]);

    const clamp = useCallback((ox: number, oy: number, s: number, iw: number, ih: number) => {
        const containerW = containerRef.current?.clientWidth ?? 320;
        const containerH = containerRef.current?.clientHeight ?? 360;
        const cropX = (containerW - cropSize) / 2;
        const cropY = (containerH - cropSize) / 2;
        const scaledW = iw * s;
        const scaledH = ih * s;
        const minX = cropX + cropSize - scaledW;
        const maxX = cropX;
        const minY = cropY + cropSize - scaledH;
        const maxY = cropY;
        return {
            x: Math.min(maxX, Math.max(minX, ox)),
            y: Math.min(maxY, Math.max(minY, oy)),
        };
    }, [cropSize]);

    const onTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length === 1) {
            dragStart.current = { px: e.touches[0].clientX, py: e.touches[0].clientY, ox: offset.x, oy: offset.y };
        } else if (e.touches.length === 2) {
            const dx = e.touches[1].clientX - e.touches[0].clientX;
            const dy = e.touches[1].clientY - e.touches[0].clientY;
            lastPinch.current = Math.hypot(dx, dy);
        }
    };

    const onTouchMove = (e: React.TouchEvent) => {
        e.preventDefault();
        if (!imgRef.current) return;
        if (e.touches.length === 1 && dragStart.current) {
            const dx = e.touches[0].clientX - dragStart.current.px;
            const dy = e.touches[0].clientY - dragStart.current.py;
            const clamped = clamp(dragStart.current.ox + dx, dragStart.current.oy + dy, scale, imgRef.current.naturalWidth, imgRef.current.naturalHeight);
            setOffset(clamped);
        } else if (e.touches.length === 2 && lastPinch.current !== null && imgRef.current) {
            const dx = e.touches[1].clientX - e.touches[0].clientX;
            const dy = e.touches[1].clientY - e.touches[0].clientY;
            const dist = Math.hypot(dx, dy);
            const delta = dist / lastPinch.current;
            lastPinch.current = dist;
            const newScale = Math.min(4, Math.max(cropSize / Math.min(imgRef.current.naturalWidth, imgRef.current.naturalHeight), scale * delta));
            const newW = imgRef.current.naturalWidth * newScale;
            const newH = imgRef.current.naturalHeight * newScale;
            const clamped = clamp(offset.x, offset.y, newScale, imgRef.current.naturalWidth, imgRef.current.naturalHeight);
            setScale(newScale);
            setImgSize({ w: newW, h: newH });
            setOffset(clamped);
        }
    };

    const onMouseDown = (e: React.MouseEvent) => { dragStart.current = { px: e.clientX, py: e.clientY, ox: offset.x, oy: offset.y }; };
    const onMouseMove = (e: React.MouseEvent) => {
        if (!dragStart.current || !imgRef.current) return;
        const dx = e.clientX - dragStart.current.px;
        const dy = e.clientY - dragStart.current.py;
        const clamped = clamp(dragStart.current.ox + dx, dragStart.current.oy + dy, scale, imgRef.current.naturalWidth, imgRef.current.naturalHeight);
        setOffset(clamped);
    };
    const onMouseUp = () => { dragStart.current = null; };

    const handleCrop = () => {
        if (!imgRef.current) return;
        const containerW = containerRef.current?.clientWidth ?? 320;
        const containerH = containerRef.current?.clientHeight ?? 360;
        const cropX = (containerW - cropSize) / 2;
        const cropY = (containerH - cropSize) / 2;

        const srcX = (cropX - offset.x) / scale;
        const srcY = (cropY - offset.y) / scale;
        const srcSize = cropSize / scale;

        const canvas = document.createElement("canvas");
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(imgRef.current, srcX, srcY, srcSize, srcSize, 0, 0, 400, 400);
        onCrop(canvas.toDataURL("image/jpeg", 0.88)); // Nén JPEG cho nhẹ
    };

    return (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col">
            <div className="flex justify-between items-center px-4 py-3 text-white">
                <button onClick={onCancel} className="text-sm font-medium text-slate-300">Hủy</button>
                <span className="text-sm font-semibold">Cắt ảnh</span>
                <button onClick={handleCrop} className="text-sm font-bold text-blue-400">Dùng ảnh</button>
            </div>
            <div
                ref={containerRef}
                className="flex-1 relative overflow-hidden select-none"
                onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
                onTouchStart={onTouchStart} onTouchMove={onTouchMove as any} onTouchEnd={() => { dragStart.current = null; lastPinch.current = null; }}
                style={{ touchAction: "none" }}
            >
                {imgRef.current && (
                    <img src={src} alt="crop" draggable={false}
                        style={{ position: "absolute", left: offset.x, top: offset.y, width: imgSize.w, height: imgSize.h, userSelect: "none", pointerEvents: "none" }}
                    />
                )}
                {containerRef.current && cropSize > 0 && (() => {
                    const cW = containerRef.current!.clientWidth;
                    const cH = containerRef.current!.clientHeight;
                    const cx = (cW - cropSize) / 2;
                    const cy = (cH - cropSize) / 2;
                    return (
                        <>
                            <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.55)", clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${cx}px ${cy}px, ${cx}px ${cy + cropSize}px, ${cx + cropSize}px ${cy + cropSize}px, ${cx + cropSize}px ${cy}px, ${cx}px ${cy}px)` }} />
                            <svg className="absolute pointer-events-none" style={{ left: cx, top: cy, width: cropSize, height: cropSize }}>
                                <line x1={cropSize / 3} y1={0} x2={cropSize / 3} y2={cropSize} stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
                                <line x1={(cropSize * 2) / 3} y1={0} x2={(cropSize * 2) / 3} y2={cropSize} stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
                                <line x1={0} y1={cropSize / 3} x2={cropSize} y2={cropSize / 3} stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
                                <line x1={0} y1={(cropSize * 2) / 3} x2={cropSize} y2={(cropSize * 2) / 3} stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
                                <rect x={0} y={0} width={cropSize} height={cropSize} fill="none" stroke="white" strokeWidth="1.5" />
                                {[[0, 0], [cropSize, 0], [0, cropSize], [cropSize, cropSize]].map(([cx2, cy2], i) => {
                                    const lx = cx2 === 0 ? 0 : cropSize - 18;
                                    const ly = cy2 === 0 ? 0 : cropSize - 18;
                                    return <rect key={i} x={lx} y={ly} width={18} height={18} fill="none" stroke="white" strokeWidth={3} />;
                                })}
                            </svg>
                        </>
                    );
                })()}
            </div>
            <div className="py-3 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
                <Move size={13} /> Kéo và phóng to để điều chỉnh
            </div>
        </div>
    );
}

// ─── Image Upload Button ──────────────────────────────────────────────────────
function ImageUploadArea({ value, onChange }: { value: string | null; onChange: (url: string | null) => void }) {
    const [rawSrc, setRawSrc] = useState<string | null>(null);
    const [showCropper, setShowCropper] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            setRawSrc(ev.target?.result as string);
            setShowCropper(true);
        };
        reader.readAsDataURL(file);
        e.target.value = "";
    };

    const handleCrop = (croppedUrl: string) => {
        onChange(croppedUrl);
        setShowCropper(false);
        setRawSrc(null);
    };

    return (
        <>
            {showCropper && rawSrc && (
                <ImageCropper src={rawSrc} onCrop={handleCrop} onCancel={() => { setShowCropper(false); setRawSrc(null); }} />
            )}
            <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-square rounded-2xl overflow-hidden bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 relative hover:border-blue-400 transition-colors active:scale-[0.98]"
            >
                {value ? (
                    <>
                        <img src={value} alt="product" className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center">
                            <div className="opacity-0 hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2">
                                <Camera size={20} className="text-slate-700" />
                            </div>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/50 rounded-full p-1.5"><Camera size={14} className="text-white" /></div>
                    </>
                ) : (
                    <>
                        <div className="bg-blue-50 rounded-full p-3"><Camera size={22} className="text-blue-500" /></div>
                        <span className="text-xs font-medium text-slate-500 text-center px-2">Chụp / Chọn ảnh sản phẩm</span>
                    </>
                )}
            </button>
        </>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProductsPage() {
    const { db, saveDb, isLoaded } = useLocalDatabase();
    
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategoryFilter, setActiveCategoryFilter] = useState("Tất cả");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    const [formData, setFormData] = useState({
        name: "", category: "", unit: "Cái", price: "", stock: "", image: null as string | null,
    });
    const [specLines, setSpecLines] = useState<string[]>([""]);

    if (!isLoaded) {
        return <div className="flex justify-center items-center h-64 text-slate-400 text-sm">Đang tải dữ liệu...</div>;
    }

    const products = db?.products || [];
    const categories = db?.categories || [];

    const filteredProducts = products.filter((item: any) => {
        const query = searchQuery.toLowerCase();
        const matchSearch = item.name.toLowerCase().includes(query) || item.id.toString().includes(query);
        const matchCategory = activeCategoryFilter === "Tất cả" || item.category === activeCategoryFilter;
        return matchSearch && matchCategory;
    });

    const buildProduct = (base: any) => ({
        ...base,
        name: formData.name,
        category: formData.category,
        unit: formData.unit,
        price: parseInt(formData.price.replace(/\D/g, "")) || 0,
        stock: parseInt(formData.stock.replace(/\D/g, "")) || 0,
        specs: specLines.map(l => l.trim()).filter(Boolean).map(l => `- ${l}`).join("\n"),
        image: formData.image, // formData.image là Base64 đã cắt nén nhẹ
    });

    const handleSaveNewProduct = () => {
        if (!formData.name.trim() || !formData.price) return alert("Điền đủ thông tin bắt buộc!");
        
        const newProduct = buildProduct({ id: Date.now() });
        const newProductsList = [newProduct, ...products];
        
        // Lưu thẳng vào Local Database
        saveDb({ ...db, products: newProductsList });
        setIsAddModalOpen(false);
    };

    const handleUpdateProduct = () => {
        if (!formData.name.trim() || !formData.price) return alert("Vui lòng điền đầy đủ thông tin!");
        
        const updated = buildProduct(selectedProduct);
        const newProductsList = products.map((p: any) => p.id === selectedProduct.id ? updated : p);
        
        // Lưu thẳng vào Local Database
        saveDb({ ...db, products: newProductsList });
        setSelectedProduct(updated);
        setIsEditing(false);
    };

    const handleOpenAddModal = () => {
        setFormData({ name: "", category: categories.length > 0 ? categories[0] : "", unit: "Cái", price: "", stock: "", image: null });
        setSpecLines([""]);
        setIsAddModalOpen(true);
    };

    const handleOpenDetailModal = (product: any) => {
        setSelectedProduct(product);
        setIsDetailModalOpen(true);
        setIsEditing(false);
    };

    const handleStartEdit = () => {
        setFormData({
            name: selectedProduct.name, category: selectedProduct.category, unit: selectedProduct.unit,
            price: selectedProduct.price.toLocaleString("vi-VN"), stock: selectedProduct.stock.toString(),
            image: selectedProduct.image ?? null,
        });
        if (selectedProduct.specs) {
            const lines = selectedProduct.specs.split("\n").map((l: string) => l.replace(/^-\s*/, ""));
            setSpecLines(lines.length > 0 ? lines : [""]);
        } else setSpecLines([""]);
        setIsEditing(true);
    };

    const handleSpecChange = (index: number, value: string) => {
        const lines = [...specLines]; lines[index] = value; setSpecLines(lines);
    };

    const FormBody = () => (
        <div className="p-4 space-y-4 overflow-y-auto">
            <div className="w-2/5 mx-auto">
                <ImageUploadArea value={formData.image} onChange={(url) => setFormData({ ...formData, image: url })} />
            </div>

            <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Tên vật tư / Hàng hóa *</label>
                <input type="text" placeholder="Nhập tên..." value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-sm p-3 rounded-xl outline-none focus:border-blue-500"
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1 block">Danh mục *</label>
                    <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 text-sm p-3 rounded-xl outline-none focus:border-blue-500 text-slate-700">
                        {categories.length > 0 ? (
                            categories.map((cat: string, i: number) => <option key={i} value={cat}>{cat}</option>)
                        ) : (
                            <option value="">Chưa có danh mục</option>
                        )}
                    </select>
                </div>
                <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1 block">Đơn vị tính</label>
                    <input type="text" placeholder="Cái, Cuộn..." value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 text-sm p-3 rounded-xl outline-none focus:border-blue-500"
                    />
                </div>
            </div>

            <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Đơn giá (VNĐ) *</label>
                <input type="text" inputMode="numeric" placeholder="0" value={formData.price}
                    onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, "");
                        setFormData({ ...formData, price: raw ? parseInt(raw).toLocaleString("vi-VN") : "" });
                    }}
                    className="w-full bg-slate-50 border border-slate-200 text-sm p-3 rounded-xl outline-none focus:border-blue-500 font-semibold text-blue-600"
                />
            </div>

            <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                <label className="text-xs font-semibold text-slate-500 mb-2 block">Thông số kỹ thuật</label>
                <div className="space-y-2">
                    {specLines.map((line, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <span className="text-slate-400 font-bold">-</span>
                            <input type="text" placeholder="VD: Công suất 12W..." value={line}
                                onChange={(e) => handleSpecChange(index, e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); setSpecLines([...specLines, ""]); } }}
                                className="flex-1 bg-white border border-slate-200 text-[13px] p-2 rounded-lg outline-none focus:border-blue-500"
                            />
                            <button onClick={() => setSpecLines(specLines.filter((_, i) => i !== index).length > 0 ? specLines.filter((_, i) => i !== index) : [""])}
                                className="p-2 text-slate-400 hover:text-red-500"><X size={16} /></button>
                        </div>
                    ))}
                    <button onClick={() => setSpecLines([...specLines, ""])} className="text-xs font-medium text-blue-600 flex items-center gap-1 mt-2">
                        <Plus size={14} /> Thêm thông số
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="px-4 space-y-5 pt-4 pb-24 relative">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Quản lý sản phẩm</h1>
                    <p className="text-slate-500 text-sm">Kho thiết bị chiếu sáng</p>
                </div>
                <button onClick={handleOpenAddModal} className="bg-blue-100 text-blue-600 p-2 rounded-full hover:bg-blue-200 transition-colors">
                    <Plus size={24} />
                </button>
            </header>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input type="text" placeholder="Tìm kiếm sản phẩm..." value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-slate-100 shadow-sm pl-10 pr-4 py-3 rounded-xl text-sm outline-none focus:border-blue-500"
                />
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                {["Tất cả", ...categories].map((cat: string) => (
                    <button key={cat} onClick={() => setActiveCategoryFilter(cat)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategoryFilter === cat ? "bg-slate-800 text-white" : "bg-white text-slate-600 border border-slate-200"}`}>
                        {cat}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {filteredProducts.length > 0 ? filteredProducts.map((item: any) => (
                    <div key={item.id} onClick={() => handleOpenDetailModal(item)}
                        className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between active:scale-[0.98] transition-transform cursor-pointer">
                        <div>
                            <div className="w-full aspect-square rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 mb-2.5 overflow-hidden">
                                {item.image ? (
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                    <Package size={30} />
                                )}
                            </div>
                            <h3 className="text-[13px] font-semibold text-slate-800 line-clamp-2 leading-tight min-h-[36px]">{item.name}</h3>
                        </div>
                        <div className="mt-2 pt-2 border-t border-slate-50 border-dashed flex justify-between items-end">
                            <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md truncate max-w-[70px]">{item.category}</span>
                            <p className="text-sm font-bold text-blue-600">{item.price.toLocaleString("vi-VN")}đ</p>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-2 text-center py-10 text-slate-400">
                        <Package size={40} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Không tìm thấy sản phẩm nào</p>
                    </div>
                )}
            </div>

            {/* ── MODAL: CHI TIẾT & CHỈNH SỬA ── */}
            {isDetailModalOpen && selectedProduct && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="text-lg font-bold text-slate-800">{isEditing ? "Chỉnh sửa sản phẩm" : "Chi tiết sản phẩm"}</h2>
                            <button onClick={() => setIsDetailModalOpen(false)} className="p-1.5 bg-slate-100 text-slate-500 rounded-full"><X size={18} /></button>
                        </div>

                        <div className="overflow-y-auto">
                            {!isEditing ? (
                                <div className="p-4 space-y-4">
                                    <div className="w-full aspect-square rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 border overflow-hidden">
                                        {selectedProduct.image ? (
                                            <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <Package size={48} />
                                        )}
                                    </div>
                                    <div>
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{selectedProduct.category}</span>
                                        <h3 className="text-lg font-bold text-slate-900 mt-2 leading-snug">{selectedProduct.name}</h3>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-xl text-sm border border-slate-100">
                                        <p className="text-slate-400 text-xs font-medium">Đơn giá bán</p>
                                        <p className="font-bold text-blue-600 text-base mt-0.5">{selectedProduct.price.toLocaleString("vi-VN")}đ</p>
                                    </div>
                                    {selectedProduct.specs && (
                                        <div className="space-y-1.5">
                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Thông số kỹ thuật</h4>
                                            <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl whitespace-pre-line leading-relaxed border border-slate-100">{selectedProduct.specs}</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <FormBody />
                            )}
                        </div>

                        <div className="p-4 border-t flex gap-3 bg-slate-50">
                            {!isEditing ? (
                                <button onClick={handleStartEdit} className="w-full py-3 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-500 shadow-lg shadow-blue-500/30 flex items-center justify-center gap-1.5 transition-colors">
                                    <Edit3 size={16} /> Chỉnh sửa hàng hóa
                                </button>
                            ) : (
                                <>
                                    <button onClick={() => setIsEditing(false)} className="flex-1 py-3 text-sm font-semibold bg-white border border-slate-200 rounded-xl">Hủy sửa</button>
                                    <button onClick={handleUpdateProduct} className="flex-1 py-3 text-sm font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-500 shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-1.5 transition-colors">
                                        <Save size={16} /> Cập nhật
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ── MODAL: THÊM MỚI ── */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="text-lg font-bold text-slate-800">Thêm sản phẩm mới</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-1.5 bg-slate-100 text-slate-500 rounded-full"><X size={18} /></button>
                        </div>
                        <div className="overflow-y-auto flex-1">
                            <FormBody />
                        </div>
                        <div className="p-4 border-t flex gap-3 bg-slate-50">
                            <button onClick={() => setIsAddModalOpen(false)} className="flex-1 py-3 text-sm font-semibold bg-white border border-slate-200 rounded-xl">Hủy</button>
                            <button onClick={handleSaveNewProduct} className="flex-1 py-3 text-sm font-bold text-white bg-blue-600 rounded-xl shadow-lg shadow-blue-500/30">Lưu sản phẩm</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}