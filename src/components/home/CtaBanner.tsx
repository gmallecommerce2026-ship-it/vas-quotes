import React from "react";

/**
 * Component Dải banner Kêu gọi Hành động (CTA)
 */
const CtaBanner = () => {
  return (
    <div
      className="mt-[78px] min-h-[379px] w-[1303px] rounded-[20px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.25)]"
      // Vì gradient này mix cả backgroundColor và linear-gradient,
      // giữ lại style inline là rõ ràng và chính xác nhất.
      style={{
        backgroundColor: "rgba(255,74,74,1)",
        background:
          "linear-gradient(90deg,rgba(0,0,0,0) 50%,rgba(0,0,0,1) 150%)",
      }}
    ></div>
  );
};

export default CtaBanner;