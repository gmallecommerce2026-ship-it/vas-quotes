// src/components/home/CriteriaSection.tsx
import React from "react";
import CriteriaCard from "./CriteriaCard"; 
// BƯỚC 1: Import các icon (đã được định nghĩa trong index.tsx)
import { 
  UserCheckIcon, 
  HeartPulseIcon, 
  BanIcon, 
  WineOffIcon, 
  FileCheckIcon, // <-- Đã có
  AwardIcon // <-- Đã có
} from "@/icons";

// BƯỚC 2: Cập nhật dữ liệu
const criteriaData = [
  {
    icon: UserCheckIcon, 
    text: "Bring your ID card or Passport",
  },
  {
    icon: HeartPulseIcon, 
    text: "Weight: Male ≥ 45 kg, Female ≥ 45 kg",
  },
  {
    icon: BanIcon, 
    text: "No history of high-risk behaviors for HIV, no Hepatitis B, Hepatitis C, or other blood-borne viruses",
  },
  {
    icon: WineOffIcon, 
    text: "No addiction to drugs, alcohol, or stimulants",
  },
  {
    icon: FileCheckIcon, 
    text: "No chronic or acute diseases related to heart, blood pressure, respiratory system, stomach...",
  },
];

const CriteriaSection = () => {
  return (
    <section className="mt-12 w-full max-w-6xl px-4">
      <div className="rounded-xl bg-red-600 p-6 shadow-lg md:p-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* Thẻ Tiêu đề (màu vàng) */}
          <div className="flex flex-col items-center justify-center rounded-lg bg-yellow-300 p-6 text-center md:row-span-2">
            <AwardIcon // <-- Dùng icon đã import
              className="h-12 w-12 text-red-700"
            />
            <h2 className="mt-4 text-2xl font-bold text-red-700">
              Criteria for Blood Donation
            </h2>
          </div>

          {/* 5 Thẻ Tiêu chuẩn (màu trắng) */}
          {criteriaData.map((item, index) => (
            <CriteriaCard key={index} icon={item.icon} text={item.text} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CriteriaSection;