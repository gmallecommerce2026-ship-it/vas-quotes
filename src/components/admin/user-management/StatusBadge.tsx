import React from 'react';
import { clsx } from 'clsx';
import { EmployeeStatus } from '@/types';

interface StatusBadgeProps {
  status: EmployeeStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <span
      className={clsx(
        'px-4 py-2 rounded-md text-sm font-medium',
        {
          'bg-green-100 text-green-800': status === 'Active',
          'bg-red-100 text-red-800': status === 'Block',
          'bg-yellow-100 text-yellow-800': status === 'Pending',
        }
      )}
    >
      {status}
    </span>
  );
};