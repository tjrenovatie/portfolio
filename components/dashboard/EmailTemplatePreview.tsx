type DashboardEmailTemplatePreviewProps = {
  description: string;
  html: string;
  subject: string;
  title: string;
};

export function DashboardEmailTemplatePreview({
  description,
  html,
  subject,
  title,
}: DashboardEmailTemplatePreviewProps) {
  return (
    <section className="overflow-hidden rounded-md border border-neutral-800 bg-neutral-900 shadow-sm">
      <div className="border-b border-neutral-800 px-5 py-4">
        <p className="text-sm font-bold text-white">{title}</p>
        <p className="mt-1 text-sm leading-6 text-neutral-400">
          {description}
        </p>
        <p className="mt-3 text-xs font-semibold text-neutral-500">
          Subject: {subject}
        </p>
      </div>
      <div className="bg-neutral-950 p-4">
        <iframe
          className="h-[30rem] w-full rounded-md border border-neutral-800 bg-white"
          sandbox=""
          srcDoc={html}
          title={`${title} preview`}
        />
      </div>
    </section>
  );
}
