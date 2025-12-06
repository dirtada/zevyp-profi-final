// pages/index.js
import Head from "next/head";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useState, useEffect, useMemo } from "react";
import { 
  Bars3Icon, 
  XMarkIcon, 
  PhoneIcon as PhoneIconOutline,
  HomeIcon,
  WrenchScrewdriverIcon as WrenchOutline,
  BanknotesIcon,
  EnvelopeIcon,
  MapPinIcon
} from "@heroicons/react/24/outline";
import {
  ScaleIcon,
  Cog6ToothIcon,
  ArrowsUpDownIcon,
  WrenchScrewdriverIcon,
  PlusCircleIcon,
  PhoneIcon,
  XMarkIcon as CloseIcon,
  GlobeAltIcon,
  IdentificationIcon
} from "@heroicons/react/24/solid";
import { Inter } from "next/font/google";
import "react-calendar/dist/Calendar.css";

const inter = Inter({ subsets: ["latin", "latin-ext"] });
// Calendar přes dynamic import (bez SSR záseků)
const Calendar = dynamic(() => import("react-calendar"), { ssr: false });

/* --- LOGIKA BAREV PRO NAVIGACI --- */
// Tato funkce určuje barvy teček podle pozadí sekce
const getNavTheme = (section) => {
  // Sekce, které mají světlé nebo žluté pozadí (potřebují tmavé tečky)
  const lightBackgroundSections = ['sluzby', 'technika', 'cenik'];
  
  if (lightBackgroundSections.includes(section)) {
    return {
      container: "bg-black/10", // Jemné tmavé pozadí kontejneru
      inactive: "bg-[#2f3237]/40 hover:bg-[#2f3237]/70", // Tmavě šedá poloprůhledná
      active: "bg-[#2f3237] scale-125", // Plná tmavá (aktivní)
      tooltip: "bg-[#2f3237] text-[#f9c600]" // Tooltip
    };
  }
  
  // Sekce s tmavým pozadím (Hero, Kontakt) - potřebují světlé/žluté tečky
  return {
    container: "bg-white/10", // Jemné světlé pozadí
    inactive: "bg-white/40 hover:bg-white", // Bílá poloprůhledná
    active: "bg-[#f9c600] scale-125", // Žlutá (aktivní)
    tooltip: "bg-white text-[#2f3237]" // Tooltip
  };
};

/* --- SIDE NAVIGATION (DESKTOP) --- */
function SideNav() {
  const [activeSection, setActiveSection] = useState('hero');
  const theme = getNavTheme(activeSection);

  useEffect(() => {
    const sections = ['hero', 'sluzby', 'technika', 'cenik', 'kontakt'];
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.4 }
    );

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const navItems = [
    { id: 'hero', label: 'Úvod' },
    { id: 'sluzby', label: 'Služby' },
    { id: 'technika', label: 'Technika' },
    { id: 'cenik', label: 'Ceník' },
    { id: 'kontakt', label: 'Kontakt' },
  ];

  return (
    // UPRAVENO: left-[6px] pro posun více doleva
    <div className="fixed left-[6px] top-1/2 transform -translate-y-1/2 z-40 hidden md:flex flex-col gap-4">
      {/* Kontejner s dynamickým pozadím */}
      <div className={`flex flex-col gap-3 p-2 backdrop-blur-sm rounded-full transition-colors duration-500 ${theme.container}`}>
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            aria-label={`Přejít na ${item.label}`}
            className={`group relative w-3 h-3 rounded-full transition-all duration-300 ${
              activeSection === item.id ? theme.active : theme.inactive
            }`}
          >
            {/* Tooltip */}
            <span className={`absolute left-6 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden md:block ${theme.tooltip}`}>
              {item.label}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

/* --- SIDE NAVIGATION (MOBILE) --- */
function MobileSideNav() {
  const [activeSection, setActiveSection] = useState('hero');
  const theme = getNavTheme(activeSection);

  useEffect(() => {
    const sections = ['hero', 'sluzby', 'technika', 'cenik', 'kontakt'];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    }, { threshold: 0.3 });

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    // UPRAVENO: Používá stejný styl kuliček jako desktop a dynamické barvy
    <div className="fixed left-2 top-1/2 transform -translate-y-1/2 z-40 flex flex-col gap-3 md:hidden">
      {/* Kontejner pro lepší čitelnost na mobilu */}
      <div className={`flex flex-col gap-3 p-1.5 backdrop-blur-sm rounded-full transition-colors duration-500 ${theme.container}`}>
        {['hero', 'sluzby', 'technika', 'cenik', 'kontakt'].map((id) => (
          <a
            key={id}
            href={`#${id}`}
            className={`w-3 h-3 rounded-full transition-all duration-300 shadow-sm ${
               activeSection === id ? theme.active : theme.inactive
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) { document.body.style.overflow = 'hidden'; } 
    else { document.body.style.overflow = 'unset'; }
  }, [open]);

  const navigation = [
    { name: 'NAŠE SLUŽBY', href: '#sluzby', icon: HomeIcon },
    { name: 'TECHNIKA', href: '#technika', icon: WrenchOutline },
    { name: 'CENÍK', href: '#cenik', icon: BanknotesIcon },
    { name: 'KONTAKT', href: '#kontakt', icon: EnvelopeIcon },
  ];

  return (
    <>
      <header className="sticky top-0 bg-[#f9c600]/95 backdrop-blur-md border-b border-black/5 z-50 shadow-sm transition-all duration-300">
        <div className="container mx-auto flex justify-between items-center px-4 py-3 md:py-4">
          <div className="flex-shrink-0">
            <Image src="/images/zevyp-newlogo.png" alt="Zevyp logo" width={160} height={50} priority className="h-10 md:h-12 w-auto object-contain hover:scale-105 transition-transform duration-300" />
          </div>
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex gap-8 text-sm lg:text-base font-bold text-[#2f3237] tracking-wide">
              {navigation.map((item) => (
                <a key={item.name} href={item.href} className="relative group py-2">
                  {item.name}
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#2f3237] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </a>
              ))}
            </nav>
            <a href="tel:+420725319300" className="group inline-flex items-center gap-2 bg-[#2f3237] text-white hover:bg-black font-semibold px-5 py-2.5 rounded-full shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
              <PhoneIcon className="w-5 h-5 group-hover:animate-pulse" />
              <span>725 319 300</span>
            </a>
          </div>
          <div className="md:hidden">
            <button onClick={() => setOpen(true)} className="p-2 text-[#2f3237] hover:bg-black/5 rounded-lg transition-colors" aria-label="Otevřít menu">
              <Bars3Icon className="w-8 h-8" />
            </button>
          </div>
        </div>
      </header>

      <div className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${open ? "opacity-100 visible" : "opacity-0 invisible"}`} onClick={() => setOpen(false)} />
      <div className={`fixed top-0 right-0 z-[70] h-full w-[85%] max-w-[300px] bg-[#2f3237] shadow-2xl transform transition-transform duration-300 ease-out md:hidden ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <span className="text-white font-bold text-xl tracking-wider">MENU</span>
            <button onClick={() => setOpen(false)} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all"><XMarkIcon className="w-7 h-7" /></button>
          </div>
          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
            {navigation.map((item) => (
              <a key={item.name} href={item.href} onClick={() => setOpen(false)} className="flex items-center gap-4 p-4 text-white hover:bg-[#f9c600] hover:text-[#2f3237] rounded-xl transition-all duration-200 group">
                <item.icon className="w-6 h-6 text-[#f9c600] group-hover:text-[#2f3237] transition-colors" />
                <span className="font-bold text-lg">{item.name}</span>
              </a>
            ))}
          </div>
          <div className="p-5 border-t border-white/10 bg-[#25282c]">
            <a href="tel:+420725319300" className="flex items-center justify-center gap-3 w-full bg-[#f9c600] text-[#2f3237] font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-transform">
              <PhoneIcon className="w-6 h-6" />
              ZAVOLAT HNED
            </a>
            <p className="text-center text-gray-500 text-xs mt-4">Zevyp - Zemní a výkopové práce</p>
          </div>
        </div>
      </div>
    </>
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
      } catch (error) { console.error(error); }
    };
    nactiObsazene();
  }, []);

  const occupiedSet = useMemo(() => new Set(obsazene), [obsazene]);

  const spocitatVzdalenost = async () => {
    if (!adresa) { setMsg("Zadejte prosím adresu."); return; }
    setLoadingKm(true); setMsg("");
    try {
      const res = await fetch("/api/vzdalenost", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ adresa }) });
      const data = await res.json();
      if (res.ok) { setKm(data.km); setMsg(`Vzdálenost: ${data.km} km`); } 
      else { setMsg(data.error || "Nepodařilo se zjistit vzdálenost."); }
    } catch (e) { setMsg("Chyba při komunikaci se serverem."); } 
    finally { setLoadingKm(false); }
  };

  const odeslat = async () => {
    if (sending) return;
    if (!popisZK || !adresa || !datumOd || !datumDo) { setMsg("Vyplňte prosím všechna povinná pole."); return; }
    setSending(true); setMsg("");
    try {
      const res = await fetch("/api/objednavka", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ popisZK, adresa, datumOd, datumDo, typZeminy: znameRozmery ? typZeminy : null, rozmerZeminy: znameRozmery ? rozmerZeminy : null, km }),
      });
      if (res.ok) { setMsg("Poptávka byla odeslána!"); } else { const data = await res.json(); setMsg(data.error || "Chyba při odesílání."); }
    } catch (e) { setMsg("Nepodařilo se připojit k serveru."); } 
    finally { setSending(false); }
  };

  const jsonLdLocalBusiness = {
    "@context": "https://schema.org", "@type": "LocalBusiness", "@id": "https://www.zevyp-kp.cz/#company", "name": "Zevyp – Zemní a výkopové práce", "url": "https://www.zevyp-kp.cz/", "telephone": "+420777123456", "image": "https://www.zevyp.cz/images/bagr-hero.png", "priceRange": "$$", "address": { "@type": "PostalAddress", "streetAddress": "Horní Částkov ev. č. 2", "addressLocality": "Habartov", "postalCode": "357 09", "addressCountry": "CZ" }, "areaServed": ["Karlovy Vary", "Karlovarský kraj"], "description": "Profesionální zemní a výkopové práce minibagrem v Karlovarském kraji a okolí.", "geo": { "@type": "GeoCoordinates", "latitude": 50.181, "longitude": 12.634 }
  };

  return (
    <>
      <Head>
        <title>Zemní a výkopové práce Karlovarský kraj a okolí | Zevyp-kp.cz</title>
        <meta name="description" content="Zemní a výkopové práce minibagrem Hitachi – Karlovarský kraj a okolí. Výkopy základů, zásypy, úpravy terénu. Rychle a spolehlivě. Zavolejte +420 725 319 300." />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://www.zevyp-kp.cz/" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="cs_CZ" />
        <meta property="og:site_name" content="zevyp-kp.cz" />
        <meta property="og:url" content="https://www.zevyp-kp.cz/" />
        <meta property="og:title" content="Zemní a výkopové práce Karlovarský kraj a okolí | Zevyp.cz" />
        <meta property="og:description" content="Výkopové a zemní práce minibagrem Hitachi v Karlovarském kraji a okolí." />
        <meta property="og:image" content="https://www.zevyp.cz/images/bagr-hero.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Zemní a výkopové práce Karlovarský kraj a okolí | Zevyp.cz" />
        <meta name="twitter:description" content="Výkopové a zemní práce minibagrem Hitachi v Karlovarském kraji a okolí. Zavolejte +420 725 319 300." />
        <meta name="twitter:image" content="https://www.zevyp.cz/images/bagr-hero.png" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdLocalBusiness) }} />
        <style>{`
          @keyframes float-card { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
          .animate-float-card { animation: float-card 4s ease-in-out infinite; }
        `}</style>
      </Head>

      <Header />
      
      {/* BOČNÍ NAVIGACE (Dynamická) */}
      <SideNav />
      <MobileSideNav />

      <div className={`${inter.className} min-h-screen bg-[#f9c600] text-gray-900`}>
        {/* Hero */}
        <main id="hero" className="bg-gradient-to-br from-[#2f3237] via-[#2f3237] to-black text-white py-16">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 text-left mb-12 md:mb-0 relative z-20">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">ZEMNÍ A VÝKOPOVÉ PRÁCE</h1>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8 max-w-[60ch]">Provádíme <span className="text-[#f9c600] font-semibold">spolehlivé zemní a výkopové práce</span> minibagrem Hitachi v Karlovarském kraji a okolí.</p>
              <a href="#kontakt" className="inline-block bg-[#f9c600] text-[#2f3237] font-bold px-6 py-3 rounded-lg shadow hover:bg-yellow-400 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#f9c600] focus-visible:ring-offset-[#2f3237]">Nezávazná poptávka</a>
            </div>
            <div className="md:w-1/2 flex justify-center relative z-10">
              <Image src="/images/bagr-hero.png" alt="Minibagr Hitachi při práci" width={700} height={500} priority sizes="(min-width: 768px) 700px, 100vw" className="object-contain -mb-24 md:-mb-32" />
            </div>
          </div>
        </main>

        <section id="sluzby" className="scroll-mt-24 bg-[#f9c600] text-black py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-10 text-[#2f3237] text-center tracking-wide">NAŠE SLUŽBY</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              {/* Box 1 */}
              <article className="group relative flex flex-col h-full rounded-2xl bg-white ring-1 ring-black/5 p-6 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-default">
                <div className="absolute top-4 right-4 text-gray-300 group-hover:text-[#f9c600] transition-colors"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg></div>
                <div className="flex-grow relative z-10">
                  <div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 rounded-full bg-[#f9c600] flex items-center justify-center text-[#2f3237] font-bold text-lg shadow-sm">1</div><h3 className="text-lg font-bold text-[#2f3237]">Výkopové práce</h3></div>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed pl-1">Výkopy základových pasů a patek, výkopy pro inženýrské sítě, bazény, jímky a další.</p>
                </div>
                <div className="mt-5 rounded-lg overflow-hidden w-full aspect-video"><img src="/videos/vykopove_prace.gif" alt="Animace výkopových prací" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ease-out" /></div>
              </article>
              {/* Box 2 */}
              <article className="group relative flex flex-col h-full rounded-2xl bg-white ring-1 ring-black/5 p-6 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-default">
                <div className="absolute top-4 right-4 text-gray-300 group-hover:text-[#f9c600] transition-colors"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg></div>
                <div className="flex-grow relative z-10">
                  <div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 rounded-full bg-[#f9c600] flex items-center justify-center text-[#2f3237] font-bold text-lg shadow-sm">2</div><h3 className="text-lg font-bold text-[#2f3237]">Terénní úpravy</h3></div>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed pl-1">Svahování, zarovnávání a skrývka ornice. Příprava pozemku pro stavbu nebo finální úpravu.</p>
                </div>
                <div className="mt-5 rounded-lg overflow-hidden w-full aspect-video"><img src="/videos/terenni_upravy.gif" alt="Animace terenních úprav" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ease-out" /></div>
              </article>
              {/* Box 3 */}
              <article className="group relative flex flex-col h-full rounded-2xl bg-white ring-1 ring-black/5 p-6 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-default">
                <div className="absolute top-4 right-4 text-gray-300 group-hover:text-[#f9c600] transition-colors"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg></div>
                <div className="flex-grow relative z-10">
                  <div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 rounded-full bg-[#f9c600] flex items-center justify-center text-[#2f3237] font-bold text-lg shadow-sm">3</div><h3 className="text-lg font-bold text-[#2f3237]">Stavební práce</h3></div>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed pl-1">Stavební příprava pro pokládky chodníků, dlažby a dalších povrchů.</p>
                </div>
                <div className="mt-5 rounded-lg overflow-hidden w-full aspect-video"><img src="/videos/stavebni_prace.gif" alt="Animace stavebních prací" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ease-out" /></div>
              </article>
              {/* Box 4 */}
              <article className="group relative flex flex-col h-full rounded-2xl bg-white ring-1 ring-black/5 p-6 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-default">
                <div className="absolute top-4 right-4 text-gray-300 group-hover:text-[#f9c600] transition-colors"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg></div>
                <div className="flex-grow relative z-10">
                  <div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 rounded-full bg-[#f9c600] flex items-center justify-center text-[#2f3237] font-bold text-lg shadow-sm">4</div><h3 className="text-lg font-bold text-[#2f3237]">Bourací práce</h3></div>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed pl-1">Bourání menších objektů, betonových konstrukcí, základů, plotů a zpevněných ploch.</p>
                </div>
                <div className="mt-5 rounded-lg overflow-hidden w-full aspect-video"><img src="/videos/bouraci_prace.gif" alt="Animace bouracích prací" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ease-out" /></div>
              </article>
              {/* Box 5 */}
              <article className="group relative flex flex-col h-full rounded-2xl bg-white ring-1 ring-black/5 p-6 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-default">
                <div className="absolute top-4 right-4 text-gray-300 group-hover:text-[#f9c600] transition-colors"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg></div>
                <div className="flex-grow relative z-10">
                  <div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 rounded-full bg-[#f9c600] flex items-center justify-center text-[#2f3237] font-bold text-lg shadow-sm">5</div><h3 className="text-lg font-bold text-[#2f3237]">Bagr s vrtákem</h3></div>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed pl-1">Vrtání děr pro plotové sloupky, patky, piloty a další drobné stavební prvky.</p>
                </div>
                <div className="mt-5 rounded-lg overflow-hidden w-full aspect-video"><img src="/videos/bagr_s_vrtakem.gif" alt="Animace vrtání" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ease-out" /></div>
              </article>
              {/* Box 6 - Vizitka Flip */}
              <article className="group relative flex flex-col h-full rounded-2xl bg-[#2f3237] ring-1 ring-black/10 p-6 shadow-md hover:shadow-2xl transition-all duration-300 items-center justify-center overflow-visible">
                <div className="flex items-center gap-3 mb-4 self-start">
                  <div className="w-10 h-10 rounded-full bg-[#f9c600] flex items-center justify-center text-[#2f3237] font-bold text-lg shadow-sm">6</div>
                  <h3 className="text-lg font-bold text-white">Individuální domluva</h3>
                </div>
                <div className="w-full aspect-[1.7/1] relative [perspective:1500px] my-auto">
                  <div className="w-full h-full relative transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] shadow-xl rounded-xl">
                    <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-xl overflow-hidden bg-[#f9c600] flex items-center justify-center border-2 border-white/10">
                      <img src="/images/vizitka_logo.png" alt="ZEVYP Logo" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none"></div>
                    </div>
                    <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-xl overflow-hidden bg-[#f9c600] border-2 border-white/10">
                      <img src="/images/vizitka_kontakty.png" alt="ZEVYP Kontakty" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-xs text-gray-400 uppercase tracking-wider font-semibold text-center flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-[#f9c600] animate-bounce"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
                  Otočit vizitku
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
              <div className="relative bg-gray-50 rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                <div className="relative">
                  <Image src={`/images/${selectedAttachmentBagr || "bagr-technik"}.png`} alt="Bagr" width={400} height={300} loading="lazy" sizes="(min-width: 768px) 400px, 80vw" className="mx-auto transition-all duration-300" />
                  <button onClick={() => setShowAccessoriesBagr(true)} className="absolute top-3/4 left-[79%] transform -translate-x-1/2 -translate-y-1/2" aria-label="Vybrat příslušenství bagru">
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
              <div className="relative bg-gray-50 rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                <div className="relative">
                  <Image src={`/images/${selectedAttachmentLoader || "nakladac"}.png`} alt="Nakladač" width={300} height={200} loading="lazy" sizes="(min-width: 768px) 300px, 80vw" className="mx-auto transition-all duration-300" />
                  <button onClick={() => setShowAccessoriesLoader(true)} className="absolute top-2/3 right-[60%] transform -translate-x-1/2 -translate-y-1/2" aria-label="Vybrat příslušenství nakladače">
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
          {/* Modaly pro příslušenství zůstávají stejné... */}
          {showAccessoriesBagr && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowAccessoriesBagr(false)} role="dialog" aria-modal="true">
              <div className="relative bg-white/95 border border-white/60 rounded-2xl shadow-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => setShowAccessoriesBagr(false)} className="absolute top-3 right-3 text-gray-600 hover:text-black" aria-label="Zavřít"><CloseIcon className="w-6 h-6" /></button>
                <h3 className="text-lg font-bold mb-4">Vyberte příslušenství pro bagr</h3>
                <ul className="space-y-3 text-gray-800">
                  {[["bagr-vrtak", "Vrták", "/images/bagr-vrtak.png"], ["bagr-sbijecka", "Sbíječka", "/images/bagr-sbijecka.png"], ["bagr-lzice30", "Lžíce 30 cm", "/images/bagr-lzice30.png"], ["bagr-lzice50", "Lžíce 50 cm", "/images/bagr-lzice50.png"], ["bagr-lzice60", "Lžíce 60 cm", "/images/bagr-lzice60.png"], ["bagr-lzice80", "Lžíce 80 cm", "/images/bagr-lzice80.png"], ["bagr-lzicesvahova", "Lžíce svahová", "/images/bagr-lzicesvahova.png"]].map(([key, label, img]) => (
                    <li key={key}><button onClick={() => { setSelectedAttachmentBagr(key); setShowAccessoriesBagr(false); }} className={`w-full text-left px-4 py-2 border rounded flex items-center gap-2 hover:bg-yellow-100 ${selectedAttachmentBagr === key ? "bg-yellow-200 border-yellow-500" : ""}`}><Image src={img} width={40} height={40} alt={label} />{label}</button></li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {showAccessoriesLoader && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowAccessoriesLoader(false)} role="dialog" aria-modal="true">
              <div className="relative bg-white/95 border border-white/60 rounded-2xl shadow-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => setShowAccessoriesLoader(false)} className="absolute top-3 right-3 text-gray-600 hover:text-black" aria-label="Zavřít"><CloseIcon className="w-6 h-6" /></button>
                <h3 className="text-lg font-bold mb-4">Vyberte příslušenství pro nakladač</h3>
                <ul className="space-y-3 text-gray-800">
                  <li><button onClick={() => { setSelectedAttachmentLoader("nakladac-pluh"); setShowAccessoriesLoader(false); }} className="w-full text-left px-4 py-2 border rounded hover:bg-yellow-100">Pluh</button></li>
                  <li><button onClick={() => { setSelectedAttachmentLoader("nakladac-vidle"); setShowAccessoriesLoader(false); }} className="w-full text-left px-4 py-2 border rounded hover:bg-yellow-100">Vidle na palety</button></li>
                </ul>
              </div>
            </div>
          )}
        </section>

        {/* CENÍK */}
        <section id="cenik" className="scroll-mt-24 bg-gray-100 text-black py-16 overflow-hidden">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-[#2f3237] text-center tracking-wide">CENÍK SLUŽEB</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                  <table className="w-full">
                    <thead className="bg-[#2f3237] text-white">
                      <tr><th className="py-4 px-6 text-left font-semibold">Položka</th><th className="py-4 px-6 text-right font-semibold">Cena</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[{ name: "Bagr s obsluhou", price: "990 Kč / hod" }, { name: "Doprava stroje", price: "30 Kč / km" }, { name: "Terénní úpravy", price: "dle domluvy" }, { name: "Odvoz a likvidace zeminy", price: "dle domluvy" }].map((item) => (
                        <tr key={item.name} className="hover:bg-yellow-50 transition-colors"><td className="py-4 px-6 font-medium text-gray-700">{item.name}</td><td className="py-4 px-6 text-right font-bold text-[#2f3237]">{item.price}</td></tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="p-4 bg-gray-50 text-xs text-gray-500 text-center border-t border-gray-100">* Ceny jsou uvedeny bez DPH. Konečnou cenu stanovíme individuálně.</div>
                </div>
              </div>
              <div className="order-1 lg:order-2 flex justify-center py-10 lg:py-0">
                <div className="relative group perspective-[1000px] animate-float-card">
                  <div className="absolute -bottom-10 left-[10%] w-[80%] h-10 bg-black/40 blur-xl rounded-full transform rotate-3 scale-75 md:scale-100"></div>
                  <div className="relative w-full max-w-[340px] md:max-w-[500px] aspect-[1.7/1] bg-[#f9c600] rounded-xl shadow-2xl overflow-visible border-2 border-yellow-400" style={{ transform: 'perspective(1000px) rotateY(-20deg) rotateX(10deg) rotateZ(-3deg)', transformStyle: 'preserve-3d', boxShadow: '-20px 20px 60px rgba(0,0,0,0.3)' }}>
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent pointer-events-none rounded-xl z-10"></div>
                    <div className="relative z-20 h-full p-4 md:p-6 flex flex-col justify-between">
                      <div className="flex flex-col space-y-2 md:space-y-4">
                        <div className="flex items-center gap-2 md:gap-4"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 md:w-8 md:h-8 text-black"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13h18M5 13v-3a7 7 0 0114 0v3M12 13v-8m-2 0h4" /><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l-1 4h16l-1-4" /></svg><h3 className="text-lg md:text-2xl font-extrabold uppercase text-black tracking-tight" style={{ fontFamily: 'sans-serif' }}>KLÁRA PUDILOVÁ</h3></div>
                        <div className="flex items-center gap-2 md:gap-4"><div className="border-2 border-black rounded-full p-1 w-6 h-6 md:w-8 md:h-8 flex items-center justify-center"><PhoneIcon className="w-3 h-3 md:w-5 md:h-5 text-black" /></div><div className="flex flex-col"><span className="text-xl md:text-3xl font-extrabold text-black tracking-wide leading-none">725 319 300</span><div className="w-full h-[2px] bg-black mt-1"></div></div></div>
                        <div className="flex items-center gap-2 md:gap-4"><GlobeAltIcon className="w-6 h-6 md:w-8 md:h-8 text-black" /><span className="text-base md:text-2xl font-extrabold uppercase text-black">ZEVYP-KP.CZ</span></div>
                        <div className="flex items-center gap-2 md:gap-4"><div className="w-6 md:w-8 flex justify-center"><IdentificationIcon className="w-6 h-6 md:w-8 md:h-8 text-black" /></div><span className="text-base md:text-2xl font-extrabold uppercase text-black">IČO: 73377619</span></div>
                      </div>
                      <div className="mt-1 pt-2 border-t-0 border-black/20 text-center"><p className="text-[9px] md:text-[11px] font-bold text-black uppercase tracking-widest">VÝKOPOVÉ PRÁCE • TERÉNNÍ ÚPRAVY • STAVEBNÍ PRÁCE</p></div>
                    </div>
                    <div className="absolute right-0 bottom-3 w-[140px] md:right-2 md:bottom-4 md:w-[150px] z-30 pointer-events-none drop-shadow-lg">
                       <img src="/images/flotila_nejlepsi_transparentni.png" alt="Flotila bagrů" className="w-full h-auto object-contain" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- VYLEPŠENÝ KONTAKTNÍ FORMULÁŘ --- */}
        <section id="kontakt" className="scroll-mt-24 bg-[#2f3237] text-white px-6 py-16 relative overflow-hidden">
          {/* Dekorativní pozadí */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#f9c600]/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="container mx-auto max-w-4xl relative z-10">
            <div className="text-center mb-10">
               <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-[#f9c600]">
                 ZAVOLEJTE NEBO NAPIŠTE
               </h2>
               <p className="text-gray-300">
                 Máte dotaz nebo chcete nezávaznou cenovou nabídku? Jsme tu pro vás.
               </p>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 text-gray-800 border-t-4 border-[#f9c600]">
              <form onSubmit={(e) => { e.preventDefault(); odeslat(); }} className="space-y-6">
                
                {/* Kontaktní údaje */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider mb-2 text-gray-700">Váš E-mail</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input 
                        type="email" 
                        required
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f9c600] focus:border-transparent transition-all"
                        placeholder="např. jan@novak.cz"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider mb-2 text-gray-700">Váš Telefon</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <PhoneIconOutline className="h-5 w-5 text-gray-400" />
                      </div>
                      <input 
                        type="tel" 
                        required
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f9c600] focus:border-transparent transition-all" 
                        placeholder="+420 123 456 789"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Adresa */}
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider mb-2 text-gray-700">Adresa realizace</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPinIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        required
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f9c600] focus:border-transparent transition-all"
                        placeholder="Ulice, Město"
                        value={adresa}
                        onChange={(e) => setAdresa(e.target.value)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={spocitatVzdalenost}
                      disabled={loadingKm}
                      className="bg-gray-800 text-white px-5 py-2 rounded-lg font-semibold hover:bg-black transition disabled:opacity-50 whitespace-nowrap"
                    >
                      {loadingKm ? "..." : "Zjistit KM"}
                    </button>
                  </div>
                  {km && <p className="text-sm mt-2 font-semibold text-[#2f3237] bg-yellow-100 inline-block px-3 py-1 rounded">Vzdálenost: {km} km</p>}
                </div>

                {/* Grid pro Kalendář a Popis */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   {/* Kalendář */}
                   <div>
                     <label className="block text-sm font-bold uppercase tracking-wider mb-2 text-gray-700">Preferovaný termín</label>
                     <div className="border border-gray-200 rounded-lg p-2 bg-gray-50">
                        <Calendar
                          selectRange
                          className="brand-calendar w-full border-none bg-transparent"
                          tileDisabled={({ date }) => occupiedSet.has(formatLocalDate(date))}
                          onChange={(range) => {
                            if (Array.isArray(range) && range.length === 2) {
                              setDatumOd(formatLocalDate(range[0]));
                              setDatumDo(formatLocalDate(range[1]));
                            }
                          }}
                        />
                     </div>
                     {datumOd && datumDo && (
                        <div className="mt-2 text-center text-sm font-bold text-[#2f3237]">
                          Vybráno: {datumOd} — {datumDo}
                        </div>
                     )}
                   </div>

                   {/* Popis */}
                   <div className="flex flex-col h-full">
                     <label className="block text-sm font-bold uppercase tracking-wider mb-2 text-gray-700">Popis prací</label>
                     <textarea
                       required
                       className="w-full flex-grow p-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f9c600] focus:border-transparent resize-none transition-all"
                       value={popisZK}
                       onChange={(e) => setpopisZK(e.target.value)}
                       placeholder={`Co potřebujete vykopat nebo upravit?\n\nNapř.: Výkop rýhy pro vodu, délka 15m, hloubka 1m. Odvoz hlíny ano/ne.`}
                     ></textarea>
                   </div>
                </div>

                {/* Tlačítko */}
                <button
                  type="submit"
                  disabled={sending}
                  className={`w-full bg-[#f9c600] text-[#2f3237] text-lg font-black uppercase tracking-widest py-4 rounded-lg shadow-lg hover:bg-yellow-400 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 ${sending ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  {sending ? "Odesílám poptávku..." : "Odeslat nezávaznou poptávku"}
                </button>
                
                {msg && (
                  <div className={`text-center p-3 rounded font-bold ${msg.includes("odeslána") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {msg}
                  </div>
                )}
              </form>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#2f3237] text-white text-center py-6 text-sm border-t border-white/10">
          <p className="opacity-70">Zemní a Výkopové Práce • IČO: 73377619 • Milan Popov</p>
          <a href="mailto:kontakt@zevyp.cz" className="text-[#f9c600] hover:underline font-bold">kontakt@zevyp.cz</a>
          <p className="opacity-50 mt-1 text-xs">Habartov, Horní Částkov ev. č. 2, 357 09</p>
        </footer>
      </div>
    </>
  );
}
