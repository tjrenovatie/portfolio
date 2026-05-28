import { redirect } from "next/navigation";
import {
  DashboardGoogleLoginButton,
  DashboardStatusMessage,
} from "@/components/dashboard";
import { getDashboardSession } from "@/lib/auth";
import { dashboardNoIndexMetadata } from "@/lib/dashboard-seo";
import {
  DASHBOARD_HOME_PATH,
  getSafeDashboardCallbackUrl,
} from "@/lib/dashboard-auth-routes";

export const metadata = dashboardNoIndexMetadata;

type DashboardLoginPageProps = {
  searchParams?: Promise<{
    callbackUrl?: string;
    error?: string;
  }>;
};

export default async function DashboardLoginPage({
  searchParams,
}: DashboardLoginPageProps) {
  const session = await getDashboardSession();

  if (session) {
    redirect(DASHBOARD_HOME_PATH);
  }

  const resolvedSearchParams = await searchParams;
  const callbackUrl = getSafeDashboardCallbackUrl(
    resolvedSearchParams?.callbackUrl,
  );
  const hasAuthError = Boolean(resolvedSearchParams?.error);

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-marble-dark bg-cover bg-center px-4 py-10 text-white">
      <div
        className="absolute inset-0 bg-black/55"
        role="img"
        aria-label="Decorative background overlay for styling purposes"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

      <section className="relative z-10 w-full max-w-xl overflow-hidden rounded-md border border-white/10 bg-neutral-950/85 shadow-2xl shadow-black/40 backdrop-blur-md">
        <div className="border-b border-white/10 px-8 py-7 sm:px-10">
          <p className="text-sm font-semibold uppercase text-[--color-primary]">
            TJ Renovatie
          </p>
          <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            Dashboard login
          </h1>
          <p className="mt-4 max-w-md text-base leading-7 text-neutral-300">
            Sign in with the approved Google account to manage website content.
          </p>
        </div>

        <div className="px-8 py-7 sm:px-10">
          {hasAuthError && (
            <DashboardStatusMessage className="mb-5" status="error">
              This Google account is not allowed to access the dashboard.
            </DashboardStatusMessage>
          )}

          <div className="flex">
            <DashboardGoogleLoginButton callbackUrl={callbackUrl} />
          </div>
        </div>
      </section>
    </main>
  );
}
