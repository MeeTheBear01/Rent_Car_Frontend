// middleware.js
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. สมมติตัวแปรเช็คสถานะจาก Cookie หรือ Session (ตัวอย่างนี้จำลองขึ้นมา)
  // ในระบบจริง อาจจะดึงและถอดรหัส JWT Token จากคุกกี้
  const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true';
  const userRole = request.cookies.get('role')?.value; // 'user' หรือ 'admin'

  // 2. ถ้าพยายามเข้าหน้าที่มีการป้องกัน (เช่น /dashboard หรือ /admin-panel) แต่ยังไม่ล็อกอิน
  if (!isLoggedIn && (pathname.startsWith('/dashboard') || pathname.startsWith('/admin'))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. ถ้าล็อกอินแล้ว แต่เป็น 'user' แล้วพยายามแอบเข้าหน้าของ 'admin'
  if (isLoggedIn && pathname.startsWith('/admin') && userRole !== 'admin') {
    // ส่งกลับไปหน้า User Dashboard หรือหน้า Unauthorized
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 4. ถ้าล็อกอินแล้ว แต่ยังอยู่ที่หน้า login ให้เด้งไปหน้าตาม Role
  if (isLoggedIn && pathname.startsWith('/login')) {
    if (userRole === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// กำหนดเส้นทางที่จะให้ Middleware ทำงาน
export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login'],
};