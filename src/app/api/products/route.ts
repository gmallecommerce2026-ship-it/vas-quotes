// src/app/api/products/route.ts
import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/localDb';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Lấy dữ liệu từ form
    const name = formData.get('name') as string;
    const price = formData.get('price') as string;
    const imageFile = formData.get('image') as File | null;

    let imageUrl = '';

    // Xử lý lưu ảnh nếu có
    if (imageFile) {
      // Chuyển File thành Buffer
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Tạo tên file duy nhất tránh trùng lặp
      const fileName = `${Date.now()}-${imageFile.name.replace(/\s+/g, '-')}`;
      
      // Đường dẫn lưu file: thư mục public/images
      const uploadDir = path.join(process.cwd(), 'public', 'images');
      
      // Đảm bảo thư mục images tồn tại
      await fs.mkdir(uploadDir, { recursive: true });
      
      // Ghi file ảnh vào hệ thống
      await fs.writeFile(path.join(uploadDir, fileName), buffer);
      
      // URL để truy cập ảnh từ Frontend
      imageUrl = `/images/${fileName}`;
    }

    // Đọc data cũ
    const dbData = await readData();

    // Tạo record mới
    const newProduct = {
      id: Date.now().toString(),
      name,
      price,
      image: imageUrl,
      createdAt: new Date().toISOString()
    };

    // Thêm vào mảng và ghi đè lại file JSON
    dbData.products.push(newProduct);
    await writeData(dbData);

    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });

  } catch (error) {
    console.error('Lỗi khi lưu dữ liệu:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

// Hàm GET để Frontend có thể lấy danh sách data
export async function GET() {
  const dbData = await readData();
  return NextResponse.json(dbData);
}