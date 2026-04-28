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
const Calendar = dynamic(() => import("react-calendar"), { ssr: false });

const getNavTheme = (section) => {
  const lightBackgroundSections = ['sluzby', 'technika', 'cenik'];
  if (lightBackgroundSections.includes(section)) {
    return {
      container: "bg-black/5", 
      inactive: "bg-[#2f3237]/30 hover:bg-[#2f3237]/60", 
      active: "bg-[#2f3237] scale-125", 
    };
  }
  return {
    container: "bg-white/5",
    inactive: "bg-white/30 hover:bg-white",
    active: "bg-[#f9c600] scale-125",
  };
};

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
    <div className={`fixed left-2 top-1/2 transform -translate-y-1/2 z-40 flex flex-col gap-3 md:hidden transition-all duration-700 ease-in-out ${
      activeSection === 'hero' ? 'opacity-0 pointer-events-none -translate-x-10' : 'opacity-100 translate-x-0' 
    }`}>
      <div className={`flex flex-col gap-3 p-1.5 backdrop-blur-[2px] rounded-full transition-colors duration-500 ${theme.container}`}>
        {['hero', 'sluzby', 'technika', 'cenik', 'kontakt'].map((id) => (
          <a key={id} href={`#${id}`} className={`w-3 h-3 rounded-full transition-all duration-300 shadow-sm ${activeSection === id ? theme.active : theme.inactive}`} />
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
            <button onClick={() => setOpen(true)} className="p-2 text-[#2f3237] hover:bg-black/5 rounded-lg transition-colors">
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
            <button onClick={() => setOpen(false)} className="p-2 text-gray-400 hover:text-white rounded-full"><XMarkIcon className="w-7 h-7" /></button>
          </div>
          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
            {navigation.map((item) => (
              <a key={item.name} href={item.href} onClick={() => setOpen(false)} className="flex items-center gap-4 p-4 text-white hover:bg-[#f9c600] hover:text-[#2f3237] rounded-xl transition-all group">
                <item.icon className="w-6 h-6 text-[#f9c600] group-hover:text-[#2f3237]" />
                <span className="font-bold text-lg">{item.name}</span>
              </a>
            ))}
          </div>
          <div className="p-5 border-t border-white/10 bg-[#25282c]">
            <a href="tel:+420725319300" className="flex items-center justify-center gap-3 w-full bg-[#f9c600] text-[#2f3237] font-bold py-4 rounded-xl shadow-lg">
              <PhoneIcon className="w-6 h-6" /> ZAVOLAT HNED
            </a>
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
        body: JSON.stringify({ popisZK, adresa, datumOd, datumDo, km }),
      });
      if (res.ok) { setMsg("Poptávka byla odeslána!"); } 
      else { const data = await res.json(); setMsg(data.error || "Chyba při odesílání."); }
    } catch (e) { setMsg("Nepodařilo se připojit k serveru."); } 
    finally { setSending(false); }
  };

  return (
    <>
      <Head>
        <title>Zemní a výkopové práce Karlovarský kraj a okolí | Zevyp-kp.cz</title>
        <meta name="description" content="Zemní a výkopové práce minibagrem Hitachi – Karlovarský kraj a okolí. Výkopy základů, zásypy, úpravy terénu. Rychle a spolehlivě." />
        <style>{`
          @keyframes float-card { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
          .animate-float-card { animation: float-card 4s ease-in-out infinite; }
        `}</style>
      </Head>

      <Header />
      <MobileSideNav />

      <div className={`${inter.className} min-h-screen bg-[#f9c600] text-gray-900`}>
        {/* Hero */}
        <main id="hero" className="bg-gradient-to-br from-[#2f3237] via-[#2f3237] to-black text-white py-16">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 text-left mb-12 md:mb-0 relative z-20">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">ZEMNÍ A VÝKOPOVÉ PRÁCE</h1>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8 max-w-[60ch]">Provádíme <span className="text-[#f9c600] font-semibold">spolehlivé zemní a výkopové práce</span> minibagrem Hitachi v Karlovarském kraji a okolí.</p>
              <a href="#kontakt" className="inline-block bg-[#f9c600] text-[#2f3237] font-bold px-6 py-3 rounded-lg shadow hover:bg-yellow-400 transition">Nezávazná poptávka</a>
            </div>
            <div className="md:w-1/2 flex justify-center relative z-10">
              <Image src="/images/bagr-hero.png" alt="Minibagr Hitachi" width={700} height={500} priority className="object-contain -mb-24 md:-mb-32" />
            </div>
          </div>
        </main>

        <section id="sluzby" className="scroll-mt-24 bg-[#f9c600] text-black py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-10 text-[#2f3237] text-center tracking-wide">NAŠE SLUŽBY</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              <article className="group relative flex flex-col h-full rounded-2xl bg-white p-6 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-[#f9c600] flex items-center justify-center text-[#2f3237] font-bold shadow-sm">1</div>
                  <h3 className="text-lg font-bold text-[#2f3237]">Výkopové práce</h3>
                </div>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">Výkopy základových pasů a patek, výkopy pro inženýrské sítě, bazény, jímky a další.</p>
              </article>
              <article className="group relative flex flex-col h-full rounded-2xl bg-white p-6 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-[#f9c600] flex items-center justify-center text-[#2f3237] font-bold shadow-sm">2</div>
                  <h3 className="text-lg font-bold text-[#2f3237]">Terénní úpravy</h3>
                </div>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">Svahování, zarovnávání a skrývka ornice. Příprava pozemku pro stavbu nebo finální úpravu.</p>
              </article>
              <article className="group relative flex flex-col h-full rounded-2xl bg-white p-6 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-[#f9c600] flex items-center justify-center text-[#2f3237] font-bold shadow-sm">3</div>
                  <h3 className="text-lg font-bold text-[#2f3237]">Stavební práce</h3>
                </div>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">Stavební příprava pro pokládky chodníků, dlažby a dalších povrchů.</p>
              </article>
              <article className="group relative flex flex-col h-full rounded-2xl bg-white p-6 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-[#f9c600] flex items-center justify-center text-[#2f3237] font-bold shadow-sm">4</div>
                  <h3 className="text-lg font-bold text-[#2f3237]">Bourací práce</h3>
                </div>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">Bourání menších objektů, betonových konstrukcí, základů, plotů a zpevněných ploch.</p>
              </article>
              <article className="group relative flex flex-col h-full rounded-2xl bg-white p-6 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-[#f9c600] flex items-center justify-center text-[#2f3237] font-bold shadow-sm">5</div>
                  <h3 className="text-lg font-bold text-[#2f3237]">Bagr s vrtákem</h3>
                </div>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">Vrtání děr pro plotové sloupky, patky, piloty a další drobné stavební prvky.</p>
              </article>
              {/* Box 6 - Zimní údržba */}
              <article className="group relative flex flex-col h-full rounded-2xl bg-white p-6 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-[#f9c600] flex items-center justify-center text-[#2f3237] font-bold shadow-sm">6</div>
                  <h3 className="text-lg font-bold text-[#2f3237]">Zimní údržba</h3>
                </div>
                <div className="mt-2 text-sm text-gray-600 leading-relaxed space-y-1">
                  <p>• Odklízení sněhu (parkoviště, areály)</p>
                  <p>• Údržba chodníků a příjezdových cest</p>
                  <p>• Posyp proti námraze (ruční i strojní)</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* TECHNIKA */}
        <section id="technika" className="scroll-mt-24 bg-white text-black py-20 relative overflow-hidden">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-16 text-[#2f3237]">TECHNIKA</h2>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-10">
              
              {/* LEVÁ STRANA - Válec */}
              <div className="w-full md:w-1/4 bg-gray-50 rounded-2xl shadow-md p-6 border border-gray-100 order-2 md:order-1">
                <div className="h-40 flex items-center justify-center">
                  <Image src="/images/valec.png" alt="Válec Ammann AV 32" width={280} height={180} className="object-contain" />
                </div>
                <h3 className="text-lg font-bold mt-4 text-[#2f3237]">Válec Ammann AV 32</h3>
                <ul className="text-xs text-gray-700 mt-3 space-y-2 text-left">
                  <li className="flex items-center gap-2"><ScaleIcon className="w-4 h-4 text-yellow-500" /> Hmotnost: 3.2 t</li>
                  <li className="flex items-center gap-2"><Cog6ToothIcon className="w-4 h-4 text-yellow-500" /> Motor: Yanmar 21.6 kW</li>
                  <li className="flex items-center gap-2"><ArrowsUpDownIcon className="w-4 h-4 text-yellow-500" /> Šířka válce: 1.24 m</li>
                </ul>
              </div>

              {/* STŘED - Bagr (Dominantní vyčnívající prvek) */}
              <div className="w-full md:w-1/3 bg-white rounded-3xl shadow-2xl p-8 border-2 border-yellow-400 z-10 md:scale-110 transform transition-transform duration-500 order-1 md:order-2">
                <div className="relative group">
                  <div className="h-56 flex items-center justify-center">
                    <Image 
                      src={`/images/${selectedAttachmentBagr || "bagr-technik"}.png`} 
                      alt="Bagr Hitachi" 
                      width={450} 
                      height={350} 
                      priority
                      className="object-contain transition-transform duration-300 group-hover:scale-105" 
                    />
                  </div>
                  <button 
                    onClick={() => setShowAccessoriesBagr(true)} 
                    className="absolute bottom-0 right-0 transform translate-x-2 translate-y-2"
                  >
                    <PlusCircleIcon className="w-14 h-14 text-yellow-500 hover:text-yellow-600 drop-shadow-lg transition" />
                  </button>
                </div>
                <h3 className="text-2xl font-black mt-6 text-[#2f3237]">Hitachi ZX 48-A5A</h3>
                <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-gray-700 text-left bg-gray-50 p-4 rounded-xl">
                  <li className="flex items-center gap-2 list-none"><ScaleIcon className="w-5 h-5 text-yellow-500" /> <strong>Hmotnost:</strong> 4.3 t</li>
                  <li className="flex items-center gap-2 list-none"><ArrowsUpDownIcon className="w-5 h-5 text-yellow-500" /> <strong>Hloubka výkopu:</strong> 3.74 m</li>
                  <li className="flex items-center gap-2 list-none"><WrenchScrewdriverIcon className="w-5 h-5 text-yellow-500" /> <strong>Vybavení:</strong> lžíce, vrták, sbíječka</li>
                </div>
              </div>

              {/* PRAVÁ STRANA - Nakladač */}
              <div className="w-full md:w-1/4 bg-gray-50 rounded-2xl shadow-md p-6 border border-gray-100 order-3">
                <div className="relative h-40 flex items-center justify-center">
                  <Image src={`/images/${selectedAttachmentLoader || "nakladac"}.png`} alt="Nakladač" width={280} height={180} className="object-contain" />
                  <button 
                    onClick={() => setShowAccessoriesLoader(true)} 
                    className="absolute bottom-0 right-0"
                  >
                    <PlusCircleIcon className="w-10 h-10 text-yellow-500 hover:text-yellow-600 transition" />
                  </button>
                </div>
                <h3 className="text-lg font-bold mt-4 text-[#2f3237]">Nakladač</h3>
                <ul className="text-xs text-gray-700 mt-3 space-y-2 text-left">
                  <li className="flex items-center gap-2"><ScaleIcon className="w-4 h-4 text-yellow-500" /> Hmotnost: 4.5 t</li>
                  <li className="flex items-center gap-2"><Cog6ToothIcon className="w-4 h-4 text-yellow-500" /> Motor: Deutz 55 kW</li>
                  <li className="flex items-center gap-2"><ArrowsUpDownIcon className="w-4 h-4 text-yellow-500" /> Nosnost: 3.5 t</li>
                </ul>
              </div>

            </div>
          </div>

          {showAccessoriesBagr && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowAccessoriesBagr(false)}>
              <div className="relative bg-white border rounded-2xl shadow-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => setShowAccessoriesBagr(false)} className="absolute top-3 right-3 text-gray-600"><CloseIcon className="w-6 h-6" /></button>
                <h3 className="text-lg font-bold mb-4">Příslušenství bagru</h3>
                <ul className="space-y-3">
                  {[["bagr-vrtak", "Vrták"], ["bagr-sbijecka", "Sbíječka"], ["bagr-lzice30", "Lžíce 30 cm"], ["bagr-lzice60", "Lžíce 60 cm"], ["bagr-lzicesvahova", "Lžíce svahová"]].map(([key, label]) => (
                    <li key={key}><button onClick={() => { setSelectedAttachmentBagr(key); setShowAccessoriesBagr(false); }} className="w-full text-left px-4 py-2 border rounded hover:bg-yellow-100">{label}</button></li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {showAccessoriesLoader && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowAccessoriesLoader(false)}>
              <div className="relative bg-white border rounded-2xl shadow-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => setShowAccessoriesLoader(false)} className="absolute top-3 right-3 text-gray-600"><CloseIcon className="w-6 h-6" /></button>
                <h3 className="text-lg font-bold mb-4">Příslušenství nakladače</h3>
                <ul className="space-y-3">
                  <li><button onClick={() => { setSelectedAttachmentLoader("nakladac-pluh"); setShowAccessoriesLoader(false); }} className="w-full text-left px-4 py-2 border rounded hover:bg-yellow-100">Sněhový pluh</button></li>
                  <li><button onClick={() => { setSelectedAttachmentLoader("nakladac-vidle"); setShowAccessoriesLoader(false); }} className="w-full text-left px-4 py-2 border rounded hover:bg-yellow-100">Paletizační vidle</button></li>
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
                      {[{ name: "Bagr s obsluhou", price: "dle domluvy" }, { name: "Doprava stroje", price: "dle domluvy" }, { name: "Terénní úpravy", price: "dle domluvy" }, { name: "Zimní údržba", price: "dle domluvy" }].map((item) => (
                        <tr key={item.name} className="hover:bg-yellow-50 transition-colors"><td className="py-4 px-6 font-medium text-gray-700">{item.name}</td><td className="py-4 px-6 text-right font-bold text-[#2f3237]">{item.price}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="order-1 lg:order-2 flex justify-center py-10 lg:py-0">
                <div className="relative group perspective-[1000px] animate-float-card">
                  <div className="relative w-full max-w-[340px] md:max-w-[500px] aspect-[1.7/1] bg-[#f9c600] rounded-xl shadow-2xl p-6 border-2 border-yellow-400" style={{ transform: 'perspective(1000px) rotateY(-20deg) rotateX(10deg) rotateZ(-3deg)' }}>
                    <div className="flex flex-col justify-between h-full relative z-20">
                      <div className="flex flex-col space-y-4">
                        <div className="flex items-center gap-3"><h3 className="text-lg md:text-2xl font-extrabold uppercase text-black tracking-tight">KLÁRA PUDILOVÁ</h3></div>
                        <div className="flex items-center gap-3"><PhoneIcon className="w-6 h-6 text-black" /><span className="text-xl md:text-3xl font-extrabold text-black">725 319 300</span></div>
                        <div className="flex items-center gap-3"><GlobeAltIcon className="w-6 h-6 text-black" /><span className="text-base md:text-2xl font-extrabold uppercase text-black">ZEVYP-KP.CZ</span></div>
                      </div>
                    </div>
                    <div className="absolute right-0 bottom-4 w-[150px] z-30 pointer-events-none drop-shadow-lg">
                        <img src="/images/flotila_nejlepsi_transparentni.png" alt="Flotila" className="w-full h-auto object-contain" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* KONTAKT */}
        <section id="kontakt" className="scroll-mt-24 bg-[#2f3237] text-white px-6 py-16 relative overflow-hidden">
          <div className="container mx-auto max-w-4xl relative z-10">
            <div className="text-center mb-10">
               <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-[#f9c600]">ZAVOLEJTE NEBO NAPIŠTE</h2>
            </div>
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 text-gray-800 border-t-4 border-[#f9c600]">
              <form onSubmit={(e) => { e.preventDefault(); odeslat(); }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input type="email" required className="w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-[#f9c600]" placeholder="Váš E-mail" />
                  <input type="tel" required className="w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-[#f9c600]" placeholder="Váš Telefon" />
                </div>
                <div className="flex gap-2">
                  <input type="text" required className="flex-1 px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-[#f9c600]" placeholder="Adresa realizace" value={adresa} onChange={(e) => setAdresa(e.target.value)} />
                  <button type="button" onClick={spocitatVzdalenost} disabled={loadingKm} className="bg-gray-800 text-white px-5 rounded-lg font-semibold">{loadingKm ? "..." : "Zjistit KM"}</button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   <div className="bg-gray-50 p-2 border rounded-lg">
                      <Calendar selectRange tileDisabled={({ date }) => occupiedSet.has(formatLocalDate(date))} onChange={(range) => { if (Array.isArray(range)) { setDatumOd(formatLocalDate(range[0])); setDatumDo(formatLocalDate(range[1])); } }} />
                   </div>
                   <textarea required className="w-full p-4 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-[#f9c600] resize-none h-full min-h-[200px]" value={popisZK} onChange={(e) => setpopisZK(e.target.value)} placeholder="Popis prací..."></textarea>
                </div>
                <button type="submit" disabled={sending} className="w-full bg-[#f9c600] text-[#2f3237] text-lg font-black uppercase py-4 rounded-lg shadow-lg hover:bg-yellow-400 transition-all">
                  {sending ? "Odesílám..." : "Odeslat nezávaznou poptávku"}
                </button>
                {msg && <div className={`text-center p-3 rounded font-bold ${msg.includes("odeslána") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{msg}</div>}
              </form>
            </div>
          </div>
        </section>

        <footer className="bg-[#2f3237] text-white text-center py-6 text-sm border-t border-white/10">
          <p className="opacity-70">Zemní a Výkopové Práce • IČO: 73377619 • Milan Popov</p>
          <p className="opacity-50 mt-1 text-xs">Habartov, Horní Částkov ev. č. 2, 357 09</p>
        </footer>
      </div>
    </>
  );
}
