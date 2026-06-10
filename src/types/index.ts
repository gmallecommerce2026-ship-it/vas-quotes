// Định nghĩa trạng thái nhân viên
export type EmployeeStatus = 'Active' | 'Block' | 'Pending';

// Định nghĩa đối tượng Nhân viên (Employee)
export interface Employee {
  id: string;
  name: string;
  position: string;
  phone: string; // Giữ placeholder, bạn có thể thay đổi sau
  status: EmployeeStatus;
}

// Định nghĩa mục điều hướng Sidebar
export interface SidebarNavItem {
  href: string;
  label: string;
  iconSrc: string;
  iconAlt: string;
}

export type BloodType = 'A' | 'B' | 'AB' | 'O';

export interface Donor {
  id: string | number;
  code: string; // Tương ứng với cột "Code" (dù dữ liệu mẫu là tên, tôi sẽ đặt là name cho chuẩn ngữ nghĩa)
  name: string;
  address: string;
  age: number;
  bloodType: BloodType;
}