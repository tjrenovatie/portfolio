export type ContactEmailTemplateData = {
  email: string;
  message: string;
  name: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatMessage(value: string) {
  return escapeHtml(value).replace(/\r?\n/g, "<br>");
}

const baseStyles = `
  :root {
    color-scheme: light dark;
    supported-color-schemes: light dark;
  }
  body {
    margin: 0;
    background: #f4f4f5;
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #27272a;
  }
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 24px;
  }
  .panel {
    border: 1px solid #e4e4e7;
    border-radius: 8px;
    background-color: #ffffff;
    padding: 28px;
  }
  .eyebrow {
    margin: 0 0 12px;
    color: #7c5b2a;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  h1 {
    margin: 0 0 18px;
    color: #18181b;
    font-size: 24px;
    line-height: 1.25;
  }
  p {
    margin: 12px 0;
  }
  .message {
    margin-top: 16px;
    border-left: 3px solid #7c5b2a;
    background: #fafafa;
    padding: 14px 16px;
  }
  .footer {
    margin-top: 24px;
    border-top: 1px solid #e4e4e7;
    padding-top: 16px;
    font-size: 13px;
    color: #71717a;
  }
  @media (prefers-color-scheme: dark) {
    body {
      background: #09090b !important;
      color: #e4e4e7 !important;
    }
    .panel {
      border-color: #27272a !important;
      background-color: #18181b !important;
    }
    .eyebrow {
      color: #d6a95f !important;
    }
    h1 {
      color: #ffffff !important;
    }
    .message {
      border-left-color: #d6a95f !important;
      background: #27272a !important;
      color: #f4f4f5 !important;
    }
    .footer {
      border-top-color: #27272a !important;
      color: #a1a1aa !important;
    }
  }
`;

function renderEmailDocument({ body, title }: { body: string; title: string }) {
  return `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>${escapeHtml(title)}</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <div class="panel">
      ${body}
    </div>
  </div>
</body>
</html>`;
}

export function renderCustomerConfirmationEmail({
  name,
}: ContactEmailTemplateData) {
  return renderEmailDocument({
    title: "Bevestiging van uw bericht",
    body: `
      <p class="eyebrow">TJ Renovatie</p>
      <h1>Bevestiging van uw bericht</h1>
      <p>Bedankt voor uw bericht, ${escapeHtml(name)}.</p>
      <p>We hebben uw aanvraag ontvangen en nemen zo snel mogelijk persoonlijk contact met u op.</p>
      <div class="footer">
        <p>Dit is een automatisch gegenereerde e-mail. U hoeft hier niet op te antwoorden.</p>
      </div>
    `,
  });
}

export function renderInternalContactNotificationEmail({
  email,
  message,
  name,
}: ContactEmailTemplateData) {
  return renderEmailDocument({
    title: "Nieuw bericht ontvangen",
    body: `
      <p class="eyebrow">Nieuwe aanvraag</p>
      <h1>Nieuw bericht ontvangen</h1>
      <p><strong>Naam:</strong> ${escapeHtml(name)}</p>
      <p><strong>E-mail:</strong> ${escapeHtml(email)}</p>
      <p><strong>Bericht:</strong></p>
      <div class="message">${formatMessage(message)}</div>
      <div class="footer">
        <p>Dit bericht is verzonden via het contactformulier op tj-renovatie.nl.</p>
      </div>
    `,
  });
}
