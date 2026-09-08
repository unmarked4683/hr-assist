import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const isAuthorized: boolean = !!request.cookies.get("accessToken")?.value;

  const { pathname } = request.nextUrl;

  const isLoginPage: boolean = pathname === "/login";
  const isRootPage: boolean = pathname === "/";

  if (isAuthorized && (isLoginPage || isRootPage)) {
    return NextResponse.redirect(new URL("/employees", request.url));
  }

  if (!isAuthorized && isRootPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!isAuthorized && !isLoginPage) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
