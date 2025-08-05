import { useState, useEffect } from "react";
import Link from "next/link";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Hammer, Truck, Layers } from "lucide-react";

export default function Home() {
  const [jmeno, setJmeno] = useState("");
  const [adresa, setAdresa] = useState("");
  const [typPrace, setTypPrace] = useState("vykop");
  const [datumOd, setDatumOd] = useState("");
  const [datumDo, setDatumDo] = useState("");
  const [km, setKm] = useState(0);
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

  // zjistit vzdálenost
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

  // odeslat objednávku
  const odeslat = async () => {
    if (!jmeno || !adresa || !datumOd || !datumDo) {
      setMsg("Vyplňte prosím všechna pole.");
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
          datumOd,
          datumDo,
          km,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg("Objednávka byla úspěšně odeslána!");
      } else {
        setMsg(data.error || "Chyba při odesílání objednávky.");
      }
    } catch (error) {
      console.error(error);
      setMsg("Nepodařilo se připojit k serveru.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Kontaktní formulář */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-[#2f3237]">
            Kontaktujte nás
          </h2>
          {/* Tvůj původní kontaktní formulář sem */}
        </div>

        {/* Nový objednávkový formulář */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-[#2f3237]">
            Poptávka prací
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

            {/* Typ práce */}
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

            {/* Odeslat */}
            <button
              onClick={odeslat}
              disabled={loading}
              className="w-full bg-green-600 text-white font-bold py-3 rounded hover:bg-green-700 transition"
            >
              {loading ? "Odesílám..." : "Odeslat objednávku"}
            </button>

            {msg && <p className="mt-4 text-center font-medium text-blue-600">{msg}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
