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
import {
  PlusCircleIcon,
  XMarkIcon as CloseIcon,
  PhoneIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function Header() {
  const [open, setOpen] = useState(false);

  const navItem =
    "px-4 py-2 rounded-lg font-semibold uppercase tracking-wide transition hover:bg-[#2f3237] hover:text-white";

  return (
    <header className="bg-[#f9c600] text-black py-4 px-4 shadow-md relative z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Image
          src="/images/logo_update.png"
          alt="Zevyp logo"
          width={150}
          height={150}
          className="h-12 w-auto"
          priority
        />

        {/* Desktop menu */}
        <nav className="hidden md:flex gap-4 text-base md:text-lg">
          <a href="#sluzby" className={navItem}>Služby</a>
          <a href="#technika" className={navItem}>Technika</a>
          <a href="#cenik" className={navItem}>Ceník</a>
          <a href="#kontakt" className={navItem}>Kontakt</a>
        </nav>

        {/* Mobile hamburger */}
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <XMarkIcon className="w-8 h-8" /> : <Bars3Icon className="w-8 h-8" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden bg-[#f9c600] py-4 px-6 flex flex-col gap-3 shadow-lg">
          <a href="#sluzby" className={navItem} onClick={() => setOpen(false)}>Služby</a>
          <a href="#technika" className={navItem} onClick={() => setOpen(false)}>Technika</a>
          <a href="#cenik" className={navItem} onClick={() => setOpen(false)}>Ceník</a>
          <a href="#kontakt" className={navItem} onClick={() => setOpen(false)}>Kontakt</a>
        </div>
      )}
    </header>
  );
}

export default function Home() {
  // ---------- TECHNIKA: accessory modals & images ----------
  const [showAccessoriesBagr, setShowAccessoriesBagr] = useState(false);
  const [showAccessoriesNakladac, setShowAccessoriesNakladac] = useState(false);
  const [selectedAttachmentBagr, setSelectedAttachmentBagr] = useState("/images/bagr-lzice50.png"); // default 50
  const [selectedAttachmentNakladac, setSelectedAttachmentNakladac] = useState("/images/nakladac-standard.png");

  // ---------- FORM STATES ----------
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [distance, setDistance] = useState(null);
  const [pozadavek, setPozadavek] = useState(
    "Poptávám výkop základové desky pro rodinný dům. Přístup pro techniku je možný, odvoz zeminy dle domluvy."
  );

  // „Neznám/znám rozměry…“
  const [nevimRozmery, setNevimRozmery] = useState(true);
  const [rozmery, setRozmery] = useState("");
  const [typZeminy, setTypZeminy] = useState("");

  // kalendář + obsazenost
  const [obsazene, setObsazene] = useState([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [msg, setMsg] = useState("");
  const [loadingDistance, setLoadingDistance] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);

  // ---------- LOAD BUSY DAYS ----------
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

  // ---------- DISTANCE ----------
  async function spocitatVzdalenost() {
    if (!customerAddress) return setMsg("Zadej prosím adresu.");
    try {
      setLoadingDistance(true);
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
    } finally {
      setLoadingDistance(false);
    }
  }

  // ---------- SEND ----------
  async function odeslatPoptavku() {
    setMsg("");
    if (!customerName || !customerEmail || !customerAddress || !dateFrom || !dateTo) {
      setMsg("Vyplň prosím všechna povinná pole a vyber rozsah dní.");
      return;
    }

    const infoZemina = nevimRozmery
      ? "Zákazník nezná rozměr/rozsah a typ zeminy."
      : `Rozměry: ${rozmery || "-"}, Typ zeminy: ${typZeminy || "-"}`;

    try {
      setLoadingSend(true);
      const res = await fetch("/api/objednavka", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jmeno: customerName,
          email: customerEmail,
          telefon: customerPhone || "",
          adresa: customerAddress,
          datumOd: dateFrom,
          datumDo: dateTo,
          km: distance,
          pozadavek,
          infoZemina,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg("Poptávka byla odeslána! Brzy se ti ozveme.");
        // reset jen části
        // setCustomerName(""); setCustomerEmail(""); ...
      } else {
        setMsg(data.error || "Chyba při odesílání.");
      }
    } catch (err) {
      console.error(err);
      setMsg("Nepodařilo se připojit k serveru.");
    } finally {
      setLoadingSend(false);
    }
  }

  // ---------- HERO ----------
  function Hero() {
    return (
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
              width={760}
              height={520}
              className="object-contain"
              priority
            />
          </div>
        </div>
      </main>
    );
  }

  // ---------- SLUŽBY ----------
  function Sluzby() {
    return (
      <section id="sluzby" className="bg-[#f9c600] text-black py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl md:text-3xl font-bold mb-12 text-[#2f3237] text-center">
            NAŠE SLUŽBY
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition">
              <BuildingOffice2Icon className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2 text-[#2f3237]">Výkopy základů</h4>
              <p className="text-gray-600 text-sm">Přesné a rychlé výkopy základů.</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition">
              <TruckIcon className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2 text-[#2f3237]">Zásypy a zasypávání</h4>
              <p className="text-gray-600 text-sm">Kvalitní a efektivní zásypy.</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition">
              <SquaresPlusIcon className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2 text-[#2f3237]">Zarovnání terénu</h4>
              <p className="text-gray-600 text-sm">Úpravy terénu a příjezdových cest.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ---------- TECHNIKA ----------
  function Technika() {
    return (
      <section id="technika" className="bg-white text-black py-16 relative">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-12 text-[#2f3237]">TECHNIKA</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start justify-center">
            {/* Válec */}
            <div className="bg-gray-50 rounded-xl shadow-lg p-6 hover:shadow-xl transition">
              <Image src="/images/valec.png" alt="Válec" width={360} height={240} className="mx-auto" />
              <h4 className="text-xl font-bold mt-4 text-[#2f3237]">Válec</h4>
              <p className="text-gray-600 text-sm mt-2">Zhutňování povrchů a příprava cest.</p>
              <ul className="text-sm text-gray-700 mt-3 space-y-2 text-left">
                <li className="flex items-center gap-2"><ScaleIcon className="w-5 h-5 text-yellow-500" /> Hmotnost: 2.7 t</li>
                <li className="flex items-center gap-2"><Cog6ToothIcon className="w-5 h-5 text-yellow-500" /> Motor: Kubota 33 kW</li>
                <li className="flex items-center gap-2"><ArrowsUpDownIcon className="w-5 h-5 text-yellow-500" /> Šířka válce: 1,2 m</li>
                <li className="flex items-center gap-2 text-left">
                  <WrenchScrewdriverIcon className="w-5 h-5 text-yellow-500" /> Hutnění asfaltu, štěrku a zemin
                </li>
              </ul>
            </div>

            {/* Bagr – uprostřed, větší & plus na lžíci */}
            <div className="relative bg-gray-50 rounded-xl shadow-lg p-6 hover:shadow-xl transition">
              <div className="relative w-full">
                <Image
                  src={selectedAttachmentBagr}
                  alt="Bagr"
                  width={520}
                  height={360}
                  className="mx-auto transition-all duration-300"
                />
                {/* plus-ikona – přibližně na pozici lžíce */}
                <button
                  onClick={() => setShowAccessoriesBagr(true)}
                  className="absolute top-[52%] left-[74%] -translate-x-1/2 -translate-y-1/2"
                  aria-label="Zvolit příslušenství bagru"
                  title="Zvolit příslušenství"
                >
                  <PlusCircleIcon className="w-12 h-12 text-yellow-500 opacity-90 hover:opacity-100 hover:text-yellow-400 transition drop-shadow" />
                </button>
              </div>
              <h4 className="text-xl font-bold mt-4 text-[#2f3237]">Bagr Hitachi ZX 48-A5A</h4>
              <ul className="text-sm text-gray-700 mt-3 space-y-2 text-left">
                <li className="flex items-center gap-2"><ScaleIcon className="w-5 h-5 text-yellow-500" /> Hmotnost: 4.3 t</li>
                <li className="flex items-center gap-2"><Cog6ToothIcon className="w-5 h-5 text-yellow-500" /> Motor: Yanmar 25.2 KW</li>
                <li className="flex items-center gap-2"><ArrowsUpDownIcon className="w-5 h-5 text-yellow-500" /> Hloubka výkopu: 3.74 m</li>
                <li className="flex items-center gap-2"><WrenchScrewdriverIcon className="w-5 h-5 text-yellow-500" /> Volitelné příslušenství</li>
              </ul>
            </div>

            {/* Nakladač – plus na lžíci */}
            <div className="bg-gray-50 rounded-xl shadow-lg p-6 hover:shadow-xl transition relative">
              <div className="relative w-full">
                <Image
                  src={selectedAttachmentNakladac}
                  alt="Nakladač"
                  width={380}
                  height={260}
                  className="mx-auto transition-all duration-300"
                />
                {/* plus zhruba v oblasti lžíce */}
                <button
                  onClick={() => setShowAccessoriesNakladac(true)}
                  className="absolute top-[56%] left-[70%] -translate-x-1/2 -translate-y-1/2"
                  aria-label="Zvolit příslušenství nakladače"
                  title="Zvolit příslušenství"
                >
                  <PlusCircleIcon className="w-12 h-12 text-yellow-500 opacity-90 hover:opacity-100 hover:text-yellow-400 transition drop-shadow" />
                </button>
              </div>
              <h4 className="text-xl font-bold mt-4 text-[#2f3237]">Nakladač</h4>
              <ul className="text-sm text-gray-700 mt-3 space-y-2 text-left">
                <li className="flex items-center gap-2"><ScaleIcon className="w-5 h-5 text-yellow-500" /> Hmotnost: 4.5 t</li>
                <li className="flex items-center gap-2"><Cog6ToothIcon className="w-5 h-5 text-yellow-500" /> Motor: Deutz 55 kW</li>
                <li className="flex items-center gap-2"><ArrowsUpDownIcon className="w-5 h-5 text-yellow-500" /> Nosnost: 3,5 t</li>
                <li className="flex items-center gap-2 text-left">
                  <WrenchScrewdriverIcon className="w-5 h-5 text-yellow-500" /> Pluh / vidle / lopata
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Modal příslušenství pro Bagr */}
        {showAccessoriesBagr && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full relative">
              <button
                onClick={() => setShowAccessoriesBagr(false)}
                className="absolute top-3 right-3 text-gray-600 hover:text-black"
              >
                <CloseIcon className="w-6 h-6" />
              </button>
              <h3 className="text-lg font-bold mb-4">Vyberte příslušenství pro bagr</h3>
              <ul className="space-y-3 text-gray-800">
                <li><button onClick={() => { setSelectedAttachmentBagr("/images/bagr-vrtak.png"); setShowAccessoriesBagr(false); }} className="w-full text-left px-4 py-2 border rounded hover:bg-yellow-100">Vrták</button></li>
                <li><button onClick={() => { setSelectedAttachmentBagr("/images/bagr-sbijecka.png"); setShowAccessoriesBagr(false); }} className="w-full text-left px-4 py-2 border rounded hover:bg-yellow-100">Sbíječka</button></li>
                <li><button onClick={() => { setSelectedAttachmentBagr("/images/bagr-lzice50.png"); setShowAccessoriesBagr(false); }} className="w-full text-left px-4 py-2 border rounded hover:bg-yellow-100">Lžíce 50 cm (výchozí)</button></li>
                <li><button onClick={() => { setSelectedAttachmentBagr("/images/bagr-lzice80.png"); setShowAccessoriesBagr(false); }} className="w-full text-left px-4 py-2 border rounded hover:bg-yellow-100">Lžíce 80 cm</button></li>
                <li><button onClick={() => { setSelectedAttachmentBagr("/images/bagr-svahova.png"); setShowAccessoriesBagr(false); }} className="w-full text-left px-4 py-2 border rounded hover:bg-yellow-100">Lžíce svahová</button></li>
              </ul>
            </div>
          </div>
        )}

        {/* Modal příslušenství pro Nakladač */}
        {showAccessoriesNakladac && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full relative">
              <button
                onClick={() => setShowAccessoriesNakladac(false)}
                className="absolute top-3 right-3 text-gray-600 hover:text-black"
              >
                <CloseIcon className="w-6 h-6" />
              </button>
              <h3 className="text-lg font-bold mb-4">Vyberte příslušenství pro nakladač</h3>
              <ul className="space-y-3 text-gray-800">
                <li><button onClick={() => { setSelectedAttachmentNakladac("/images/nakladac-pluh.png"); setShowAccessoriesNakladac(false); }} className="w-full text-left px-4 py-2 border rounded hover:bg-yellow-100">Pluh</button></li>
                <li><button onClick={() => { setSelectedAttachmentNakladac("/images/nakladac-vidle.png"); setShowAccessoriesNakladac(false); }} className="w-full text-left px-4 py-2 border rounded hover:bg-yellow-100">Vidle na palety</button></li>
                <li><button onClick={() => { setSelectedAttachmentNakladac("/images/nakladac-standard.png"); setShowAccessoriesNakladac(false); }} className="w-full text-left px-4 py-2 border rounded hover:bg-yellow-100">Standardní lopata</button></li>
              </ul>
            </div>
          </div>
        )}
      </section>
    );
  }

  // ---------- CENÍK ----------
  function Cenik() {
    return (
      <section id="cenik" className="bg-[#f9c600] text-black py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl md:text-3xl font-bold mb-12 text-[#2f3237] text-center">
            CENÍK
          </h3>
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
          <p className="text-sm text-gray-700 mt-6 text-center">
            *Konečnou cenu stanovíme individuálně podle vzdálenosti a požadavků.
          </p>
        </div>
      </section>
    );
  }

  // ---------- FORM ----------
  function KontaktAPoptavka() {
    return (
      <section id="kontakt" className="bg-[#2f3237] text-white px-6 py-12">
        <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center text-[#f9c600]">
          KONTAKT A POPTÁVKA
        </h3>

        {/* Phone highlight */}
        <div className="max-w-5xl mx-auto mb-6">
          <div className="bg-[#f9c600] text-[#2f3237] rounded-lg px-4 py-3 flex items-center gap-3 justify-center">
            <PhoneIcon className="w-6 h-6" />
            <span className="font-bold">Volejte: +420 777 777 777</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* (Levá "kontakt" část jsme odstranili – sjednocený formulář je vpravo) */}

          {/* Poptávka */}
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-4 text-gray-800 md:col-span-2">
            {/* Základní info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold">Vaše jméno *</label>
                <input
                  type="text"
                  className={`w-full border px-4 py-2 rounded ${!customerName && msg ? "border-red-500" : "border-gray-300"}`}
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Jan Novák"
                />
              </div>
              <div>
                <label className="block font-semibold">Váš e-mail *</label>
                <input
                  type="email"
                  className={`w-full border px-4 py-2 rounded ${!customerEmail && msg ? "border-red-500" : "border-gray-300"}`}
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="jan.novak@email.cz"
                />
              </div>
              <div>
                <label className="block font-semibold">Telefon</label>
                <input
                  type="tel"
                  className="w-full border px-4 py-2 rounded border-gray-300"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+420 ..."
                />
              </div>
            </div>

            {/* Adresa + km */}
            <div>
              <label className="block font-semibold">Adresa zakázky *</label>
              <div className="flex gap-2 flex-col sm:flex-row">
                <input
                  type="text"
                  className={`flex-1 border px-4 py-2 rounded ${!customerAddress && msg ? "border-red-500" : "border-gray-300"}`}
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Ulice, číslo, město"
                />
                <button
                  type="button"
                  onClick={spocitatVzdalenost}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-60"
                  disabled={loadingDistance}
                >
                  {loadingDistance ? "Zjišťuji…" : "Zjistit km"}
                </button>
              </div>
              {distance !== null && (
                <p className="text-sm mt-1 text-gray-600">Vzdálenost: {distance} km</p>
              )}
            </div>

            {/* Termín – kalendář */}
            <div>
              <label className="block font-semibold mb-2">Vyberte rozsah dní *</label>
              <div className="rounded border border-gray-200 p-2 bg-white">
                <Calendar
                  selectRange={true}
                  tileDisabled={({ date }) => obsazene.includes(date.toISOString().split("T")[0])}
                  tileContent={({ date, view }) => {
                    // červená tečka u obsazených dnů
                    const iso = date.toISOString().split("T")[0];
                    if (view === "month" && obsazene.includes(iso)) {
                      return <span title="Obsazeno" className="block w-1.5 h-1.5 bg-red-500 rounded-full mx-auto mt-1" />;
                    }
                    return null;
                  }}
                  onChange={(range) => {
                    if (Array.isArray(range) && range.length === 2) {
                      setDateFrom(range[0].toISOString().split("T")[0]);
                      setDateTo(range[1].toISOString().split("T")[0]);
                    }
                  }}
                />
              </div>
              {(dateFrom && dateTo) && (
                <p className="text-sm text-gray-600 mt-2">
                  Vybráno: {dateFrom} – {dateTo}
                </p>
              )}
            </div>

            {/* Neznám / znám rozměry & zeminu */}
            <div className="space-y-2">
              <label className="block font-semibold">Rozměry a typ zeminy</label>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setNevimRozmery(true)}
                  className={`flex-1 border px-4 py-2 rounded text-left ${nevimRozmery ? "border-yellow-500 bg-yellow-50" : "border-gray-300"}`}
                >
                  Neznám rozměr/rozsah a typ zeminy
                </button>
                <button
                  type="button"
                  onClick={() => setNevimRozmery(false)}
                  className={`flex-1 border px-4 py-2 rounded text-left ${!nevimRozmery ? "border-yellow-500 bg-yellow-50" : "border-gray-300"}`}
                >
                  Znám rozměry a typ zeminy
                </button>
              </div>

              {!nevimRozmery && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    className="w-full border px-4 py-2 rounded border-gray-300"
                    placeholder="Např. 8 × 12 m"
                    value={rozmery}
                    onChange={(e) => setRozmery(e.target.value)}
                  />
                  <input
                    type="text"
                    className="w-full border px-4 py-2 rounded border-gray-300"
                    placeholder="Např. jílovitá / písčitá"
                    value={typZeminy}
                    onChange={(e) => setTypZeminy(e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Poznámka/požadavek */}
            <div>
              <label className="block font-semibold">Požadavek / poznámka</label>
              <textarea
                rows={4}
                className="w-full border px-4 py-2 rounded border-gray-300 placeholder-gray-400"
                placeholder="Poptávám výkop základové desky pro rodinný dům. Přístup pro techniku je možný, odvoz zeminy dle domluvy."
                value={pozadavek}
                onChange={(e) => setPozadavek(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                *Kalkulace je orientační. Konečnou cenu potvrdíme po upřesnění detailů.
              </p>
            </div>

            {/* Submit */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={odeslatPoptavku}
                className="flex-1 bg-[#f9c600] text-[#2f3237] font-bold py-3 rounded hover:bg-yellow-400 transition disabled:opacity-60"
                disabled={loadingSend}
              >
                {loadingSend ? "Odesílám…" : "ODESLAT POPTÁVKU"}
              </button>
              {msg && (
                <div className="flex items-center gap-2 text-sm">
                  {msg.toLowerCase().includes("chyba") || msg.toLowerCase().includes("nedaří") || msg.toLowerCase().includes("vyplň")
                    ? <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                    : <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  }
                  <span className={`${msg.toLowerCase().includes("chyba") ? "text-red-600" : "text-green-700"}`}>{msg}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <Head>
        <title>Zemní a výkopové práce – Zevyp.cz</title>
        <meta name="description" content="Výkopové a zemní práce minibagrem Hitachi – Praha a okolí." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <div className="min-h-screen bg-[#f9c600] font-sans text-gray-900">
        <Hero />
        <Sluzby />
        <Technika />
        <Cenik />
        <KontaktAPoptavka />

        <footer className="bg-[#2f3237] text-white text-center py-4 text-sm">
          Zemní a Výkopové Práce • IČO:73377619 • info@zevyp.cz • Habartov, Horní Částkov ev. č. 2, 357 09
        </footer>
      </div>
    </>
  );
}
