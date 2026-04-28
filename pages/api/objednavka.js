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
    // === 1. SEKCE PRO WEDOS EMAIL ===
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

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #ddd; border-radius: 10px; overflow: hidden; margin: 0 auto;">
        <div style="background-color: #2f3237; padding: 20px; text-align: center;">
          <h1 style="color: #f9c600; margin: 0; font-size: 24px; text-transform: uppercase;">Nová poptávka z webu</h1>
        </div>
        <div style="padding: 20px; background-color: #ffffff; color: #333; line-height: 1.6;">
          <p style="font-size: 16px; border-bottom: 2px solid #f9c600; padding-bottom: 5px;"><strong>📍 LOKALITA A TERMÍN</strong></p>
          <p style="margin: 5px 0;"><strong>Adresa:</strong> ${adresa}</p>
          <p style="margin: 5px 0;"><strong>Termín:</strong> ${datumOd} až ${datumDo}</p>
          <p style="margin: 5px 0;"><strong>Vzdálenost:</strong> ${km ?? "-"} km</p>
          
          <p style="font-size: 16px; border-bottom: 2px solid #f9c600; padding-bottom: 5px; margin-top: 25px;"><strong>👤 KONTAKT NA ZÁKAZNÍKA</strong></p>
          <p style="margin: 5px 0;"><strong>E-mail:</strong> <a href="mailto:${email}" style="color: #2f3237; font-weight: bold;">${email}</a></p>
          <p style="margin: 5px 0;"><strong>Telefon:</strong> <a href="tel:${telefon}" style="color: #2f3237; font-weight: bold;">${telefon}</a></p>

          <p style="font-size: 16px; border-bottom: 2px solid #f9c600; padding-bottom: 5px; margin-top: 25px;"><strong>📝 PODROBNOSTI PRACÍ</strong></p>
          <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; border-left: 4px solid #f9c600; white-space: pre-wrap;">
            ${popisZK}
          </div>

          ${typZeminy ? `<p style="margin-top: 15px;"><strong>🪨 Typ zeminy:</strong> ${typZeminy}</p>` : ""}
          ${rozmerZeminy ? `<p><strong>📏 Rozměry/Množství:</strong> ${rozmerZeminy}</p>` : ""}
        </div>
        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #ddd;">
          Tato poptávka byla automaticky vložena do Google Kalendáře jako <strong>NÁVRH</strong>.
        </div>
      </div>
    `;

    try {
      await transporter.sendMail({
        from: `"Web Zevyp" <${process.env.WEDOS_MAIL_USER}>`,
        to: process.env.WEDOS_MAIL_TO, 
        subject: `Poptávka: ${adresa}`,
        html: emailHtml,
      });
      console.log("Email na Wedos odeslán.");
    } catch (mailErr) {
      console.error("Chyba Wedos mailu:", mailErr.message);
    }


    // === 2. SEKCE PRO GOOGLE KALENDÁŘ (Tvůj původní Gmail účet) ===
    const oauth2Client = new google.auth.OAuth2(
      process.env.GCAL_CLIENT_ID,
      process.env.GCAL_CLIENT_SECRET,
      process.env.GCAL_REDIRECT_URI
    );
    
    oauth2Client.setCredentials({ 
      refresh_token: process.env.GCAL_REFRESH_TOKEN 
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    
    const endDate = new Date(datumDo);
    endDate.setDate(endDate.getDate() + 1);

    await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
      requestBody: {
        summary: `NÁVRH: ${adresa}`,
        location: adresa,
        description: `Zákazník: ${email}\nTel: ${telefon}\n\nPopis prací:\n${popisZK}\n\nVzdálenost: ${km ?? "-"} km`,
        start: { date: datumOd, timeZone: "Europe/Prague" },
        end: { date: endDate.toISOString().split("T")[0], timeZone: "Europe/Prague" },
        status: "tentative",
      },
    });
    console.log("Záznam v kalendáři vytvořen.");

    return res.status(200).json({ ok: true, message: "Poptávka zpracována." });

  } catch (error) {
    console.error("Kritická chyba backendu:", error);
    return res.status(500).json({ error: "Chyba na serveru při odesílání." });
  }
}
