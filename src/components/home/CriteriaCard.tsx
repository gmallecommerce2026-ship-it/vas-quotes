// src/components/home/CriteriaCard.tsx
import React from "react";
// Không cần import Image

interface CriteriaCardProps {
  icon: React.ElementType; // <-- THAY ĐỔI: Từ string sang ElementType
  text: string;
}

const CriteriaCard: React.FC<CriteriaCardProps> = ({ 
  icon: IconComponent, // <-- THAY ĐỔI
  text 
}) => {
  return (
    <div className="flex h-full items-center gap-3 rounded-lg bg-white p-4 shadow-md">
      {/* Vòng tròn xanh chứa icon */}
      <div className="flex-shrink-0 rounded-full bg-blue-600 p-2 text-white">
        {/* THAY ĐỔI: Render component icon mới */}
        <IconComponent className="h-6 w-6" />
      </div>
      {/* Nội dung text */}
      <p className="text-sm font-medium text-gray-700">{text}</p>
    </div>
  );
};

export default CriteriaCard;