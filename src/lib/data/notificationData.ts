// src/lib/data/notificationData.ts
import { StaticImageData } from "next/image";

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

/**
 * Kiểu dữ liệu cho các mảnh ghép của hình ảnh graphic ở header (cái chuông)
 * Tương ứng với 'data1' cũ
 */
export interface HeaderGraphicPart {
  id: number;
  width: string;
  height: string;
  top: string;
  left: string;
  zIndex: number;
  hasBackgroundImage?: boolean;
  hasPaddingBottom?: boolean;
  imageSrc: string;
  alt: string;
}

/**
 * Kiểu dữ liệu cho một mục thông báo
 * Gộp 'data2', 'data3' và nội dung text hardcoded lại làm một
 */
export interface NotificationItemData {
  id: number;
  /** Dữ liệu cho icon bên trái */
  icon: {
    src: string | StaticImageData;
    alt: string;
    width: number;
    height: number;
    /** Áp dụng style w-[30px] h-[30px] cho wrapper */
    isSquare: boolean;
  };
  /** Tiêu đề (in đậm) */
  title: string;
  /** Icon nhỏ bên cạnh tiêu đề */
  titleIcon: string | StaticImageData;
  /** Thời gian */
  timestamp: string;
  /** Nội dung thông báo */
  message: string;
  /** Dữ liệu cho icon "..." bên phải */
  actionIcon: {
    src: string | StaticImageData;
    alt: string;
  };
  /** Hiển thị tag 'New' */
  isNew?: boolean;
}

// -----------------------------------------------------------------------------
// DATA
// -----------------------------------------------------------------------------

/**
 * Dữ liệu cho các mảnh ghép graphic ở header
 * Tương ứng với 'data1'
 */
export const headerGraphicParts: Omit<HeaderGraphicPart, "id" | "imageSrc" | "alt">[] = [
  { width: "3.9px", height: "5.5px", top: "12.5px", left: "41.8px", zIndex: 50 },
  { width: "9px", height: "12.6px", top: "8.9px", left: "35.7px", zIndex: 40 },
  { width: "28.6px", height: "23.5px", top: "0.6px", left: "13.9px", zIndex: 30 },
  {
    width: "39.9px",
    height: "24.1px",
    top: "0px", // Gốc là undefined, đặt 0px
    left: "2.5px",
    zIndex: 20,
    hasBackgroundImage: true,
    hasPaddingBottom: true,
  },
  { width: "9px", height: "12.6px", top: "9px", left: "0px", zIndex: 10 }, // Gốc là undefined, đặt 0px
];

/**
 * Dữ liệu cho danh sách thông báo
 * Gộp từ 'data2', 'data3' và text
 */
export const notificationItems: NotificationItemData[] = [
  {
    id: 1,
    icon: {
      src: "/assets/SvgAsset23.svg",
      alt: "Svg Asset 23",
      width: 17.5,
      height: 25,
      isSquare: true,
    },
    title: "Appointment Reminder",
    titleIcon: "/assets/SvgAsset19.svg",
    timestamp: "Today, 12:15",
    message: "You have a blood donation appointment on 15/04 at 9:00",
    actionIcon: {
      src: "/assets/SvgAsset28.svg",
      alt: "Svg Asset 28",
    },
    isNew: true,
  },
  {
    id: 2,
    icon: {
      src: "/assets/SvgAsset20.svg",
      alt: "Svg Asset 20",
      width: 22.5,
      height: 27.5,
      isSquare: true,
    },
    title: "Notification",
    titleIcon: "/assets/SvgAsset18.svg",
    timestamp: "Today, 09:40",
    message: "Your application has been approved and confirmed",
    actionIcon: {
      src: "/assets/SvgAsset27.svg",
      alt: "Svg Asset 27",
    },
  },
  {
    id: 3,
    icon: {
      src: "/assets/SvgAsset22.svg",
      alt: "Svg Asset 22",
      width: 27.5,
      height: 23.8,
      isSquare: false,
    },
    title: "Update",
    titleIcon: "/assets/SvgAsset16.svg",
    timestamp: "21/03/2025, 16:34",
    message: "Donation location on 25/03 has changed",
    actionIcon: {
      src: "/assets/SvgAsset26.svg",
      alt: "Svg Asset 26",
    },
  },
  {
    id: 4,
    icon: {
      src: "/assets/SvgAsset21.svg",
      alt: "Svg Asset 21",
      width: 25,
      height: 20,
      isSquare: false,
    },
    title: "Thank You Letter",
    titleIcon: "/assets/SvgAsset17.svg",
    timestamp: "30/12/2024, 21:05",
    message: "Thank you for participating in the blood donation program...",
    actionIcon: {
      src: "/assets/SvgAsset25.svg",
      alt: "Svg Asset 25",
    },
  },
];