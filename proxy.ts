import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import {
  DASHBOARD_HOME_PATH,
  DASHBOARD_LOGIN_PATH,
} from "@/lib/dashboard-auth-routes";
import { DASHBOARD_ROBOTS_HEADER } from "@/lib/dashboard-seo";

const intlProxy = createIntlMiddleware(routing);

function isAllowedDashboardEmail(email?: string | null) {
  const allowedEmail = process.env.ALLOWED_GOOGLE_EMAIL?.trim().toLowerCase();

  return Boolean(allowedEmail && email?.trim().toLowerCase() === allowedEmail);
}

function withDashboardRobotsHeader(response: NextResponse) {
  response.headers.set("X-Robots-Tag", DASHBOARD_ROBOTS_HEADER);

  return response;
}

async function dashboardProxy(request: NextRequest) {
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

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    return dashboardProxy(request);
  }

  return intlProxy(request);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/((?!api|_next|_vercel|assets|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};
