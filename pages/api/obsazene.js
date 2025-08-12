// pages/api/obsazene.js
import { google } from "googleapis";

const TZ = "Europe/Prague";

const pad = (n) => String(n).padStart(2, "0");

// přičti dny k YYYY-MM-DD bez toISOString/UTC
const addDaysStr = (ymd, days) => {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
};

// rozepíše interval po jednotlivých dnech: <start, end)
const expandRange = (startYMD, endYMDExclusive) => {
  const out = [];
  for (let cur = startYMD; cur < endYMDExclusive; cur = addDaysStr(cur, 1)) {
    out.push(cur);
  }
  return out;
};

// z dateTime udělá YYYY-MM-DD v dané timezone (žádné ISO!)
const formatYMD = (date) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const get = (t) => parts.find((p) => p.type === t).value;
  return `${get("year")}-${get("month")}-${get("day")}`;
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
    const timeMin = new Date(now.getFullYear(), now.getMonth() - 3, 1).toISOString();
    const timeMax = new Date(now.getFullYear(), now.getMonth() + 9, 1).toISOString();

    const { data } = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
      singleEvents: true,
      orderBy: "startTime",
      timeMin,
      timeMax,
      timeZone: TZ,
      maxResults: 2500,
    });

    const occupied = new Set();

    for (const ev of data.items || []) {
      const summary = (ev.summary || "").toUpperCase().trim();
      // přeskakujeme návrhy, pokud nechceš blokovat kalendář
      if (summary.startsWith("NÁVRH")) continue;

      // all-day událost (end.date je EXKLUZIVNÍ)
      if (ev.start?.date && ev.end?.date) {
        for (const d of expandRange(ev.start.date, ev.end.date)) {
          occupied.add(d);
        }
        continue;
      }

      // časovaná událost – rozepiš po dnech (pro jistotu)
      if (ev.start?.dateTime && ev.end?.dateTime) {
        const s = new Date(ev.start.dateTime);
        const e = new Date(ev.end.dateTime);
        const startYMD = formatYMD(s);
        const endYMDEx = addDaysStr(formatYMD(e), 1);
        for (const d of expandRange(startYMD, endYMDEx)) {
          occupied.add(d);
        }
      }
    }

    const obsazene = Array.from(occupied).sort();
    res.status(200).json({ obsazene });
  } catch (error) {
    console.error("Chyba při načítání obsazených termínů:", error);
    res.status(500).json({ error: "Nepodařilo se načíst obsazené termíny." });
  }
}
