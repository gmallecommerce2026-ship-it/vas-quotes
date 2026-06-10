import Image from "next/image";
import React from "react";

/**
 * Component Chân trang (Footer)
 */
const PageFooter = () => {
  return (
    <footer className="mt-[84px] h-[597px] w-[1458px]">
      <Image
        width={1458}
        height={597}
        src="/assets/SvgAsset8.svg"
        alt="Chân trang"
        className="h-full w-full"
      />
    </footer>
  );
};

export default PageFooter;