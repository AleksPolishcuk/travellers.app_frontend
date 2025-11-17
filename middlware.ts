import { NextRequest, NextResponse } from "next/server";
import { checkServerSession } from "./lib/api/serverApi";

const privateRoutes = ["/profile", "/create-story"];
const authRoutes = ["/auth/login", "/auth/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  try {
    
    const session = await checkServerSession();
    const isAuthenticated = session.success;

    console.log('Middleware check:', { pathname, isAuthenticated });

    
    if (authRoutes.some(route => pathname.startsWith(route)) && isAuthenticated) {
      console.log('Redirect authenticated user from auth route');
      return NextResponse.redirect(new URL("/", request.url));
    }


    if (privateRoutes.some(route => pathname.startsWith(route)) && !isAuthenticated) {
      console.log('Redirect unauthenticated user from private route');
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();

  } catch (error) {
    console.error('Middleware error:', error);
    
   
    if (privateRoutes.some(route => pathname.startsWith(route))) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/profile",
    "/create-story", 
    "/auth/login",
    "/auth/register"
  ],
};