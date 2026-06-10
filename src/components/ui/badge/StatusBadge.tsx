// src/components/ui/StatusBadge.tsx
import clsx from "clsx";

interface StatusBadgeProps {
  status: "Complete" | "Pending" | "Cancelled"; // Mở rộng cho tương lai
}

/**
 * Component hiển thị tag trạng thái (ví dụ: "Complete")
 */
export const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <div
      className={clsx(
        "flex h-[52px] w-[167px] items-center justify-center rounded-[10px] text-2xl font-normal text-white",
        // Chuyển rgba(4,182,75,1) thành class Tailwind
        status === "Complete" && "bg-green-600",
        status === "Pending" && "bg-yellow-500", // Ví dụ cho tương lai
        status === "Cancelled" && "bg-red-600" // Ví dụ cho tương lai
      )}
    >
      {status}
    </div>
  );
};