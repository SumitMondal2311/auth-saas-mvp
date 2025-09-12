import { NextRequest, NextResponse } from "next/server";
import { AUTH_ROUTES, PROTECTED_ROUTES } from "./configs/frontend-routes";

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const token = req.cookies.get("__auth-session")?.value;

    if (AUTH_ROUTES.some((route) => pathname.includes(route))) {
        if (token) {
            return NextResponse.redirect(new URL(`/dashboard`, req.nextUrl.origin));
        }
    }

    if (PROTECTED_ROUTES.some((route) => pathname.includes(route))) {
        if (!token) {
            return NextResponse.redirect(new URL(`/login`, req.nextUrl.origin));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
