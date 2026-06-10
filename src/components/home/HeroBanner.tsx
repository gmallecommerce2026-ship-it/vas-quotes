"use client"; // <-- THÊM DÒNG NÀY VÀO ĐẦU TIÊN

import Image from "next/image";
import React from "react";

// 1. Import Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// 2. Import CSS cẩn thiết của Swiper
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

/**
 * TODO: Thay thế bằng danh sách ảnh banner thực tế của bạn.
 * Đây là dữ liệu giả lập cho carousel.
 */
const bannerData = [
  { id: 1, imageUrl: "/assets/team-doctors.jpg" },
  { id: 2, imageUrl: "/assets/istockphoto-1567297364-1024x1024.jpg" }, // ảnh ví dụ
  { id: 3, imageUrl: "/assets/gettyimages-1486019635-612x612.jpg" }, // ảnh ví dụ
];

/**
 * Component HeroBanner (đã được chuyển thành Carousel)
 */
const HeroBanner = () => {
  // ... phần còn lại của component giữ nguyên ...
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      slidesPerView={1}
      loop={true}
      autoplay={{
        delay: 4000,
        disableOnInteraction: false,
      }}
      pagination={{ clickable: true }}
      navigation={true}
      className="w-full h-[250px] md:h-[390px]"
    >
      {bannerData.map((banner) => (
        <SwiperSlide key={banner.id}>
          <div
            className="flex h-full w-full items-center justify-start bg-cover bg-center bg-no-repeat px-4 md:pl-14"
            style={{
              backgroundImage: `url('${banner.imageUrl}')`,
            }}
          >
           
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroBanner;