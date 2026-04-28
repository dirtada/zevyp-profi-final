import { google } from "googleapis";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { popisZK, adresa, datumOd, datumDo, typZeminy, rozmerZeminy, km, email, telefon } = req.body;

  try {
    // === 1. SEKCE PRO WEDOS EMAIL (Tady se přihlašujeme k Wedosu) ===
    const transporter = nodemailer.createTransport({
      host: "wes1-smtp.wedos.net", 
      port: 465,
      secure: true, 
      auth: {
        user: process.env.WEDOS_MAIL_USER, 
        pass: process.env.WEDOS_MAIL_PASS,
      },
      tls: { rejectUnauthorized: false }
    });

    const emailHtml = `<h2>Nová poptávka - zevyp-kp.cz</h2>...`; // Obsah mailu

    try {
      await transporter.sendMail({
        from: `"Web Zevyp" <${process.env.WEDOS_MAIL_USER}>`,
        to: process.env.WEDOS_MAIL_TO, 
        subject: `Nová poptávka: ${adresa}`,
        html: emailHtml,
      });
    } catch (e) { console.error("Chyba Wedos mailu:", e.message); }


    // === 2. SEKCE PRO GOOGLE KALENDÁŘ (Tady zůstávají tvoje původní Google klíče) ===
    const oauth2Client = new google.auth.OAuth2(
      process.env.GCAL_CLIENT_ID,        // TVŮJ PŮVODNÍ KLÍČ
      process.env.GCAL_CLIENT_SECRET,    // TVŮJ PŮVODNÍ KLÍČ
      process.env.GCAL_REDIRECT_URI      // TVŮJ PŮVODNÍ KLÍČ
    );
    
    oauth2Client.setCredentials({ 
      refresh_token: process.env.GCAL_REFRESH_TOKEN // TVŮJ PŮVODNÍ TOKEN
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    
    // ... zbytek kódu pro zápis do kalendáře zůstává stejný ...
    
    const endDate = new Date(datumDo);
    endDate.setDate(endDate.getDate() + 1);

    await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID || "primary", // TVŮJ PŮVODNÍ ID KALENDÁŘE
      requestBody: {
        summary: `NÁVRH: ${adresa}`,
        location: adresa,
        description: `Klient: ${email}\nTel: ${telefon}\n\n${popisZK}`,
        start: { date: datumOd, timeZone: "Europe/Prague" },
        end: { date: endDate.toISOString().split("T")[0], timeZone: "Europe/Prague" },
        status: "tentative",
      },
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: "Chyba na serveru." });
  }
}
