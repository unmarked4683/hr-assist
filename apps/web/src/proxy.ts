import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token: string | null =
    request.cookies.get("accessToken")?.value ?? null;
  const { pathname } = request.nextUrl;

  const isLoginPage: boolean = pathname === "/login";
  const isRootPage: boolean = pathname === "/";

  if (token && (isLoginPage || isRootPage)) {
    return NextResponse.redirect(new URL("/employees", request.url));
  }

  if (!token && isRootPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!token && !isLoginPage) {
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
