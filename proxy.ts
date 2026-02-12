import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  const { nextUrl } = req;
  const { pathname } = nextUrl;

  const isLogin = pathname === "/login";
  const isAdmin = pathname.startsWith("/admin");
  const isApiAuth = pathname.startsWith("/api/auth");
  const isAdminOnlyPage = pathname === "/admin/config" || pathname === "/admin/email";

  if (isApiAuth) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    if (isLogin) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  const role = token.role as string | undefined;

  if (isLogin) {
    if (role === "EDITOR") {
      return NextResponse.redirect(new URL("/admin", nextUrl));
    }
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  if (role === "VIEWER" && isAdmin) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  if (role !== "ADMIN" && isAdminOnlyPage) {
    return NextResponse.redirect(new URL("/admin", nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
