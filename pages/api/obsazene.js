import { google } from "googleapis";

export default async function handler(req, res) {
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

    const now = new Date().toISOString();
    const events = await calendar.events.list({
      calendarId: "primary",
      timeMin: now,
      maxResults: 100,
      singleEvents: true,
      orderBy: "startTime",
    });

    const obsazene = [];

    for (const ev of events.data.items) {
      // zahrnout POUZE potvrzené události, které nezačínají "NÁVRH"
      if (
        ev.status !== "confirmed" ||
        (ev.summary && ev.summary.toUpperCase().startsWith("NÁVRH"))
      ) {
        continue;
      }

      if (ev.start?.date && ev.end?.date) {
        let current = new Date(ev.start.date);
        const end = new Date(ev.end.date);
        while (current < end) {
          obsazene.push(current.toISOString().split("T")[0]);
          current.setDate(current.getDate() + 1);
        }
      } else if (ev.start?.dateTime) {
        const den = new Date(ev.start.dateTime).toISOString().split("T")[0];
        obsazene.push(den);
      }
    }

    const uniqueSorted = Array.from(new Set(obsazene)).sort();

    res.status(200).json({ obsazene: uniqueSorted });
  } catch (error) {
    console.error("Chyba při načítání obsazených termínů:", error);
    res.status(500).json({ error: "Nepodařilo se načíst obsazené termíny." });
  }
}
