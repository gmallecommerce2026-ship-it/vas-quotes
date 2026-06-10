// home/ActivityCard.tsx
import Image from "next/image";
import React from "react";

interface ActivityCardProps {
  imgSrc: string;
  title: string;
  date?: string; // Date là tùy chọn
}

/**
 * Component Thẻ Hoạt động (tin tức)
 */
const ActivityCard: React.FC<ActivityCardProps> = ({ imgSrc, title, date }) => {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-lg">
      {/* Hình ảnh */}
      <div className="relative h-48 w-full">
        <Image
          src={imgSrc}
          alt={title}
          layout="fill"
          objectFit="cover" // Đảm bảo ảnh lấp đầy khung
        />
      </div>
      {/* Nội dung text */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="flex-1 font-semibold text-gray-800">{title}</h3>
        {date && ( // Chỉ hiển thị nếu có ngày
          <div className="mt-3 flex items-center text-sm text-gray-500">
            {/* Bạn có thể thay thế emoji 📅 bằng component Icon
              ví dụ: <CalendarIcon className="mr-2 h-4 w-4" /> 
            */}
            <span className="mr-2">📅</span>
            <span>{date}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityCard;