import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { clsx } from 'clsx'; // Thư viện tiện ích để nối class có điều kiện

interface SidebarNavLinkProps {
  href: string;
  label: string;
  iconSrc: string;
  iconAlt: string;
  isActive: boolean;
}

const SidebarNavLink: React.FC<SidebarNavLinkProps> = ({
  href,
  label,
  iconSrc,
  iconAlt,
  isActive,
}) => {
  return (
    <Link
      href={href}
      // clsx giúp nối class
      // 'flex ...' là class chung
      // { 'bg-red-700 ...': isActive } là class có điều kiện
      className={clsx(
        'flex items-center gap-4 py-4 px-6 rounded-lg transition-colors',
        {
          'bg-red-700 text-white shadow-lg': isActive,
          'text-gray-700 hover:bg-gray-100': !isActive,
        }
      )}
    >
      <Image src={iconSrc} alt={iconAlt} width={24} height={24} />
      <span className="font-bold text-lg">{label}</span>
    </Link>
  );
};

export default SidebarNavLink;