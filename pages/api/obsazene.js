import { google } from "googleapis";

// Přidá 1 den k datu ve formátu YYYY-MM-DD
function nextDay(ymd) {
  const [y, m, d] = ymd.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + 1);
  return date.toISOString().split("T")[0];
}

// Vrátí pole dat mezi start (včetně) a end (exkluzivně)
function expandRange(startYMD, endYMD) {
  const result = [];
  let cur = startYMD;
  while (cur < endYMD) {
    result.push(cur);
    cur = nextDay(cur);
  }
  return result;
}

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
      const summary = ev.summary?.toUpperCase().trim() || "";

      // Přeskočíme události s názvem začínajícím na "NÁVRH"
      if (summary.startsWith("NÁVRH")) continue;

      if (ev.start?.date && ev.end?.date) {
        // Celodenní událost: end je EXCLUSIVE
        const days = expandRange(ev.start.date, ev.end.date);
        obsazene.push(...days);
      } else if (ev.start?.dateTime) {
        // Časová událost: přidáme datum začátku
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
