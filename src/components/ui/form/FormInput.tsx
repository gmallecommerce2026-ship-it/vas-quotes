// 📁 src/components/ui/FormInput.tsx
import React from 'react';

type FormInputProps = {
  label: string;
  value: string;
  icon?: React.ReactNode;
  containerClassName?: string;
  isTextArea?: boolean;
};

const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  icon,
  containerClassName = '',
  isTextArea = false,
}) => (
  <div className={containerClassName}>
    <label className="mb-2 block font-inter text-xl font-medium text-black">
      {label}
    </label>
    <div className="relative flex w-full items-center">
      {isTextArea ? (
        <textarea
          className="h-24 w-full rounded-lg border border-gray-300 bg-white p-4 font-inter text-xl font-normal text-black"
          defaultValue={value}
        />
      ) : (
        <input
          type="text"
          className="h-16 w-full rounded-lg border border-gray-300 bg-white p-4 font-inter text-xl font-normal text-black"
          defaultValue={value} // Sử dụng defaultValue. Tốt hơn là dùng value + onChange
        />
      )}
      {icon && (
        <div className="absolute right-4 flex h-6 w-6 items-center justify-center">
          {icon}
        </div>
      )}
    </div>
  </div>
);

export default FormInput;