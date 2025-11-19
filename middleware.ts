import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const privateRoutes = ['/profile'];
const publicRoutes = ['/auth/login', '/auth/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // 1) Публічні маршрути: завжди дозволяємо відкрити
  //    (редіректимо на / тільки якщо є валідний accessToken)
  if (isPublicRoute) {
    if (accessToken) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // 2) Приватні маршрути: допускаємо лише з accessToken.
  //    Якщо його немає — скеровуємо на /auth/login.
  //    Наявність лише refreshToken НЕ вважаємо сесією,
  //    щоб не блокувати форму логіну.
  if (isPrivateRoute) {
    if (accessToken) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // 3) Інші маршрути — пропускаємо
  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/auth/login', '/auth/register'],
};
