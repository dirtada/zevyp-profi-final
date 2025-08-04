"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import ical from "ical";

export default function Vypocet() {
  const [step, setStep] = useState(1);
  const [jmeno, setJmeno] = useState("");
  const [datum, setDatum] = useState(null);
  const [hodiny, setHodiny] = useState(0);
  const [km, setKm] = useState(0);
  const [cena, setCena] = useState(null);
  const [obsazeneDny, setObsazeneDny] = useState([]);

  // URL na veřejný iCal kalendář
  const ICAL_URL = "https://calendar.google.com/calendar/ical/TVUJ_KALENDAR/basic.ics";

  useEffect(() => {
    async function fetchCalendar() {
      try {
        const res = await fetch(ICAL_URL);
        const text = await res.text();
        const events = ical.parseICS(text);

        const dny = [];
        for (let k in events) {
          const ev = events[k];
          if (ev.start) {
            dny.push(new Date(ev.start));
          }
        }
        setObsazeneDny(dny);
      } catch (err) {
        console.error("Chyba při načítání kalendáře", err);
      }
    }
    fetchCalendar();
  }, []);

  const spocitat = () => {
    const cenaPrace = hodiny * 990;
    const cenaDopravy = km * 30;
    setCena(cenaPrace + cenaDopravy);
  };

  // disable pokud datum je v obsazených dnech
  const disableTiles = ({ date }) => {
    return obsazeneDny.some(
      (d) =>
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <Link href="/" className="text-sm text-blue-600 hover:underline block mb-4">
          ← Zpět na hlavní stránku
        </Link>

        <h2 className="text-2xl font-bold mb-6 text-center text-[#2f3237]">
          Kalkulace výkopových prací
        </h2>

        {step === 1 && (
          <div className="space-y-4">
            <label className="block font-semibold mb-1">Jméno projektu</label>
            <input
              type="text"
              className="w-full border px-4 py-2 rounded"
              value={jmeno}
              onChange={(e) => setJmeno(e.target.value)}
            />
            <button
              onClick={() => setStep(2)}
              disabled={!jmeno}
              className="w-full bg-[#f9c600] text-[#2f3237] font-bold py-3 rounded hover:bg-yellow-400 transition"
            >
              Pokračovat
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="font-semibold">Vyberte datum (volné dny)</p>
            <Calendar onChange={setDatum} value={datum} tileDisabled={disableTiles} />
            <button
              onClick={() => setStep(3)}
              disabled={!datum}
              className="w-full bg-[#f9c600] text-[#2f3237] font-bold py-3 rounded hover:bg-yellow-400 transition"
            >
              Pokračovat
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Počet hodin</label>
              <input
                type="number"
                className="w-full border px-4 py-2 rounded"
                value={hodiny}
                onChange={(e) => setHodiny(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Kilometry dopravy</label>
              <input
                type="number"
                className="w-full border px-4 py-2 rounded"
                value={km}
                onChange={(e) => setKm(Number(e.target.value))}
              />
            </div>
            <button
              onClick={() => { spocitat(); setStep(4); }}
              className="w-full bg-[#f9c600] text-[#2f3237] font-bold py-3 rounded hover:bg-yellow-400 transition"
            >
              Spočítat cenu
            </button>
          </div>
        )}

        {step === 4 && cena !== null && (
          <div className="text-center space-y-4">
            <p className="text-lg font-semibold">Projekt: {jmeno}</p>
            <p className="text-lg">Datum: {datum.toLocaleDateString()}</p>
            <p className="text-xl font-bold">Celková cena: {cena.toLocaleString()} Kč</p>
            <button
              onClick={() => setStep(1)}
              className="w-full bg-gray-300 text-[#2f3237] font-bold py-3 rounded hover:bg-gray-400 transition"
            >
              Nový výpočet
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
