import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";
import {
  DASHBOARD_HOME_PATH,
  DASHBOARD_LOGIN_PATH,
} from "@/lib/dashboard-auth-routes";
import { DASHBOARD_ROBOTS_HEADER } from "@/lib/dashboard-seo";

function isAllowedDashboardEmail(email?: string | null) {
  const allowedEmail = process.env.ALLOWED_GOOGLE_EMAIL?.trim().toLowerCase();

  return Boolean(allowedEmail && email?.trim().toLowerCase() === allowedEmail);
}

function withDashboardRobotsHeader(response: NextResponse) {
  response.headers.set("X-Robots-Tag", DASHBOARD_ROBOTS_HEADER);

  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isLoginRoute = pathname === DASHBOARD_LOGIN_PATH;
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const isAuthenticated = isAllowedDashboardEmail(token?.email);

  if (isLoginRoute && isAuthenticated) {
    return withDashboardRobotsHeader(
      NextResponse.redirect(new URL(DASHBOARD_HOME_PATH, request.url)),
    );
  }

  if (!isLoginRoute && !isAuthenticated) {
    const loginUrl = new URL(DASHBOARD_LOGIN_PATH, request.url);
    loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);

    return withDashboardRobotsHeader(NextResponse.redirect(loginUrl));
  }

  return withDashboardRobotsHeader(NextResponse.next());
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
