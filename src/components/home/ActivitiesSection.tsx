// home/ActivitiesSection.tsx
"use client"; // <-- THÊM "use client" VÌ SỬ DỤNG STATE
import React, { useState } from "react"; // <-- IMPORT useState
import ActivityCard from "./ActivityCard";

// Dữ liệu cho các thẻ hoạt động
// LƯU Ý: Đã thay thế ảnh và thêm 6 mục mới
const activitiesData = [
  // First 3 items
  {
    imgSrc: "/assets/tonvinhhoichuthapdo.jpg", // Illustration image 1
    title: "Vibrant voluntary blood donation activities - Vietnam Red Cross Society",
    date: "26/01/2025",
  },
  {
    imgSrc: "/assets/vna_potal_thanh_pho_ho_chi_minh_phat_dong_hien_mau_nhan_dao_chung_tay_day_lui_dich_covid-19_stand.jpeg", // Illustration image 2
    title: "Launching humanitarian blood donation, joining hands to fight Covid-19",
    date: "07/02/2025",
  },
  {
    imgSrc: "/assets/dhnguyentrai.jpg", // Illustration image 3
    title:
      "Nguyen Trai University organizes blood donation festival 'Sharing Red Drops - Giving Hope'",
    // No date
  },
  // 6 'See more' items
  {
    imgSrc: "/assets/Chu-nhat-Do-2025-5-1-2048x1365.jpg", // Illustration image 4
    title: "'Red Sunday' Festival 2025: Spreading the spirit of compassion",
    date: "15/01/2025",
  },
  {
    imgSrc: "/assets/hanhtrinhdo.jpg", // Illustration image 5
    title: "'Red Journey' Campaign connecting Vietnamese bloodlines",
    date: "10/02/2025",
  },
  {
    imgSrc: "/assets/vietinbank.jpg", // Illustration image 6
    title: "VietinBank organizes 'System-wide Blood Donation Festival'",
    date: "20/02/2025",
  },
  {
    imgSrc: "/assets/Giot-hong-tri-an.jpg", // Illustration image 7
    title: "Summer Red Drops 2025 - Sharing Love",
    // No date
  },
  {
    imgSrc: "/assets/fpt.jpg", // Illustration image 8
    title: "FPT Software Da Nang: 500 employees participate in humanitarian blood donation",
    date: "28/02/2025",
  },
  {
    imgSrc: "/assets/xuanhong.jpg", // Illustration image 9
    title: "Red Spring Festival - Give blood, sow the seeds of life",
    date: "05/03/2025",
  },
];

/**
 * Component Khối "Outstanding Activities"
 */
const ActivitiesSection = () => {
  // Thêm state để quản lý việc "Xem thêm"
  const [showMore, setShowMore] = useState(false);

  const toggleShowMore = () => {
    setShowMore((prev) => !prev);
  };

  return (
    // Section này có nền đỏ full-width
    <section className="mt-12 w-full bg-red-600 py-12">
      <div className="mx-auto max-w-6xl px-4">
        {/* Tiêu đề */}
        <h2 className="mb-8 text-center text-3xl font-bold uppercase text-white">
          Outstanding Activities
        </h2>

        {/* Grid 3 cột cho tin tức */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Hiển thị 3 tin đầu tiên */}
          {activitiesData.slice(0, 3).map((activity, index) => (
            <ActivityCard
              key={index}
              imgSrc={activity.imgSrc}
              title={activity.title}
              date={activity.date}
            />
          ))}

          {/* Hiển thị 6 tin tiếp theo nếu showMore là true */}
          {showMore &&
            activitiesData.slice(3).map((activity, index) => (
              <ActivityCard
                key={`more-${index}`}
                imgSrc={activity.imgSrc}
                title={activity.title}
                date={activity.date}
              />
            ))}
        </div>

        {/* Nút "See more" / "Collapse" */}
        <div className="mt-10 text-center">
          <button
            onClick={toggleShowMore} // Thêm sự kiện click
            className="rounded-full border-2 border-white px-8 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-white hover:text-red-600"
          >
            {showMore ? "See less" : "See more"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ActivitiesSection;