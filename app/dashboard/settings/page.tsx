import { dashboardNoIndexMetadata } from "@/lib/dashboard-seo";
import { getWebsiteDisplayEnabled } from "@/lib/site-settings";
import WebsiteDisplayToggle from "./WebsiteDisplayToggle";

export const metadata = dashboardNoIndexMetadata;
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function DashboardSettingsPage() {
  const isWebsiteEnabled = await getWebsiteDisplayEnabled();

  return (
    <article className="space-y-6">
      <section className="border-b border-neutral-800 pb-6">
        <p className="text-sm font-semibold uppercase text-[--color-primary]">
          Settings
        </p>
        <h2 className="mt-2 text-3xl font-bold text-white">Website display</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-300">
          Control whether visitors can see the public website.
        </p>
      </section>

      <WebsiteDisplayToggle isWebsiteEnabled={isWebsiteEnabled} />
    </article>
  );
}
