import { google } from "googleapis";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    popisZK,
    adresa,
    datumOd,
    datumDo,
    typZeminy,
    rozmerZeminy,
    km,
    email,
    telefon,
  } = req.body;

  try {
    // === 1. ODESLÁNÍ EMAILU PŘES WEDOS ===
    const transporter = nodemailer.createTransport({
      host: "wes1-smtp.wedos.net", 
      port: 465,
      secure: true, 
      auth: {
        user: process.env.WEDOS_MAIL_USER, 
        pass: process.env.WEDOS_MAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false 
      }
    });

    const emailHtml = `
      <div style="font-family: sans-serif; color: #333; padding: 20px; border: 1px solid #eee;">
        <h2 style="color: #2f3237; background: #f9c600; padding: 10px; display: inline-block;">Nová poptávka z webu</h2>
        <p><strong>Lokalita:</strong> ${adresa}</p>
        <p><strong>Zákazník:</strong> ${email} | <a href="tel:${telefon}">${telefon}</a></p>
        <p><strong>Termín:</strong> ${datumOd} – ${datumDo}</p>
        <p><strong>Vzdálenost:</strong> ${km ?? "-"} km</p>
        <hr />
        <p><strong>Popis prací:</strong><br />${popisZK}</p>
        ${typZeminy ? `<p><strong>Zemina:</strong> ${typZeminy} (${rozmerZeminy})</p>` : ""}
      </div>
    `;

    try {
      await transporter.sendMail({
        from: `"Web Zevyp" <${process.env.WEDOS_MAIL_USER}>`,
        to: process.env.WEDOS_MAIL_TO, 
        subject: `Nová poptávka: ${adresa}`,
        html: emailHtml,
      });
    } catch (mailError) {
      console.error("Chyba odesílání Wedos mailu:", mailError.message);
    }

    // === 2. ZÁPIS DO GOOGLE KALENDÁŘE (Tvůj Gmail) ===
    const oauth2Client = new google.auth.OAuth2(
      process.env.GCAL_CLIENT_ID,
      process.env.GCAL_CLIENT_SECRET,
      process.env.GCAL_REDIRECT_URI
    );
    oauth2Client.setCredentials({ refresh_token: process.env.GCAL_REFRESH_TOKEN });
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const endDate = new Date(datumDo);
    endDate.setDate(endDate.getDate() + 1);

    const event = {
      summary: `NÁVRH: ${adresa}`,
      location: adresa,
      description: `Klient: ${email}\nTel: ${telefon}\n\nPopis: ${popisZK}\n\nVzdálenost: ${km} km`,
      start: { date: datumOd, timeZone: "Europe/Prague" },
      end: { date: endDate.toISOString().split("T")[0], timeZone: "Europe/Prague" },
      status: "tentative",
    };

    await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
      requestBody: event,
    });

    return res.status(200).json({ ok: true, message: "Poptávka odeslána." });

  } catch (error) {
    console.error("Celková chyba serveru:", error);
    return res.status(500).json({ error: "Chyba na straně serveru." });
  }
}
