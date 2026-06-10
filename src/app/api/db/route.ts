import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/localDb';

export async function GET() {
  const data = await readData();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const currentData = await readData();
    
    // Merge dữ liệu mới vào DB cũ (body có thể gửi lên { products: [...] } để update bảng products)
    const newData = { ...currentData, ...body };
    await writeData(newData);
    
    return NextResponse.json({ success: true, data: newData });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Lỗi ghi dữ liệu" }, { status: 500 });
  }
}