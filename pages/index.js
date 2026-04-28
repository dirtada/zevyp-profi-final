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

/* --- LOGIKA BAREV PRO NAVIGACI --- */
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

/* --- SIDE NAVIGATION (POUZE MOBIL) --- */
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
      activeSection === 'hero' 
        ? 'opacity-0 pointer-events-none -translate-x-10' 
        : 'opacity-100 translate-x-0' 
    }`}>
      <div className={`flex flex-col gap-3 p-1.5 backdrop-blur-[2px] rounded-full transition-colors duration-500 ${theme.container}`}>
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
  const [email, setEmail] = useState(""); // PŘIDÁNO
  const [telefon, setTelefon] = useState(""); // PŘIDÁNO
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
    // Kontrola všech povinných polí včetně kontaktu
    if (!popisZK || !adresa || !datumOd || !datumDo || !email || !telefon) { 
      setMsg("Vyplňte prosím všechna povinná pole."); 
      return; 
    }
    setSending(true); setMsg("");
    try {
      const res = await fetch("/api/objednavka", {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          popisZK, 
          adresa, 
          email, // PŘIDÁNO
          telefon, // PŘIDÁNO
          datumOd, 
          datumDo, 
          typZeminy: znameRozmery ? typZeminy : null, 
          rozmerZeminy: znameRozmery ? rozmerZeminy : null, 
          km 
        }),
      });
      if (res.ok) { 
        setMsg("Poptávka byla odeslána!"); 
        // Reset formuláře
        setpopisZK(""); setAdresa(""); setEmail(""); setTelefon("");
      } else { 
        const data = await res.json(); 
        setMsg(data.error || "Chyba při odesílání."); 
      }
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
              <Image src="/images/bagr-hero.png" alt="Minibagr Hitachi při práci" width={700} height={500} priority sizes="(min-width: 768px) 700px, 100vw" className="object-contain -mb-24 md:-mb-32" />
            </div>
          </div>
        </main>

        <section id="sluzby" className="scroll-mt-24 bg-[#f9c600] text-black py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-10 text-[#2f3237] text-center tracking-wide">NAŠE SLUŽBY</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              {/* Služba 1 */}
              <article className="group relative flex flex-col h-full rounded-2xl bg-white p-6 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-default">
                <div className="flex-grow relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-[#f9c600] flex items-center justify-center text-[#2f3237] font-bold text-lg shadow-sm">1</div>
                    <h3 className="text-lg font-bold text-[#2f3237]">Výkopové práce</h3>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed pl-1">Výkopy základových pasů a patek, výkopy pro inženýrské sítě, bazény, jímky a další.</p>
                </div>
              </article>
              {/* Služba 2 */}
              <article className="group relative flex flex-col h-full rounded-2xl bg-white p-6 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-default">
                <div className="flex-grow relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-[#f9c600] flex items-center justify-center text-[#2f3237] font-bold text-lg shadow-sm">2</div>
                    <h3 className="text-lg font-bold text-[#2f3237]">Terénní úpravy</h3>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed pl-1">Svahování, zarovnávání a skrývka ornice. Příprava pozemku pro stavbu nebo finální úpravu.</p>
                </div>
              </article>
              {/* Služba 3 */}
              <article className="group relative flex flex-col h-full rounded-2xl bg-white p-6 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-default">
                <div className="flex-grow relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-[#f9c600] flex items-center justify-center text-[#2f3237] font-bold text-lg shadow-sm">3</div>
                    <h3 className="text-lg font-bold text-[#2f3237]">Stavební práce</h3>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed pl-1">Stavební příprava pro pokládky chodníků, dlažby a dalších povrchů.</p>
                </div>
              </article>
              {/* Služba 4 */}
              <article className="group relative flex flex-col h-full rounded-2xl bg-white p-6 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-default">
                <div className="flex-grow relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-[#f9c600] flex items-center justify-center text-[#2f3237] font-bold text-lg shadow-sm">4</div>
                    <h3 className="text-lg font-bold text-[#2f3237]">Bourací práce</h3>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed pl-1">Bourání menších objektů, betonových konstrukcí, základů, plotů a zpevněných ploch.</p>
                </div>
              </article>
              {/* Služba 5 */}
              <article className="group relative flex flex-col h-full rounded-2xl bg-white p-6 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-default">
                <div className="flex-grow relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-[#f9c600] flex items-center justify-center text-[#2f3237] font-bold text-lg shadow-sm">5</div>
                    <h3 className="text-lg font-bold text-[#2f3237]">Bagr s vrtákem</h3>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed pl-1">Vrtání děr pro plotové sloupky, patky, piloty a další drobné stavební prvky.</p>
                </div>
              </article>
              {/* Služba 6 */}
              <article className="group relative flex flex-col h-full rounded-2xl bg-white p-6 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-default">
                <div className="flex-grow relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-[#f9c600] flex items-center justify-center text-[#2f3237] font-bold text-lg shadow-sm">6</div>
                    <h3 className="text-lg font-bold text-[#2f3237]">Zimní údržba</h3>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed pl-1">Odklízení sněhu, údržba chodníků a příjezdových cest, posyp proti námraze.</p>
                </div>
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
                <h3 className="text-xl font-bold mt-4 text-[#2f3237]">Válec Ammann</h3>
                <ul className="text-sm text-gray-700 mt-3 space-y-2 text-left">
                  <li className="flex items-center gap-2"><ScaleIcon className="w-5 h-5 text-yellow-500" /> Hmotnost: 3.2 t</li>
                  <li className="flex items-center gap-2"><ArrowsUpDownIcon className="w-5 h-5 text-yellow-500" /> Šířka: 1,24 m</li>
                </ul>
              </div>
              <div className="relative bg-gray-50 rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                <Image src={`/images/${selectedAttachmentBagr || "bagr-technik"}.png`} alt="Bagr" width={400} height={300} className="mx-auto" />
                <h3 className="text-xl font-bold mt-4 text-[#2f3237]">Hitachi ZX 48</h3>
                <button onClick={() => setShowAccessoriesBagr(true)} className="mt-4 flex items-center gap-2 mx-auto bg-yellow-400 px-4 py-2 rounded-lg font-bold text-sm"><PlusCircleIcon className="w-5 h-5" /> Příslušenství</button>
              </div>
              <div className="relative bg-gray-50 rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                <Image src={`/images/${selectedAttachmentLoader || "nakladac"}.png`} alt="Nakladač" width={300} height={200} className="mx-auto" />
                <h3 className="text-xl font-bold mt-4 text-[#2f3237]">Smykový nakladač</h3>
                <button onClick={() => setShowAccessoriesLoader(true)} className="mt-4 flex items-center gap-2 mx-auto bg-yellow-400 px-4 py-2 rounded-lg font-bold text-sm"><PlusCircleIcon className="w-5 h-5" /> Příslušenství</button>
              </div>
            </div>
          </div>

          {/* Modaly pro příslušenství */}
          {showAccessoriesBagr && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]" onClick={() => setShowAccessoriesBagr(false)}>
              <div className="bg-white rounded-2xl p-6 max-w-md w-full m-4" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-lg font-bold mb-4">Příslušenství bagru</h3>
                <div className="grid grid-cols-2 gap-2">
                  {["Vrták", "Sbíječka", "Lžíce 30cm", "Lžíce 60cm", "Svahovka"].map(item => (
                    <button key={item} className="p-3 border rounded-lg hover:bg-yellow-50 text-left font-medium">{item}</button>
                  ))}
                </div>
                <button onClick={() => setShowAccessoriesBagr(false)} className="mt-6 w-full py-2 bg-gray-800 text-white rounded-lg">Zavřít</button>
              </div>
            </div>
          )}
        </section>

        {/* CENÍK */}
        <section id="cenik" className="scroll-mt-24 bg-gray-100 text-black py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-[#2f3237] text-center">CENÍK SLUŽEB</h2>
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#2f3237] text-white">
                  <tr><th className="py-4 px-6 text-left">Položka</th><th className="py-4 px-6 text-right">Cena</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-yellow-50"><td className="py-4 px-6">Bagr s obsluhou</td><td className="py-4 px-6 text-right font-bold">dle domluvy</td></tr>
                  <tr className="hover:bg-yellow-50"><td className="py-4 px-6">Doprava stroje</td><td className="py-4 px-6 text-right font-bold">dle domluvy</td></tr>
                  <tr className="hover:bg-yellow-50"><td className="py-4 px-6">Terénní úpravy</td><td className="py-4 px-6 text-right font-bold">individuálně</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* KONTAKTNÍ FORMULÁŘ */}
        <section id="kontakt" className="scroll-mt-24 bg-[#2f3237] text-white px-6 py-16 relative overflow-hidden">
          <div className="container mx-auto max-w-4xl relative z-10">
            <div className="text-center mb-10">
               <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-[#f9c600]">ZAVOLEJTE NEBO NAPIŠTE</h2>
               <p className="text-gray-300">Napište nám podrobnosti a my se vám ozveme s nabídkou.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 text-gray-800">
              <form onSubmit={(e) => { e.preventDefault(); odeslat(); }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold uppercase mb-2">Váš E-mail</label>
                    <input 
                      type="email" required 
                      value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-[#f9c600] outline-none" 
                      placeholder="email@seznam.cz" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold uppercase mb-2">Váš Telefon</label>
                    <input 
                      type="tel" required 
                      value={telefon} onChange={(e) => setTelefon(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-[#f9c600] outline-none" 
                      placeholder="+420 123 456 789" 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold uppercase mb-2">Adresa realizace</label>
                  <div className="flex gap-2">
                    <input
                      type="text" required value={adresa} onChange={(e) => setAdresa(e.target.value)}
                      className="flex-1 px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-[#f9c600] outline-none"
                      placeholder="Město, ulice..."
                    />
                    <button type="button" onClick={spocitatVzdalenost} className="bg-gray-800 text-white px-4 rounded-lg font-bold text-xs uppercase">Zjistit KM</button>
                  </div>
                  {km && <p className="text-sm mt-2 font-bold text-[#2f3237] bg-yellow-100 inline-block px-2 py-1 rounded">Vzdálenost: {km} km</p>}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   <div>
                     <label className="block text-sm font-bold uppercase mb-2">Termín (od - do)</label>
                     <Calendar
                        selectRange
                        className="rounded-lg shadow-sm w-full"
                        tileDisabled={({ date }) => occupiedSet.has(formatLocalDate(date))}
                        onChange={(range) => {
                          if (Array.isArray(range) && range.length === 2) {
                            setDatumOd(formatLocalDate(range[0]));
                            setDatumDo(formatLocalDate(range[1]));
                          }
                        }}
                     />
                     {datumOd && <p className="mt-2 text-center text-sm font-bold">{datumOd} — {datumDo}</p>}
                   </div>
                   <div className="flex flex-col">
                     <label className="block text-sm font-bold uppercase mb-2">Popis prací</label>
                     <textarea
                       required value={popisZK} onChange={(e) => setpopisZK(e.target.value)}
                       className="flex-1 p-4 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-[#f9c600] outline-none min-h-[150px]"
                       placeholder="Co potřebujete udělat?"
                     />
                   </div>
                </div>

                <button
                  type="submit" disabled={sending}
                  className="w-full bg-[#f9c600] text-[#2f3237] text-lg font-black uppercase py-4 rounded-lg shadow-lg hover:bg-yellow-400 transition"
                >
                  {sending ? "Odesílám..." : "Odeslat nezávaznou poptávku"}
                </button>
                
                {msg && <div className={`text-center p-3 rounded font-bold ${msg.includes("odeslána") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{msg}</div>}
              </form>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#2f3237] text-white text-center py-8 text-sm border-t border-white/10">
          <p className="font-bold text-[#f9c600] mb-2">Milan Popov - Zemní a výkopové práce</p>
          <p className="opacity-70">IČO: 73377619</p>
          <p className="opacity-70">kontakt@zevyp-kp.cz</p>
          <p className="opacity-50 mt-4 text-xs">Habartov, Horní Částkov ev. č. 2, 357 09</p>
        </footer>
      </div>
    </>
  );
}
