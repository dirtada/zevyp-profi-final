"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function Vypocet() {
  const [step, setStep] = useState(1);
  const [jmeno, setJmeno] = useState("");
  const [datum, setDatum] = useState(null);
  const [hodiny, setHodiny] = useState(0);
  const [km, setKm] = useState(0);
  const [cena, setCena] = useState(null);
  const [obsazeneDny, setObsazeneDny] = useState([]);

  // načíst obsazené dny ze serveru
  useEffect(() => {
    async function fetchObsazene() {
      try {
        const res = await fetch("/api/kalendare");
        const data = await res.json();
        if (data.obsazene) {
          setObsazeneDny(data.obsazene.map(d => new Date(d)));
        }
      } catch (err) {
        console.error("Nepodařilo se načíst obsazené dny", err);
      }
    }
    fetchObsazene();
  }, []);

  const spocitat = () => {
    const cenaPrace = hodiny * 990;
    const cenaDopravy = km * 30;
    setCena(cenaPrace + cenaDopravy);
  };

  // Disable pokud je datum obsazené
  const disableTiles = ({ date }) => {
    return obsazeneDny.some(
      (d) =>
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
    );
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <Link href="/" className="text-sm text-blue-600 hover:underline block mb-4">
          ← Zpět na hlavní stránku
        </Link>

        <h2 className="text-2xl font-bold mb-6 text-center text-[#2f3237]">
          Kalkulace výkopových prací
        </h2>

        {/* Krok 1 */}
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

        {/* Krok 2 */}
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

        {/* Krok 3 */}
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

        {/* Krok 4 */}
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
