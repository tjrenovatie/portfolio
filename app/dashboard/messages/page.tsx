import { DashboardEmailTemplatePreview } from "@/components/dashboard";
import {
  renderCustomerConfirmationEmail,
  renderInternalContactNotificationEmail,
} from "@/lib/contact-email-templates";
import { dashboardNoIndexMetadata } from "@/lib/dashboard-seo";

export const metadata = dashboardNoIndexMetadata;
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const sampleTemplateData = {
  email: "klant@example.com",
  message:
    "Wij willen onze badkamer laten renoveren en ontvangen graag advies over de mogelijkheden.",
  name: "Voorbeeld klant",
};

export default async function DashboardMessagesPage() {
  const customerTemplateHtml =
    renderCustomerConfirmationEmail(sampleTemplateData);
  const internalTemplateHtml =
    renderInternalContactNotificationEmail(sampleTemplateData);

  return (
    <article className="space-y-6">
      <section className="flex flex-col justify-between gap-4 border-b border-neutral-800 pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase text-[--color-primary]">
            Contact
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white">
            Email templates
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-300">
            Preview the emails sent after a visitor submits the contact form.
          </p>
        </div>

        <div className="rounded-md border border-neutral-800 bg-neutral-900 px-4 py-3">
          <p className="text-sm font-semibold text-neutral-400">Templates</p>
          <p className="mt-1 text-2xl font-bold text-white">2</p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <DashboardEmailTemplatePreview
          description="Sent to the customer after the contact form is submitted."
          html={customerTemplateHtml}
          subject="Bevestiging van uw bericht"
          title="Customer confirmation"
        />
        <DashboardEmailTemplatePreview
          description="Sent to info@tj-renovatie.nl with the customer's details."
          html={internalTemplateHtml}
          subject="Nieuw bericht ontvangen"
          title="Internal notification"
        />
      </section>
    </article>
  );
}
