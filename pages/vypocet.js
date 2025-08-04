import { useState } from "react";
import Link from "next/link";

export default function Vypocet() {
  const [jmeno, setJmeno] = useState("");
  const [datumOd, setDatumOd] = useState("");
  const [datumDo, setDatumDo] = useState("");
  const [hodiny, setHodiny] = useState(0);
  const [km, setKm] = useState(0);
  const [cena, setCena] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const spocitat = () => {
    if (!datumOd || !datumDo) {
      setMsg("Vyberte prosím datum od a do.");
      return;
    }

    const start = new Date(datumOd);
    const end = new Date(datumDo);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // včetně obou dní

    const cenaPrace = hodiny * 990 * diffDays;
    const cenaDopravy = km * 30;
    setCena(cenaPrace + cenaDopravy);
    setMsg(`Počet dní: ${diffDays}`);
  };

  const odeslat = async () => {
    if (!jmeno || !datumOd || !datumDo || cena === null) {
      setMsg("Vyplňte prosím všechna pole a nejdříve spočítejte cenu.");
      return;
    }
    setLoading(true);
    setMsg("");

    try {
      const res = await fetch("/api/objednavka", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jmeno, datumOd, datumDo, hodiny, km, cena }),
      });

      const data = await res.json();
      if (res.ok) {
        setMsg("Poptávka byla úspěšně odeslána!");
      } else {
        setMsg(data.error || "Chyba při odesílání poptávky.");
      }
    } catch (error) {
      console.error("Chyba:", error);
      setMsg("Nepodařilo se připojit k serveru.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">

        {/* odkaz zpět */}
        <Link href="/" className="text-sm text-blue-600 hover:underline block mb-4">
          ← Zpět na hlavní stránku
        </Link>

        <h2 className="text-2xl font-bold mb-6 text-center text-[#2f3237]">
          Kalkulace výkopových prací
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Název projektu</label>
            <input
              type="text"
              className="w-full border px-4 py-2 rounded"
              value={jmeno}
              onChange={(e) => setJmeno(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Datum od</label>
            <input
              type="date"
              className="w-full border px-4 py-2 rounded"
              value={datumOd}
              onChange={(e) => setDatumOd(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Datum do</label>
            <input
              type="date"
              className="w-full border px-4 py-2 rounded"
              value={datumDo}
              onChange={(e) => setDatumDo(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Počet hodin / den</label>
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
            onClick={spocitat}
            className="w-full bg-[#f9c600] text-[#2f3237] font-bold py-3 rounded hover:bg-yellow-400 transition"
          >
            Spočítat cenu
          </button>

          {cena !== null && (
            <div className="mt-4 text-center">
              <p className="text-lg font-semibold">
                Celková cena: {cena.toLocaleString()} Kč
              </p>
            </div>
          )}

          {cena !== null && (
            <button
              onClick={odeslat}
              disabled={loading}
              className="w-full mt-4 bg-green-600 text-white font-bold py-3 rounded hover:bg-green-700 transition"
            >
              {loading ? "Odesílám..." : "Odeslat poptávku"}
            </button>
          )}

          {msg && (
            <p className={`mt-4 text-center font-medium ${msg.includes("obsazený") ? "text-red-600" : "text-blue-600"}`}>
              {msg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
