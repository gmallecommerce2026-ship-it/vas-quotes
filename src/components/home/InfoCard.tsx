// src/components/home/InfoCard.tsx
import React from "react";
// Không cần import Image nữa

interface InfoCardProps {
  icon: React.ElementType; // <-- THAY ĐỔI: Từ string sang ElementType
  iconAlt: string;
  title: React.ReactNode;
  className?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({
  icon: IconComponent, // <-- THAY ĐỔI: Đổi tên prop
  iconAlt,
  title,
  className = "",
}) => {
  return (
    <div
      className={`flex h-auto min-h-[100px] w-full items-center justify-start bg-white p-4 shadow-lg md:h-[131.1px] md:w-[325px] ${className}`}
    >
      {/* Icon */}
      <div className="flex items-center justify-center text-red-600">
        {/* THAY ĐỔI: Render component icon mới */}
        <IconComponent className="h-10 w-10" aria-label={iconAlt} />
      </div>

      {/* Title */}
      <div
        className="ml-3 w-auto flex-1 text-[15px] font-bold leading-6 text-black"
      >
        {title}
      </div>

      {/* Button "Register" */}
      <div
        className="ml-3 flex h-[31.8px] items-center justify-center rounded-full bg-red-600 px-3"
      >
        <div
          className="text-center text-[12px] font-medium leading-6 text-white"
        >
          Register
        </div>
      </div>
    </div>
  );
};

export default InfoCard;