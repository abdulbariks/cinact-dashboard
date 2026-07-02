import { NextRequest, NextResponse } from "next/server";
import { AppConfig } from "./config/app.config";
// import { AppConfig } from "../config/app.config";

type UserRole = "su_admin" | "tutor" | "finance" | "viewer";

const normalizeRole = (value?: string): UserRole => {
  if (!value) return "viewer";

  const role = value.toLowerCase().trim();
  if (role === "admin" || role === "su_admin" || role === "superadmin") {
    return "su_admin";
  }
  if (role === "tutor" || role === "teacher") {
    return "tutor";
  }
  if (role === "finance" || role === "accountant") {
    return "finance";
  }

  return "viewer";
};

const getRoleFromUserCookie = (userCookie?: string): UserRole => {
  if (!userCookie) return "viewer";

  try {
    const parsed = JSON.parse(userCookie);
    return normalizeRole(parsed?.role || parsed?.apiRole);
  } catch {
    return "viewer";
  }
};

const getHomeByRole = (role: UserRole): string => {
  if (role === "su_admin") return "/dashboard";
  if (role === "tutor") return "/tutor-dashboard";
  if (role === "finance") return "/finance-dashboard";
  return "/";
};

const requiredRoleForPath = (pathname: string): UserRole | null => {
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    return "su_admin";
  }
  if (
    pathname === "/tutor-dashboard" ||
    pathname.startsWith("/tutor-dashboard/")
  ) {
    return "tutor";
  }
  if (
    pathname === "/finance-dashboard" ||
    pathname.startsWith("/finance-dashboard/")
  ) {
    return "finance";
  }

  return null;
};

const AUTH_COOKIES = [
  "token",
  "accessToken",
  "refreshToken",
  "user",
  "userRole",
];

const clearAuthCookies = (response: NextResponse) => {
  for (const name of AUTH_COOKIES) {
    response.cookies.set({ name, value: "", expires: new Date(0), path: "/" });
  }
};

const validateToken = async (token: string): Promise<boolean> => {
  try {
    const apiUrl = AppConfig().app.apiUrl;
    const response = await fetch(`${apiUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.ok;
  } catch {
    return false;
  }
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token =
    req.cookies.get("token")?.value ||
    req.cookies.get("accessToken")?.value ||
    "";

  const roleFromUser = getRoleFromUserCookie(req.cookies.get("user")?.value);
  const roleFromCookie = normalizeRole(req.cookies.get("userRole")?.value);
  const role = roleFromUser !== "viewer" ? roleFromUser : roleFromCookie;

  // Consider the user authenticated if token exists OR legacy user cookie exists.
  const isAuthenticated = Boolean(token) || roleFromUser !== "viewer";

  // If already authenticated, keep login page inaccessible.
  if (pathname === "/" && isAuthenticated) {
    const url = req.nextUrl.clone();
    url.pathname = getHomeByRole(role);
    return NextResponse.redirect(url);
  }

  const requiredRole = requiredRoleForPath(pathname);
  if (!requiredRole) {
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (token) {
    const isValid = await validateToken(token);
    if (!isValid) {
      const response = NextResponse.redirect(new URL("/", req.url));
      clearAuthCookies(response);
      return response;
    }
  }

  if (role !== requiredRole) {
    const url = req.nextUrl.clone();
    url.pathname = getHomeByRole(role);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/tutor-dashboard/:path*",
    "/finance-dashboard/:path*",
  ],
};
