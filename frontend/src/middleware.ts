import { NextResponse, NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value || request.headers.get("authorization")?.replace("Bearer ", "");

    const isProtected = request.nextUrl.pathname.startsWith("/mealPlanner");

    if (isProtected && !token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/mealPlanner/:path*", "/shoppingList/:path*"],
};
