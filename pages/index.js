// pages/index.js

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
  PlusIcon,
  XMarkIcon as CloseIcon,
} from "@heroicons/react/24/solid";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function Header() {
  const [open, setOpen] = useState(false);



// SPOČÍTAT VZDÁLENOST (klient -> /api/vzdalenost)
const spocitatVzdalenost = async () => {
  if (!customerAddress) {
    setMsg("Zadej prosím adresu.");
    return;
  }
  try {
    const res = await fetch("/api/vzdalenost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adresa: customerAddress }),
    });
    const data = await res.json();
    if (res.ok) {
      setDistance(data.km);
      setMsg(`Vzdálenost: ${data.km} km`);
    } else {
      setMsg(data.error || "Nepodařilo se zjistit vzdálenost.");
    }
  } catch (err) {
    console.error(err);
    setMsg("Chyba při komunikaci se serverem.");
  }
};





  
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
        <nav className="hidden md:flex gap-6 text-base md:text-lg">
          <a href="#sluzby" className="hover:underline">NAŠE SLUŽBY</a>
          <a href="#technika" className="hover:underline">TECHNIKA</a>
          <a href="#cenik" className="hover:underline">CENÍK</a>
          <a href="#kontakt" className="hover:underline">KONTAKT</a>
        </nav>
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <XMarkIcon className="w-8 h-8" /> : <Bars3Icon className="w-8 h-8" />}
        </button>
      </div>
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
  const [showAccessoriesBagr, setShowAccessoriesBagr] = useState(false);
  const [showAccessoriesNakladac, setShowAccessoriesNakladac] = useState(false);
  const [selectedAttachmentBagr, setSelectedAttachmentBagr] = useState("/images/bagr-lzice50.png");
  const [selectedAttachmentNakladac, setSelectedAttachmentNakladac] = useState("/images/nakladac-standard.png");

  const [startDate, setStartDate] = useState(new Date());
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [distance, setDistance] = useState(null);
  const [pozadavek, setPozadavek] = useState("Poptávám výkop základové desky...");

  const [nevimRozmery, setNevimRozmery] = useState(true);
  const [znamRozmery, setZnamRozmery] = useState(false);
  const [rozmery, setRozmery] = useState("");
  const [typZeminy, setTypZeminy] = useState("");

  const [obsazene, setObsazene] = useState([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    async function nactiObsazene() {
      try {
        const res = await fetch("/api/obsazene");
        const data = await res.json();
        setObsazene(data.obsazene || []);
      } catch (e) {
        console.error("Chyba při načítání obsazenosti:", e);
      }
    }
    nactiObsazene();
  }, []);
  // === ČÁST 2: Hero + Služby + Technika (s modály) ===

  // HERO sekce (s obrázkem bagru vpravo)
  const Hero = () => (
    <section className="bg-[#2f3237] text-white py-16">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 text-left mb-12 md:mb-0 relative z-20">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            ZEMNÍ A VÝKOPOVÉ PRÁCE
          </h1>
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

        {/* Obrázek bagru vpravo */}
        <div className="md:w-1/2 flex justify-center relative z-10">
          <Image
            src="/images/bagr-hero.png"
            alt="Bagr"
            width={740}
            height={520}
            className="object-contain -mb-24 md:-mb-32"
          />
        </div>
      </div>
    </section>
  );

  // SLUŽBY
  const Sluzby = () => (
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
  );

  // TECHNIKA (bagr uprostřed větší; plus ikona na lžíci bagru i nakladače)
  const Technika = () => (
    <section id="technika" className="bg-white text-black py-16 relative">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-2xl md:text-3xl font-bold mb-12 text-[#2f3237]">
          TECHNIKA
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start justify-center">

          {/* Válec (vlevo) */}
          <div className="bg-gray-50 rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <Image src="/images/valec.png" alt="Válec" width={360} height={240} className="mx-auto" />
            <h4 className="text-xl font-bold mt-4 text-[#2f3237]">Válec</h4>
            <ul className="text-sm text-gray-700 mt-3 space-y-2 text-left">
              <li className="flex items-center gap-2">
                <ScaleIcon className="w-5 h-5 text-yellow-500" /> Hmotnost: 2.7 t
              </li>
              <li className="flex items-center gap-2">
                <Cog6ToothIcon className="w-5 h-5 text-yellow-500" /> Motor: Kubota 33 kW
              </li>
              <li className="flex items-center gap-2">
                <ArrowsUpDownIcon className="w-5 h-5 text-yellow-500" /> Šířka válce: 1,2 m
              </li>
              <li className="flex items-center gap-2">
                <WrenchScrewdriverIcon className="w-5 h-5 text-yellow-500" /> Pro hutnění zemin a štěrku
              </li>
            </ul>
          </div>

          {/* Bagr – uprostřed (zvýrazněný a větší) */}
          <div className="relative bg-gray-50 rounded-xl shadow-lg p-8 hover:shadow-xl transition md:scale-[1.08]">
            <div className="relative w-full max-w-[520px] mx-auto">
              <Image
                src={selectedAttachmentBagr || "/images/bagr-lzice50.png"}
                alt="Bagr"
                width={520}
                height={360}
                className="mx-auto transition-all duration-300"
                priority
              />
              {/* Plus ikona přesně u lžíce (přibližná pozice) */}
              <button
                onClick={() => setShowAccessoriesBagr(true)}
                className="absolute bottom-[18%] right-[8%] -translate-y-1/2 bg-[#f9c600] text-black p-2 rounded-full shadow hover:bg-yellow-400 transition"
                aria-label="Vybrat příslušenství bagru"
              >
                <PlusIcon className="w-6 h-6" />
              </button>
            </div>
            <h4 className="text-xl font-bold mt-4 text-[#2f3237]">Bagr Hitachi ZX 48-A5A</h4>
            <ul className="text-sm text-gray-700 mt-3 space-y-2 text-left">
              <li className="flex items-center gap-2"><ScaleIcon className="w-5 h-5 text-yellow-500" /> Hmotnost: 4.3 t</li>
              <li className="flex items-center gap-2"><Cog6ToothIcon className="w-5 h-5 text-yellow-500" /> Motor: Yanmar 25.2 KW</li>
              <li className="flex items-center gap-2"><ArrowsUpDownIcon className="w-5 h-5 text-yellow-500" /> Hloubka výkopu: 3.74 m</li>
              <li className="flex items-center gap-2"><WrenchScrewdriverIcon className="w-5 h-5 text-yellow-500" /> Pro výkopy a úpravy</li>
            </ul>
          </div>

          {/* Nakladač (vpravo) */}
          <div className="relative bg-gray-50 rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <div className="relative w-full max-w-[420px] mx-auto">
              <Image
                src={selectedAttachmentNakladac || "/images/nakladac-standard.png"}
                alt="Nakladač"
                width={420}
                height={280}
                className="mx-auto transition-all duration-300"
              />
              {/* Plus ikona u lžíce nakladače (přibližná pozice) */}
              <button
                onClick={() => setShowAccessoriesNakladac(true)}
                className="absolute bottom-[16%] right-[10%] bg-[#f9c600] text-black p-2 rounded-full shadow hover:bg-yellow-400 transition"
                aria-label="Vybrat příslušenství nakladače"
              >
                <PlusIcon className="w-6 h-6" />
              </button>
            </div>
            <h4 className="text-xl font-bold mt-4 text-[#2f3237]">Nakladač</h4>
            <ul className="text-sm text-gray-700 mt-3 space-y-2 text-left">
              <li className="flex items-center gap-2"><ScaleIcon className="w-5 h-5 text-yellow-500" /> Hmotnost: 4.5 t</li>
              <li className="flex items-center gap-2"><Cog6ToothIcon className="w-5 h-5 text-yellow-500" /> Motor: Deutz 55 kW</li>
              <li className="flex items-center gap-2"><ArrowsUpDownIcon className="w-5 h-5 text-yellow-500" /> Nosnost: 3,5 t</li>
              <li className="flex items-center gap-2"><WrenchScrewdriverIcon className="w-5 h-5 text-yellow-500" /> Pro přepravu a úpravy terénu</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modal – příslušenství pro Bagr */}
      {showAccessoriesBagr && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full relative">
            <button
              onClick={() => setShowAccessoriesBagr(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
              aria-label="Zavřít"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
            <h3 className="text-lg font-bold mb-4">Vyberte příslušenství pro bagr</h3>
            <ul className="space-y-3 text-gray-800">
              <li><button onClick={() => { setSelectedAttachmentBagr("/images/bagr-vrtak.png"); setShowAccessoriesBagr(false); }} className="w-full text-left px-4 py-2 border rounded hover:bg-yellow-100">Vrták</button></li>
              <li><button onClick={() => { setSelectedAttachmentBagr("/images/bagr-sbijecka.png"); setShowAccessoriesBagr(false); }} className="w-full text-left px-4 py-2 border rounded hover:bg-yellow-100">Sbíječka</button></li>
              <li><button onClick={() => { setSelectedAttachmentBagr("/images/bagr-lzice50.png"); setShowAccessoriesBagr(false); }} className="w-full text-left px-4 py-2 border rounded hover:bg-yellow-100">Lžíce 50 cm</button></li>
              <li><button onClick={() => { setSelectedAttachmentBagr("/images/bagr-lzice80.png"); setShowAccessoriesBagr(false); }} className="w-full text-left px-4 py-2 border rounded hover:bg-yellow-100">Lžíce 80 cm</button></li>
              <li><button onClick={() => { setSelectedAttachmentBagr("/images/bagr-svahova.png"); setShowAccessoriesBagr(false); }} className="w-full text-left px-4 py-2 border rounded hover:bg-yellow-100">Lžíce svahová</button></li>
            </ul>
          </div>
        </div>
      )}

      {/* Modal – příslušenství pro Nakladač */}
      {showAccessoriesNakladac && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full relative">
            <button
              onClick={() => setShowAccessoriesNakladac(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
              aria-label="Zavřít"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
            <h3 className="text-lg font-bold mb-4">Vyberte příslušenství pro nakladač</h3>
            <ul className="space-y-3 text-gray-800">
              <li><button onClick={() => { setSelectedAttachmentNakladac("/images/nakladac-pluh.png"); setShowAccessoriesNakladac(false); }} className="w-full text-left px-4 py-2 border rounded hover:bg-yellow-100">Pluh</button></li>
              <li><button onClick={() => { setSelectedAttachmentNakladac("/images/nakladac-standard.png"); setShowAccessoriesNakladac(false); }} className="w-full text-left px-4 py-2 border rounded hover:bg-yellow-100">Standardní lopata</button></li>
            </ul>
          </div>
        </div>
      )}
    </section>
  );
  // === ČÁST 3: Ceník + Kontakt & Poptávka (unifikovaný formulář) ===

  const Cenik = () => (
    <section id="cenik" className="bg-[#f9c600] text-black py-16">
      <div className="container mx-auto px-4">
        <h3 className="text-2xl md:text-3xl font-bold mb-12 text-[#2f3237] text-center">
          CENÍK
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full max-w-3xl mx-auto border border-gray-300 rounded-lg bg-white">
            <tbody className="divide-y divide-gray-300">
              <tr>
                <td className="py-4 px-6 font-semibold">Bagr s obsluhou</td>
                <td className="py-4 px-6 text-right font-bold">990 Kč / hod</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-semibold">Doprava stroje</td>
                <td className="py-4 px-6 text-right font-bold">30 Kč / km</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-semibold">Výkop základů do 1 m</td>
                <td className="py-4 px-6 text-right font-bold">od 66 Kč / m²</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-semibold">Zásypy, zarovnání</td>
                <td className="py-4 px-6 text-right font-bold">dle domluvy</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-800 mt-6 text-center max-w-xl mx-auto">
          *Konečnou cenu vždy upřesníme dle rozsahu, vzdálenosti a typu zeminy.
        </p>
      </div>
    </section>
  );

  const KontaktPoptavka = () => (
    <section id="kontakt" className="bg-[#2f3237] text-white py-14">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* TOP řádek: titulek + rychlý kontakt */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h3 className="text-2xl md:text-3xl font-bold">
            KONTAKT A POPTÁVKA
          </h3>

          {/* zvýrazněné telefonní číslo – nahraď svým číslem */}
          <a
            href="tel:+420777123456"
            className="inline-flex items-center gap-3 bg-[#f9c600] text-[#2f3237] font-bold px-4 py-3 rounded-lg shadow hover:bg-yellow-400 transition w-full md:w-auto justify-center"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <path d="M6.62 10.79a15.09 15.09 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24 11.36 11.36 0 003.56.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.56 1 1 0 01-.25 1.02l-2.2 2.21z"/>
            </svg>
            +420&nbsp;777&nbsp;123&nbsp;456
          </a>
        </div>

        {/* Formulář */}
        <div className="bg-white text-gray-900 rounded-xl shadow-xl p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Levý sloupec */}
            <div className="space-y-5">
              <div>
                <label className="block font-semibold mb-1">Vaše jméno</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#f9c600] outline-none"
                  placeholder="Jan Novák"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Váš e-mail</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#f9c600] outline-none"
                  placeholder="vas@email.cz"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Telefon</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#f9c600] outline-none"
                  placeholder="+420 …"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Adresa zakázky</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#f9c600] outline-none"
                    placeholder="Ulice, město…"
                  />
                  <button
                    type="button"
                    onClick={spocitatVzdalenost}
                    className="shrink-0 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition"
                  >
                    Zjistit km
                  </button>
                </div>
                {distance !== null && (
                  <p className="text-sm text-gray-600 mt-1">Vzdálenost: {distance} km</p>
                )}
              </div>

              <div>
                <label className="block font-semibold mb-1">Požadavek / poznámka</label>
                <textarea
                  value={pozadavek}
                  onChange={(e) => setPozadavek(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#f9c600] outline-none placeholder-gray-400"
                  placeholder="Poptávám výkop základové desky…"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tip: text je předvyplněn (bledě šedý) jako inspirace – klidně upravte.
                </p>
              </div>
            </div>

            {/* Pravý sloupec */}
            <div className="space-y-5">

              {/* Volba znalosti rozměrů/zeminy */}
              <fieldset className="border border-gray-200 rounded-lg p-4">
                <legend className="px-2 text-sm font-semibold text-gray-700">Rozměry a typ zeminy</legend>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="zemina"
                    checked={nevimRozmery}
                    onChange={() => { setNevimRozmery(true); setZnamRozmery(false); }}
                    className="mt-1 h-4 w-4"
                  />
                  <span className="text-sm">
                    Neznám rozměr/rozsah a typ zeminy (upřesníme na místě).
                  </span>
                </label>

                <div className="h-3" />

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="zemina"
                    checked={znamRozmery}
                    onChange={() => { setNevimRozmery(false); setZnamRozmery(true); }}
                    className="mt-1 h-4 w-4"
                  />
                  <span className="text-sm">
                    Znám rozměry a typ zeminy
                  </span>
                </label>

                {znamRozmery && (
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={rozmery}
                      onChange={(e) => setRozmery(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#f9c600] outline-none"
                      placeholder="Rozměry (např. 8×12 m, hl. 0.8 m)"
                    />
                    <input
                      type="text"
                      value={typZeminy}
                      onChange={(e) => setTypZeminy(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#f9c600] outline-none"
                      placeholder="Typ zeminy (hlinitá, jílovitá…)"
                    />
                  </div>
                )}
              </fieldset>

              {/* Kalendář – výběr rozsahu + obsazené dny */}
              <div>
                <label className="block font-semibold mb-2">Preferovaný termín (rozsah dní)</label>
                <Calendar
                  selectRange={true}
                  tileDisabled={({ date }) =>
                    obsazene.includes(date.toISOString().split("T")[0])
                  }
                  tileClassName={({ date }) => {
                    const iso = date.toISOString().split("T")[0];
                    return obsazene.includes(iso) ? "opacity-40 !text-red-700 !font-semibold" : undefined;
                  }}
                  onChange={(range) => {
                    if (Array.isArray(range) && range.length === 2) {
                      setDateFrom(range[0].toISOString().split("T")[0]);
                      setDateTo(range[1].toISOString().split("T")[0]);
                    }
                  }}
                />
                <div className="flex gap-3 text-sm text-gray-700 mt-2">
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-block w-3 h-3 bg-red-600 opacity-40 rounded-sm" />
                    obsazeno
                  </span>
                  {dateFrom && dateTo && (
                    <span>Vybráno: {dateFrom} → {dateTo}</span>
                  )}
                </div>
              </div>

              <button
                onClick={odeslatPoptavku}
                className="w-full bg-[#f9c600] text-[#2f3237] font-bold py-3 rounded-lg shadow hover:bg-yellow-400 transition"
              >
                ODESLAT POPTÁVKU
              </button>

              {msg && (
                <p className="text-sm mt-2 text-red-600">{msg}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
return (
  <>
    <Head>…</Head>
    <Header />

    <div className="min-h-screen bg-[#f9c600] font-sans text-gray-900">
      <Hero />
      <Sluzby />
      <Technika />
      <Cenik />
      <KontaktPoptavka />

      <footer className="bg-[#2f3237] text-white text-center py-4 text-sm">
        Zemní a Výkopové Práce • IČO:73377619 • info@zevyp.cz • Habartov, Horní Částkov ev. č. 2, 357 09
      </footer>
    </div>
  </>
);
}
