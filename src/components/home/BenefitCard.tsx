// home/BenefitCard.tsx
"use client"; // Cần "use client" vì dùng useState
import React, { useState } from "react";
import { ChevronLeftIcon, ArrowRightIcon } from "@/icons"; // Import icons

// Dữ liệu cho 3 tab carousel
const benefitsData = [
  {
    title: "Health Consultation",
    items: [
      "Explanation of the blood donation process and potential risks during and after donation.",
      "Information on signs and symptoms of Hepatitis, HIV, and other blood-borne or sexually transmitted diseases.",
      "Screening tests for blood-borne viruses (HIV, Syphilis, Hepatitis, etc.) after donation.",
      "Guidance on health care and consultation on any abnormal results after donation.",
      "Confidentiality regarding clinical examination and test results.",
    ],
  },
  {
    title: "Gifts and Support",
    items: [
      "Served snacks and drinks according to current regulations.",
      "Receive souvenir gifts (in-kind or cash) equivalent to the value.",
      "Travel support (cash or ticket) according to regulations.",
      "Receive a Voluntary Blood Donation Certificate.",
      "Priority for free blood transfusion at public health facilities nationwide if needed.",
    ],
  },
  {
    title: "Honor and Recognition",
    items: [
      "Considered for titles, awards, and medals for humanitarian blood donation.",
      "Honored at events and programs recognizing outstanding blood donors.",
      "Join the community of blood donors, spreading the spirit of kindness.",
      "Receive respect from family, friends, and society.",
      "Feel proud of the noble act of saving lives.",
    ],
  },
];

/**
 * Component Thẻ Quyền lợi (thẻ màu đỏ)
 * ĐÃ CẬP NHẬT thành carousel
 */
const BenefitCard = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? benefitsData.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === benefitsData.length - 1 ? 0 : prevIndex + 1
    );
  };

  const currentBenefit = benefitsData[currentIndex];

  return (
    <div
      className="relative flex h-full w-full flex-col rounded-lg bg-red-600 p-6 text-white shadow-lg md:p-8"
      // Bỏ gradient, dùng màu đỏ đồng nhất
    >
      {/* Nút điều hướng TRÁI */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white transition hover:bg-white/40 md:left-4"
        aria-label="Previous slide"
      >
        <ChevronLeftIcon className="h-6 w-6" />
      </button>

      {/* Nút điều hướng PHẢI */}
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white transition hover:bg-white/40 md:right-4"
        aria-label="Next slide"
      >
        <ArrowRightIcon className="h-6 w-6" />
      </button>

      {/* Nội dung slide - Thêm key để React re-render transition (nếu có) */}
      <div key={currentIndex} className="flex flex-col px-8 md:px-12">
        <h3
          className="w-full text-center text-2xl font-bold leading-tight md:text-3xl"
        >
          {currentBenefit.title}
        </h3>

        {/* ===== LIST NỘI DUNG CỦA SLIDE HIỆN TẠI ===== */}
        <div
          className="mt-6 w-full text-base font-normal leading-relaxed md:text-lg"
        >
          <ul className="list-disc space-y-3 pl-5">
            {currentBenefit.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BenefitCard;