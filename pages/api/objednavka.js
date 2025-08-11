// pages/api/objednavka.js
import { google } from "googleapis";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      popisZK,
      adresa,
      datumOd,
      datumDo,
      typZeminy,
      rozmerZeminy,
      km,
      // pokud budeš do formuláře doplňovat:
      email,
      telefon,
      // případně starší pole:
      // jmeno, hodiny, cena,
    } = req.body;

    // === GOOGLE CALENDAR (OAuth2 s refresh tokenem) ===
    const oauth2Client = new google.auth.OAuth2(
      process.env.GCAL_CLIENT_ID,
      process.env.GCAL_CLIENT_SECRET,
      process.env.GCAL_REDIRECT_URI
    );
    oauth2Client.setCredentials({
      refresh_token: process.env.GCAL_REFRESH_TOKEN,
    });
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    // === EMAIL (Gmail / SMTP) ===
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const emailHtml = `
      <h2>Nová poptávka</h2>
      <p><strong>Popis prací:</strong> ${popisZK}</p>
      <p><strong>Adresa zakázky:</strong> ${adresa}</p>
      <p><strong>Termín:</strong> ${new Date(datumOd).toLocaleDateString("cs-CZ")} – ${new Date(datumDo).toLocaleDateString("cs-CZ")}</p>
      <p><strong>Vzdálenost:</strong> ${km ?? "-"} km</p>
      ${typZeminy ? `<p><strong>Typ zeminy:</strong> ${typZeminy}</p>` : ""}
      ${rozmerZeminy ? `<p><strong>Rozměr zeminy:</strong> ${rozmerZeminy}</p>` : ""}
      ${email ? `<p><strong>E-mail:</strong> ${email}</p>` : ""}
      ${telefon ? `<p><strong>Telefon:</strong> ${telefon}</p>` : ""}
    `;

    await transporter.sendMail({
      from: `"Zevyp" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_TO || "kontaktzevyp@gmail.com",
      subject: "Nová poptávka výkopových prací",
      html: emailHtml,
    });

    // === Událost v Google Kalendáři (celodenní, status: tentative) ===
    const endDate = new Date(datumDo);
    endDate.setDate(endDate.getDate() + 1); // end.date je den po

    const event = {
      summary: `NÁVRH: ${adresa}`,
      description:
        `Popis: ${popisZK}\n` +
        `Vzdálenost: ${km ?? "-"} km\n` +
        (typZeminy ? `Typ zeminy: ${typZeminy}\n` : "") +
        (rozmerZeminy ? `Rozměr zeminy: ${rozmerZeminy}\n` : "") +
        (email ? `E-mail: ${email}\n` : "") +
        (telefon ? `Telefon: ${telefon}\n` : ""),
      start: { date: datumOd, timeZone: "Europe/Prague" },
      end: { date: endDate.toISOString().split("T")[0], timeZone: "Europe/Prague" },
      status: "tentative",
    };

    await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
      requestBody: event,
    });

    return res.status(200).json({
      ok: true,
      message: "Poptávka byla odeslána. Rezervace vložena do kalendáře jako návrh.",
    });
  } catch (error) {
    console.error("Chyba při zpracování:", error);
    return res.status(500).json({ error: "Nepodařilo se odeslat poptávku." });
  }
}
