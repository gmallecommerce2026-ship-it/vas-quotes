// src/lib/localDb.ts
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data.json');

// Khởi tạo data mặc định chuẩn
const defaultData = {
  categories: ["Đèn LED", "Dây cáp", "Công tắc", "Trang trí"],
  products: [],
  savedQuotes: [], // Dùng cho app/page.tsx (Báo giá tạm)
  history: []      // Dùng cho app/history/page.tsx (Phiếu mua hàng thực tế)
};

export async function readData() {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    // Nếu file chưa tồn tại hoặc lỗi, tự động tạo file với data mặc định
    await writeData(defaultData);
    return defaultData;
  }
}

export async function writeData(data: any) {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
}