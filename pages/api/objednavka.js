import { google } from "googleapis";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { jmeno, datumOd, datumDo, hodiny, km, cena } = req.body;

  try {
    // Připojení ke Google Calendar
    const oauth2Client = new google.auth.OAuth2(
      process.env.GCAL_CLIENT_ID,
      process.env.GCAL_CLIENT_SECRET,
      process.env.GCAL_REDIRECT_URI
    );
    oauth2Client.setCredentials({
      refresh_token: process.env.GCAL_REFRESH_TOKEN,
    });
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    // Kontrola obsazenosti v rozsahu
    const events = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date(datumOd).toISOString(),
      timeMax: new Date(new Date(datumDo).getTime() + 24*60*60*1000).toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    if (events.data.items.length > 0) {
      return res.status(400).json({ error: "V tomto rozsahu je již rezervace. Zvolte prosím jiné datum." });
    }

    // Odeslání e‑mailu
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Zevyp kalkulace" <${process.env.MAIL_USER}>`,
      to: "kontaktzevyp@gmail.com",
      subject: "Nová poptávka výkopových prací",
      html: `
        <h2>Nová poptávka</h2>
        <p><strong>Projekt:</strong> ${jmeno}</p>
        <p><strong>Od:</strong> ${new Date(datumOd).toLocaleDateString("cs-CZ")}</p>
        <p><strong>Do:</strong> ${new Date(datumDo).toLocaleDateString("cs-CZ")}</p>
        <p><strong>Hodiny:</strong> ${hodiny}</p>
        <p><strong>Kilometry:</strong> ${km}</p>
        <p><strong>Celková cena:</strong> ${cena} Kč</p>
      `,
    });

    // Vytvoření události přes více dní
    const event = {
      summary: `NÁVRH: ${jmeno}`,
      description: `Počet hodin: ${hodiny}, Km: ${km}, Cena: ${cena} Kč`,
      start: {
        date: datumOd,
        timeZone: "Europe/Prague",
      },
      end: {
        date: new Date(new Date(datumDo).getTime() + 24*60*60*1000)
          .toISOString()
          .split("T")[0], // Google očekává, že "end.date" je den po konci
        timeZone: "Europe/Prague",
      },
      status: "tentative",
    };

    await calendar.events.insert({
      calendarId: "primary",
      resource: event,
    });

    return res.status(200).json({ message: "Poptávka byla úspěšně odeslána a vložena do kalendáře." });
  } catch (error) {
    console.error("Chyba při zpracování:", error);
    return res.status(500).json({ error: "Nepodařilo se odeslat poptávku." });
  }
}
