import { NextResponse, NextRequest } from "next/server";

interface SuccessLogoutResponse {
  ok: true;
  data: null;
  statusCode: 204;
  errors: null;
}

export async function POST(request: NextRequest) {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  //   const token = request.cookies.get("accessToken")?.value;
  console.log("COOOKIES", request.cookies.get("accessToken")?.value);
  try {
    await fetch(`${backendUrl}/api/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
  } catch {}

  const response = NextResponse.json<SuccessLogoutResponse>({
    ok: true,
    data: null,
    statusCode: 204,
    errors: null,
  });

  response.cookies.set({
    name: "accessToken",
    value: "",
    maxAge: 0,
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
