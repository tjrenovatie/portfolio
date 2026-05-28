import type { NextAuthOptions } from "next-auth";
import { getSafeDashboardRedirectUrl } from "@/lib/dashboard-auth-routes";

const FIFTEEN_MINUTES_SECONDS = 15 * 60;

export const AUTH_SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;
export const AUTH_SESSION_UPDATE_AGE_SECONDS = 60 * 60;

const useSecureCookies =
  process.env.NEXTAUTH_URL?.startsWith("https://") ||
  process.env.VERCEL_ENV === "production";

const cookiePrefix = useSecureCookies ? "__Secure-" : "";
const csrfCookiePrefix = useSecureCookies ? "__Host-" : "";

const baseCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  secure: useSecureCookies,
};

export const authSecurityOptions = {
  cookies: {
    callbackUrl: {
      name: `${cookiePrefix}next-auth.callback-url`,
      options: baseCookieOptions,
    },
    csrfToken: {
      name: `${csrfCookiePrefix}next-auth.csrf-token`,
      options: baseCookieOptions,
    },
    nonce: {
      name: `${cookiePrefix}next-auth.nonce`,
      options: baseCookieOptions,
    },
    pkceCodeVerifier: {
      name: `${cookiePrefix}next-auth.pkce.code_verifier`,
      options: {
        ...baseCookieOptions,
        maxAge: FIFTEEN_MINUTES_SECONDS,
      },
    },
    sessionToken: {
      name: `${cookiePrefix}next-auth.session-token`,
      options: baseCookieOptions,
    },
    state: {
      name: `${cookiePrefix}next-auth.state`,
      options: {
        ...baseCookieOptions,
        maxAge: FIFTEEN_MINUTES_SECONDS,
      },
    },
  },
  jwt: {
    maxAge: AUTH_SESSION_MAX_AGE_SECONDS,
  },
  session: {
    maxAge: AUTH_SESSION_MAX_AGE_SECONDS,
    strategy: "jwt",
    updateAge: AUTH_SESSION_UPDATE_AGE_SECONDS,
  },
  useSecureCookies,
} satisfies Pick<
  NextAuthOptions,
  "cookies" | "jwt" | "session" | "useSecureCookies"
>;

export function getSafeAuthRedirectUrl({
  baseUrl,
  url,
}: {
  baseUrl: string;
  url: string;
}) {
  return getSafeDashboardRedirectUrl({ baseUrl, url });
}
