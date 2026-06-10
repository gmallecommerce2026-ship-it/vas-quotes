import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const { pathname } = req.nextUrl;

  // 1. Các route public không cần token (trang Auth)
  const publicPaths = ['/signin', '/signup', '/forgot-password', '/reset-password'];
  
  // Nếu là trang chủ '/', có thể tuỳ chỉnh cho phép truy cập public hoặc bắt buộc login

  // 4. (Tuỳ chọn) Thêm logic giải mã JWT và phân quyền Role cho dự án mới tại đây
  /*
  try {
     const payload = decodeJWT(token);
     const role = payload.role;
     // Handle role-based routing...
  } catch(e) {
     const response = NextResponse.redirect(new URL('/signin', req.url));
     response.cookies.delete('token');
     return response;
  }
  */

  return NextResponse.next();
}

export const config = {
  // Chỉ áp dụng middleware cho các page routes, bỏ qua các file tĩnh và API
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api|assets).*)'],
};