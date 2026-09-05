import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const token =
    request.cookies.get("token")?.value ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/mealPlanner/:path*", "/shoppingList/:path*"],
};
