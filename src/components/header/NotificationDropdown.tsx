// src/components/header/NotificationDropdown.tsx
"use client";
import React, { useState, useEffect } from "react";
// ... imports cũ giữ nguyên
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { 
  BellIcon, 
  CheckCircleIcon, 
  AlertIcon, 
  InfoIcon, 
  ClockIcon 
} from "@/icons";
import clsx from "clsx";

// Helper chọn icon
const getIcon = (type: string) => {
  const className = "w-6 h-6";
  switch (type) {
    case 'SUCCESS': return <CheckCircleIcon className={clsx(className, "text-green-500")} />;
    case 'WARNING': return <AlertIcon className={clsx(className, "text-yellow-500")} />;
    case 'ERROR': return <AlertIcon className={clsx(className, "text-red-500")} />;
    default: return <InfoIcon className={clsx(className, "text-blue-500")} />;
  }
};

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  

  return (
    <></>
  );
}