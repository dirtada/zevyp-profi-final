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

  return (
    <header className="bg-[#f9c600] text-black py-4 px-4 shadow-md relative z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Image
          src="/images/logo_update.png"
          alt="Zevyp logo"
          width={150}
          height={150}
          className="h-12 w-auto"
        />

        {/* Desktop menu */}
        <nav className="hidden md:flex gap-6 text-base md:text-lg">
          <a href="#sluzby" className="hover:underline">NAŠE SLUŽBY</a>
          <a href="#technika" className="hover:underline">TECHNIKA</a>
          <a href="#cenik" className="hover:underline">CENÍK</a>
          <a href="#kontakt" className="hover:underline">KONTAKT</a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <XMarkIcon className="w-8 h-8" /> : <Bars3Icon className="w-8 h-8" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden bg-[#f9c600] py-4 px-6 flex flex-col gap-4 shadow-lg">
          <a href="#sluzby" onClick={() => setOpen(false)}>NAŠE SLUŽBY</a>
          <a href="#technika" onClick={() => setOpen(false)}>TECHNIKA</a>
          <a href="#cenik" onClick={() => setOpen(false)}>CENÍK</a>
          <a href="#kontakt" onClick={() => setOpen(false)}>KONTAKT</a>
        </div>
      )}
    </header>
  );
}

export default function Home() {
  const [jmeno, setJmeno] = useState("");
  const [adresa, setAdresa] = useState("");
  const [typPrace, setTypPrace] = useState("vykop");
  const [datumOd, setDatumOd] = useState("");
  const [datumDo, setDatumDo] = useState("");
  const [obsazene, setObsazene] = useState([]);
  const [msg, setMsg] = useState("");

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

  const odeslat = async () => {
    if (!jmeno || !adresa || !datumOd || !datumDo) {
      setMsg("Vyplňte prosím všechna pole.");
      return;
    }
    try {
      const res = await fetch("/api/objednavka", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jmeno, adresa, typPrace, datumOd, datumDo }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg("Poptávka byla odeslána!");
      } else {
        setMsg(data.error || "Chyba při odesílání.");
      }
    } catch (error) {
      console.error(error);
      setMsg("Nepodařilo se připojit k serveru.");
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
                <span className="text-[#f9c600] font-semibold">
                  spolehlivé zemní a výkopové práce
                </span>{" "}
                minibagrem Hitachi v Praze a okolí.
              </p>
              <a
                href="#kontakt"
                className="inline-block bg-[#f9c600] text-[#2f3237] font-bold px-6 py-3 rounded-lg shadow hover:bg-yellow-400 transition"
              >
                Nezávazná poptávka
              </a>
            </div>
            <div className="md:w-1/2 flex justify-center relative z-10">
              <Image
                src="/images/bagr-hero.png"
                alt="Bagr"
                width={700}
                height={500}
                className="object-contain -mb-24 md:-mb-32"
              />
            </div>
          </div>
        </main>

        {/* SLUŽBY */}
        <section id="sluzby" className="bg-[#f9c600] text-black py-16">
          <div className="container mx-auto px-4">
            <h3 className="text-2xl md:text-3xl font-bold mb-12 text-[#2f3237] text-center">
              NAŠE SLUŽBY
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <BuildingOffice2Icon className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2 text-[#2f3237]">Výkopy základů</h4>
                <p className="text-gray-600 text-sm">Přesné a rychlé výkopy základů.</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <TruckIcon className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2 text-[#2f3237]">Zásypy a zasypávání</h4>
                <p className="text-gray-600 text-sm">Kvalitní a efektivní zásypy.</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <SquaresPlusIcon className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2 text-[#2f3237]">Zarovnání terénu</h4>
                <p className="text-gray-600 text-sm">Úpravy terénu a příjezdových cest.</p>
              </div>
            </div>
          </div>
        </section>

        {/* TECHNIKA */}
        <section id="technika" className="bg-white text-black py-16">
          <div className="container mx-auto px-4">
            <h3 className="text-2xl md:text-3xl font-bold mb-12 text-[#2f3237] text-center">
              TECHNIKA
            </h3>
            <div className="flex flex-col md:flex-row items-center gap-10 max-w-5xl mx-auto bg-gray-50 rounded-xl shadow-lg p-8">
              <Image src="/images/bagr-technik.png" alt="Bagr Technika" width={400} height={300} />
              <div className="text-lg space-y-4">
                <h4 className="text-2xl font-bold text-[#2f3237]">Hitachi ZX 48-A5A</h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <ScaleIcon className="w-6 h-6 text-yellow-500" />
                    <span>Hmotnost: 4.3 tuny</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Cog6ToothIcon className="w-6 h-6 text-yellow-500" />
                    <span>Motor: Yanmar 25.2 KW</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <ArrowsUpDownIcon className="w-6 h-6 text-yellow-500" />
                    <span>Max. hloubka výkopu: 3.74 m</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <WrenchScrewdriverIcon className="w-6 h-6 text-yellow-500" />
                    <span>Vhodný pro základy a terénní úpravy</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CENÍK */}
        <section id="cenik" className="bg-[#f9c600] text-black py-16">
          <div className="container mx-auto px-4">
            <h3 className="text-2xl md:text-3xl font-bold mb-12 text-[#2f3237] text-center">
              CENÍK
            </h3>
            <table className="w-full max-w-3xl mx-auto border border-gray-300 rounded-lg">
              <tbody className="divide-y divide-gray-300">
                <tr><td className="py-4 px-6 font-semibold">Bagr s obsluhou</td><td className="py-4 px-6 text-right font-bold">990 Kč / hod</td></tr>
                <tr><td className="py-4 px-6 font-semibold">Doprava stroje</td><td className="py-4 px-6 text-right font-bold">30 Kč / km</td></tr>
              </tbody>
            </table>
            <p className="text-sm text-gray-700 mt-6 text-center">*Cena je orientační dle požadavků.</p>
          </div>
        </section>

        {/* KONTAKT + POPÁVKA */}
        <section id="kontakt" className="bg-[#2f3237] text-white px-6 py-12">
          <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center text-[#f9c600]">
            KONTAKT A POPTÁVKA
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {/* Kontakt */}
            <form className="bg-white rounded-lg shadow-lg p-6 space-y-5 text-gray-800">
              <div><label className="block font-semibold">Jméno</label><input type="text" className="w-full border px-4 py-2 rounded" /></div>
              <div><label className="block font-semibold">E-mail</label><input type="email" className="w-full border px-4 py-2 rounded" /></div>
              <div><label className="block font-semibold">Telefon</label><input type="tel" className="w-full border px-4 py-2 rounded" /></div>
              <div><label className="block font-semibold">Zpráva</label><textarea rows="4" className="w-full border px-4 py-2 rounded"></textarea></div>
              <button type="submit" className="w-full bg-[#f9c600] text-[#2f3237] font-bold py-3 rounded hover:bg-yellow-400">ODESLAT</button>
            </form>

           {/* Poptávka */}
<div className="bg-white rounded-lg shadow-lg p-6 space-y-4 text-gray-800">
  <div>
    <label className="block font-semibold">Název projektu</label>
    <input
      type="text"
      className="w-full border px-4 py-2 rounded"
      value={jmeno}
      onChange={(e) => setJmeno(e.target.value)}
    />
  </div>

  <div>
    <label className="block font-semibold">Adresa zakázky</label>
    <div className="flex space-x-2">
      <input
        type="text"
        className="flex-1 border px-4 py-2 rounded"
        value={adresa}
        onChange={(e) => setAdresa(e.target.value)}
      />
      <button
        type="button"
        onClick={async () => {
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
            setMsg("Chyba při komunikaci se serverem.");
          }
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Zjistit km
      </button>
    </div>
    {km > 0 && <p className="text-sm text-gray-600 mt-1">Vzdálenost: {km} km</p>}
  </div>

  <div>
    <label className="block font-semibold">Vyberte typ prací</label>
    <div className="grid gap-2">
      <button
        onClick={() => setTypPrace("vykop")}
        className={`p-3 border rounded ${
          typPrace === "vykop" ? "bg-yellow-100 border-yellow-500" : ""
        }`}
      >
        Výkopové práce
      </button>
      <button
        onClick={() => setTypPrace("vykopZasyp")}
        className={`p-3 border rounded ${
          typPrace === "vykopZasyp" ? "bg-yellow-100 border-yellow-500" : ""
        }`}
      >
        Výkop + zásypové práce
      </button>
      <button
        onClick={() => setTypPrace("komplexni")}
        className={`p-3 border rounded ${
          typPrace === "komplexni" ? "bg-yellow-100 border-yellow-500" : ""
        }`}
      >
        Komplexní práce
      </button>
    </div>
  </div>

  <div>
    <label className="block font-semibold">Vyberte termín</label>
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

  <button
    onClick={odeslat}
    className="w-full bg-[#f9c600] text-[#2f3237] font-bold py-3 rounded hover:bg-yellow-400"
  >
    ODESLAT OBJEDNÁVKU
  </button>
  {msg && <p className="text-sm text-red-600 mt-2">{msg}</p>}
</div>

        </section>

        {/* Footer */}
        <footer className="bg-[#2f3237] text-white text-center py-4 text-sm">
          Zemní a Výkopové Práce • IČO:73377619 • info@zevyp.cz • Habartov, Horní Částkov ev. č. 2, 357 09
        </footer>
      </div>
    </>
  );
}
