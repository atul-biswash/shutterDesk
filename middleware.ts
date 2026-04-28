import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);

const PROTECTED_PREFIXES = ["/admin", "/office", "/photographer"];
const PHOTOGRAPHER_BLOCKED_PREFIXES = ["/admin", "/office"];
const ADMIN_ONLY_PREFIXES = ["/admin/users"];
const AUTH_PREFIXES = ["/auth"];

export default auth((req) => {
  const { nextUrl } = req;
  const path = nextUrl.pathname;
  const session = req.auth;
  const isAuthed = !!session;
  const role = session?.user?.role;

  const isProtected = PROTECTED_PREFIXES.some(
    (p) => path === p || path.startsWith(p + "/")
  );
  const isAuthRoute = AUTH_PREFIXES.some(
    (p) => path === p || path.startsWith(p + "/")
  );

  if (isAuthed && isAuthRoute) {
    const dest = role === "PHOTOGRAPHER" ? "/photographer" : "/admin";
    return NextResponse.redirect(new URL(dest, nextUrl));
  }

  if (!isAuthed && isProtected) {
    const signInUrl = new URL("/auth/signin", nextUrl);
    signInUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(signInUrl);
  }

  if (isAuthed && role === "PHOTOGRAPHER") {
    const isBlocked = PHOTOGRAPHER_BLOCKED_PREFIXES.some(
      (p) => path === p || path.startsWith(p + "/")
    );
    if (isBlocked) {
      return NextResponse.redirect(new URL("/photographer", nextUrl));
    }
  }

  if (isAuthed && role !== "ADMIN") {
    const isAdminOnly = ADMIN_ONLY_PREFIXES.some(
      (p) => path === p || path.startsWith(p + "/")
    );
    if (isAdminOnly) {
      return NextResponse.redirect(new URL("/admin", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
