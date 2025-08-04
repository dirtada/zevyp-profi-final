// pages/api/kalendare.js
import ICAL from "ical.js";

export default async function handler(req, res) {
  const ICAL_URL = "https://calendar.google.com/calendar/ical/7c2d9da97fecf66a4d05ccd44338c31b266f02c8f9f7214ca153da25adbf4772%40group.calendar.google.com/public/basic.ics"; 
  // 👉 nahraď vlastním veřejným iCal odkazem z Google Kalendáře

  try {
    const response = await fetch(ICAL_URL);
    if (!response.ok) {
      throw new Error("Nepodařilo se stáhnout kalendář");
    }

    const text = await response.text();
    const jcalData = ICAL.parse(text);
    const comp = new ICAL.Component(jcalData);
    const vevents = comp.getAllSubcomponents("vevent");

    const dny = vevents.map((event) => {
      const e = new ICAL.Event(event);
      const startDate = e.startDate.toJSDate();
      startDate.setHours(0, 0, 0, 0);
      return startDate.toISOString();
    });

    res.status(200).json({ obsazene: dny });
  } catch (error) {
    console.error("Chyba při načítání kalendáře", error);
    res.status(500).json({ error: "Nepodařilo se načíst kalendář" });
  }
}
