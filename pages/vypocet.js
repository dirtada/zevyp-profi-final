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

  // načtení obsazených dnů
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

  // spočítat km
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
        setMsg(`Vzdálenost je ${data.km} km.`);
      } else {
        setMsg(data.error || "Nepodařilo se zjistit vzdálenost.");
      }
    } catch (error) {
      console.error(error);
      setMsg("Chyba při komunikaci se serverem.");
    }
  };

  // spočítat cenu
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
    const cenaBagr = vypocetHodiny * 900;
    const cenaNakladni = vypocetHodiny * 850;
    const cenaPracovnici = vypocetHodiny * manualniPracovnici * 300;

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

  // odeslat poptávku
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
        body: JSON.stringify({
          jmeno,
          adresa,
          typPrace,
          manualniPracovnici,
          datumOd,
          datumDo,
          hodiny,
          km,
          cena,
        }),
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
            <label className="block font-semibold mb-2">Vyberte typ prací</label>
            <div className="grid gap-3">
              <button
                onClick={() => setTypPrace("vykop")}
                className={`flex items-center justify-between p-4 border rounded-lg hover:shadow transition ${
                  typPrace === "vykop" ? "border-yellow-500 bg-yellow-50" : "border-gray-300"
                }`}
              >
                <div className="flex items-center">
                  <Hammer className="w-6 h-6 mr-2 text-yellow-600" />
                  <span className="font-semibold">Výkopové práce</span>
                </div>
                <span className="text-sm text-gray-600">Obtížnost ★</span>
              </button>

              <button
                onClick={() => setTypPrace("vykopZasyp")}
                className={`flex items-center justify-between p-4 border rounded-lg hover:shadow transition ${
                  typPrace === "vykopZasyp" ? "border-yellow-500 bg-yellow-50" : "border-gray-300"
                }`}
              >
                <div className="flex items-center">
                  <Truck className="w-6 h-6 mr-2 text-yellow-600" />
                  <span className="font-semibold">Výkop + zásypové práce</span>
                </div>
                <span className="text-sm text-gray-600">Obtížnost ★★</span>
              </button>

              <button
                onClick={() => setTypPrace("komplexni")}
                className={`flex items-center justify-between p-4 border rounded-lg hover:shadow transition ${
                  typPrace === "komplexni" ? "border-yellow-500 bg-yellow-50" : "border-gray-300"
                }`}
              >
                <div className="flex items-center">
                  <Layers className="w-6 h-6 mr-2 text-yellow-600" />
                  <span className="font-semibold">Komplexní práce</span>
                </div>
                <span className="text-sm text-gray-600">Obtížnost ★★★</span>
              </button>
            </div>
          </div>

          {/* Počet pracovníků u komplexních prací */}
          {typPrace === "komplexni" && (
            <div>
              <label className="block font-semibold mb-1">Počet manuálních pracovníků</label>
              <input
                type="number"
                min="0"
                className="w-full border px-4 py-2 rounded"
                value={manualniPracovnici}
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

          {/* Spočítat cenu */}
          <button
            onClick={spocitat}
            className="w-full bg-yellow-500 text-[#2f3237] font-bold py-3 rounded hover:bg-yellow-600 transition"
          >
            Spočítat cenu
          </button>

          {cena !== null && (
            <div className="mt-4 text-center border-t pt-4">
              <h3 className="text-lg font-bold mb-2">Souhrn kalkulace</h3>

              <div className="space-y-1 text-sm text-gray-700">
                <p>
                  <strong>Cena za operaci strojů:</strong>{" "}
                  {(() => {
                    const cenaBagr = hodiny * 900;
                    const cenaNakladni =
                      typPrace === "vykopZasyp" || typPrace === "komplexni"
                        ? hodiny * 850
                        : 0;
                    const cenaPracovnici =
                      typPrace === "komplexni"
                        ? hodiny * manualniPracovnici * 300
                        : 0;
                    return (cenaBagr + cenaNakladni + cenaPracovnici).toLocaleString();
                  })()} Kč
                </p>

                <p>
                  <strong>Cena za dopravu:</strong>{" "}
                  {(() => {
                    let doprava = 0;
                    if (typPrace === "vykop") doprava = km * 8;
                    if (typPrace === "vykopZasyp") doprava = km * 16;
                    if (typPrace === "komplexni") doprava = km * 16;
                    return doprava.toLocaleString();
                  })()} Kč
                </p>
              </div>

              <p className="text-lg font-semibold mt-3">
                Celková cena: {cena.toLocaleString()} Kč
              </p>
              <p className="text-sm text-gray-600">Hodin celkem: {hodiny}</p>
              <p className="mt-2 text-xs text-red-600 font-medium">
                Upozornění: Kalkulace je pouze orientační. Konečná cena se může lišit dle specifických požadavků.
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
