"use client";
import React from 'react';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select'; // Import Select chuẩn
import { ChevronDownIcon } from '@/icons'; // Giả sử bạn có icon này từ file khác

interface FormSelectProps {
  label: string;
  className?: string;
}

/**
 * Component Select (Dropdown) dùng chung cho form
 * ĐÃ ĐƯỢC CẬP NHẬT để dùng Label và Select chuẩn cho đồng nhất.
 */
const FormSelect: React.FC<FormSelectProps> = ({ label, className = '' }) => {
  // Dùng label làm ID
  const selectId = label.toLowerCase().replace(/ /g, '-');

  // Dữ liệu giả lập cho Select
  const dummyOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  return (
    <div className={`w-full ${className}`}>
      <Label htmlFor={selectId}>{label}</Label>
      <div className="relative">
        <Select
         // id={selectId}
          options={dummyOptions}
          placeholder="Select..."
          onChange={() => {
            // Xử lý logic khi chọn
          }}
          className=""
        />
        {/* Icon mũi tên (lấy từ DefaultInputs.tsx) */}
        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <ChevronDownIcon />
        </span>
      </div>
    </div>
  );
};

export default FormSelect;