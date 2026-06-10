"use client"
import { useState, useEffect } from 'react';

const DB_KEY = 'vas_lighting_db';

// 1. TÁCH MẢNG SẢN PHẨM RA BIẾN RIÊNG ĐỂ DỄ DÀNG LỌC VÀ TÁI SỬ DỤNG
const ALL_PRODUCTS = [
  // --- BỘ SẢN PHẨM VAS LIGHTING ---
  { id: 1001, name: "Đèn spotlight chống chói 10W (Lỗ khoét 75mm, 3 màu)", price: 195000, category: "Đèn Spotlight Âm Trần", unit: "Cái", stock: 100, image: "/images/1001.png", specs: "- Công suất: 10w\n- Lỗ khoét: 75mm\n- Màu sắc: 3 màu Trắng/Vàng/Trung tính\n- Góc chiếu: 36 độ\n- Chip led: Bridgelux, Osram\n- Nguồn: Lifud\n- CRI>95" },
  { id: 1002, name: "Đèn spotlight chống chói 12W (Lỗ khoét 85mm)", price: 355000, category: "Đèn Spotlight Âm Trần", unit: "Cái", stock: 100, image: "/images/1002.png", specs: "- Công suất: 12w\n- Lỗ khoét: 85mm\n- Góc chiếu: 36 độ\n- Chip led: Osram\n- Nguồn: Eaglerise\n- CRI>97" },
  { id: 1003, name: "Đèn spotlight chống chói 12W (Philips, Lỗ 75mm)", price: 345000, category: "Đèn Spotlight Âm Trần", unit: "Cái", stock: 100, image: "/images/1003.png", specs: "- Công suất: 12w\n- Lỗ khoét: 75mm\n- Màu sắc: 3000k-6000k\n- Góc chiếu: 24, 36, 55 độ\n- Chip led: Philips\n- Nguồn: Philips" },
  { id: 1004, name: "Đèn spotlight chống chói 15W (Lỗ khoét 90-95mm)", price: 295000, category: "Đèn Spotlight Âm Trần", unit: "Cái", stock: 100, image: "/images/1004.png", specs: "- Công suất: 15W\n- Lỗ khoét: 90-95mm\n- Góc chiếu: 36 độ\n- Chip led: Bridgelux\n- Nguồn: Lifud\n- CRI>97" },
  { id: 1005, name: "Đèn spotlight chống chói 18W (Lỗ khoét 120mm)", price: 425000, category: "Đèn Spotlight Âm Trần", unit: "Cái", stock: 100, image: "/images/1005.png", specs: "- Công suất: 18W\n- Lỗ khoét: 120mm\n- Góc chiếu: 55 độ\n- Chip led: Bridgelux\n- Nguồn: Lifud\n- CRI>97" },
  { id: 1006, name: "Đèn downlight chống chói 10W (Cree, Lỗ 75mm)", price: 355000, category: "Đèn Spotlight Âm Trần", unit: "Cái", stock: 100, image: "/images/1006.png", specs: "- Công suất: 10W\n- Lỗ khoét: 75mm\n- Góc chiếu: 50 độ\n- Chip led: Cree\n- Nguồn: Lifud\n- CRI>95" },
  { id: 1007, name: "Đèn spotlight chiếu rọi 10W (Osram, Lỗ 75mm)", price: 335000, category: "Đèn Spotlight Âm Trần", unit: "Cái", stock: 100, image: "/images/1007.png", specs: "- Công suất: 10W\n- Lỗ khoét: 75mm\n- Góc chiếu: 36, 55 độ\n- Chip led: Osram\n- Nguồn: Eaglerise\n- CRI>95" },
  { id: 1008, name: "Đèn spotlight chiếu rọi 10W (Choá chống chói tuyệt đối)", price: 290000, category: "Đèn Spotlight Âm Trần", unit: "Cái", stock: 100, image: "/images/1008.png", specs: "- Công suất: 10W\n- Lỗ khoét: 75mm\n- Góc chiếu: 36 độ\n- Chip led: Osram\n- Nguồn: Lifud\n- CRI>97" },
  { id: 1009, name: "Đèn spotlight chống chói 10W (Màu choá trắng)", price: 315000, category: "Đèn Spotlight Âm Trần", unit: "Cái", stock: 100, image: "/images/1009.png", specs: "- Công suất: 10W\n- Lỗ khoét: 75mm\n- Chip led: Osram\n- Nguồn: Eaglerise\n- CRI>95" },
  { id: 1010, name: "Đèn spotlight chống chói 10W (Màu choá đen)", price: 315000, category: "Đèn Spotlight Âm Trần", unit: "Cái", stock: 100, image: "/images/1010.png", specs: "- Công suất: 10W\n- Lỗ khoét: 75mm\n- Chip led: Osram\n- Nguồn: Eaglerise\n- CRI>95" },
  { id: 1011, name: "Đèn spotlight mini 7W (Lỗ khoét 55mm)", price: 285000, category: "Đèn Spotlight Âm Trần", unit: "Cái", stock: 100, image: "/images/1011.png", specs: "- Công suất: 7W\n- Lỗ khoét: 55mm\n- Góc chiếu: 24 độ\n- Chip led: Osram\n- Nguồn: Lifud\n- CRI>97" },
  { id: 1012, name: "Đèn spotlight mini 6W (Lỗ khoét 50mm)", price: 320000, category: "Đèn Spotlight Âm Trần", unit: "Cái", stock: 100, image: "/images/1012.png", specs: "- Công suất: 6W\n- Lỗ khoét: 50mm\n- Góc chiếu: 15, 24 độ\n- Chip led: Philips\n- Nguồn: Philips" },
  { id: 1013, name: "Đèn spotlight chiếu gương 10W (Tránh sấp bóng mặt)", price: 345000, category: "Đèn Spotlight Âm Trần", unit: "Cái", stock: 100, image: "/images/1013.png", specs: "- Công suất: 10W\n- Lỗ khoét: 75mm\n- Góc chiếu: 36 độ\n- Chip led: Cree\n- Nguồn: Lifud\n- CRI>95" },
  { id: 1014, name: "Đèn spotlight cảm biến 10W (Tự động bật tắt)", price: 345000, category: "Smart Lighting", unit: "Cái", stock: 100, image: "/images/1014.png", specs: "- Công suất: 10W\n- Lỗ khoét: 75mm\n- Góc chiếu: 36 độ\n- Chip led: Bridgelux\n- Nguồn: Lifud\n- CRI>97" },
  { id: 1015, name: "Đèn Smart Spotlight chiếu rọi có điều khiển và APP 18W", price: 850000, category: "Smart Lighting", unit: "Cái", stock: 100, image: "/images/1015.png", specs: "- Công suất: 18W\n- Lỗ khoét: 95mm\n- Điều chỉnh màu: 2700K-6500K\n- Chip led: Bridgelux\n- Nguồn: Goldsunda\n- CRI>97" },
  { id: 1016, name: "Đèn spotlight chỉnh tiêu cự góc 10-60 độ 8W (Đế nổi)", price: 495000, category: "Đèn Ống Bơ / Gắn Nổi", unit: "Cái", stock: 100, image: "/images/1016.png", specs: "- Công suất: 8W\n- Kích thước: D48xL105mm\n- Nhôm sơn tĩnh điện\n- Chip led: Osram\n- CRI>95" },
  { id: 1017, name: "Đèn spotlight âm trần chỉnh tiêu cự 10-60 độ 8W", price: 485000, category: "Đèn Spotlight Âm Trần", unit: "Cái", stock: 100, image: "/images/1017.png", specs: "- Công suất: 8W\n- Kích thước: D48xL105mm\n- Chip led: Osram\n- CRI>95" },
  { id: 1018, name: "Đèn bơ vuông mỏng 12W", price: 380000, category: "Đèn Ống Bơ / Gắn Nổi", unit: "Cái", stock: 100, image: "/images/1018.png", specs: "- Công suất: 12W\n- Kích thước: 117x117x55mm\n- Chip led + Nguồn: Philips" },
  { id: 1019, name: "Đèn bơ vuông đôi mỏng 12W", price: 720000, category: "Đèn Ống Bơ / Gắn Nổi", unit: "Cái", stock: 100, image: "/images/1019.png", specs: "- Công suất: 12W\n- Kích thước: 226x117x55mm\n- Chip led + Nguồn: Philips" },
  { id: 1020, name: "Đèn rọi ray T2 12W", price: 380000, category: "Đèn Rọi Ray / Soi Tranh", unit: "Cái", stock: 100, image: "/images/1020.png", specs: "- Công suất: 12W\n- Góc chiếu: 24, 36\n- Kích thước: 60x135mm\n- Chip led + Nguồn: Philips" },
  { id: 1021, name: "Đèn rọi đế ngồi 12W", price: 395000, category: "Đèn Ống Bơ / Gắn Nổi", unit: "Cái", stock: 100, image: "/images/1021.png", specs: "- Công suất: 12W\n- Kích thước: 60x135mm\n- Chip led + Nguồn: Philips" },
  { id: 1022, name: "Đèn ống bơ chống nước 12W (Vỏ đen chóa đen)", price: 380000, category: "Đèn Ống Bơ / Gắn Nổi", unit: "Cái", stock: 100, image: "/images/1022.png", specs: "- Công suất: 12W\n- Cấp bảo vệ: IP65 chống nước\n- Góc chiếu: 24, 36 độ\n- Chip led: Philips\n- Nguồn: Done" },
  { id: 1023, name: "Đèn ống bơ chống nước 12W (Vỏ trắng chóa trắng)", price: 380000, category: "Đèn Ống Bơ / Gắn Nổi", unit: "Cái", stock: 100, image: "/images/1023.png", specs: "- Công suất: 12W\n- Cấp bảo vệ: IP65 chống nước\n- Góc chiếu: 36 độ\n- Chip led: Philips\n- Nguồn: Done" },
  { id: 1024, name: "Đèn ống bơ chống nước 20W (IP65)", price: 580000, category: "Đèn Ống Bơ / Gắn Nổi", unit: "Cái", stock: 100, image: "/images/1024.png", specs: "- Công suất: 20W\n- Cấp bảo vệ: IP65\n- Góc chiếu: 36 độ\n- Chip led + Nguồn: Philips" },
  { id: 1025, name: "Đèn downlight chống chói 12W", price: 215000, category: "Đèn Spotlight Âm Trần", unit: "Cái", stock: 100, image: "/images/1025.png", specs: "- Công suất: 12W\n- Lỗ khoét: 90-95mm\n- Chip led: Osram\n- CRI >90" },
  { id: 1026, name: "Đèn âm trần soi tranh chỉnh hướng 360 độ 10W (Lỗ 75mm)", price: 355000, category: "Đèn Rọi Ray / Soi Tranh", unit: "Cái", stock: 100, image: "/images/1026.png", specs: "- Công suất: 10W\n- Lỗ khoét: 75mm\n- Góc chiếu: 36 độ\n- Chip led: Osram\n- Nguồn: Lifud" },
  { id: 1027, name: "Đèn âm trần soi tranh chỉnh hướng 360 độ 10W (Lỗ 90mm)", price: 385000, category: "Đèn Rọi Ray / Soi Tranh", unit: "Cái", stock: 100, image: "/images/1027.png", specs: "- Công suất: 10W\n- Lỗ khoét: 90mm\n- Chip led + Nguồn: Philips" },
  { id: 1028, name: "Dây led COB bản dày cao cấp (kèm phích 220V)", price: 65000, category: "Dây LED & Nguồn", unit: "Mét", stock: 500, image: "/images/1028.png", specs: "- Công suất: 15W/m\n- Màu sắc: Trung tính" },
  { id: 1029, name: "Dây led hắt 3 hàng mắt led bản dày (kèm phích 220V)", price: 35000, category: "Dây LED & Nguồn", unit: "Mét", stock: 500, image: "/images/1029.png", specs: "- Công suất: 10W/m\n- Màu sắc: Vàng" },
  { id: 1030, name: "Ray nam châm âm trần 2mm (Thanh dài 2m)", price: 160000, category: "Hệ Ray Nam Châm", unit: "Mét", stock: 200, image: "/images/1030.png", specs: "- Chiều dài: 2 mét/thanh\n- Chất liệu: Nhôm\n- Có tai chống nứt" },
  { id: 1031, name: "Nối thẳng (Ray nam châm)", price: 50000, category: "Hệ Ray Nam Châm", unit: "Cái", stock: 500, image: "/images/1031.png", specs: "- Phụ kiện nối thẳng ray nam châm" },
  { id: 1032, name: "Đèn nam châm tán quang 12W (Dài 30cm)", price: 175000, category: "Hệ Ray Nam Châm", unit: "Cái", stock: 100, image: "/images/1032.png", specs: "- Công suất: 12W\n- Kích thước: Dài 30cm\n- Màu sắc: Trung tính" },
  { id: 1033, name: "Đèn nam châm tán quang 24W (Dài 60cm)", price: 235000, category: "Hệ Ray Nam Châm", unit: "Cái", stock: 100, image: "/images/1033.png", specs: "- Công suất: 24W\n- Kích thước: Dài 60cm\n- Màu sắc: Trung tính" },
  { id: 1034, name: "Đèn nam châm tán quang 36W (Dài 90cm)", price: 275000, category: "Hệ Ray Nam Châm", unit: "Cái", stock: 100, image: "/images/1034.png", specs: "- Công suất: 36W\n- Kích thước: Dài 90cm\n- Màu sắc: Trung tính" },
  { id: 1035, name: "Đèn nam châm tiêu điểm thẳng 12W (Dài 22cm)", price: 180000, category: "Hệ Ray Nam Châm", unit: "Cái", stock: 100, image: "/images/1035.png", specs: "- Công suất: 12W\n- Kích thước: Dài 22cm\n- Màu sắc: Trung tính" },
  { id: 1036, name: "Đèn nam châm tiêu điểm thẳng 18W (Dài 33cm)", price: 215000, category: "Hệ Ray Nam Châm", unit: "Cái", stock: 100, image: "/images/1036.png", specs: "- Công suất: 18W\n- Kích thước: Dài 33cm\n- Màu sắc: Trung tính" },
  { id: 1037, name: "Đèn nam châm tiêu điểm thẳng 24W (Dài 43cm)", price: 235000, category: "Hệ Ray Nam Châm", unit: "Cái", stock: 100, image: "/images/1037.png", specs: "- Công suất: 24W\n- Kích thước: Dài 43cm\n- Màu sắc: Trung tính" },
  { id: 1038, name: "Đèn nam châm rọi 12W", price: 250000, category: "Hệ Ray Nam Châm", unit: "Cái", stock: 100, image: "/images/1038.png", specs: "- Công suất: 12W\n- Kích thước: D46x110mm\n- Màu sắc: Trung tính" },
  { id: 1039, name: "Đèn nam châm rọi 24W", price: 275000, category: "Hệ Ray Nam Châm", unit: "Cái", stock: 100, image: "/images/1039.png", specs: "- Công suất: 24W\n- Kích thước: D55x150mm\n- Màu sắc: Trung tính" },
  { id: 1040, name: "Nguồn đèn ray nam châm 100W 48V", price: 235000, category: "Hệ Ray Nam Châm", unit: "Cái", stock: 50, image: "/images/1040.png", specs: "- Công suất: 100W\n- Điện áp: 48V\n- Lắp trực tiếp trên ray" },
  { id: 1041, name: "Nguồn đèn ray nam châm 200W 48V", price: 325000, category: "Hệ Ray Nam Châm", unit: "Cái", stock: 50, image: "/images/1041.png", specs: "- Công suất: 200W\n- Điện áp: 48V\n- Lắp trực tiếp trên ray" },
  { id: 1042, name: "Công thợ", price: 2000000, category: "Lắp Đặt", unit: "", stock: 9999, image: "/images/ct.png", specs: ""},
  
  // --- BỘ SẢN PHẨM BỔ SUNG TỪ CTLED ---
  { id: 2001, name: "Đèn Downlight DN228 8W (Chip Philips)", price: 560000, category: "Đèn Downlight", unit: "Cái", stock: 100, image: "/images/2001.jpg", specs: "- Công suất: 8W\n- Lỗ khoét: 70-75mm\n- Góc chiếu: 24 độ\n- Chip led: Philips\n- Nguồn: Philips" },
  { id: 2002, name: "Đèn Downlight chống nước IP65 DN01 8W", price: 530000, category: "Đèn Downlight", unit: "Cái", stock: 100, image: "/images/2002.jpg", specs: "- Công suất: 8W\n- Lỗ khoét: 55mm\n- Cấp bảo vệ: IP65\n- Chip led: Philips\n- Nguồn: Philips" },
  { id: 2003, name: "Đèn Downlight DN02 12W (Mặt Mica)", price: 470000, category: "Đèn Downlight", unit: "Cái", stock: 100, image: "/images/2003.jpg", specs: "- Công suất: 12W\n- Lỗ khoét: 95mm\n- Góc chiếu: 90 độ\n- Chip led: Philips" },
  { id: 2004, name: "Đèn Downlight âm trần đồng ATD01 12W", price: 2375000, category: "Đèn Downlight", unit: "Cái", stock: 50, image: "/images/2004.jpg", specs: "- Công suất: 12W\n- Lỗ khoét: 100mm\n- Góc chiếu: 110 độ\n- Chất liệu: Đồng cao cấp\n- Chip led: Philips" },
  { id: 2005, name: "Đèn Spotlight SP228 10W (Chip Philips)", price: 670000, category: "Đèn Spotlight Âm Trần", unit: "Cái", stock: 100, image: "/images/2005.jpg", specs: "- Công suất: 10W\n- Lỗ khoét: 75mm\n- Góc chiếu: 15-55 độ\n- Chip led: Philips" },
  { id: 2006, name: "Đèn Spotlight SP01 12W", price: 615000, category: "Đèn Spotlight Âm Trần", unit: "Cái", stock: 100, image: "/images/2006.jpg", specs: "- Công suất: 12W\n- Lỗ khoét: 85-90mm\n- Góc chiếu: 38-60 độ\n- Chip led: Philips" },
  { id: 2007, name: "Đèn Spotlight SP06 12W (Chỉnh tiêu cự Lens)", price: 445000, category: "Đèn Spotlight Âm Trần", unit: "Cái", stock: 100, image: "/images/2007.jpg", specs: "- Công suất: 12W\n- Lỗ khoét: 75mm\n- Góc chiếu: 15-55 độ\n- Chip led: Philips" },
  { id: 2008, name: "Đèn Spotlight SPX05 10W (Xoay 360)", price: 430000, category: "Đèn Spotlight Âm Trần", unit: "Cái", stock: 100, image: "/images/2008.jpg", specs: "- Công suất: 10W\n- Lỗ khoét: 75mm\n- Thiết kế: Xoay 360 độ\n- Chip led: Philips" },
  { id: 2009, name: "Đèn Multiple SQ08 1x10W (Vuông)", price: 690000, category: "Đèn Multiple Light", unit: "Cái", stock: 100, image: "/images/2009.jpg", specs: "- Công suất: 1x10W\n- Lỗ khoét: 58x55mm\n- Kích thước: L65xW65xH120\n- Chip led: Philips" },
  { id: 2010, name: "Đèn Ốp Nổi DLV5 1x10W", price: 715000, category: "Đèn Lon Nổi", unit: "Cái", stock: 100, image: "/images/2010.jpg", specs: "- Công suất: 10W\n- Kích thước: 108x108xH108mm\n- Thiết kế: Ốp nổi vuông\n- Chip led: Philips" },
  { id: 2011, name: "Đèn Lon Nổi CLX360 10W (Xoay 360 độ)", price: 840000, category: "Đèn Lon Nổi", unit: "Cái", stock: 100, image: "/images/2011.jpg", specs: "- Công suất: 10W\n- Kích thước: D96xH70\n- Thiết kế: Lon nổi xoay 360\n- Chip led: Philips" },
  { id: 2012, name: "Đèn Lon Nổi CL2 12W", price: 590000, category: "Đèn Lon Nổi", unit: "Cái", stock: 100, image: "/images/2012.jpg", specs: "- Công suất: 12W\n- Kích thước: D75xH83\n- Thiết kế: Lon nổi tròn\n- Chip led: Philips" },
  { id: 2013, name: "Đèn Rọi Ray STR02 10W (Zoom 15-55 độ)", price: 920000, category: "Đèn Rọi Ray / Soi Tranh", unit: "Cái", stock: 100, image: "/images/2013.jpg", specs: "- Công suất: 10W\n- Kích thước: D50xL130\n- Góc chiếu: Zoom 15-55 độ\n- Chip led: Philips" },
  { id: 2014, name: "Đèn Rọi Ray STR04 12W", price: 570000, category: "Đèn Rọi Ray / Soi Tranh", unit: "Cái", stock: 100, image: "/images/2014.jpg", specs: "- Công suất: 12W\n- Kích thước: D60xL136\n- Góc chiếu: 15-36 độ\n- Chip led: Philips" },
  { id: 2015, name: "Thanh Ray T2 1M", price: 210000, category: "Đèn Rọi Ray / Soi Tranh", unit: "Thanh", stock: 200, image: "/images/2015.jpg", specs: "- Chiều dài: 1 Mét\n- Kích thước: L1000x34xH20\n- Trọng lượng: 394g\n- Chất liệu: Hợp kim nhôm" },
  { id: 2016, name: "Đèn Nam Châm Gấp Mắt DG 12W", price: 1035000, category: "Hệ Ray Nam Châm", unit: "Cái", stock: 100, image: "/images/2016.jpg", specs: "- Công suất: 12W\n- Kích thước: L220xW22xH110\n- Điện áp: 48VDC\n- Chip led: Osram" },
  { id: 2017, name: "Đèn Nam Châm Tiêu Điểm TD 12W", price: 510000, category: "Hệ Ray Nam Châm", unit: "Cái", stock: 100, image: "/images/2017.jpg", specs: "- Công suất: 12W\n- Kích thước: L220xW22xH45\n- Điện áp: 48VDC\n- Chip led: Osram" },
  { id: 2018, name: "Đèn Panel LPN02 48W (600x600)", price: 900000, category: "Đèn Panel", unit: "Cái", stock: 200, image: "/images/2018.jpg", specs: "- Công suất: 48W\n- Kích thước: 595x595x34mm\n- Lắp đặt: Thả trần / Âm trần\n- Chip led: Bridgelux" },
  { id: 2019, name: "Đèn Panel LPN02 42W (300x1200)", price: 975000, category: "Đèn Panel", unit: "Cái", stock: 200, image: "/images/2019.jpg", specs: "- Công suất: 42W\n- Kích thước: 295x1195x34mm\n- Lắp đặt: Thả trần / Âm trần\n- Chip led: Bridgelux" },
  { id: 2020, name: "Đèn Rọi Cột Tròn RC02 9W", price: 640000, category: "Đèn Ngoài Trời", unit: "Cái", stock: 50, image: "/images/2020.jpg", specs: "- Công suất: 9W\n- Kích thước: D130xH150\n- Cấp bảo vệ: IP66\n- Góc chiếu: 8-10 độ\n- Chip led: Cree XTE" },
  { id: 2021, name: "Đèn Rọi Cột Thấp RC04 20W", price: 910000, category: "Đèn Ngoài Trời", unit: "Cái", stock: 50, image: "/images/2021.jpg", specs: "- Công suất: 20W\n- Kích thước: D130xH190\n- Cấp bảo vệ: IP66\n- Góc chiếu: 30 độ\n- Chip led: Cree XTE" },
  { id: 2022, name: "Đèn Cầu Thang CT01 3W", price: 425000, category: "Đèn Cầu Thang", unit: "Cái", stock: 100, image: "/images/2022.jpg", specs: "- Công suất: 3W\n- Kích thước: 145x70xH60\n- Cấp bảo vệ: IP65\n- Chip led: Bridgelux" },
  { id: 2023, name: "Đèn Nấm Sân Vườn NSV01 7W", price: 1205000, category: "Đèn Sân Vườn", unit: "Cái", stock: 50, image: "/images/2023.jpg", specs: "- Công suất: 7W\n- Kích thước: D108xH400\n- Cấp bảo vệ: IP65\n- Chip led: Bridgelux" },
  { id: 2024, name: "Đèn Cắm Cỏ CC01 5W", price: 535000, category: "Đèn Sân Vườn", unit: "Cái", stock: 100, image: "/images/2024.jpg", specs: "- Công suất: 5W\n- Kích thước: D48x75xH230\n- Cấp bảo vệ: IP66\n- Góc chiếu: 30 độ" },
  { id: 2025, name: "Đèn Âm Đất Chỉnh Hướng AD01 9W", price: 1550000, category: "Đèn Âm Đất / Âm Nước", unit: "Cái", stock: 50, image: "/images/2025.jpg", specs: "- Công suất: 9W\n- Kích thước: D160xH210\n- Cấp bảo vệ: IP67\n- Góc chiếu: 30 độ\n- Chip led: Cree" },
  { id: 2026, name: "Đèn Âm Nước Để Ngồi AN01 9W", price: 1550000, category: "Đèn Âm Đất / Âm Nước", unit: "Cái", stock: 50, image: "/images/2026.jpg", specs: "- Công suất: 9W\n- Kích thước: D145xH180\n- Cấp bảo vệ: IP68\n- Góc chiếu: 30 độ" },
  { id: 2027, name: "Đèn Pha LED LFL01 50W", price: 690000, category: "Đèn Pha / Nhà Xưởng", unit: "Cái", stock: 100, image: "/images/2027.jpg", specs: "- Công suất: 50W\n- Kích thước: 210x240x60mm\n- IP66, Thêm chống sét 10KV\n- Chip led: Bridgelux" },
  { id: 2028, name: "Đèn Pha LED Module LFL02.1 100W", price: 1690000, category: "Đèn Pha / Nhà Xưởng", unit: "Cái", stock: 50, image: "/images/2028.jpg", specs: "- Công suất: 100W\n- Kích thước: 360x280x190mm\n- Cấp bảo vệ: IP66\n- Chip led: Bridgelux" },
  { id: 2029, name: "Đèn LED Nhà Xưởng HB01 100W", price: 2160000, category: "Đèn Pha / Nhà Xưởng", unit: "Cái", stock: 50, image: "/images/2029.jpg", specs: "- Công suất: 100W\n- Kích thước: 160xH180\n- Chao: D410mm\n- Chip led: Philips" },
  { id: 2030, name: "Đèn LED Nhà Xưởng UFO HB07 100W", price: 6150000, category: "Đèn Pha / Nhà Xưởng", unit: "Cái", stock: 30, image: "/images/2030.jpg", specs: "- Công suất: 100W\n- Kích thước: D300xH500\n- Cấp bảo vệ: IP65\n- Chip led: Lumileds 3030" }
];

// 2. KHỞI TẠO STATE MẶC ĐỊNH
const DEFAULT_DATA = {
  categories: [
    "Đèn Downlight",
    "Đèn Spotlight Âm Trần", 
    "Đèn Multiple Light",
    "Đèn Lon Nổi",
    "Đèn Ống Bơ / Gắn Nổi", 
    "Đèn Rọi Ray / Soi Tranh", 
    "Hệ Ray Nam Châm", 
    "Dây LED & Nguồn",
    "Smart Lighting",
    "Đèn Panel",
    "Đèn Cầu Thang",
    "Đèn Sân Vườn",
    "Đèn Ngoài Trời",
    "Đèn Âm Đất / Âm Nước",
    "Đèn Pha / Nhà Xưởng"
  ],
  products: ALL_PRODUCTS,
  // 3. SEED SẴN BẢN BÁO GIÁ TÙY CHỈNH (CHỈ LẤY SẢN PHẨM TỪ 1001 ĐẾN 1041)
  savedQuotes: [
    {
      id: "quote_vas_catalog_2026",
      name: "Bảng báo giá Catalog VAS Lighting (41 SP)",
      date: "11/06/2026",
      products: ALL_PRODUCTS.filter(p => p.id >= 1001 && p.id <= 1041)
    }
  ],
  history: []
};

export function useLocalDatabase() {
  const [db, setDb] = useState<typeof DEFAULT_DATA>(DEFAULT_DATA);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data từ localStorage khi component mount
  useEffect(() => {
    const localData = localStorage.getItem(DB_KEY);
    if (localData) {
      setDb(JSON.parse(localData));
    } else {
      localStorage.setItem(DB_KEY, JSON.stringify(DEFAULT_DATA));
      setDb(DEFAULT_DATA);
    }
    setIsLoaded(true);
  }, []);

  // Hàm lưu Data và cập nhật state
  const saveDb = (newData: typeof DEFAULT_DATA) => {
    setDb(newData);
    localStorage.setItem(DB_KEY, JSON.stringify(newData));
  };

  return { db, saveDb, isLoaded };
}