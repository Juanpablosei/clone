import { auth } from "./lib/auth";

export const proxy = auth((req) => {
  const pathname = req.nextUrl.pathname;

  if (pathname === "/admin/login") {
    return;
  }

  if (pathname.startsWith("/admin")) {
    const session = req.auth;
    if (!session) {
      return Response.redirect(new URL("/admin/login", req.nextUrl));
    }
    const role = (session.user as { role?: string })?.role;
    if (role === "VIEWER") {
      return Response.redirect(new URL("/", req.nextUrl));
    }
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
