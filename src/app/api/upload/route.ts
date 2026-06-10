import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { base64Image } = await request.json();
    
    if (!base64Image) return NextResponse.json({ error: "No image" }, { status: 400 });

    // Tách phần header của base64 (vd: data:image/jpeg;base64,...)
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Tạo tên file random tránh trùng lặp
    const fileName = `img_${Date.now()}.jpg`;
    const filePath = path.join(process.cwd(), 'public', 'images', fileName);

    // Ghi file vào public/images
    await fs.writeFile(filePath, buffer);

    // Trả về URL để FE dùng
    return NextResponse.json({ success: true, url: `/images/${fileName}` });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
  }
}