import React from 'react';
import Image from 'next/image';
import clsx from 'clsx'; // Thư viện tiện ích để gộp class có điều kiện

// Định nghĩa kiểu dữ liệu cho mỗi icon
interface LogoIconProps {
  width: string;
  height: string;
  top: string;
  left: string;
  zIndex: string;
  hasBgImage: boolean;
  hasPadding: boolean;
}

// Dữ liệu cho các icon (trước đây là data1)
const logoIconData: LogoIconProps[] = [
  { width: '3.9px', height: '5.5px', top: '12.5px', left: '41.8px', zIndex: '50', hasBgImage: false, hasPadding: false },
  { width: '9px', height: '12.6px', top: '8.9px', left: '35.7px', zIndex: '40', hasBgImage: false, hasPadding: false },
  { width: '28.6px', height: '23.5px', top: '0.6px', left: '13.9px', zIndex: '30', hasBgImage: false, hasPadding: false },
  { width: '39.9px', height: '24.1px', top: '0px', left: '2.5px', zIndex: '20', hasBgImage: true, hasPadding: true },
  { width: '9px', height: '12.6px', top: '9px', left: '0px', zIndex: '10', hasBgImage: false, hasPadding: false },
];

/**
 * Một icon riêng lẻ trong logo, dùng absolute positioning.
 * Sử dụng Tailwind arbitrary values (vd: top-[12.5px]) để xử lý giá trị động.
 */
const LogoIcon: React.FC<LogoIconProps> = ({
  width, height, top, left, zIndex, hasBgImage, hasPadding,
}) => (
  <img
    className={clsx(
      'absolute',
      // Dùng Tailwind arbitrary values cho vị trí động
      `top-[${top}] left-[${left}] z-[${zIndex}]`,
      {
        'bg-[url(/assets/SvgAsset10.svg)]': hasBgImage,
        'pb-[3.4px]': hasPadding,
      }
    )}
    style={{ width, height }} // Giữ lại width/height động trong style nếu cần
    src="/assets/SvgAsset7.svg"
    alt="Logo part"
  />
);

/**
 * Component chính cho Logo hoạt ảnh, kết hợp nhiều icon.
 */
export const AnimatedBloodLogo: React.FC = () => {
  return (
    <div className="relative w-[329px] h-[61px]">
      {/* Main icon group */}
      <div className="absolute left-[266px] z-20 flex flex-col items-center justify-center w-[63px] h-[61px] bg-[url(/assets/SvgAsset1.svg)]">
        <div className="flex flex-col items-center justify-between w-[45.7px] h-[41.2px] -rotate-180">
          {/* Vùng chứa các icon động */}
          <div className="relative w-[45.7px] h-[24.1px]">
            {logoIconData.map((icon, index) => (
              <LogoIcon key={index} {...icon} />
            ))}
          </div>

          <Image
            width={17.4}
            height={2.1}
            src="/assets/SvgAsset2.svg"
            alt="Logo part 2"
            className="w-[17.4px] h-[2.1px]"
          />

          {/* Vùng chứa icon giọt máu */}
          <div className="relative w-[25.9px] h-[15.6px]">
            <Image
              width={17.3}
              height={15.6}
              style={{ left: '8.7px' }}
              className="absolute z-20 w-[17.3px] h-[15.6px]"
              src="/assets/SvgAsset3.svg"
              alt="Logo part 3"
            />
            <div className="absolute z-10 flex items-center justify-between w-[25.9px] h-[15.6px] bg-[url(/assets/SvgAsset4.svg)] pl-[0.4px] pr-[9.1px]">
              <Image width={3.7} height={4.2} src="/assets/SvgAsset5.svg" alt="Logo part 4" />
              <Image width={14.2} height={9.7} src="/assets/SvgAsset6.svg" alt="Logo part 5" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Vạch kẻ gradient */}
      <div className="absolute top-[40px] z-10 h-[3px] w-[300px] bg-gradient-to-l from-[#C31313] via-[#D19393]/36 to-transparent" />
    </div>
  );
};