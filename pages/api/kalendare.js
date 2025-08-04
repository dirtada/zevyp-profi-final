// pages/api/kalendare.js
import ICAL from "ical.js";

export default async function handler(req, res) {
  const ICAL_URL = "https://calendar.google.com/calendar/ical/kontaktzevyp%40gmail.com/public/basic.ics";

  try {
    const response = await fetch(ICAL_URL);
    if (!response.ok) {
      throw new Error("Nepodařilo se stáhnout kalendář");
    }

    const text = await response.text();
    const jcalData = ICAL.parse(text);
    const comp = new ICAL.Component(jcalData);
    const vevents = comp.getAllSubcomponents("vevent");

    const dny = [];

    vevents.forEach((event) => {
      const e = new ICAL.Event(event);

      // začátek a konec
      const start = e.startDate.toJSDate();
      const end = e.endDate.toJSDate();

      // znormalizovat na půlnoc
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      // přidáme všechny dny v intervalu
      const current = new Date(start);
      while (current <= end) {
        dny.push(new Date(current).toISOString());
        current.setDate(current.getDate() + 1);
      }
    });

    res.status(200).json({ obsazene: [...new Set(dny)] });
  } catch (error) {
    console.error("Chyba při načítání kalendáře", error);
    res.status(500).json({ error: "Nepodařilo se načíst kalendář" });
  }
}
