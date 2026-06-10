// home/BenefitsSection.tsx
import React from "react";
import Image from "next/image";
import BenefitCard from "./BenefitCard"; // Import thẻ đỏ

/**
 * Component Khối Quyền lợi (vàng + đỏ)
 * Đã refactor để dùng Flexbox, bỏ absolute/z-index.
 */
const BenefitsSection = () => {
  return (
    // Container chính, dùng Flexbox
    // - mobile: flex-col (xếp dọc)
    // - desktop: lg:flex-row (xếp ngang)
    <section className="relative mt-12 flex w-full max-w-6xl flex-col gap-8 px-4 lg:flex-row">
      {/* ===== PHẦN BÊN TRÁI (MÀU VÀNG) ===== */}
      <div
        className="flex-1 rounded-lg bg-yellow-100 p-6 md:p-8"
        // Thêm màu nền vàng nhạt (thay cho ảnh SvgAsset1.svg phức tạp)
        // Nếu muốn dùng ảnh nền, hãy dùng style={{ backgroundImage: "url(...)" }}
      >
        <h2
          className="w-full text-3xl font-bold leading-tight text-red-600 md:text-4xl"
        >
          Benefits of Blood Donors
        </h2>
        <p
          className="mt-4 w-full text-lg font-normal text-red-600 md:text-xl"
        >
          Voluntary blood donors are entitled to the following benefits:
        </p>
        <Image
          className="mt-6 h-auto w-full max-w-lg"
          src="/assets/ImageAsset1.png"
          alt="Hình ảnh tình nguyện viên hiến máu"
          width={637}
          height={413}
        />
      </div>

      {/* ===== PHẦN BÊN PHẢI (MÀU ĐỎ) ===== */}
      {/* BenefitCard (thẻ đỏ) sẽ chiếm phần còn lại
        Nó đã được sửa ở file BenefitCard.tsx để chứa luôn list
      */}
      <div className="flex-1">
        <BenefitCard />
      </div>
    </section>
  );
};

export default BenefitsSection;