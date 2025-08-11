import { google } from "googleapis";

// Pomocné funkce pro bezpečnou práci s dny bez lokálního/UTC driftu
const ymdFromUTCDate = (d) => d.toISOString().slice(0, 10); // YYYY-MM-DD
const nextYMD = (ymd) => {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + 1);
  return ymdFromUTCDate(dt);
};

// Rozbalí uzavřený interval [startYMD, endYMD], end je inclusive
const expandRangeYMD = (startYMD, endYMD) => {
  const days = [];
  let cur = startYMD;
  while (cur <= endYMD) {
    days.push(cur);
    cur = nextYMD(cur);
  }
  return days;
};

export default async function handler(req, res) {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GCAL_CLIENT_ID,
      process.env.GCAL_CLIENT_SECRET,
      process.env.GCAL_REDIRECT_URI
    );
    oauth2Client.setCredentials({ refresh_token: process.env.GCAL_REFRESH_TOKEN });

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
      timeZone: "Europe/Prague", // sjednocení časové zóny v odpovědi
    });

    const blocked = [];

    for (const ev of events.data.items || []) {
      // Přeskočit návrhy
      if (ev.summary && ev.summary.toUpperCase().startsWith("NÁVRH")) continue;

      const isAllDay = !!ev.start?.date && !!ev.end?.date;

      if (isAllDay) {
        // Google vrací end.date jako EXCLUSIVE -> obsazené dny jsou [start, end-1]
        let cur = ev.start.date;      // "YYYY-MM-DD"
        const endExclusive = ev.end.date;

        while (cur < endExclusive) {
          blocked.push(cur);
          cur = nextYMD(cur);
        }
      } else if (ev.start?.dateTime) {
        // Časové události – označíme všechny dny, kterých se dotýká
        const start = new Date(ev.start.dateTime);
        const end = new Date(ev.end?.dateTime || ev.start.dateTime);

        const startYMD = ymdFromUTCDate(new Date(Date.UTC(
          start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()
        )));
        const endYMD = ymdFromUTCDate(new Date(Date.UTC(
          end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate()
        )));

        expandRangeYMD(startYMD, endYMD).forEach((d) => blocked.push(d));
      }
    }

    // Odduplikovat a seřadit
    const obsazene = Array.from(new Set(blocked)).sort();

    res.status(200).json({ obsazene });
  } catch (error) {
    console.error("Chyba při načítání obsazených termínů:", error);
    res.status(500).json({ error: "Nepodařilo se načíst obsazené termíny." });
  }
}
