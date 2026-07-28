"use client"
import { useState } from "react";
import { Plus, Trash2, Minus, X, Eye, Share2, ArrowLeft, FileText, Image as ImageIcon, Search, Banknote } from "lucide-react";
import { useLocalDatabase } from "@/hooks/useLocalDatabase"; // Đảm bảo đường dẫn này trỏ đúng tới hook của bạn
import { useRef } from "react";

export default function CreatePurchaseOrderPage() {
    const { db, saveDb, isLoaded } = useLocalDatabase();

    const today = new Date().toISOString().split('T')[0];
    const [quoteDate, setQuoteDate] = useState(today);
    const [autoCustomerId, setAutoCustomerId] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [customerAddress, setCustomerAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("Chuyển khoản");
    const [note, setNote] = useState("");
    const [deposit, setDeposit] = useState("");
    const [selectedItems, setSelectedItems] = useState<any[]>([]);
    const [isPreview, setIsPreview] = useState(false);
    const printRef = useRef<HTMLDivElement>(null);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addSearchQuery, setAddSearchQuery] = useState("");

    // Tránh lỗi Hydration Mismatch của Next.js
    if (!isLoaded) {
        return <div className="flex justify-center items-center h-screen text-slate-400 text-sm">Đang tải dữ liệu...</div>;
    }

    // Lấy danh sách sản phẩm gốc từ Local Database
    const productCatalog = db?.products || [];

    const generateCustomerId = () => {
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        return `$kh_${randomNum}`;
    };

    // LƯU PHIẾU VÀO LỊCH SỬ (Không dùng API fetch nữa)
    const handleSaveToHistory = () => {
        if (selectedItems.length === 0) return alert("Chọn ít nhất 1 sản phẩm!");

        const newId = generateCustomerId();
        const newHistoryItem = {
            id: newId,
            customerName,
            phone: customerPhone,
            address: customerAddress,
            paymentMethod,
            date: quoteDate,
            deposit,
            note,
            products: selectedItems
        };

        // Đẩy phiếu mua hàng mới vào mảng history trong Local Database
        saveDb({ ...db, history: [newHistoryItem, ...(db?.history || [])] });

        setAutoCustomerId(newId);
        setIsPreview(true); // Sang trang in
    };

    const filteredAddProducts = productCatalog.filter((p: any) => {
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

    const handleAddProduct = (product: any) => {
        const existingItem = selectedItems.find(item => item.id === product.id);
        if (existingItem) {
            setSelectedItems(selectedItems.map(item => item.id === product.id ? { ...item, quantity: (Number(item.quantity) || 0) + 1 } : item));
        } else {
            setSelectedItems([...selectedItems, { ...product, quantity: 1 }]);
        }
    };

    const handleUpdateQuantity = (id: number, newQuantity: number | string) => {
        if (typeof newQuantity === 'number') {
            setSelectedItems(selectedItems.map(item => item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item));
        } else {
            const raw = newQuantity.replace(/\D/g, '');
            const qty = raw === '' ? '' : parseInt(raw, 10);
            setSelectedItems(selectedItems.map(item => item.id === id ? { ...item, quantity: qty } : item));
        }
    };

    const handleUpdatePrice = (id: number, newPrice: string) => {
        let price = parseInt(newPrice.replace(/\D/g, ''));
        if (isNaN(price)) price = 0;
        setSelectedItems(selectedItems.map(item => item.id === id ? { ...item, price: price } : item));
    };

    const handleRemoveItem = (id: number) => {
        setSelectedItems(selectedItems.filter(item => item.id !== id));
    };

    const totalAmount = selectedItems.reduce((sum, item) => sum + item.price * (Number(item.quantity) || 0), 0);
    const depositAmount = parseInt(deposit.replace(/\D/g, '')) || 0;
    const remainingAmount = totalAmount - depositAmount;

    const formattedDateString = `Ngày ${new Date(quoteDate).getDate().toString().padStart(2, '0')} tháng ${(new Date(quoteDate).getMonth() + 1).toString().padStart(2, '0')} năm ${new Date(quoteDate).getFullYear()}`;

    const handleNativeShare = async () => {
        handleSaveToHistory();
        if (!printRef.current) return;

        const html2canvas = (await import("html2canvas-pro")).default;
        const { jsPDF } = await import("jspdf");

        // Tạm thời bỏ overflow hidden để capture full bảng
        const tableWrapper = printRef.current.querySelector(".overflow-x-auto") as HTMLElement;
        const prevOverflow = tableWrapper?.style.overflow;
        if (tableWrapper) tableWrapper.style.overflow = "visible";

        const canvas = await html2canvas(printRef.current, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: "#ffffff",
            // Render theo đúng kích thước thực của DOM, không bị crop
            width: printRef.current.scrollWidth,
            height: printRef.current.scrollHeight,
            windowWidth: printRef.current.scrollWidth,
            windowHeight: printRef.current.scrollHeight,
        });

        // Khôi phục overflow
        if (tableWrapper) tableWrapper.style.overflow = prevOverflow || "";

        const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

        const A4_WIDTH = 210;   // mm
        const A4_HEIGHT = 297;  // mm
        const MARGIN = 10;      // mm padding 4 cạnh

        const contentWidth = A4_WIDTH - MARGIN * 2;
        const imgWidthPx = canvas.width;
        const imgHeightPx = canvas.height;

        // Scale ảnh vừa khít chiều ngang A4
        const scale = contentWidth / (imgWidthPx * 0.264583); // px → mm (1px = 0.264583mm ở 96dpi)
        const totalHeightMm = imgHeightPx * 0.264583 * scale;

        const pageContentHeight = A4_HEIGHT - MARGIN * 2;
        const totalPages = Math.ceil(totalHeightMm / pageContentHeight);

        for (let page = 0; page < totalPages; page++) {
            if (page > 0) pdf.addPage();

            // Tính vùng cắt theo pixel cho từng trang
            const srcY = (page * pageContentHeight / (0.264583 * scale));
            const srcH = Math.min(
                pageContentHeight / (0.264583 * scale),
                imgHeightPx - srcY
            );

            // Tạo canvas con cho từng trang
            const pageCanvas = document.createElement("canvas");
            pageCanvas.width = imgWidthPx;
            pageCanvas.height = Math.ceil(srcH);
            const ctx = pageCanvas.getContext("2d")!;
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
            ctx.drawImage(canvas, 0, -srcY);

            const pageImg = pageCanvas.toDataURL("image/png");
            const pageHeightMm = (pageCanvas.height * 0.264583) * scale;

            pdf.addImage(pageImg, "PNG", MARGIN, MARGIN, contentWidth, Math.min(pageHeightMm, pageContentHeight));
        }

        const pdfBlob = pdf.output("blob");
        const fileName = `Phieu_Mua_Hang_${customerName || "KH"}_${quoteDate}.pdf`;
        const file = new File([pdfBlob], fileName, { type: "application/pdf" });

        if (navigator.canShare?.({ files: [file] })) {
            await navigator.share({ files: [file], title: fileName });
        } else {
            const url = URL.createObjectURL(pdfBlob);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    // ==========================================
    // VIEW 1: GIAO DIỆN XUẤT PDF (ĐÃ CẬP NHẬT GIAO DIỆN BẢNG MỚI)
    // ==========================================
    if (isPreview) {
        return (
            <div className="bg-slate-100 min-h-screen py-4 print:bg-white print:p-0">
                <div className="max-w-[800px] mx-auto bg-white p-4 sm:p-8 shadow-sm print:shadow-none print:w-full">
                    <div className="flex items-center justify-between border-b pb-4 mb-6 print:hidden">
                        <button onClick={() => setIsPreview(false)} className="flex items-center gap-2 text-slate-600 bg-slate-100 px-4 py-2 rounded-xl font-medium hover:bg-slate-200 transition-colors">
                            <ArrowLeft size={18} /> Sửa lại
                        </button>
                        <div className="flex gap-2">
                            <button onClick={() => window.print()} className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-xl font-medium">
                                <FileText size={18} /> Lưu tệp
                            </button>
                            <button onClick={handleNativeShare} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-medium shadow-lg">
                                <Share2 size={18} /> Chia sẻ
                            </button>
                        </div>
                    </div>

                    <div ref={printRef} className="text-black font-sans text-[13px] print:text-[12px] leading-relaxed">
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <h1 className="font-bold text-lg text-blue-800 print:text-black">Lighting</h1>
                                <p className="font-medium">Địa chỉ: Hai Bà Trưng-Hà Nội</p>
                                <p className="font-medium">SĐT: 0793398668 - 0383764983</p>
                            </div>
                            <div className="text-right flex flex-col items-end">
                                <h2 className="font-bold text-xl uppercase tracking-wider mb-1">PHIẾU MUA HÀNG</h2>
                                <p className="italic text-sm">{formattedDateString}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-6 text-sm">
                            <div className="flex gap-2"><span className="font-semibold w-28 shrink-0">Mã phiếu mua:</span><span className="border-b border-dotted border-gray-400 flex-1">{autoCustomerId}</span></div>
                            <div className="flex gap-2"><span className="font-semibold w-12 shrink-0">SĐT:</span><span className="border-b border-dotted border-gray-400 flex-1">{customerPhone}</span></div>
                            <div className="flex gap-2 col-span-2"><span className="font-semibold w-28 shrink-0">Người mua:</span><span className="border-b border-dotted border-gray-400 flex-1">{customerName}</span></div>
                            <div className="flex gap-2 col-span-2"><span className="font-semibold w-28 shrink-0">Địa chỉ:</span><span className="border-b border-dotted border-gray-400 flex-1">{customerAddress}</span></div>
                            <div className="flex gap-2 col-span-2"><span className="font-semibold w-[140px] shrink-0">Thanh toán:</span><span className="border-b border-dotted border-gray-400 flex-1">{paymentMethod}</span></div>
                        </div>

                        {/* BẢNG IN XUẤT ĐÃ ĐƯỢC CHỈNH LẠI GIAO DIỆN ĐẸP MẮT */}
                        <div className="w-full overflow-x-auto custom-scrollbar border border-slate-300 rounded-xl print:overflow-visible">
                            <table className="w-full min-w-[750px] border-collapse text-[12px] text-center">
                                <thead className="bg-slate-100 print:bg-slate-100 font-bold text-slate-700 print:text-black">
                                    <tr>
                                        <th className="border border-slate-300 print:border-slate-400 p-2.5 w-[40px]">STT</th>
                                        <th className="border border-slate-300 print:border-slate-400 p-2.5 w-[60px]">Hình ảnh</th>
                                        <th className="border border-slate-300 print:border-slate-400 p-2.5 text-left w-[200px]">Tên vật tư</th>
                                        <th className="border border-slate-300 print:border-slate-400 p-2.5 text-left">Thông số</th>
                                        <th className="border border-slate-300 print:border-slate-400 p-2.5 w-[50px]">ĐVT</th>
                                        <th className="border border-slate-300 print:border-slate-400 p-2.5 w-[50px]">SL</th>
                                        <th className="border border-slate-300 print:border-slate-400 p-2.5 text-right w-[100px]">Đơn giá</th>
                                        <th className="border border-slate-300 print:border-slate-400 p-2.5 text-right w-[110px]">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedItems.map((item, index) => (
                                        <tr key={item.id} className="h-10 hover:bg-slate-50 print:hover:bg-transparent transition-colors">
                                            <td className="border border-slate-300 print:border-slate-400 p-2 text-slate-600 print:text-black font-medium">{index + 1}</td>
                                            <td className="border border-slate-300 print:border-slate-400 p-2">
                                                <div className="w-9 h-9 border border-slate-200 rounded mx-auto flex items-center justify-center text-slate-300 bg-slate-50 print:border-slate-400 overflow-hidden">
                                                    {item.image ? (
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <ImageIcon size={14} />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="border border-slate-300 print:border-slate-400 p-2 text-left font-semibold text-slate-800 print:text-black whitespace-normal">{item.name}</td>
                                            <td className="border border-slate-300 print:border-slate-400 p-2 text-left whitespace-pre-line text-[11px] text-slate-500 print:text-black">{item.specs}</td>
                                            <td className="border border-slate-300 print:border-slate-400 p-2 text-slate-600 print:text-black">{item.unit || 'Cái'}</td>
                                            <td className="border border-slate-300 print:border-slate-400 p-2 text-slate-800 print:text-black font-semibold">{item.quantity || 0}</td>
                                            <td className="border border-slate-300 print:border-slate-400 p-2 text-right text-slate-800 print:text-black">{item.price.toLocaleString('vi-VN')}</td>
                                            <td className="border border-slate-300 print:border-slate-400 p-2 text-right font-bold text-blue-600 print:text-black">{(item.price * (Number(item.quantity) || 0)).toLocaleString('vi-VN')}</td>
                                        </tr>
                                    ))}

                                    {/* CÁC DÒNG TỔNG KẾT */}
                                    <tr className="font-bold text-sm bg-slate-50 h-10">
                                        <td colSpan={7} className="border border-slate-300 print:border-slate-400 p-2.5 text-right uppercase text-slate-700 print:text-black">TỔNG CỘNG:</td>
                                        <td className="border border-slate-300 print:border-slate-400 p-2.5 text-right text-slate-900 print:text-black">{totalAmount.toLocaleString('vi-VN')}đ</td>
                                    </tr>
                                    {depositAmount > 0 && (
                                        <tr className="font-bold text-sm bg-slate-50 h-10 text-emerald-600">
                                            <td colSpan={7} className="border border-slate-300 print:border-slate-400 p-2.5 text-right uppercase">ĐÃ CỌC:</td>
                                            <td className="border border-slate-300 print:border-slate-400 p-2.5 text-right">-{depositAmount.toLocaleString('vi-VN')}đ</td>
                                        </tr>
                                    )}
                                    <tr className="font-bold text-[15px] bg-slate-100 h-12 text-red-600">
                                        <td colSpan={7} className="border border-slate-300 print:border-slate-400 p-3 text-right uppercase">CÒN PHẢI TRẢ:</td>
                                        <td className="border border-slate-300 print:border-slate-400 p-3 text-right">{remainingAmount.toLocaleString('vi-VN')}đ</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        {note && <div className="mt-4"><span className="font-bold underline italic">Ghi chú:</span><p className="whitespace-pre-line italic text-sm mt-1">{note}</p></div>}
                    </div>
                </div>
            </div>
        );
    }


    // ==========================================
    // VIEW 2: GIAO DIỆN NHẬP LIỆU APP MOBILE
    // ==========================================
    return (
        <div className="px-4 space-y-5 pb-32">
            <header className="py-4">
                <h1 className="text-2xl font-bold text-slate-900">Tạo phiếu mua hàng</h1>
                <p className="text-slate-500 text-sm">Lập tệp phiếu mua vật tư chiếu sáng</p>
            </header>

            <div className="bg-white p-4 rounded-2xl shadow-sm border space-y-3">
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Ngày lập phiếu</label>
                    <input type="date" value={quoteDate} onChange={(e) => setQuoteDate(e.target.value)} className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-slate-700 mt-1" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input placeholder="Tên đối tác / Người mua *" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500" />
                    <input placeholder="Số điện thoại" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500" />
                </div>
                <input placeholder="Địa chỉ giao hàng" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500" />
                <input placeholder="Thanh toán" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500" />
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <h2 className="font-bold text-slate-700">Sản phẩm chọn ({selectedItems.length})</h2>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 hover:bg-blue-100 transition-colors"
                    >
                        <Plus size={16} /> Thêm nhanh
                    </button>
                </div>

                {selectedItems.length > 0 ? (
                    <div className="space-y-3">
                        {selectedItems.map((item) => (
                            <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-semibold text-slate-800 text-sm leading-tight">{item.name}</h3>
                                    <button onClick={() => handleRemoveItem(item.id)} className="text-red-400 p-1.5 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                </div>
                                <div className="flex justify-between items-center border-t pt-3 border-dashed">

                                    <div className="flex items-center bg-slate-100 rounded-lg p-1 border">
                                        <button onClick={() => handleUpdateQuantity(item.id, Number(item.quantity) - 1)} className="p-1 text-slate-600 hover:bg-white rounded-md"><Minus size={14} /></button>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            value={item.quantity}
                                            onChange={(e) => handleUpdateQuantity(item.id, e.target.value)}
                                            onBlur={() => {
                                                if (!item.quantity || Number(item.quantity) < 1) {
                                                    handleUpdateQuantity(item.id, 1);
                                                }
                                            }}
                                            className="w-10 text-center text-sm font-semibold bg-transparent outline-none no-scrollbar"
                                        />
                                        <button onClick={() => handleUpdateQuantity(item.id, Number(item.quantity) + 1)} className="p-1 text-slate-600 hover:bg-white rounded-md"><Plus size={14} /></button>
                                    </div>

                                    <div className="text-right flex flex-col items-end">
                                        <div className="flex items-center gap-1 text-slate-500">
                                            <input type="text" inputMode="numeric" value={item.price === 0 ? '' : item.price} onChange={(e) => handleUpdatePrice(item.id, e.target.value)} className="w-20 text-right text-[12px] bg-transparent border-b border-dashed border-slate-300 focus:border-blue-500 focus:text-blue-600 outline-none transition-colors font-medium" />
                                            <span className="text-[11px]">đ/{item.unit}</span>
                                        </div>
                                        <div className="font-bold text-slate-900 text-base">{(item.price * (Number(item.quantity) || 0)).toLocaleString('vi-VN')}đ</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-slate-100 border-dashed border-2 p-10 rounded-3xl flex flex-col items-center justify-center text-slate-400">
                        <Plus size={40} className="mb-2 opacity-50" />
                        <span className="text-sm font-medium">Chưa có vật tư nào</span>
                    </div>
                )}
            </div>

            <div className="space-y-3">
                <div className="bg-white p-4 rounded-2xl shadow-sm border flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-slate-600 font-semibold text-sm">
                        <Banknote size={18} className="text-emerald-500" />
                        Khách đã đặt cọc
                    </div>
                    <div className="flex items-center gap-1">
                        <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="0"
                            value={deposit}
                            onChange={(e) => {
                                const raw = e.target.value.replace(/\D/g, '');
                                setDeposit(raw ? parseInt(raw).toLocaleString('vi-VN') : '');
                            }}
                            className="w-28 text-right font-bold text-base text-emerald-600 bg-transparent border-b border-slate-200 focus:border-emerald-500 outline-none placeholder:font-normal"
                        />
                        <span className="text-sm font-semibold text-slate-500">đ</span>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-2xl shadow-sm border">
                    <h2 className="font-bold text-slate-700 mb-2 text-sm">Ghi chú phiếu mua</h2>
                    <textarea placeholder="Nhập ghi chú xuất kho..." value={note} onChange={(e) => setNote(e.target.value)} className="w-full text-sm p-3 bg-slate-50 rounded-xl outline-none resize-none min-h-[90px] border border-slate-200 focus:border-blue-500" />
                </div>
            </div>

            <div className="fixed bottom-28 left-4 right-4 bg-slate-900 text-white p-4 rounded-2xl flex justify-between items-center shadow-2xl z-40">
                <div>
                    <p className="text-[10px] text-slate-400 uppercase font-medium tracking-wider">
                        {depositAmount > 0 ? "Còn phải trả" : "Tổng cộng"}
                    </p>
                    <div className="flex items-end gap-2">
                        <p className="text-xl font-bold">{remainingAmount.toLocaleString('vi-VN')}đ</p>
                        {depositAmount > 0 && <p className="text-[11px] text-slate-400 line-through mb-1 border-l border-slate-700 pl-2">{totalAmount.toLocaleString('vi-VN')}đ</p>}
                    </div>
                </div>
                <button
                    onClick={handleSaveToHistory}
                    className="bg-blue-600 px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-1.5 shadow-lg shadow-blue-500/30 hover:bg-blue-500 transition-colors"
                >
                    <Eye size={16} /> Xem và Xuất
                </button>
            </div>

            {/* MODAL: CHỌN SẢN PHẨM CÓ THANH TÌM KIẾM ĐA NĂNG */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0">

                        <div className="flex justify-between items-center p-4 border-b border-slate-100">
                            <div>
                                <h3 className="font-bold text-slate-800 text-sm">Kho sản phẩm gốc</h3>
                                <p className="text-xs text-slate-500">Chạm để thêm vào phiếu mua hàng</p>
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
                            {filteredAddProducts.length > 0 ? (
                                filteredAddProducts.map((product: any) => {
                                    const addedCount = selectedItems.find(item => item.id === product.id)?.quantity || 0;
                                    return (
                                        <div key={product.id} onClick={() => handleAddProduct(product)} className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-100 cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all active:scale-[0.98]">
                                            <div className="pr-4">
                                                <div className="flex items-center gap-2 mb-0.5"><span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">#{product.id}</span><p className="text-sm font-bold text-slate-800 leading-tight">{product.name}</p></div>
                                                <p className="text-xs text-slate-500 line-clamp-1 mt-1">{product.specs?.replace(/\n/g, ' ')}</p>
                                                <p className="text-xs text-blue-600 font-semibold mt-1">{product.price.toLocaleString('vi-VN')}đ <span className="text-[10px] text-slate-400 font-normal">/{product.unit}</span></p>
                                            </div>
                                            <div className="flex flex-col items-center justify-center gap-1.5">
                                                <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${addedCount > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}><Plus size={16} /></div>
                                                {addedCount > 0 && <span className="text-[10px] font-bold text-emerald-600">Đã chọn ({addedCount})</span>}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-10 flex flex-col items-center justify-center"><Search size={32} className="text-slate-300 mb-2" /><p className="text-sm font-semibold text-slate-600">Không tìm thấy sản phẩm!</p></div>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}