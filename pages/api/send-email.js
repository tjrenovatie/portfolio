import { Resend } from "resend";

const rateLimit = {};
const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;

export default async function handler(req, res) {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (req.method === "POST") {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

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
        to: `${name} <${email}>`,
        subject: "Bevestiging van uw bericht",
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bevestiging van uw bericht</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 5px;
              background-color: #f9f9f9;
            }
            h1 {
              color: #0056b3;
            }
            p {
              margin: 10px 0;
            }
            .footer {
              margin-top: 20px;
              font-size: 0.9em;
              color: #777;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Bevestiging van uw bericht</h1>
            <p>Bedankt voor uw bericht, ${name}!</p>
            <p>We zullen zo snel mogelijk contact met u opnemen.</p>
            <div class="footer">
              <p>Dit is een automatisch gegenereerde e-mail, gelieve niet te antwoorden.</p>
            </div>
          </div>
        </body>
        </html>`,
        // message: `Bedankt voor uw bericht, ${name}! We zullen zo snel mogelijk contact met u opnemen.`,
      });

      await resend.emails.send({
        from: `TJ Renovatie <noreply@tj-renovatie.nl>`,
        to: `TJ Renovatie <info@tj-renovatie.nl>`,
        subject: "Nieuw bericht ontvangen",
        html: `   <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nieuw bericht ontvangen</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
            background-color: #f9f9f9;
          }
          h1 {
            color: #0056b3;
          }
          p {
            margin: 10px 0;
          }
          .footer {
            margin-top: 20px;
            font-size: 0.9em;
            color: #777;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Nieuw bericht ontvangen</h1>
          <p><strong>Naam:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Bericht:</strong></p>
          <p>${message}</p>
          <div class="footer">
            <p>Dit is een automatisch gegenereerde e-mail, gelieve niet te antwoorden.</p>
          </div>
        </div>
      </body>
      </html>`,
      });
      res.status(200).json({ success: "Email sent successfully!" });
    } catch (error) {
      res.status(500).json({ error: "Error sending email." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
