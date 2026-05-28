import { Resend } from "resend";
import {
  renderCustomerConfirmationEmail,
  renderInternalContactNotificationEmail,
} from "@/lib/contact-email-templates";

const rateLimit = {};
const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeEmailHeaderValue(value) {
  return normalizeText(value).replace(/[\r\n]/g, " ");
}

export default async function handler(req, res) {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (req.method === "POST") {
    const name = normalizeText(req.body?.name);
    const email = normalizeText(req.body?.email);
    const message = normalizeText(req.body?.message);

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const emailHeaderName = normalizeEmailHeaderValue(name);
    const emailHeaderAddress = normalizeEmailHeaderValue(email);

    // Rate limiting logic
    if (!rateLimit[ip]) {
      rateLimit[ip] = { count: 1, firstRequestTime: Date.now() };
    } else {
      const currentTime = Date.now();
      if (currentTime - rateLimit[ip].firstRequestTime < RATE_LIMIT_WINDOW) {
        rateLimit[ip].count += 1;
        if (rateLimit[ip].count > MAX_REQUESTS_PER_WINDOW) {
          return res
            .status(429)
            .json({ error: "Too many requests. Please try again later." });
        }
      } else {
        rateLimit[ip] = { count: 1, firstRequestTime: currentTime };
      }
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    try {
      await resend.emails.send({
        from: `TJ Renovatie NOREPLY <noreply@tj-renovatie.nl>`,
        to: `${emailHeaderName} <${emailHeaderAddress}>`,
        subject: "Bevestiging van uw bericht",
        html: renderCustomerConfirmationEmail({ email, message, name }),
      });

      await resend.emails.send({
        from: `TJ Renovatie <noreply@tj-renovatie.nl>`,
        to: `TJ Renovatie <info@tj-renovatie.nl>`,
        subject: "Nieuw bericht ontvangen",
        html: renderInternalContactNotificationEmail({ email, message, name }),
      });

      res.status(200).json({ success: "Email sent successfully!" });
    } catch (error) {
      res.status(500).json({ error: "Error sending email." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
