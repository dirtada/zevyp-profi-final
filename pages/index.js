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

  const [knowsDetails, setKnowsDetails] = useState(null);
  const [dimensions, setDimensions] = useState("");
  const [soilType, setSoilType] = useState("");

  // stav pro obsazenost a datumový rozsah
  const [obsazene, setObsazene] = useState([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [msg, setMsg] = useState("");

  // pro volbu znalosti rozměrů/zeminy
  const [nevimRozmery, setNevimRozmery] = useState(true);
  const [znamRozmery, setZnamRozmery] = useState(false);
  const [rozmery, setRozmery] = useState("");
  const [typZeminy, setTypZeminy] = useState("");

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

    async function spocitatVzdalenost() {
    if (!customerAddress) return setMsg("Zadej prosím adresu.");
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
  }

    async function odeslatPoptavku() {
    if (!customerName || !customerEmail || !customerAddress || !dateFrom || !dateTo) {
      setMsg("Vyplň prosím všechna pole a vyber rozsah dní.");
      return;
    }

    const infoZemina = nevimRozmery
      ? "Zákazník neví rozměr/rozsah a typ zeminy."
      : `Rozměry: ${rozmery || "-"}, Typ zeminy: ${typZeminy || "-"}`;

    try {
      const res = await fetch("/api/objednavka", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // identifikace/komunikace
          jmeno: customerName,
          email: customerEmail,
          telefon: customerPhone || "",
          // místo a termíny
          adresa: customerAddress,
          datumOd: dateFrom,
          datumDo: dateTo,
          // doplňující info
          km: distance,
          pozadavek,
          infoZemina,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg("Poptávka byla odeslána! Brzy se ti ozveme.");
      } else {
        setMsg(data.error || "Chyba při odesílání.");
      }
    } catch (err) {
      console.error(err);
      setMsg("Nepodařilo se připojit k serveru.");
    }
  }


  // HERO sekce
  const Hero = () => (
    <section className="bg-cover bg-center py-20" style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}>
      <div className="container mx-auto text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Zemní a výkopové práce</h1>
        <p className="text-lg md:text-2xl mb-8">Profesionální služby s moderní technikou a zkušeným týmem</p>
        <a href="#kontakt" className="bg-[#f9c600] text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition">Kontaktujte nás</a>
      </div>
    </section>
  );

  // SLUŽBY
  const Sluzby = () => (
    <section id="sluzby" className="py-20 bg-gray-100">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-10">Naše služby</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 shadow rounded">
            <TruckIcon className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
            <h3 className="font-bold text-xl mb-2">Výkopové práce</h3>
            <p>Provádíme výkopové práce pro základy, přípojky a terénní úpravy.</p>
          </div>
          <div className="bg-white p-6 shadow rounded">
            <BuildingOffice2Icon className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
            <h3 className="font-bold text-xl mb-2">Terénní úpravy</h3>
            <p>Úpravy terénu, odvoz a dovoz materiálu, hutnění ploch.</p>
          </div>
          <div className="bg-white p-6 shadow rounded">
            <SquaresPlusIcon className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
            <h3 className="font-bold text-xl mb-2">Pronájem strojů</h3>
            <p>Pronájem bagrů, nakladačů a válců s obsluhou nebo bez obsluhy.</p>
          </div>
        </div>
      </div>
    </section>
  );
  // TECHNIKA
  const Technika = () => (
    <section id="technika" className="py-20 bg-white">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-10">Naše technika</h2>

        <div className="grid md:grid-cols-3 gap-8 items-start">

          {/* VÁLEC */}
          <div className="bg-gray-100 p-6 rounded shadow">
            <img src="/images/valec.png" alt="Válec" className="mx-auto mb-4" />
            <h3 className="font-bold text-xl">Válec</h3>
            <ul className="text-sm text-gray-700 mt-3 space-y-2">
              <li className="flex items-center gap-2"><ScaleIcon className="w-5 h-5 text-yellow-500" /> Hmotnost: 2.7 t</li>
              <li className="flex items-center gap-2"><Cog6ToothIcon className="w-5 h-5 text-yellow-500" /> Motor: Kubota 33 kW</li>
              <li className="flex items-center gap-2"><ArrowsUpDownIcon className="w-5 h-5 text-yellow-500" /> Pracovní šířka válce: 1,2 m</li>
              <li className="flex items-center gap-2"><WrenchScrewdriverIcon className="w-5 h-5 text-yellow-500" /> Vhodný pro hutnění asfaltu, štěrku a zemin</li>
            </ul>
          </div>

          {/* BAGR – uprostřed */}
          <div className="bg-gray-100 p-6 rounded shadow relative">
            <div className="relative inline-block">
              <img src={selectedAttachmentBagr} alt="Bagr" className="mx-auto mb-4 transition-all duration-300" />
              {/* Plus ikona */}
              <button
                onClick={() => setShowAccessoriesBagr(true)}
                className="absolute top-1/2 right-10 bg-yellow-500 text-black p-2 rounded-full shadow hover:bg-yellow-400"
              >
                <PlusIcon className="w-6 h-6" />
              </button>
            </div>
            <h3 className="font-bold text-xl">Bagr</h3>
            <ul className="text-sm text-gray-700 mt-3 space-y-2">
              <li className="flex items-center gap-2"><ScaleIcon className="w-5 h-5 text-yellow-500" /> Hmotnost: 8 t</li>
              <li className="flex items-center gap-2"><Cog6ToothIcon className="w-5 h-5 text-yellow-500" /> Motor: Yanmar 55 kW</li>
              <li className="flex items-center gap-2"><ArrowsUpDownIcon className="w-5 h-5 text-yellow-500" /> Hloubka kopání: 4,2 m</li>
              <li className="flex items-center gap-2"><WrenchScrewdriverIcon className="w-5 h-5 text-yellow-500" /> Možnost různých příslušenství</li>
            </ul>
          </div>

          {/* NAKLADAČ */}
          <div className="bg-gray-100 p-6 rounded shadow relative">
            <div className="relative inline-block">
              <img src={selectedAttachmentNakladac} alt="Nakladač" className="mx-auto mb-4 transition-all duration-300" />
              {/* Plus ikona */}
              <button
                onClick={() => setShowAccessoriesNakladac(true)}
                className="absolute top-1/2 right-10 bg-yellow-500 text-black p-2 rounded-full shadow hover:bg-yellow-400"
              >
                <PlusIcon className="w-6 h-6" />
              </button>
            </div>
            <h3 className="font-bold text-xl">Nakladač</h3>
            <ul className="text-sm text-gray-700 mt-3 space-y-2">
              <li className="flex items-center gap-2"><ScaleIcon className="w-5 h-5 text-yellow-500" /> Hmotnost: 5 t</li>
              <li className="flex items-center gap-2"><Cog6ToothIcon className="w-5 h-5 text-yellow-500" /> Motor: Perkins 45 kW</li>
              <li className="flex items-center gap-2"><ArrowsUpDownIcon className="w-5 h-5 text-yellow-500" /> Nosnost: 2,5 t</li>
              <li className="flex items-center gap-2"><WrenchScrewdriverIcon className="w-5 h-5 text-yellow-500" /> Možnost nasazení pluhu</li>
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
              <li><button onClick={() => { setSelectedAttachmentBagr("/images/bagr-lzice50.png"); setShowAccessoriesBagr(false); }} className="w-full text-left px-4 py-2 border rounded hover:bg-yellow-100">Lžíce 50 cm</button></li>
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
              <li><button onClick={() => { setSelectedAttachmentNakladac("/images/nakladac-standard.png"); setShowAccessoriesNakladac(false); }} className="w-full text-left px-4 py-2 border rounded hover:bg-yellow-100">Standardní lopata</button></li>
            </ul>
          </div>
        </div>
      )}
    </section>
  );
  // CENÍK
  const Cenik = () => (
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
  return (
    <>
      <Head>
        <title>Zemní a výkopové práce – Zevyp.cz</title>
        <meta
          name="description"
          content="Výkopové a zemní práce minibagrem Hitachi – Praha a okolí."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <div className="min-h-screen bg-[#f9c600] font-sans text-gray-900">
        {/* Hero */}
        {/* Pokud chceš použít vlastní Hero sekci z vrchu souboru, můžeš buď volat <Hero /> 
            anebo nechat tu verzi co už teď máš nahoře v kódu. 
            Pokud používáš <Hero/>, odstraň duplikát. */}
        {/* <Hero /> */}

        {/* SLUŽBY */}
        {/* <Sluzby /> */}

        {/* TECHNIKA */}
        <Technika />

        {/* CENÍK */}
        <Cenik />

        {/* KONTAKT + POPTÁVKA – sem doplň svou sjednocenou poptávku,
            kterou už máš (s adresou, vzdáleností, rozsahem dat, poznámkou atd.) */}
        {/* ... tvoje sekce #kontakt ... */}

        <footer className="bg-[#2f3237] text-white text-center py-4 text-sm">
          Zemní a Výkopové Práce • IČO:73377619 • info@zevyp.cz • Habartov,
          Horní Částkov ev. č. 2, 357 09
        </footer>
      </div>
    </>
  );
}

