// pages/api/kalendare.js
import ICAL from "ical.js";

function pad(n) { return n < 10 ? `0${n}` : `${n}`; }
function toYMDLocal(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function nextDayYMD(ymd) {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + 1);
  return toYMDLocal(dt);
}
function expandInclusive(startYMD, endYMD) {
  const out = [];
  let cur = startYMD;
  while (cur <= endYMD) {
    out.push(cur);
    cur = nextDayYMD(cur);
  }
  return out;
}

export default async function handler(req, res) {
  const ICAL_URL = "https://calendar.google.com/calendar/ical/kontaktzevyp%40gmail.com/public/basic.ics";

  try {
    const response = await fetch(ICAL_URL);
    if (!response.ok) throw new Error("Nepodařilo se stáhnout kalendář");

    const text = await response.text();
    const jcalData = ICAL.parse(text);
    const comp = new ICAL.Component(jcalData);
    const vevents = comp.getAllSubcomponents("vevent");

    const blocked = [];

    vevents.forEach((eventComp) => {
      const e = new ICAL.Event(eventComp);

      // Přeskoč „NÁVRH …“
      const summary = (e.summary || "").toUpperCase().trim();
      if (summary.startsWith("NÁVRH")) return;

      const start = e.startDate.toJSDate(); // JS Date
      const end = e.endDate.toJSDate();     // JS Date

      // Lokální YMD (bez UTC posunů)
      let startYMD = toYMDLocal(start);

      if (e.startDate.isDate) {
        // Celodenní: ICS má end EXCLUSIVE -> obsazeno [start, end-1]
        const endExclusiveYMD = toYMDLocal(end);
        let cur = startYMD;
        while (cur < endExclusiveYMD) {
          blocked.push(cur);
          cur = nextDayYMD(cur);
        }
      } else {
        // Časové: označ všechny dny, kterých se událost dotýká (start..end inclusive)
        const endYMD = toYMDLocal(end);
        expandInclusive(startYMD, endYMD).forEach((d) => blocked.push(d));
      }
    });

    // Odduplikovat a seřadit
    const obsazene = Array.from(new Set(blocked)).sort();

    res.status(200).json({ obsazene });
  } catch (error) {
    console.error("Chyba při načítání kalendáře", error);
    res.status(500).json({ error: "Nepodařilo se načíst kalendář" });
  }
}
