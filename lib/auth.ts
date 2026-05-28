import { getServerSession, type NextAuthOptions, type Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { DASHBOARD_LOGIN_PATH } from "@/lib/dashboard-auth-routes";

function getAllowedGoogleEmail() {
  return process.env.ALLOWED_GOOGLE_EMAIL?.trim().toLowerCase() ?? "";
}

export function isAllowedGoogleEmail(email?: string | null) {
  const allowedEmail = getAllowedGoogleEmail();

  return Boolean(allowedEmail && email?.trim().toLowerCase() === allowedEmail);
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider !== "google") {
        return false;
      }

      const googleProfile = profile as
        | {
            email?: string;
            email_verified?: boolean;
          }
        | undefined;

      return Boolean(
        googleProfile?.email_verified &&
          isAllowedGoogleEmail(googleProfile.email),
      );
    },
  },
  pages: {
    error: DASHBOARD_LOGIN_PATH,
    signIn: DASHBOARD_LOGIN_PATH,
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
};

export async function getDashboardSession(): Promise<Session | null> {
  const session = await getServerSession(authOptions);

  if (!isAllowedGoogleEmail(session?.user?.email)) {
    return null;
  }

  return session;
}

export async function isDashboardAuthenticated() {
  const session = await getDashboardSession();

  return Boolean(session);
}
