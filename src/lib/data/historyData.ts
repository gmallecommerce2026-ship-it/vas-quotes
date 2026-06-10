// src/lib/data/historyData.ts

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

/**
 * Kiểu dữ liệu cho một hàng trong lịch sử hiến máu
 */
export interface DonationHistoryItem {
  id: number;
  day: string;
  type: string;
  location: string;
  status: "Complete";
  // detailsSvg: string; // <-- Đã xóa
}

/**
 * Kiểu dữ liệu cho các mảnh ghép của hình ảnh graphic ở header (cái chuông)
 * Tương ứng với 'data1' mới
 */
export interface HeaderGraphicPart {
  width: string;
  height: string;
  top?: string;
  left?: string;
  zIndex: number;
  hasBackgroundImage?: boolean;
  hasPaddingBottom?: boolean;
}

// -----------------------------------------------------------------------------
// DATA
// -----------------------------------------------------------------------------

/**
 * Dữ liệu cho các tiêu đề của bảng
 */
export const donationHistoryHeaders: string[] = [
  "Day",
  "Type",
  "Location",
  "Status",
  "Actions",
];

/**
 * Dữ liệu cho các hàng của bảng
 * (Gộp từ data3, data4, data5)
 */
export const donationHistoryData: DonationHistoryItem[] = [
  {
    id: 1,
    day: "12/09/2024",
    type: "Platelets",
    location: "Bach Mai Hospital",
    status: "Complete",
    // detailsSvg: "/assets/SvgAsset3.svg", // <-- Đã xóa
  },
  {
    id: 2,
    day: "25/06/2024",
    type: "Platelets",
    location: "Hanoi Medical University",
    status: "Complete",
    // detailsSvg: "/assets/SvgAsset2.svg", // <-- Đã xóa
  },
  {
    id: 3,
    day: "01/02/2024",
    type: "Platelets",
    location: "Hanoi Medical University",
    status: "Complete",
    // detailsSvg: "/assets/SvgAsset1.svg", // <-- Đã xóa
  },
];

/**
 * Dữ liệu cho các mảnh ghép graphic ở header trang History
 * Tương ứng với 'data1' mới
 */
export const historyHeaderGraphicParts: HeaderGraphicPart[] = [
  { width: "3.9px", height: "5.5px", top: "12.5px", left: "41.8px", zIndex: 50 },
  { width: "9px", height: "12.6px", top: "8.9px", left: "35.7px", zIndex: 40 },
  { width: "28.6px", height: "23.5px", top: "0.6px", left: "13.9px", zIndex: 30 },
  {
    width: "39.9px",
    height: "24.1px",
    left: "2.5px", // top: undefined
    zIndex: 20,
    hasBackgroundImage: true,
    hasPaddingBottom: true,
  },
  {
    width: "9px",
    height: "12.6px",
    top: "9px", // left: undefined
    zIndex: 10,
  },
];