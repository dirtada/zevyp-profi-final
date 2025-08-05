import { useState } from "react";
import Link from "next/link";
{/* */}
export default function VypocetObjem() {
  const [jmeno, setJmeno] = useState("");
  const [typPrace, setTypPrace] = useState("vykop");
  const [objem, setObjem] = useState("");
  const [typZeminy, setTypZeminy] = useState("lehka");
  const [startDatum, setStartDatum] = useState("");
  const [hodiny, setHodiny] = useState(0);
  const [dny, setDny] = useState(0);
  const [cena, setCena] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // výkon bagru podle zeminy
  const produktivita = typZeminy === "lehka" ? 15 : typZeminy === "stredni" ? 12 : 8;

  const spocitat = () => {
    if (!objem || !startDatum) {
      setMsg("Zadejte objem a počáteční datum.");
      return;
    }
    const obj = parseFloat(objem);
    const hod = obj / produktivita;
    const dni = Math.ceil(hod / 8);
    setHodiny(Math.ceil(hod));
    setDny(dni);

    // Cena – pro jednoduchost použijeme podobnou logiku jako u klasického výpočtu
    let cenaCelkem = 0;
    const cenaBagr = hod * 900;
    const cenaNakladni = typPrace !== "vykop" ? hod * 850 : 0;
    const cenaPracovnici = typPrace === "komplexni" ? hod * 300 * 2 : 0; // příklad: 2 pracovníci default

    cenaCelkem = cenaBagr + cenaNakladni + cenaPracovnici;
    setCena(Math.round(cenaCelkem));

    setMsg("");
  };

  const odeslat = async () => {
    if (!jmeno || !startDatum || cena === null) {
      setMsg("Vyplňte všechna pole a nejdříve spočítejte cenu.");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("/api/objem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jmeno,
          typPrace,
          objem,
          typZeminy,
          startDatum,
          hodiny,
          dny,
          cena,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg("Poptávka byla odeslána. V kalendáři je návrh.");
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
          Kalkulace podle objemu (m³)
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

          {/* Typ práce */}
          <div>
            <label className="block font-semibold mb-1">Typ práce</label>
            <select
              className="w-full border px-4 py-2 rounded"
              value={typPrace}
              onChange={(e) => setTypPrace(e.target.value)}
            >
              <option value="vykop">Výkopové práce</option>
              <option value="vykopZasyp">Výkop + zásyp</option>
              <option value="komplexni">Komplexní práce</option>
            </select>
          </div>

          {/* Objem */}
          <div>
            <label className="block font-semibold mb-1">Objem zeminy (m³)</label>
            <input
              type="number"
              className="w-full border px-4 py-2 rounded"
              value={objem}
              onChange={(e) => setObjem(e.target.value)}
            />
          </div>

          {/* Typ zeminy */}
          <div>
            <label className="block font-semibold mb-1">Typ zeminy</label>
            <select
              className="w-full border px-4 py-2 rounded"
              value={typZeminy}
              onChange={(e) => setTypZeminy(e.target.value)}
            >
              <option value="lehka">Lehká (písek, suť) – 15 m³/h</option>
              <option value="stredni">Střední (hlína) – 12 m³/h</option>
              <option value="tezka">Těžká (jílovitá, kamenitá) – 8 m³/h</option>
            </select>
          </div>

          {/* Datum zahájení */}
          <div>
            <label className="block font-semibold mb-1">Datum zahájení</label>
            <input
              type="date"
              className="w-full border px-4 py-2 rounded"
              value={startDatum}
              onChange={(e) => setStartDatum(e.target.value)}
            />
          </div>

          {/* Výpočet */}
          <button
            onClick={spocitat}
            className="w-full bg-yellow-500 text-[#2f3237] font-bold py-3 rounded hover:bg-yellow-600 transition"
          >
            Spočítat
          </button>

          {cena !== null && (
            <div className="mt-4 text-center border-t pt-4">
              <h3 className="text-lg font-bold mb-2">Souhrn kalkulace</h3>
              <p>Objem: {objem} m³</p>
              <p>Produktivita: {produktivita} m³/h</p>
              <p>Celkem hodin: {hodiny}</p>
              <p>Odhad dní: {dny}</p>
              <p className="text-lg font-semibold mt-3">
                Celková cena: {cena.toLocaleString()} Kč
              </p>
              <p className="mt-2 text-xs text-red-600 font-medium">
                Kalkulace je orientační a může se lišit dle podmínek.
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
            <p className="mt-4 text-center font-medium text-blue-600">{msg}</p>
          )}
        </div>
      </div>
    </div>
  );
}
