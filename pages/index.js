import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  ScaleIcon,
  Cog6ToothIcon,
  ArrowsUpDownIcon,
  WrenchScrewdriverIcon,
  BuildingOffice2Icon,
  TruckIcon,
  SquaresPlusIcon,
} from "@heroicons/react/24/outline";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Hammer, Truck, Layers } from "lucide-react";

function Header() {
  const [open, setOpen] = useState(false);
  const navClasses =
    "px-4 py-2 rounded-lg font-semibold uppercase tracking-wide transition hover:bg-[#2f3237] hover:text-white";

  return (
    <header className="bg-[#f9c600] text-black py-4 px-4 shadow-md relative z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo_update.png"
            alt="Zevyp logo"
            width={150}
            height={150}
            className="h-12 w-auto"
          />
        </div>
        <nav className="hidden md:flex gap-4 text-base md:text-lg">
          <a href="#sluzby" className={navClasses}>Služby</a>
          <a href="#technika" className={navClasses}>Technika</a>
          <a href="#cenik" className={navClasses}>Ceník</a>
          <a href="#kontakt" className={navClasses}>Kontakt</a>
        </nav>
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <XMarkIcon className="w-8 h-8" /> : <Bars3Icon className="w-8 h-8" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-[#f9c600] py-4 px-6 flex flex-col gap-3 shadow-lg">
          <a href="#sluzby" className={navClasses} onClick={() => setOpen(false)}>Služby</a>
          <a href="#technika" className={navClasses} onClick={() => setOpen(false)}>Technika</a>
          <a href="#cenik" className={navClasses} onClick={() => setOpen(false)}>Ceník</a>
          <a href="#kontakt" className={navClasses} onClick={() => setOpen(false)}>Kontakt</a>
        </div>
      )}
    </header>
  );
}

export default function Home() {
  // kontaktni form
  const [jmeno, setJmeno] = useState("");
  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [zprava, setZprava] = useState("");

  // kalkulacka
  const [projJmeno, setProjJmeno] = useState("");
  const [adresa, setAdresa] = useState("");
  const [typPrace, setTypPrace] = useState("vykop");
  const [manualniPracovnici, setManualniPracovnici] = useState(0);
  const [datumOd, setDatumOd] = useState("");
  const [datumDo, setDatumDo] = useState("");
  const [km, setKm] = useState(0);
  const [hodiny, setHodiny] = useState(0);
  const [cena, setCena] = useState(null);
  const [obsazene, setObsazene] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const nactiObsazene = async () => {
      try {
        const res = await fetch("/api/obsazene");
        const data = await res.json();
        setObsazene(data.obsazene || []);
      } catch (error) {
        console.error(error);
      }
    };
    nactiObsazene();
  }, []);

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
        setMsg("Nepodařilo se zjistit vzdálenost.");
      }
    } catch (error) {
      console.error(error);
      setMsg("Chyba při zjišťování vzdálenosti.");
    }
  };

  const spocitat = () => {
    if (!datumOd || !datumDo || !adresa || km === 0) {
      setMsg("Vyplňte prosím všechna pole.");
      return;
    }
    const start = new Date(datumOd);
    const end = new Date(datumDo);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const vypocetHodiny = diffDays * 8;
    setHodiny(vypocetHodiny);

    const cenaBagr = vypocetHodiny * 900;
    const cenaNakladni =
      typPrace === "vykopZasyp" || typPrace === "komplexni" ? vypocetHodiny * 850 : 0;
    const cenaPracovnici =
      typPrace === "komplexni" ? vypocetHodiny * manualniPracovnici * 300 : 0;

    let cenaCelkem = 0;
    if (typPrace === "vykop") cenaCelkem = cenaBagr + km * 8;
    if (typPrace === "vykopZasyp") cenaCelkem = cenaBagr + cenaNakladni + km * 16;
    if (typPrace === "komplexni") cenaCelkem = cenaBagr + cenaNakladni + cenaPracovnici + km * 16;

    setCena(cenaCelkem);
    setMsg(`Počet dní: ${diffDays}, hodin celkem: ${vypocetHodiny}`);
  };

  const odeslat = async () => {
    if (!projJmeno || !datumOd || !datumDo || cena === null) {
      setMsg("Vyplňte prosím všechna pole a spočítejte cenu.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/objednavka", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jmeno: projJmeno,
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
    <>
      <Head>
        <title>Zemní a výkopové práce – Zevyp.cz</title>
        <meta name="description" content="Výkopové a zemní práce minibagrem Hitachi – Praha a okolí." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <div className="min-h-screen bg-[#f9c600] font-sans text-gray-900">
        {/* Hero */}
        {/* ... tvoje hero, služby, technika, ceník ... */}

        {/* Kontakt + Poptávka */}
        <section id="kontakt" className="bg-[#2f3237] text-white px-6 py-12">
          <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center text-[#f9c600] drop-shadow">
            KONTAKT & POPTÁVKA
          </h3>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Kontakt */}
            <form className="bg-white rounded-lg shadow-lg p-6 space-y-5 text-black">
              <h4 className="text-xl font-bold text-[#2f3237] mb-4">Kontaktujte nás</h4>
              <input type="text" value={jmeno} onChange={(e)=>setJmeno(e.target.value)} placeholder="Vaše jméno"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"/>
              <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="vas@email.cz"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"/>
              <input type="tel" value={telefon} onChange={(e)=>setTelefon(e.target.value)} placeholder="+420 ..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"/>
              <textarea rows="4" value={zprava} onChange={(e)=>setZprava(e.target.value)} placeholder="Sem napište svou poptávku..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"/>
              <button type="submit"
                className="w-full bg-[#f9c600] text-[#2f3237] font-bold py-3 rounded-lg shadow hover:bg-yellow-400 transition">
                ODESLAT POPTÁVKU
              </button>
            </form>

            {/* Kalkulace */}
            <div className="bg-white rounded-lg shadow-lg p-6 text-black">
              <h4 className="text-xl font-bold text-[#2f3237] mb-4">Výpočet & Rezervace</h4>
              <input type="text" value={projJmeno} onChange={(e)=>setProjJmeno(e.target.value)} placeholder="Název projektu"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-3"/>
              <div className="flex space-x-2 mb-3">
                <input type="text" value={adresa} onChange={(e)=>setAdresa(e.target.value)} placeholder="Adresa zakázky"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"/>
                <button type="button" onClick={spocitatVzdalenost}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  Zjistit km
                </button>
              </div>
              {km > 0 && <p className="text-sm text-gray-600 mb-3">Vzdálenost: {km} km</p>}
              <div className="grid gap-3 mb-3">
                <button type="button" onClick={()=>setTypPrace("vykop")}
                  className={`flex items-center justify-between p-3 border rounded-lg ${typPrace==="vykop"?"border-yellow-500 bg-yellow-50":"border-gray-300"}`}>
                  <Hammer className="w-5 h-5 mr-2 text-yellow-600"/> Výkopové práce ★
                </button>
                <button type="button" onClick={()=>setTypPrace("vykopZasyp")}
                  className={`flex items-center justify-between p-3 border rounded-lg ${typPrace==="vykopZasyp"?"border-yellow-500 bg-yellow-50":"border-gray-300"}`}>
                  <Truck className="w-5 h-5 mr-2 text-yellow-600"/> Výkop + zásypové práce ★★
                </button>
                <button type="button" onClick={()=>setTypPrace("komplexni")}
                  className={`flex items-center justify-between p-3 border rounded-lg ${typPrace==="komplexni"?"border-yellow-500 bg-yellow-50":"border-gray-300"}`}>
                  <Layers className="w-5 h-5 mr-2 text-yellow-600"/> Komplexní práce ★★★
                </button>
              </div>
              {typPrace === "komplexni" && (
                <input type="number" min="0" value={manualniPracovnici}
                  onChange={(e)=>setManualniPracovnici(Number(e.target.value))}
                  placeholder="Počet manuálních pracovníků"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-3"/>
              )}
              <Calendar selectRange={true}
                tileDisabled={({ date }) =>
                  obsazene.includes(date.toISOString().split("T")[0])
                }
                onChange={(range) => {
                  if (Array.isArray(range) && range.length === 2) {
                    setDatumOd(range[0].toISOString().split("T")[0]);
                    setDatumDo(range[1].toISOString().split("T")[0]);
                  }
                }}
                className="bg-white rounded-lg shadow-md p-2 mb-3"/>
              {datumOd && datumDo && <p className="text-sm text-gray-600 mb-3">Vybráno: {datumOd} – {datumDo}</p>}
              <button type="button" onClick={spocitat}
                className="w-full bg-yellow-500 text-[#2f3237] font-bold py-3 rounded-lg hover:bg-yellow-600 transition mb-3">
                Spočítat cenu
              </button>
              {cena !== null && (
                <div className="text-center border-t pt-3">
                  <p className="text-lg font-bold">Celková cena: {cena.toLocaleString()} Kč</p>
                  <p className="text-sm text-gray-600">Hodin celkem: {hodiny}</p>
                  <p className="mt-2 text-xs text-red-600">Kalkulace je orientační.</p>
                </div>
              )}
              <button type="button" onClick={odeslat} disabled={loading}
                className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition mt-3">
                {loading ? "Odesílám..." : "ODESLAT OBJEDNÁVKU"}
              </button>
              {msg && <p className="text-center text-sm mt-2 text-blue-600">{msg}</p>}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#2f3237] text-white text-center py-4 text-sm">
          Zemní a Výkopové Práce • IČO:73377619 • info@zevyp.cz • Habartov,
          Horní Částkov ev. č. 2, 357 09
        </footer>
      </div>
    </>
  );
}
