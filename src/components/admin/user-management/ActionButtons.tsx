// src/components/admin/user-management/ActionButtons.tsx
import React from 'react';
import { Pencil, Trash2 } from 'lucide-react'; // Dùng icon thật

// BƯỚC 1: Thêm props
interface ActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ onEdit, onDelete }) => {
  return (
    <div className="flex items-center gap-3">
      {/* BƯỚC 2: Gán sự kiện onClick */}
      <button 
        onClick={onEdit}
        className="text-blue-600 hover:text-blue-800 p-2"
        aria-label="Edit user"
      >
        <Pencil size={20} />
      </button>
      <button 
        onClick={onDelete}
        className="text-red-600 hover:text-red-800 p-2"
        aria-label="Delete user"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
};