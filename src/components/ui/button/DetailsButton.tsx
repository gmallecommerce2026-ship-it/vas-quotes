// src/components/ui/button/DetailsButton.tsx
import Link from "next/link";
import { ArrowRightIcon } from "@/icons"; // <-- Thêm import icon

interface DetailsButtonProps {
  // svgAsset: string; // <-- Xóa prop này
  href: string; // <-- Giữ lại href prop
}

/**
 * Component nút "Details"
 * ĐÃ CẬP NHẬT: Dùng <Link> với style của Button (outline, sm)
 * để đồng nhất UI, thay vì dùng ảnh nền.
 */
export const DetailsButton = ({ href }: DetailsButtonProps) => {
  return (
    <Link
      href={href}
      // Các class này được lấy từ component Button.tsx (variant="outline", size="sm")
      className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium
                 transition rounded-lg
                 bg-white text-gray-700 ring-1 ring-inset ring-gray-300
                 hover:bg-gray-50
                 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700
                 dark:hover:bg-white/[0.03] dark:hover:text-gray-300"
    >
      Details
      <ArrowRightIcon className="w-4 h-4" />
    </Link>
  );
};