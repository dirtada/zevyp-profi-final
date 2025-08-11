// ČÁST 1/6
import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Bars3Icon,
  XMarkIcon,
  PlusCircleIcon,
  PlusIcon,
  XMarkIcon as CloseIcon,
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

export default function Home() {
  const [open, setOpen] = useState(false);
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
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [msg, setMsg] = useState("");
  const [obsazene, setObsazene] = useState([]);

  const [nevimRozmery, setNevimRozmery] = useState(true);
  const [znamRozmery, setZnamRozmery] = useState(false);
  const [rozmery, setRozmery] = useState("");
  const [typZeminy, setTypZeminy] = useState("");

  useEffect(() => {
    async function nactiObsazene() {
      try {
        const res = await fetch("/api/kalendare");
        const data = await res.json();
        setObsazene(data.obsazene || []);
      } catch (e) {
        console.error("Chyba při načítání obsazenosti:", e);
      }
    }
    nactiObsazene();
  }, []);
// ČÁST 2/6 – Pomocné funkce

  async function spocitatVzdalenost() {
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
      } else {
        setMsg(data.error || "Chyba při odesílání.");
      }
    } catch (err) {
      console.error(err);
      setMsg("Nepodařilo se připojit k serveru.");
    }
  }
  // ČÁST 3/6 – Komponenty: Header, Hero, Sluzby, Cenik

  const Header = () => (
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
           <a href="#cenik" onClick={(e) => {
  e.preventDefault();
  document.getElementById("sluzby")?.scrollIntoView({ behavior: "smooth" });
  setOpen(false);
}}>
  NAŠE SLUŽBY
</a>
           <a href="#technika" onClick={(e) => {
  e.preventDefault();
  document.getElementById("technika")?.scrollIntoView({ behavior: "smooth" });
  setOpen(false);
}}>
  TECHNIKA
</a>
          <a href="#cenik" onClick={(e) => {
  e.preventDefault();
  document.getElementById("cenik")?.scrollIntoView({ behavior: "smooth" });
  setOpen(false);
}}>
  CENÍK
</a>

         <a href="#kontakt" onClick={(e) => {
  e.preventDefault();
  document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" });
  setOpen(false);
}}>
  KONTAKT
</a>

        </div>
      )}
    </header>
  );

  const Hero = () => (
    <section className="bg-cover bg-center py-20 relative text-white"
      style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}>
      <div className="container mx-auto text-center px-4">
        <div className="grid md:grid-cols-2 items-center gap-8">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Zemní a výkopové práce</h1>
            <p className="text-lg md:text-2xl mb-8">Profesionální služby s moderní technikou a zkušeným týmem</p>
            <a href="#kontakt" className="bg-[#f9c600] text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition">Kontaktujte nás</a>
          </div>
          <div className="hidden md:block">
            <Image
              src="/images/bagr-hero.png"
              alt="Bagr"
              width={500}
              height={500}
              className="mx-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );

  const Sluzby = () => (
    <section id="sluzby" className="py-20 bg-gray-100">
      <div className="container mx-auto text-center px-4">
        <h2 className="text-3xl font-bold mb-10">Naše služby</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 shadow rounded">
            <TruckIcon className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
            <h3 className="font-bold text-xl mb-2">Výkopové práce</h3>
            <p>Výkopy základů, přípojek, bazénů a další zemní práce.</p>
          </div>
          <div className="bg-white p-6 shadow rounded">
            <BuildingOffice2Icon className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
            <h3 className="font-bold text-xl mb-2">Terénní úpravy</h3>
            <p>Srovnání ploch, navezení materiálu a příprava pozemků.</p>
          </div>
          <div className="bg-white p-6 shadow rounded">
            <SquaresPlusIcon className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
            <h3 className="font-bold text-xl mb-2">Pronájem strojů</h3>
            <p>Pronájem bagru, nakladače a válce s obsluhou i bez ní.</p>
          </div>
        </div>
      </div>
    </section>
  );

  const Cenik = () => (
    <section id="cenik" className="bg-[#f9c600] text-black py-16">
      <div className="container mx-auto px-4">
        <h3 className="text-2xl md:text-3xl font-bold mb-12 text-[#2f3237] text-center">CENÍK</h3>
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
  const Technika = () => (
    <section id="technika" className="py-20 bg-white">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-10">Naše technika</h2>
        <div className="grid md:grid-cols-3 gap-8 items-start">

          {/* Válec */}
          <div className="bg-gray-100 p-6 rounded shadow">
            <div className="relative">
              <img src="/images/valec.png" alt="Válec" className="mx-auto mb-4 w-full h-auto max-h-64 object-contain" />
            </div>
            <h3 className="font-bold text-xl">Válec</h3>
            <ul className="text-sm text-gray-700 mt-3 space-y-2 text-left">
              <li className="flex items-center gap-2"><ScaleIcon className="w-5 h-5 text-yellow-500" /> Hmotnost: 2.7 t</li>
              <li className="flex items-center gap-2"><Cog6ToothIcon className="w-5 h-5 text-yellow-500" /> Motor: Kubota 33 kW</li>
              <li className="flex items-center gap-2"><ArrowsUpDownIcon className="w-5 h-5 text-yellow-500" /> Šířka válce: 1,2 m</li>
              <li className="flex items-center gap-2"><WrenchScrewdriverIcon className="w-5 h-5 text-yellow-500" /> Pro asfalt, štěrk, zeminu</li>
            </ul>
          </div>

          {/* Bagr */}
          <div className="bg-gray-100 p-6 rounded shadow relative scale-105 z-10">
            <div className="relative inline-block">
              <img src={selectedAttachmentBagr} alt="Bagr" className="mx-auto mb-4 w-full h-auto max-h-72 object-contain" />
              {/* Plus ikona přesně na lžíci (pravý dolní roh obrázku) */}
              <button
                onClick={() => setShowAccessoriesBagr(true)}
                className="absolute bottom-6 right-6 bg-yellow-500 text-black p-2 rounded-full shadow hover:bg-yellow-400"
              >
                <PlusIcon className="w-6 h-6" />
              </button>
            </div>
            <h3 className="font-bold text-xl">Bagr</h3>
            <ul className="text-sm text-gray-700 mt-3 space-y-2 text-left">
              <li className="flex items-center gap-2"><ScaleIcon className="w-5 h-5 text-yellow-500" /> Hmotnost: 8 t</li>
              <li className="flex items-center gap-2"><Cog6ToothIcon className="w-5 h-5 text-yellow-500" /> Motor: Yanmar 55 kW</li>
              <li className="flex items-center gap-2"><ArrowsUpDownIcon className="w-5 h-5 text-yellow-500" /> Hloubka kopání: 4,2 m</li>
              <li className="flex items-center gap-2"><WrenchScrewdriverIcon className="w-5 h-5 text-yellow-500" /> Příslušenství volitelné</li>
            </ul>
          </div>

          {/* Nakladač */}
          <div className="bg-gray-100 p-6 rounded shadow relative">
            <div className="relative inline-block">
              <img src={selectedAttachmentNakladac} alt="Nakladač" className="mx-auto mb-4 w-full h-auto max-h-64 object-contain" />
              {/* Plus ikona na lžíci */}
              <button
                onClick={() => setShowAccessoriesNakladac(true)}
                className="absolute bottom-6 right-6 bg-yellow-500 text-black p-2 rounded-full shadow hover:bg-yellow-400"
              >
                <PlusIcon className="w-6 h-6" />
              </button>
            </div>
            <h3 className="font-bold text-xl">Nakladač</h3>
            <ul className="text-sm text-gray-700 mt-3 space-y-2 text-left">
              <li className="flex items-center gap-2"><ScaleIcon className="w-5 h-5 text-yellow-500" /> Hmotnost: 5 t</li>
              <li className="flex items-center gap-2"><Cog6ToothIcon className="w-5 h-5 text-yellow-500" /> Motor: Perkins 45 kW</li>
              <li className="flex items-center gap-2"><ArrowsUpDownIcon className="w-5 h-5 text-yellow-500" /> Nosnost: 2,5 t</li>
              <li className="flex items-center gap-2"><WrenchScrewdriverIcon className="w-5 h-5 text-yellow-500" /> Možnost pluhu</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modal pro Bagr */}
      {showAccessoriesBagr && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full relative">
            <button onClick={() => setShowAccessoriesBagr(false)} className="absolute top-3 right-3 text-gray-600 hover:text-black">
              <CloseIcon className="w-6 h-6" />
            </button>
            <h3 className="text-lg font-bold mb-4">Vyberte příslušenství pro bagr</h3>
            <ul className="space-y-3 text-gray-800">
              <li><button onClick={() => { setSelectedAttachmentBagr("/images/bagr-vrtak.png"); setShowAccessoriesBagr(false); }} className="w-full text-left px-4 py-2 border rounded hover:bg-yellow-100">Vrták</button></li>
              <li><button onClick={() => { setSelectedAttachmentBagr("/images/bagr-sbijecka.png"); setShowAccessoriesBagr(false); }} className="w-full text-left px-4 py-2 border rounded hover:bg-yellow-100">Sbíječka</button></li>
              <li><button onClick={() => { setSelectedAttachmentBagr("/images/bagr-lzice30.png"); setShowAccessoriesBagr(false); }} className="w-full text-left px-4 py-2 border rounded hover:bg-yellow-100">Lžíce 30 cm</button></li>
        <li><button onClick={() => { setSelectedAttachmentBagr("/images/bagr-lzice50.png"); setShowAccessoriesBagr(false); }} className="w-full text-left px-4 py-2 border rounded hover:bg-yellow-100">Lžíce 50 cm</button></li>
        <li><button onClick={() => { setSelectedAttachmentBagr("/images/bagr-lzice60.png"); setShowAccessoriesBagr(false); }} className="w-full text-left px-4 py-2 border rounded hover:bg-yellow-100">Lžíce 60 cm</button></li>
              <li><button onClick={() => { setSelectedAttachmentBagr("/images/bagr-lzice80.png"); setShowAccessoriesBagr(false); }} className="w-full text-left px-4 py-2 border rounded hover:bg-yellow-100">Lžíce 80 cm</button></li>
              <li><button onClick={() => { setSelectedAttachmentBagr("/images/bagr-lzicesvahova.png"); setShowAccessoriesBagr(false); }} className="w-full text-left px-4 py-2 border rounded hover:bg-yellow-100">Lžíce svahová</button></li>
            </ul>
          </div>
        </div>
      )}

      {/* Modal pro Nakladač */}
      {showAccessoriesNakladac && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full relative">
            <button onClick={() => setShowAccessoriesNakladac(false)} className="absolute top-3 right-3 text-gray-600 hover:text-black">
              <CloseIcon className="w-6 h-6" />
            </button>
            <h3 className="text-lg font-bold mb-4">Vyberte příslušenství pro nakladač</h3>
            <ul className="space-y-3 text-gray-800">
              <li><button onClick={() => { setSelectedAttachmentNakladac("/images/nakladac.png"); setShowAccessoriesNakladac(false); }} className="w-full text-left px-4 py-2 border rounded hover:bg-yellow-100">Standardní lopata</button></li>
              <li><button onClick={() => { setSelectedAttachmentNakladac("/images/nakladac-pluh.png"); setShowAccessoriesNakladac(false); }} className="w-full text-left px-4 py-2 border rounded hover:bg-yellow-100">Pluh</button></li>
            </ul>
          </div>
        </div>
      )}
    </section>
  );
  const Poptavka = () => (
    <section id="kontakt" className="bg-white py-20">
      <div className="container mx-auto px-4">
        <h3 className="text-3xl font-bold mb-8 text-center">Poptávka</h3>

        <div className="bg-[#f9f9f9] p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
          <div className="text-center mb-4">
            <p className="text-sm bg-yellow-200 text-black font-bold py-2 px-4 inline-block rounded">
              📞 Volejte: <span className="underline">+420 728 388 993</span>
            </p>
          </div>

          <div className="grid gap-4">
            <input
              type="text"
              placeholder="Vaše jméno"
              className="p-3 border rounded w-full"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Váš e-mail"
              className="p-3 border rounded w-full"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
            />
            <input
              type="text"
              placeholder="Telefon (nepovinné)"
              className="p-3 border rounded w-full"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
            <input
              type="text"
              placeholder="Adresa realizace"
              className="p-3 border rounded w-full"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
            />
            <button
              onClick={spocitatVzdalenost}
              className="bg-[#f9c600] font-bold text-black p-3 rounded hover:bg-yellow-300"
            >
              Zjistit vzdálenost
            </button>
            {msg && <p className="text-center text-sm text-gray-600">{msg}</p>}

            <div className="mt-6">
  <label className="block font-medium mb-1">Zvol datum realizace (rozsah):</label>
 <Calendar
  selectRange={true}
  value={
    dateFrom && dateTo
      ? [new Date(dateFrom), new Date(dateTo)]
      : null
  }
  onChange={(range) => {
    if (Array.isArray(range)) {
      const [from, to] = range;
      setDateFrom(from.toISOString().split("T")[0]);
      setDateTo(to.toISOString().split("T")[0]);
    }
  }}
  tileClassName={({ date }) =>
    obsazene.includes(date.toISOString().split("T")[0])
      ? "bg-red-300 text-white"
      : ""
  }
/>

</div>

            {/* Výběr znalosti údajů */}
            <div className="mt-6">
              <p className="font-medium mb-2">
                Znáte rozměry a typ zeminy?
              </p>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={nevimRozmery}
                    onChange={() => {
                      setNevimRozmery(true);
                      setZnamRozmery(false);
                    }}
                  />
                  Ne
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={znamRozmery}
                    onChange={() => {
                      setNevimRozmery(false);
                      setZnamRozmery(true);
                    }}
                  />
                  Ano
                </label>
              </div>
            </div>

            {znamRozmery && (
              <div className="mt-4 grid gap-4">
                <input
                  type="text"
                  placeholder="Zadejte rozměry (např. 10 × 8 m)"
                  className="p-3 border rounded w-full"
                  value={rozmery}
                  onChange={(e) => setRozmery(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Zadejte typ zeminy (např. hlína, písek)"
                  className="p-3 border rounded w-full"
                  value={typZeminy}
                  onChange={(e) => setTypZeminy(e.target.value)}
                />
              </div>
            )}

            <textarea
              rows={4}
              placeholder="Poptávám výkop základové desky..."
              className="p-3 border rounded w-full text-gray-600"
              value={pozadavek}
              onChange={(e) => setPozadavek(e.target.value)}
            />

            <button
              onClick={odeslatPoptavku}
              className="bg-[#f9c600] font-bold text-black p-4 rounded hover:bg-yellow-300 mt-4"
            >
              Odeslat poptávku
            </button>
          </div>
        </div>
      </div>
    </section>
  );
  const Footer = () => (
    <footer className="bg-[#2f3237] text-white py-8 mt-16">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} ZEVYP – Zemní a výkopové práce</p>
        <p className="text-sm text-gray-400 mt-2">Vytvořeno s pomocí AI a ruční láskou</p>
      </div>
    </footer>
  );

  return (
    <>
      <Head>
        <title>Zemní a Výkopové práce | Zevyp.cz</title>
        <meta name="description" content="Profesionální výkopové a zemní práce s moderní technikou v Česku." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main>
        <Hero />
        <Sluzby />
        <Technika />
        <Cenik />
        <Poptavka />
      </main>
      <Footer />
    </>
  );
}
