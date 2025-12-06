// pages/index.js
import Head from "next/head";
import Link from "next/link";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useState, useEffect, useMemo } from "react";
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
  PhoneIcon,
  XMarkIcon as CloseIcon,
} from "@heroicons/react/24/solid";
import { Inter } from "next/font/google";
import "react-calendar/dist/Calendar.css";

const inter = Inter({ subsets: ["latin", "latin-ext"] });
// Calendar přes dynamic import (bez SSR záseků)
const Calendar = dynamic(() => import("react-calendar"), { ssr: false });

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 bg-[#f9c600]/90 backdrop-blur supports-[backdrop-filter]:bg-[#f9c600]/80 border-b border-black/5 z-50">
      <div className="container mx-auto flex justify-between items-center px-4 py-2">
        <Image
          src="/images/zevyp-newlogo.png"
          alt="Zevyp logo"
          width={150}
          height={150}
          priority
          sizes="150px"
          className="h-12 w-auto"
        />

        {/* Desktop: menu + telefon */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex gap-6 text-base md:text-lg">
            <a href="#sluzby" className="hover:underline">NAŠE SLUŽBY</a>
            <a href="#technika" className="hover:underline">TECHNIKA</a>
            <a href="#cenik" className="hover:underline">CENÍK</a>
            <a href="#kontakt" className="hover:underline">KONTAKT</a>
        
          </nav>

          <a
            href="tel:+420725319300"
            aria-label="Zavolat +420 725 319 300"
            className="inline-flex items-center gap-2 bg-white/90 hover:bg-white text-[#2f3237] font-semibold px-4 py-2 rounded-full shadow-sm ring-1 ring-black/10 transition whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2f3237] focus-visible:ring-offset-[#f9c600]"
          >
            <PhoneIcon className="w-5 h-5" />
            <span>+420&nbsp;725&nbsp;319&nbsp;300</span>
          </a>
        </div>

        {/* Mobile burger */}
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Otevřít menu">
          {open ? <XMarkIcon className="w-8 h-8" /> : <Bars3Icon className="w-8 h-8" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#f9c600] py-4 px-6 flex flex-col gap-4 shadow-lg">
          <a href="#sluzby" onClick={() => setOpen(false)}>NAŠE SLUŽBY</a>
          <a href="#technika" onClick={() => setOpen(false)}>TECHNIKA</a>
          <a href="#cenik" onClick={() => setOpen(false)}>CENÍK</a>
          <a href="#kontakt" onClick={() => setOpen(false)}>KONTAKT</a>
          <a
            href="tel:+420725319300"
            className="mt-2 inline-flex items-center justify-center gap-2 bg-white text-[#2f3237] font-semibold px-4 py-3 rounded-lg shadow ring-1 ring-black/10"
          >
            <PhoneIcon className="w-5 h-5" />
            Zavolat
          </a>
        </div>
      )}
    </header>
  );
}

export default function Home() {
  const [adresa, setAdresa] = useState("");
  const [datumOd, setDatumOd] = useState("");
  const [datumDo, setDatumDo] = useState("");
  const [znameRozmery, setZnameRozmery] = useState(false);
  const [typZeminy, setTypZeminy] = useState("");
  const [rozmerZeminy, setRozmerZeminy] = useState("");
  const [obsazene, setObsazene] = useState([]);
  const [popisZK, setpopisZK] = useState("");
  const [km, setKm] = useState(null);
  const [selectedAttachmentBagr, setSelectedAttachmentBagr] = useState(null);
  const [selectedAttachmentLoader, setSelectedAttachmentLoader] = useState(null);
  const [showAccessoriesBagr, setShowAccessoriesBagr] = useState(false);
  const [showAccessoriesLoader, setShowAccessoriesLoader] = useState(false);
  const [msg, setMsg] = useState("");
  const [loadingKm, setLoadingKm] = useState(false);
  const [sending, setSending] = useState(false);

  // Lokální YYYY-MM-DD (bez UTC posunu)
  const formatLocalDate = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

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

  const occupiedSet = useMemo(() => new Set(obsazene), [obsazene]);

  const spocitatVzdalenost = async () => {
    if (!adresa) { setMsg("Zadejte prosím adresu."); return; }
    setLoadingKm(true);
    setMsg("");
    try {
      const res = await fetch("/api/vzdalenost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adresa }),
      });
      const data = await res.json();
      if (res.ok) {
        setKm(data.km);
        setMsg(`Vzdálenost: ${data.km} km`);
      } else {
        setMsg(data.error || "Nepodařilo se zjistit vzdálenost.");
      }
    } catch (e) {
      console.error(e);
      setMsg("Chyba při komunikaci se serverem.");
    } finally {
      setLoadingKm(false);
    }
  };

  const odeslat = async () => {
    if (sending) return;
    if (!popisZK || !adresa || !datumOd || !datumDo) {
      setMsg("Vyplňte prosím všechna povinná pole.");
      return;
    }
    setSending(true);
    setMsg("");
    try {
      const res = await fetch("/api/objednavka", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          popisZK,
          adresa,
          datumOd,
          datumDo,
          typZeminy: znameRozmery ? typZeminy : null,
          rozmerZeminy: znameRozmery ? rozmerZeminy : null,
          km,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg("Poptávka byla odeslána!");
      } else {
        setMsg(data.error || "Chyba při odesílání.");
      }
    } catch (e) {
      console.error(e);
      setMsg("Nepodařilo se připojit k serveru.");
    } finally {
      setSending(false);
    }
  };

  const jsonLdLocalBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://www.zevyp-kp.cz/#company",
    "name": "Zevyp – Zemní a výkopové práce",
    "url": "https://www.zevyp-kp.cz/",
    "telephone": "+420777123456",
    "image": "https://www.zevyp.cz/images/bagr-hero.png",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Horní Částkov ev. č. 2",
      "addressLocality": "Habartov",
      "postalCode": "357 09",
      "addressCountry": "CZ"
    },
    "areaServed": ["Karlovy Vary", "Karlovarský kraj"],
    "description": "Profesionální zemní a výkopové práce minibagrem v Karlovarském kraji a okolí.",
    "geo": { "@type": "GeoCoordinates", "latitude": 50.181, "longitude": 12.634 } // volitelně – klidně smaž, pokud nechceš
  };

  return (
    <>
      <Head>
        <title>Zemní a výkopové práce Karlovarský kraj a okolí | Zevyp-kp.cz</title>
        <meta
          name="description"
          content="Zemní a výkopové práce minibagrem Hitachi – Karlovarský kraj a okolí. Výkopy základů, zásypy, úpravy terénu. Rychle a spolehlivě. Zavolejte +420 725 319 300."
        />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://www.zevyp-kp.cz/" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="cs_CZ" />
        <meta property="og:site_name" content="zevyp-kp.cz" />
        <meta property="og:url" content="https://www.zevyp-kp.cz/" />
        <meta property="og:title" content="Zemní a výkopové práce Karlovarský kraj a okolí | Zevyp.cz" />
        <meta
          property="og:description"
          content="Výkopové a zemní práce minibagrem Hitachi v Karlovarském kraji a okolí."
        />
        <meta property="og:image" content="https://www.zevyp.cz/images/bagr-hero.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Zemní a výkopové práce Karlovarský kraj a okolí | Zevyp.cz" />
        <meta
          name="twitter:description"
          content="Výkopové a zemní práce minibagrem Hitachi v Karlovarském kraji a okolí. Zavolejte +420 725 319 300."
        />
        <meta name="twitter:image" content="https://www.zevyp.cz/images/bagr-hero.png" />

        {/* JSON-LD LocalBusiness */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdLocalBusiness) }}
        />
      </Head>

      <Header />

      <div className={`${inter.className} min-h-screen bg-[#f9c600] text-gray-900`}>
        {/* Hero */}
        <main className="bg-gradient-to-br from-[#2f3237] via-[#2f3237] to-black text-white py-16">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 text-left mb-12 md:mb-0 relative z-20">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                ZEMNÍ A VÝKOPOVÉ PRÁCE
              </h1>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8 max-w-[60ch]">
                Provádíme{" "}
                <span className="text-[#f9c600] font-semibold">spolehlivé zemní a výkopové práce</span>{" "}
                minibagrem Hitachi v Karlovarském kraji a okolí.
              </p>
              <a
                href="#kontakt"
                className="inline-block bg-[#f9c600] text-[#2f3237] font-bold px-6 py-3 rounded-lg shadow hover:bg-yellow-400 transition
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#f9c600] focus-visible:ring-offset-[#2f3237]"
              >
                Nezávazná poptávka
              </a>
            </div>
            <div className="md:w-1/2 flex justify-center relative z-10">
              <Image
                src="/images/bagr-hero.png"
                alt="Minibagr Hitachi při práci"
                width={700}
                height={500}
                priority
                sizes="(min-width: 768px) 700px, 100vw"
                className="object-contain -mb-24 md:-mb-32"
              />
            </div>
          </div>
        </main>

<section id="sluzby" className="scroll-mt-24 bg-[#f9c600] text-black py-16">
  <div className="container mx-auto px-4">
    <h2 className="text-2xl md:text-3xl font-bold mb-10 text-[#2f3237] text-center">
      NAŠE SLUŽBY
    </h2>

    {/* ---------- MŘÍŽKA 3x2 (6 boxů) ---------- */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">

      {/* 1. Výkopové práce */}
      <article className="flex flex-col h-full rounded-2xl bg-white ring-1 ring-black/10 p-6 shadow-sm hover:shadow-xl hover:ring-2 hover:ring-[#2f3237] hover:-translate-y-1 transition-all duration-300">
        <div className="flex-grow">
          <h3 className="text-lg font-bold text-[#2f3237]">Výkopové práce</h3>
          <p className="mt-2 text-sm text-gray-600 leading-relaxed">
            Výkopy základových pasů a patek, výkopy pro inženýrské sítě, bazény, jímky a další.
          </p>
        </div>
        <img 
          src="/videos/vykopove_prace.gif"
          alt="Animace výkopových prací"
          className="w-full rounded-lg mt-5 aspect-video object-cover"
        />
      </article>

      {/* 2. Terénní úpravy */}
      <article className="flex flex-col h-full rounded-2xl bg-white ring-1 ring-black/10 p-6 shadow-sm hover:shadow-xl hover:ring-2 hover:ring-[#2f3237] hover:-translate-y-1 transition-all duration-300">
        <div className="flex-grow">
          <h3 className="text-lg font-bold text-[#2f3237]">Terénní úpravy</h3>
          <p className="mt-2 text-sm text-gray-600 leading-relaxed">
            Svahování, zarovnávání a skrývka ornice. Příprava pozemku pro stavbu nebo finální úpravu terénu.
          </p>
        </div>
        <img 
          src="/videos/terenni_upravy.gif"
          alt="Animace terenních úprav"
          className="w-full rounded-lg mt-5 aspect-video object-cover"
        />
      </article>

      {/* 3. Stavební práce */}
      <article className="flex flex-col h-full rounded-2xl bg-white ring-1 ring-black/10 p-6 shadow-sm hover:shadow-xl hover:ring-2 hover:ring-[#2f3237] hover:-translate-y-1 transition-all duration-300">
        <div className="flex-grow">
          <h3 className="text-lg font-bold text-[#2f3237]">Stavební práce</h3>
          <p className="mt-2 text-sm text-gray-600 leading-relaxed">
            Stavební příprava pro pokládky chodníků, dlažby a dalších povrchů.
          </p>
        </div>
        <img 
          src="/videos/stavebni_prace.gif"
          alt="Animace stavebních prací"
          className="w-full rounded-lg mt-5 aspect-video object-cover"
        />
      </article>

      {/* 4. Bourací práce */}
      <article className="flex flex-col h-full rounded-2xl bg-white ring-1 ring-black/10 p-6 shadow-sm hover:shadow-xl hover:ring-2 hover:ring-[#2f3237] hover:-translate-y-1 transition-all duration-300">
        <div className="flex-grow">
          <h3 className="text-lg font-bold text-[#2f3237]">Bourací práce</h3>
          <p className="mt-2 text-sm text-gray-600 leading-relaxed">
            Bourání menších objektů, betonových konstrukcí, základů, plotů a zpevněných ploch.
          </p>
        </div>
        <img 
          src="/images/bourani.png"
          alt="Animace bouracích prací"
          className="w-full rounded-lg mt-5 aspect-video object-cover"
        />
      </article>

      {/* 5. Bagr s vrtákem */}
      <article className="flex flex-col h-full rounded-2xl bg-white ring-1 ring-black/10 p-6 shadow-sm hover:shadow-xl hover:ring-2 hover:ring-[#2f3237] hover:-translate-y-1 transition-all duration-300">
        <div className="flex-grow">
          <h3 className="text-lg font-bold text-[#2f3237]">Bagr s vrtákem</h3>
          <p className="mt-2 text-sm text-gray-600 leading-relaxed">
            Vrtání děr pro plotové sloupky, patky, piloty a další drobné stavební prvky.
          </p>
        </div>
        <img 
          src="/images/vrtani.png"
          alt="Animace vrtání"
          className="w-full rounded-lg mt-5 aspect-video object-cover"
        />
      </article>

      {/* 6. 3D OBOUSTRANNÁ VIZITKA */}
      {/* 'group' na hlavním článku umožňuje ovládat hover efekt uvnitř */}
      <article className="group relative flex flex-col h-full rounded-2xl bg-white ring-1 ring-black/10 p-6 shadow-sm hover:shadow-xl transition-all duration-300 items-center justify-center overflow-hidden">
        
        {/* Nadpis pro sjednocení s ostatními boxy */}
        <h3 className="text-lg font-bold text-[#2f3237] mb-4 self-start">Kontakty & Individuální domluva</h3>

        {/* 3D Scéna - Kontejner definující perspektivu */}
        {/* aspect ratio nastavuje poměr stran vizitky */}
        <div className="w-full aspect-[1.7/1] relative [perspective:1500px]">
          
          {/* Samotný otáčecí element (Flipper) */}
          {/* group-hover:rotate-y-180 zajistí otočení při najetí na hlavní article */}
          <div className="w-full h-full relative transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] shadow-lg rounded-xl">
            
            {/* --- PŘEDNÍ STRANA (Kontakty) --- */}
            {/* [backface-visibility:hidden] skryje tuto stranu, když je otočená zády */}
            <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-xl overflow-hidden bg-[#f9c600]">
               {/* ZDE VLOŽTE CESTU K OBRÁZKU S KONTAKTY (image_1.png) */}
              <img 
                src="/images/vizitka-kontakty.png" 
                alt="ZEVYP Kontakty Klára Pudilová" 
                className="w-full h-full object-cover" 
              />
            </div>

            {/* --- ZADNÍ STRANA (Logo) --- */}
            {/* Tato strana je již na začátku otočená o 180 stupňů [transform:rotateY(180deg)] */}
            <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-xl overflow-hidden bg-[#f9c600] flex items-center justify-center">
               {/* ZDE VLOŽTE CESTU K OBRÁZKU S LOGEM (image_0.png) */}
              <img 
                src="/images/vizitka-logo.png" 
                alt="ZEVYP Logo" 
                className="w-full h-full object-cover" 
              />
            </div>

          </div>
        </div>
        
        {/* Nápověda pro uživatele */}
        <p className="mt-4 text-xs text-gray-400 uppercase tracking-wider font-semibold text-center flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 animate-bounce">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
          </svg>
          Najeďte pro otočení
        </p>
      </article>

    </div>
  </div>
</section>


        {/* TECHNIKA */}
        <section id="technika" className="scroll-mt-24 bg-white text-black py-16 relative">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-[#2f3237]">TECHNIKA</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start justify-center">
              {/* Válec */}
              <div className="bg-gray-50 rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                <Image src="/images/valec.png" alt="Válec" width={300} height={200} className="mx-auto" />
                <h3 className="text-xl font-bold mt-4 text-[#2f3237]">Válec</h3>
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
                    loading="lazy"
                    sizes="(min-width: 768px) 400px, 80vw"
                    className="mx-auto transition-all duration-300"
                  />
                  <button
                    onClick={() => setShowAccessoriesBagr(true)}
                    className="absolute top-3/4 left-[79%] transform -translate-x-1/2 -translate-y-1/2"
                    aria-label="Vybrat příslušenství bagru"
                  >
                    <PlusCircleIcon className="w-12 h-12 text-yellow-500 hover:text-yellow-600 transition" />
                  </button>
                </div>
                <h3 className="text-xl font-bold mt-4 text-[#2f3237]">Bagr Hitachi ZX 48-A5A</h3>
                <ul className="text-sm text-gray-700 mt-3 space-y-2 text-left">
                  <li className="flex items-center gap-2"><ScaleIcon className="w-5 h-5 text-yellow-500" /> Hmotnost: 4.3 t</li>
                  <li className="flex items-center gap-2"><Cog6ToothIcon className="w-5 h-5 text-yellow-500" /> Motor: Yanmar 25.2 kW</li>
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
                    loading="lazy"
                    sizes="(min-width: 768px) 300px, 80vw"
                    className="mx-auto transition-all duration-300"
                  />
                  <button
                    onClick={() => setShowAccessoriesLoader(true)}
                    className="absolute top-2/3 right-[60%] transform -translate-x-1/2 -translate-y-1/2"
                    aria-label="Vybrat příslušenství nakladače"
                  >
                    <PlusCircleIcon className="w-12 h-12 text-yellow-500 hover:text-yellow-600 transition" />
                  </button>
                </div>
                <h3 className="text-xl font-bold mt-4 text-[#2f3237]">Nakladač</h3>
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
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setShowAccessoriesBagr(false)}
              role="dialog"
              aria-modal="true"
            >
              <div
                className="relative bg-white/95 border border-white/60 rounded-2xl shadow-2xl p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowAccessoriesBagr(false)}
                  className="absolute top-3 right-3 text-gray-600 hover:text-black"
                  aria-label="Zavřít"
                >
                  <CloseIcon className="w-6 h-6" />
                </button>
                <h3 className="text-lg font-bold mb-4">Vyberte příslušenství pro bagr</h3>
                <ul className="space-y-3 text-gray-800">
                  {[
                    ["bagr-vrtak", "Vrták", "/images/bagr-vrtak.png"],
                    ["bagr-sbijecka", "Sbíječka", "/images/bagr-sbijecka.png"],
                    ["bagr-lzice30", "Lžíce 30 cm", "/images/bagr-lzice30.png"],
                    ["bagr-lzice50", "Lžíce 50 cm", "/images/bagr-lzice50.png"],
                    ["bagr-lzice60", "Lžíce 60 cm", "/images/bagr-lzice60.png"],
                    ["bagr-lzice80", "Lžíce 80 cm", "/images/bagr-lzice80.png"],
                    ["bagr-lzicesvahova", "Lžíce svahová", "/images/bagr-lzicesvahova.png"],
                  ].map(([key, label, img]) => (
                    <li key={key}>
                      <button
                        onClick={() => { setSelectedAttachmentBagr(key); setShowAccessoriesBagr(false); }}
                        className={`w-full text-left px-4 py-2 border rounded flex items-center gap-2 hover:bg-yellow-100 ${
                          selectedAttachmentBagr === key ? "bg-yellow-200 border-yellow-500" : ""
                        }`}
                      >
                        <Image src={img} width={40} height={40} alt={label} />
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Modal příslušenství pro Nakladač */}
          {showAccessoriesLoader && (
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setShowAccessoriesLoader(false)}
              role="dialog"
              aria-modal="true"
            >
              <div
                className="relative bg-white/95 border border-white/60 rounded-2xl shadow-2xl p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowAccessoriesLoader(false)}
                  className="absolute top-3 right-3 text-gray-600 hover:text-black"
                  aria-label="Zavřít"
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
        <section id="cenik" className="scroll-mt-24 bg-[#f9c600] text-black py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-[#2f3237] text-center">CENÍK</h2>
            <table className="w-full max-w-3xl mx-auto rounded-xl overflow-hidden border border-black/10 bg-white">
              <tbody className="[&_tr]:border-b [&_tr:last-child]:border-none border-black/10">
                <tr>
                  <td className="py-4 px-6 font-semibold">Bagr s obsluhou</td>
                  <td className="py-4 px-6 text-right font-bold">990 Kč / hod</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold">Doprava stroje</td>
                  <td className="py-4 px-6 text-right font-bold">30 Kč / km</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold">Terenní úpravy</td>
                  <td className="py-4 px-6 text-right font-bold">dle domluvy</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold">Odvoz a likvidace zeminy</td>
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
<section id="kontakt" className="scroll-mt-24 bg-[#2f3237] text-white px-6 py-12">
  <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-[#f9c600]">
    KONTAKTNÍ FORMULÁŘ
  </h2>

  <form
    onSubmit={(e) => { e.preventDefault(); odeslat(); }}
    /* Ponecháváme 'space-y-5', protože většina prvků je stále pod sebou */
    className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6 space-y-5 text-gray-800"
  >
    
    {/* 1. E-mail a Telefon: ZABALENO V GRIDU PRO RESPONZIVNÍ ROZLOŽENÍ
        (Původně bylo jako bod 2, nyní je první)
    */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      
      {/* E-mail (bude 1. sloupec na PC) */}
      <div>
        <label className="block font-semibold">E-mail</label>
        <input 
          type="email" 
          className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
          // POZNÁMKA: Chybí useState/onChange pro E-mail.
        />
      </div>

      {/* Telefon (bude 2. sloupec na PC) */}
      <div>
        <label className="block font-semibold">Telefon</label>
        <input 
          type="tel" 
          className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400" 
          // POZNÁMKA: Chybí useState/onChange pro Telefon.
        />
      </div>
    </div>
    
    {/* 2. Adresa zakázky (Původně bod 3) */}
    <div>
      <label className="block font-semibold">Adresa zakázky</label>
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border px-4 py-2 rounded"
          value={adresa}
          onChange={(e) => setAdresa(e.target.value)}
        />
        <button
          type="button"
          onClick={spocitatVzdalenost}
          disabled={loadingKm}
          aria-busy={loadingKm}
          className={`bg-[#f4c700] text-black px-4 py-2 rounded ${loadingKm ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          {loadingKm ? "Počítám…" : "Zjistit km"}
        </button>
      </div>
      {km && <p className="text-sm mt-1 text-gray-600">Vzdálenost: {km} km</p>}
    </div>

    {/* 3. NOVÝ GRID PRO KALENDÁŘ A POPIS PRACÍ 
        - Na mobilu (grid-cols-1): Bude vše pod sebou.
        - Na PC (md:grid-cols-2): Budou vedle sebe.
    */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* 3a. LEVÝ SLOUPEC: Kalendář (Původně bod 5) */}
      <div>
        <label className="block font-semibold">Zvolte termín</label>
        <Calendar
          selectRange
          className="brand-calendar"
          tileDisabled={({ date }) => occupiedSet.has(formatLocalDate(date))}
          onChange={(range) => {
            if (Array.isArray(range) && range.length === 2) {
              setDatumOd(formatLocalDate(range[0]));
              setDatumDo(formatLocalDate(range[1]));
            }
          }}
        />
        {datumOd && datumDo && (
          <p className="text-sm mt-2 text-[#000000]">
            Vybraný termín: {datumOd} až {datumDo}
          </p>
        )}
      </div>

      {/* 3b. PRAVÝ SLOUPEC: Popis požadovaných prací (PŘESUNUTO ZDE) */}
      {/* ÚPRAVA: 'flex flex-col h-full' zajistí, že se tento div
        snaží být stejně vysoký jako kalendář, a 'flex-grow' na textarea
        způsobí, že textové pole vyplní dostupnou výšku.
      */}
      <div className="flex flex-col h-full">
        <label className="block font-semibold">Popis požadovaných prací</label>
        <textarea
          className="w-full border px-4 py-3 rounded min-h-[140px] resize-y placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 flex-grow"
          value={popisZK}
          onChange={(e) => setpopisZK(e.target.value)}
          placeholder={`Např.: Poptávám výkop rýhy pro elektriku cca 12 m, hloubka 70 cm, šířka 30 cm.\nOdvoz přebytečné zeminy, zarovnání terénu. Místo: Karlovy Vary.`}
        />
        <p className="text-xs text-gray-500 mt-1">
          Tip: uveďte rozměry (délka/šířka/hloubka), místo realizace a případně odvoz zeminy.
        </p>
      </div>

    </div> 
    {/* KONEC GRIDU PRO KALENDÁŘ A POPIS */}
    

    {/* 4. ODESLAT tlačítko (Původně bod 6) */}
    <button
      type="submit"
      disabled={sending}
      aria-busy={sending}
      className={`w-full bg-[#f9c600] text-[#2f3237] font-bold py-3 rounded hover:bg-yellow-400 ${sending ? "opacity-60 cursor-not-allowed" : ""}`}
    >
      {sending ? "Odesílám…" : "ODESLAT NEZÁVAZNĚ OBJEDNÁVKU"}
    </button>
    {msg && <p className="text-sm text-red-600 mt-2">{msg}</p>}

  </form>
</section>
        {/* Footer */}
        <footer className="bg-[#2f3237] text-white text-center py-4 text-sm">
          Zemní a Výkopové Práce • IČO:73377619 • Milan Popov • kontakt@zevyp.cz • Habartov, Horní Částkov ev. č. 2, 357 09
        </footer>
      </div>
    </>
  );
}
