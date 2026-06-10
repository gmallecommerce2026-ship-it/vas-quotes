// src/components/home/InfoSection.tsx
import React from "react";
import InfoCard from "./InfoCard";
// BƯỚC 1: Import các icon
import { UserIcon, HandHeartIcon, FlaskConicalIcon } from "@/icons";

const InfoSection = () => {
  // BƯỚC 2: Cập nhật dữ liệu
  const infoCardsData = [
    {
      icon: UserIcon,
      iconAlt: "Biểu tượng hoạt động",
      title: <>Volunteer <br /> Activities</>,
      className: "pl-[25.1px]",
    },
    {
      icon: HandHeartIcon,
      iconAlt: "Biểu tượng tình nguyện",
      title: <>Volunteer <br /> program</>,
      className: "pl-[27px]",
    },
    {
      icon: FlaskConicalIcon, 
      iconAlt: "Biểu tượng khám bệnh",
      title: <>Free medical <br /> examination</>,
      className: "pl-[26px]",
    },
  ];

  return (
    <section className="mt-8 w-full max-w-6xl px-4">
      <div className="flex flex-col items-center justify-center gap-6 md:flex-row md:justify-between">
        {/* BƯỚC 3: Truyền prop 'icon' đã cập nhật */}
        {infoCardsData.map((card) => (
          <InfoCard
            key={card.iconAlt}
            icon={card.icon} 
            iconAlt={card.iconAlt}
            title={card.title}
            className={card.className}
          />
        ))}
      </div>
    </section>
  );
};

export default InfoSection;