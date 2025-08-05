import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
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

        {/* Desktop menu */}
        <nav className="hidden md:flex gap-4 text-base md:text-lg">
          <a href="#sluzby" className={navClasses}>Služby</a>
          <a href="#technika" className={navClasses}>Technika</a>
          <a href="#cenik" className={navClasses}>Ceník</a>
          <a href="#kontakt" className={navClasses}>Kontakt</a>
        </nav>

        {/* Mobile hamburger */}
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
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
  const [jmeno, setJmeno] = useState("");
  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [zprava, setZprava] = useState("");

  const [projJmeno, setProjJmeno] = useState("");
  const [adresa, setAdresa] = useState("");
  const [typPrace, setTypPrace] = useState("vykop");
  const [datumOd, setDatumOd] = useState("");
  const [datumDo, setDatumDo] = useState("");
  const [km, setKm] = useState(0);

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // zjistit km
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

  // odeslat objednávku
  const odeslat = async () => {
    if (!projJmeno || !adresa || !datumOd || !datumDo) {
      setMsg("Vyplňte prosím všechna pole.");
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
          datumOd,
          datumDo,
          km,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg("Objednávka byla úspěšně odeslána!");
      } else {
        setMsg("Chyba při odesílání objednávky.");
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
        <main className="bg-[#2f3237] text-white py-16">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 text-left mb-12 md:mb-0 relative z-20">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                ZEMNÍ A VÝKOPOVÉ PRÁCE
              </h2>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8">
                Provádíme{" "}
                <span className="text-[#f9c600] font-semibold">spolehlivé zemní a výkopové práce</span>{" "}
                minibagrem Hitachi v Praze a okolí.
              </p>
              <a href="#kontakt" className="inline-block bg-[#f9c600] text-[#2f3237] font-bold px-6 py-3 rounded-lg shadow hover:bg-yellow-400 transition">
                Nezávazná poptávka
              </a>
            </div>
            <div className="md:w-1/2 flex justify-center relative z-10">
              <Image src="/images/bagr-hero.png" alt="Bagr" width={700} height={500} className="object-contain -mb-24 md:-mb-32" />
            </div>
          </div>
        </main>

        {/* SLUŽBY */}
        {/* ... (tvoje původní sekce Služby, Technika, Ceník) ... */}

        {/* KONTAKT + POPTÁVKA */}
        <section id="kontakt" className="bg-[#2f3237] text-white px-6 py-12">
          <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center text-[#f9c600] drop-shadow">
            KONTAKT & POPTÁVKA
          </h3>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Kontaktni formulář */}
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

            {/* Rezervační formulář */}
            <div className="bg-white rounded-lg shadow-lg p-6 text-black">
              <h4 className="text-xl font-bold text-[#2f3237] mb-4">Rezervace termínu</h4>
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
                  className={`p-3 border rounded-lg ${typPrace==="vykop" ? "border-yellow-500 bg-yellow-50":"border-gray-300"}`}>
                  Výkopové práce ★
                </button>
                <button type="button" onClick={()=>setTypPrace("vykopZasyp")}
                  className={`p-3 border rounded-lg ${typPrace==="vykopZasyp" ? "border-yellow-500 bg-yellow-50":"border-gray-300"}`}>
                  Výkop + zásypové práce ★★
                </button>
                <button type="button" onClick={()=>setTypPrace("komplexni")}
                  className={`p-3 border rounded-lg ${typPrace==="komplexni" ? "border-yellow-500 bg-yellow-50":"border-gray-300"}`}>
                  Komplexní práce ★★★
                </button>
              </div>
              <Calendar selectRange={true}
                onChange={(range) => {
                  if (Array.isArray(range) && range.length === 2) {
                    setDatumOd(range[0].toISOString().split("T")[0]);
                    setDatumDo(range[1].toISOString().split("T")[0]);
                  }
                }}
                className="bg-white rounded-lg shadow-md p-2 mb-3"/>
              {datumOd && datumDo && (
                <p className="text-sm text-gray-600 mb-3">
                  Vybráno: {datumOd} – {datumDo}
                </p>
              )}
              <button type="button" onClick={odeslat} disabled={loading}
                className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition">
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
