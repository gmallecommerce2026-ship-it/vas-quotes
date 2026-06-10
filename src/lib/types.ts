// src/lib/types.ts

export interface Address {
  province: string;
  district: string;
  street: string;
}

export interface DonorInformation {
  name: string;
  phone: string;
  email: string;
  birthday: string; // Nên dùng kiểu string 'YYYY-MM-DD' cho input type="date"
  address: Address;
  bloodType: string;
}

export interface AppointmentDetails {
  province: string;
  location: string;
  date: string; // 'YYYY-MM-DD'
  timeSlot: string;
  notes?: string;
}

// Kiểu dữ liệu cho toàn bộ form
export interface AppointmentUpdateForm {
  donor: DonorInformation;
  appointment: AppointmentDetails;
}