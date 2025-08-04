import { useState, useEffect } from "react";
import Link from "next/link";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Hammer, Truck, Layers } from "lucide-react";

export default function Vypocet() {
  const [jmeno, setJmeno] = useState("");
  const [adresa, setAdresa] = useState("");
  const [typPrace, setTypPrace] = useState("vykop");
  const [manualniPracovnici, setManualniPracovnici] = useState(0);
  const [datumOd, setDatumOd] = useState("");
  const [datumDo, setDatumDo] = useState("");
  const [km, setKm] = useState(0);
  const [hodiny, setHodiny] = useState(0);
  const [cena, setCena] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [obsazene, setObsazene] = useState([]);

  // načteme obsazené termíny z API
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

  // spočítá km přes Google API
  const spocitatVzdalenost = async () => {
    try {
      const res = await fetch("/api/vzdalenost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adresa }),
      });
      const data = await res.json();
      if (res.ok) {
        setKm(data.km);
      } else {
        setMsg(data.error || "Nepodařilo se zjistit vzdálenost.");
      }
    } catch (error) {
      console.error(error);
      setMsg("Chyba při komunikaci se serverem.");
    }
  };

  // spočítá cenu
  const spocitat = () => {
    if (!datumOd || !datumDo) {
      setMsg("Vyberte prosím rozsah dní.");
      return;
    }
    if (!adresa || km === 0) {
      setMsg("Zadejte prosím adresu a zjistěte vzdálenost.");
      return;
    }

    const start = new Date(datumOd);
    const end = new Date(datumDo);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const vypocetHodiny = diffDays * 8;
    setHodiny(vypocetHodiny);

    let cenaCelkem = 0;

    // základní sazby
    const cenaBagr = vypocetHodiny * 900;
    const cenaNakladni = vypocetHodiny * 850;
    const cenaPracovnici = vypocetHodiny * manualniPracovnici * 300;

    // výpočty podle varianty
    if (typPrace === "vykop") {
      cenaCelkem = cenaBagr + km * 8;
    } else if (typPrace === "vykopZasyp") {
      cenaCelkem = cenaBagr + cenaNakladni + km * 16;
    } else if (typPrace === "komplexni") {
      cenaCelkem = cenaBagr + cenaNakladni + cenaPracovnici + km * 16;
    }

    setCena(cenaCelkem);
    setMsg(`Počet dní: ${diffDays}, hodin celkem: ${vypocetHodiny}`);
  };

  const odeslat = async () => {
    if (!jmeno || !datumOd || !datumDo || cena === null) {
      setMsg("Vyplňte prosím všechna pole a nejdříve spočítejte cenu.");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("/api/objednavka", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jmeno, adresa, datumOd, datumDo, hodiny, km, cena }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg("Poptávka byla úspěšně odeslána!");
      } else {
        setMsg(data.error || "Chyba při odesílání poptávky.");
      }
    } catch (error) {
      console.error(error);
      setMsg("Nepodařilo se připojit k serveru.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
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

          {/* Adresa */}
          <div>
            <label className="block font-semibold mb-1">Adresa zakázky</label>
            <div className="flex space-x-2">
              <input
                type="text"
                className="flex-1 border px-4 py-2 rounded"
                value={adresa}
                onChange={(e) => setAdresa(e.target.value)}
              />
              <button
                onClick={spocitatVzdalenost}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Zjistit km
              </button>
            </div>
            {km > 0 && <p className="text-sm text-gray-600 mt-1">Vzdálenost: {km} km</p>}
          </div>

          {/* Výběr typu práce */}
          <div>
            <label className="block font-semibold mb-2">Typ prací</label>
            <div className="grid gap-3">
              <button
                onClick={() => setTypPrace("vykop")}
                className={`flex items-center p-3 border rounded hover:shadow ${
                  typPrace === "vykop" ? "border-yellow-500 bg-yellow-50" : ""
                }`}
              >
                <Hammer className="w-6 h-6 mr-2 text-yellow-600" />
                Výkopové práce (900 Kč/h) – obtížnost ★
              </button>
              <button
                onClick={() => setTypPrace("vykopZasyp")}
                className={`flex items-center p-3 border rounded hover:shadow ${
                  typPrace === "vykopZasyp" ? "border-yellow-500 bg-yellow-50" : ""
                }`}
              >
                <Truck className="w-6 h-6 mr-2 text-yellow-600" />
                Výkop + zásyp (900 + 850 Kč/h) – obtížnost ★★
              </button>
              <button
                onClick={() => setTypPrace("komplexni")}
                className={`flex items-center p-3 border rounded hover:shadow ${
                  typPrace === "komplexni" ? "border-yellow-500 bg-yellow-50" : ""
                }`}
              >
                <Layers className="w-6 h-6 mr-2 text-yellow-600" />
                Komplexní práce (bagr + vůz + pracovníci) – obtížnost ★★★
              </button>
            </div>
          </div>

          {/* Počet pracovníků (jen u komplexních prací) */}
          {typPrace === "komplexni" && (
            <div>
              <label className="block font-semibold mb-1">Počet manuálních pracovníků</label>
              <input
                type="number"
                className="w-full border px-4 py-2 rounded"
                value={manualniPracovnici}
                min="0"
                onChange={(e) => setManualniPracovnici(Number(e.target.value))}
              />
            </div>
          )}

          {/* Kalendář */}
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

          {/* Výpočet ceny */}
          <button
            onClick={spocitat}
            className="w-full bg-yellow-500 text-[#2f3237] font-bold py-3 rounded hover:bg-yellow-600 transition"
          >
            Spočítat cenu
          </button>

          {cena !== null && (
            <div className="mt-4 text-center">
              <p className="text-lg font-semibold">Celková cena: {cena.toLocaleString()} Kč</p>
              <p className="text-sm text-gray-600">Hodin celkem: {hodiny}</p>
            </div>
          )}

          {/* Odeslat poptávku */}
          {cena !== null && (
            <button
              onClick={odeslat}
              disabled={loading}
              className="w-full mt-4 bg-green-600 text-white font-bold py-3 rounded hover:bg-green-700 transition"
            >
              {loading ? "Odesílám..." : "Odeslat poptávku"}
            </button>
          )}

          {msg && <p className="mt-4 text-center font-medium text-blue-600">{msg}</p>}
        </div>
      </div>
    </div>
  );
}
