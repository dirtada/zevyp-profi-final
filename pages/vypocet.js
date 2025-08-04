import { useState, useEffect } from "react";
import Link from "next/link";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function Vypocet() {
  const [jmeno, setJmeno] = useState("");
  const [datumOd, setDatumOd] = useState("");
  const [datumDo, setDatumDo] = useState("");
  const [km, setKm] = useState(0);
  const [hodiny, setHodiny] = useState(0);
  const [cena, setCena] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [obsazene, setObsazene] = useState([]);

  // Načteme obsazené termíny z API
  useEffect(() => {
    const nactiObsazene = async () => {
      try {
        const res = await fetch("/api/obsazene");
        const data = await res.json();
        setObsazene(data.obsazene || []);
      } catch (error) {
        console.error("Chyba při načítání obsazených termínů:", error);
      }
    };
    nactiObsazene();
  }, []);

  const spocitat = () => {
    if (!datumOd || !datumDo) {
      setMsg("Vyberte prosím rozsah dní.");
      return;
    }

    const start = new Date(datumOd);
    const end = new Date(datumDo);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const vypocetHodiny = diffDays * 8;
    setHodiny(vypocetHodiny);

    const cenaPrace = vypocetHodiny * 990;
    const cenaDopravy = km * 30;
    setCena(cenaPrace + cenaDopravy);

    setMsg(`Počet dní: ${diffDays} (${vypocetHodiny} hodin)`);
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

        <Link href="/" className="text-sm text-blue-600 hover:underline block mb-4">
          ← Zpět na hlavní stránku
        </Link>

        <h2 className="text-2xl font-bold mb-6 text-center text-[#2f3237]">
          Kalkulace výkopových prací
        </h2>

        <div className="space-y-4">

          {/* Název projektu */}
          <div>
            <label className="block font-semibold mb-1">Název projektu</label>
            <input
              type="text"
              className="w-full border px-4 py-2 rounded"
              value={jmeno}
              onChange={(e) => setJmeno(e.target.value)}
            />
          </div>

          {/* Kalendář pro výběr rozsahu */}
          <div>
            <label className="block font-semibold mb-2">Vyberte rozsah dní</label>
            <Calendar
              selectRange={true}
              tileDisabled={({ date }) =>
                obsazene.includes(date.toISOString().split("T")[0])
              }
              onChange={(range) => {
                if (Array.isArray(range) && range.length === 2) {
                  setDatumOd(range[0].toISOString().split("T")[0]);
                  setDatumDo(range[1].toISOString().split("T")[0]);
                }
              }}
            />
          </div>

          {/* Kilometry */}
          <div>
            <label className="block font-semibold mb-1">Kilometry dopravy</label>
            <input
              type="number"
              className="w-full border px-4 py-2 rounded"
              value={km}
              onChange={(e) => setKm(Number(e.target.value))}
            />
          </div>

          {/* Tlačítko na výpočet ceny */}
          <button
            onClick={spocitat}
            className="w-full bg-[#f9c600] text-[#2f3237] font-bold py-3 rounded hover:bg-yellow-400 transition"
          >
            Spočítat cenu
          </button>

          {/* Výsledek kalkulace */}
          {cena !== null && (
            <div className="mt-4 text-center">
              <p className="text-lg font-semibold">
                Celková cena: {cena.toLocaleString()} Kč
              </p>
              <p className="text-sm text-gray-600">
                Hodin celkem: {hodiny}
              </p>
            </div>
          )}

          {/* Tlačítko na odeslání poptávky */}
          {cena !== null && (
            <button
              onClick={odeslat}
              disabled={loading}
              className="w-full mt-4 bg-green-600 text-white font-bold py-3 rounded hover:bg-green-700 transition"
            >
              {loading ? "Odesílám..." : "Odeslat poptávku"}
            </button>
          )}

          {/* Zpráva pro uživatele */}
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
