import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const session = await getToken({
    req,
    secret: process.env.JWT_SECRET,
    secureCookie:
      process.env.NEXTAUTH_URL?.startsWith("https://") ??
      !!process.env.VERCEL_URL,
  });

  const { pathname } = req.nextUrl;

  if (session && pathname === "/login") {
    return NextResponse.redirect("/");
  }

  if (pathname.includes("/api/auth") || session) {
    return NextResponse.next();
  }

  if (!session && pathname !== "/login") {
    return NextResponse.redirect("/login");
  }

  return NextResponse.next();
}
