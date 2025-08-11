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
  PlusCircleIcon,
  XMarkIcon as CloseIcon,
} from "@heroicons/react/24/solid";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

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
        <nav className="hidden md:flex gap-6 text-base md:text-lg">
          <a href="#sluzby" className="hover:underline">NAŠE SLUŽBY</a>
          <a href="#technika" className="hover:underline">TECHNIKA</a>
          <a href="#cenik" className="hover:underline">CENÍK</a>
          <a href="#kontakt" className="hover:underline">KONTAKT</a>
        </nav>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
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
const [showAccessories, setShowAccessories] = useState(false);
  const [showNakladac, setShowNakladac] = useState(false);
  const [bagrImage, setBagrImage] = useState("/images/bagr-technik.png");
  const [nakladacImage, setNakladacImage] = useState("/images/nakladac.png");
    const [selectedAttachmentBagr, setSelectedAttachmentBagr] = useState(null);
  const [selectedAttachmentLoader, setSelectedAttachmentLoader] = useState(null);
  const [showAccessoriesBagr, setShowAccessoriesBagr] = useState(false);
  const [showAccessoriesLoader, setShowAccessoriesLoader] = useState(false);
  
 export default function Poptavka() {
  const [jmeno, setJmeno] = useState("");
  const [email, setEmail] = useState("");
  const [adresa, setAdresa] = useState("");
  const [datumOd, setDatumOd] = useState("");
  const [datumDo, setDatumDo] = useState("");
  const [pozadavek, setPozadavek] = useState(
    "Poptávám výkop základové desky pro rodinný dům, přibližně 10x8 m, hloubka 1 m."
  );
  const [nevimRozmery, setNevimRozmery] = useState(true);
  const [znamRozmery, setZnamRozmery] = useState(false);
  const [rozmery, setRozmery] = useState("");
  const [typZeminy, setTypZeminy] = useState("");
  const [km, setKm] = useState("");
  const [loadingKm, setLoadingKm] = useState(false);

  const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
  const ORIGIN_ADDRESS = "Habartov, Horní Částkov ev. č. 2, 357 09";

  const spocitatVzdalenost = async () => {
    if (!adresa) return;
    setLoadingKm(true);
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
          ORIGIN_ADDRESS
        )}&destinations=${encodeURIComponent(
          adresa
        )}&key=${GOOGLE_API_KEY}&units=metric`
      );
      const data = await res.json();
      if (data.rows[0].elements[0].status === "OK") {
        const vzdKM =
          data.rows[0].elements[0].distance.value / 1000; // metry → km
        setKm(vzdKM.toFixed(1));
      } else {
        setKm("Chyba");
      }
    } catch (err) {
      console.error(err);
      setKm("Chyba");
    }
    setLoadingKm(false);
  };

  const odeslat = async (e) => {
    e.preventDefault();

    let infoZemina;
    if (nevimRozmery) {
      infoZemina = "Zákazník neví rozměr/rozsah a typ zeminy.";
    } else {
      infoZemina = `Rozměry: ${rozmery}, Typ zeminy: ${typZeminy}`;
    }

    const event = {
      summary: `Poptávka od ${jmeno}`,
      description: `${pozadavek}\nAdresa: ${adresa}\nVzdálenost: ${km} km\n${infoZemina}\nEmail: ${email}`,
      start: {
        dateTime: `${datumOd}T08:00:00`,
        timeZone: "Europe/Prague",
      },
      end: {
        dateTime: `${datumDo || datumOd}T17:00:00`,
        timeZone: "Europe/Prague",
      },
    };

    try {
      await fetch("/api/add-to-calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
      });
      alert("Poptávka odeslána!");
    } catch (err) {
      console.error(err);
      alert("Chyba při odesílání.");
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
        <section id="sluzby" className="bg-[#f9c600] text-black py-16">
          <div className="container mx-auto px-4">
            <h3 className="text-2xl md:text-3xl font-bold mb-12 text-[#2f3237] text-center">NAŠE SLUŽBY</h3>
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
        <section id="technika" className="bg-white text-black py-16 relative">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-12 text-[#2f3237]">TECHNIKA</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start justify-center">
              {/* Válec */}
              <div className="bg-gray-50 rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                <Image src="/images/valec.png" alt="Válec" width={300} height={200} className="mx-auto" />
                <h4 className="text-xl font-bold mt-4 text-[#2f3237]">Válec</h4>
                <ul className="text-sm text-gray-700 mt-3 space-y-2 text-left">
                  <li className="flex items-center gap-2"><ScaleIcon className="w-5 h-5 text-yellow-500" /> Hmotnost: 2.7 t</li>
                  <li className="flex items-center gap-2"><Cog6ToothIcon className="w-5 h-5 text-yellow-500" /> Motor: Kubota 33 kW</li>
                  <li className="flex items-center gap-2"><ArrowsUpDownIcon className="w-5 h-5 text-yellow-500" /> Šířka válce: 1,2 m</li>
                  <li className="flex items-center gap-2"><WrenchScrewdriverIcon className="w-5 h-5 text-yellow-500" /> Pro hutnění zemin a štěrku</li>
                </ul>
              </div>

              {/* Bagr – s příslušenstvím */}
              <div className="relative bg-gray-50 rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                <div className="relative">
                  <Image
                    src={`/images/${selectedAttachmentBagr || "bagr-technik"}.png`}
                    alt="Bagr"
                    width={400}
                    height={300}
                    className="mx-auto transition-all duration-300"
                  />
                  <button
                    onClick={() => setShowAccessoriesBagr(true)}
                    className="absolute top-3/4 left-[79%] transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
                  >
                    <PlusCircleIcon className="w-12 h-12 text-yellow-500 hover:text-yellow-600 transition" />
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

              {/* Nakladač – s příslušenstvím */}
              <div className="relative bg-gray-50 rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                <div className="relative">
                  <Image
                    src={`/images/${selectedAttachmentLoader || "nakladac"}.png`}
                    alt="Nakladač"
                    width={300}
                    height={200}
                    className="mx-auto transition-all duration-300"
                  />
                  <button
                    onClick={() => setShowAccessoriesLoader(true)}
                    className="absolute top-2/3 right-[60%] transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
                  >
                    <PlusCircleIcon className="w-12 h-12 text-yellow-500 hover:text-yellow-600 transition" />
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
        {/* Vrták */}
        <li>
          <button
            onClick={() => { setSelectedAttachmentBagr("bagr-vrtak.png"); setShowAccessoriesBagr(false); }}
            className={`w-full text-left px-4 py-2 border rounded flex items-center gap-2 hover:bg-yellow-100 ${selectedAttachmentBagr === "bagr-vrtak.png" ? "bg-yellow-200 border-yellow-500" : ""}`}
          >
            <Image src="/images/bagr-vrtak.png" width={40} height={40} alt="Vrták" />
            Vrták
          </button>
        </li>
        {/* Sbíječka */}
        <li>
          <button
            onClick={() => { setSelectedAttachmentBagr("bagr-sbijecka.png"); setShowAccessoriesBagr(false); }}
            className={`w-full text-left px-4 py-2 border rounded flex items-center gap-2 hover:bg-yellow-100 ${selectedAttachmentBagr === "bagr-sbijecka.png" ? "bg-yellow-200 border-yellow-500" : ""}`}
          >
            <Image src="/images/bagr-sbijecka.png" width={40} height={40} alt="Sbíječka" />
            Sbíječka
          </button>
        </li>
        {/* Lžíce 30 cm */}
        <li>
          <button
            onClick={() => { setSelectedAttachmentBagr("bagr-lzice30.png"); setShowAccessoriesBagr(false); }}
            className={`w-full text-left px-4 py-2 border rounded flex items-center gap-2 hover:bg-yellow-100 ${selectedAttachmentBagr === "bagr-lzice30.png" ? "bg-yellow-200 border-yellow-500" : ""}`}
          >
            <Image src="/images/bagr-lzice30.png" width={40} height={40} alt="Lžíce 30 cm" />
            Lžíce 30 cm
          </button>
        </li>
        {/* Lžíce 50 cm (výchozí) */}
        <li>
          <button
            onClick={() => { setSelectedAttachmentBagr("bagr-lzice50.png"); setShowAccessoriesBagr(false); }}
            className={`w-full text-left px-4 py-2 border rounded flex items-center gap-2 hover:bg-yellow-100 ${selectedAttachmentBagr === "bagr-lzice50.png" ? "bg-yellow-200 border-yellow-500" : ""}`}
          >
            <Image src="/images/bagr-lzice50.png" width={40} height={40} alt="Lžíce 50 cm" />
            Lžíce 50 cm
          </button>
        </li>
        {/* Lžíce 60 cm */}
        <li>
          <button
            onClick={() => { setSelectedAttachmentBagr("bagr-lzice60.png"); setShowAccessoriesBagr(false); }}
            className={`w-full text-left px-4 py-2 border rounded flex items-center gap-2 hover:bg-yellow-100 ${selectedAttachmentBagr === "bagr-lzice60.png" ? "bg-yellow-200 border-yellow-500" : ""}`}
          >
            <Image src="/images/bagr-lzice60.png" width={40} height={40} alt="Lžíce 60 cm" />
            Lžíce 60 cm
          </button>
        </li>
        {/* Lžíce 80 cm */}
        <li>
          <button
            onClick={() => { setSelectedAttachmentBagr("bagr-lzice80.png"); setShowAccessoriesBagr(false); }}
            className={`w-full text-left px-4 py-2 border rounded flex items-center gap-2 hover:bg-yellow-100 ${selectedAttachmentBagr === "bagr-lzice80.png" ? "bg-yellow-200 border-yellow-500" : ""}`}
          >
            <Image src="/images/bagr-lzice80.png" width={40} height={40} alt="Lžíce 80 cm" />
            Lžíce 80 cm
          </button>
        </li>
        {/* Lžíce svahová */}
        <li>
          <button
            onClick={() => { setSelectedAttachmentBagr("bagr-lzicesvahova.png"); setShowAccessoriesBagr(false); }}
            className={`w-full text-left px-4 py-2 border rounded flex items-center gap-2 hover:bg-yellow-100 ${selectedAttachmentBagr === "bagr-lzicesvahova.png" ? "bg-yellow-200 border-yellow-500" : ""}`}
          >
            <Image src="/images/bagr-lzice-svahova.png" width={40} height={40} alt="Lžíce svahová" />
            Lžíce svahová
          </button>
        </li>
      </ul>
    </div>
  </div>
)}

          {/* Modal příslušenství pro Nakladač */}
          {showAccessoriesLoader && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
              <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full relative">
                <button
                  onClick={() => setShowAccessoriesLoader(false)}
                  className="absolute top-3 right-3 text-gray-600 hover:text-black"
                >
                  <CloseIcon className="w-6 h-6" />
                </button>
                <h3 className="text-lg font-bold mb-4">Vyberte příslušenství pro nakladač</h3>
                <ul className="space-y-3 text-gray-800">
                  <li>
                    <button
                      onClick={() => { setSelectedAttachmentLoader("nakladac-pluh"); setShowAccessoriesLoader(false); }}
                      className="w-full text-left px-4 py-2 border rounded hover:bg-yellow-100"
                    >
                      Pluh
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => { setSelectedAttachmentLoader("nakladac-vidle"); setShowAccessoriesLoader(false); }}
                      className="w-full text-left px-4 py-2 border rounded hover:bg-yellow-100"
                    >
                      Vidle na palety
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </section>

{/* CENÍK */}
        <section id="cenik" className="bg-[#f9c600] text-black py-16">
          <div className="container mx-auto px-4">
            <h3 className="text-2xl md:text-3xl font-bold mb-12 text-[#2f3237] text-center">
              CENÍK
            </h3>
            <table className="w-full max-w-3xl mx-auto border border-gray-300 rounded-lg">
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

        {/* KONTAKT + POPTÁVKA */}
      <div className="bg-gray-100 py-10 px-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Poptávkový formulář</h2>

        {/* Telefonní kontakt */}
        <div className="bg-yellow-200 p-3 rounded mb-6 text-center font-bold text-lg">
          📞 Zavolejte nám: +420 123 456 789
        </div>

        <form onSubmit={odeslat} className="space-y-4">
          <input
            type="text"
            placeholder="Vaše jméno"
            value={jmeno}
            onChange={(e) => setJmeno(e.target.value)}
            className="w-full border px-4 py-2 rounded"
            required
          />
          <input
            type="email"
            placeholder="Váš e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-4 py-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Adresa realizace"
            value={adresa}
            onChange={(e) => setAdresa(e.target.value)}
            onBlur={spocitatVzdalenost}
            className="w-full border px-4 py-2 rounded"
            required
          />

          {/* Zobrazení vzdálenosti */}
          {loadingKm ? (
            <p className="text-blue-500">Počítám vzdálenost...</p>
          ) : km ? (
            <p className="text-green-600">Vzdálenost: {km} km</p>
          ) : null}

          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              value={datumOd}
              onChange={(e) => setDatumOd(e.target.value)}
              className="border px-4 py-2 rounded"
              required
            />
            <input
              type="date"
              value={datumDo}
              onChange={(e) => setDatumDo(e.target.value)}
              className="border px-4 py-2 rounded"
            />
          </div>

          {/* Volba znalosti parametrů */}
          <div className="space-y-2">
            <label className="block font-semibold">
              Informace o rozměrech a zemině
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="rozmeryTypZeminy"
                checked={nevimRozmery}
                onChange={() => {
                  setNevimRozmery(true);
                  setZnamRozmery(false);
                }}
              />
              Neznám rozměr/rozsah a typ zeminy
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="rozmeryTypZeminy"
                checked={znamRozmery}
                onChange={() => {
                  setNevimRozmery(false);
                  setZnamRozmery(true);
                }}
              />
              Znám rozměr/rozsah a typ zeminy
            </label>

            {znamRozmery && (
              <div className="mt-3 space-y-2">
                <input
                  type="text"
                  placeholder="Rozměry (např. 5x10 m)"
                  value={rozmery}
                  onChange={(e) => setRozmery(e.target.value)}
                  className="w-full border px-4 py-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Typ zeminy (např. hlína, písek)"
                  value={typZeminy}
                  onChange={(e) => setTypZeminy(e.target.value)}
                  className="w-full border px-4 py-2 rounded"
                />
              </div>
            )}
          </div>

          {/* Pole Pozadavek */}
          <textarea
            value={pozadavek}
            onChange={(e) => setPozadavek(e.target.value)}
            placeholder="Popište, co potřebujete..."
            className="w-full border px-4 py-2 rounded text-gray-600"
            rows="4"
          />

          <button
            type="submit"
            className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600"
          >
            Odeslat poptávku
          </button>
        </form>
      </div>
    </div>
  );
}

        {/* Footer */}
        <footer className="bg-[#2f3237] text-white text-center py-4 text-sm">
          Zemní a Výkopové Práce • IČO:73377619 • info@zevyp.cz • Habartov, Horní Částkov ev. č. 2, 357 09
        </footer>
</div>  {/* <- uzavření hlavního wrapperu */}
    </>
  );
}

