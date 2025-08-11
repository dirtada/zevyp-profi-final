import { google } from "googleapis";

export default async function handler(req, res) {
  console.log("API /obsazene bylo zavolano");
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GCAL_CLIENT_ID,
      process.env.GCAL_CLIENT_SECRET,
      process.env.GCAL_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GCAL_REFRESH_TOKEN,
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const now = new Date();
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(now.getMonth() + 3);

    const events = await calendar.events.list({
      calendarId: "primary",
      timeMin: now.toISOString(),
      timeMax: threeMonthsLater.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
      timeZone: "Europe/Prague"
    });

    const obsazene = [];

    for (const ev of events.data.items || []) {
      if (ev.summary && ev.summary.toUpperCase().startsWith("NÁVRH")) {
        continue; // přeskočit návrhy
      }

      if (ev.start?.date && ev.end?.date) {
        // Celodenní událost: end.date je exclusive, takže obsazené jsou [start, end - 1]
        let current = new Date(ev.start.date);
        const end = new Date(ev.end.date);

        while (current < end) {
          obsazene.push(current.toISOString().split("T")[0]);
          current.setDate(current.getDate() + 1);
        }

      } else if (ev.start?.dateTime) {
        // Časová událost: zabere minimálně den začátku
        const start = new Date(ev.start.dateTime);
        const end = new Date(ev.end?.dateTime || ev.start.dateTime);

        const startYMD = start.toISOString().split("T")[0];
        const endYMD = end.toISOString().split("T")[0];

        // Přidat všechny dny mezi startYMD a endYMD včetně
        let current = new Date(startYMD);
        const endDate = new Date(endYMD);

        while (current <= endDate) {
          obsazene.push(current.toISOString().split("T")[0]);
          current.setDate(current.getDate() + 1);
        }
      }
    }

    // Odstranit duplicity
    const unikatni = Array.from(new Set(obsazene)).sort();

    console.log("Obsazené termíny:", unikatni);
    res.status(200).json({ obsazene: unikatni });

  } catch (error) {
    console.error("Chyba při načítání obsazených termínů:", error);
    res.status(500).json({ error: "Nepodařilo se načíst obsazené termíny." });
  }
}
