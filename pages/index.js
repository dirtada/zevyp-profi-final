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
  IdentificationIcon,
  ChevronRightIcon
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

/* --- TATO SEKCE JE TEĎ DEFINOVANÁ, ALE NENÍ VOLANÁ DOLE V HOME --- */
function AktualneZTerenu() {
  const stavkaData = {
    popis: "Výkop rýhy pro inženýrské sítě a zásyp pískem",
    obec: "Josefov",
    fotoPath: "/images/josefov_zakazka.png" 
  };

  return (
    <section id="aktualne" className="scroll-mt-24 bg-[#f9c600] py-12 border-b-4 border-black/10 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")' }}></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="bg-[#2f3237] rounded-3xl p-6 md:p-10 shadow-2xl border border-black/20 flex flex-col md:flex-row items-center gap-10 overflow-hidden relative" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23f9c600\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\'/%3E%3C/g%3E%3C/svg%3E")' }}>
          <div className="absolute top-4 right-6 flex items-center gap-2.5 bg-black/50 px-4 py-1.5 rounded-full shadow-inner border border-white/10 z-20">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-90"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600 shadow-md"></span>
            </span>
            <span className="text-xs font-black text-white uppercase tracking-widest">Právě teď</span>
          </div>
          <div className="flex-1 space-y-4 w-full text-center md:text-left relative z-10">
            <h3 className="font-black text-[#f9c600] text-sm tracking-[0.3em] uppercase opacity-90">Aktuální projekt</h3>
            <p className="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight shadow-sm">{stavkaData.popis}</p>
            <div className="flex items-center gap-3 text-2xl font-bold text-gray-300 justify-center md:justify-start pt-2">
              <MapPinIcon className="w-8 h-8 text-[#f9c600] drop-shadow" />
              <span className="border-b-2 border-[#f9c600]/30 pb-1">{stavkaData.obec}</span>
            </div>
          </div>
          <div className="flex-shrink-0 w-full md:w-[450px] lg:w-[600px] relative z-10">
            <div className="aspect-video md:aspect-[16/10] rounded-2xl overflow-hidden relative border-4 border-[#1a1c1f] shadow-2xl group bg-[#1a1c1f]">
              <Image src={stavkaData.fotoPath} alt={`Práce v lokalitě ${stavkaData.obec}`} fill className="object-contain transform group-hover:scale-105 transition-transform duration-700" priority />
            </div>
          </div>
        </div>
      </div>
    </section>
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
      if (res.ok) { setMsg("Poptávka byla odeslána!"); } else { const data = await res.json(); setMsg(data.error || "Chyba při odesílání."); }
    } catch (e) { setMsg("Nepodařilo se připojit k serveru."); } 
    finally { setSending(false); }
  };

  return (
    <>
      <Head>
        <title>Zemní a výkopové práce Karlovarský kraj | Zevyp-kp.cz</title>
        <style>{`
          @keyframes float-card { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
          .animate-float-card { animation: float-card 4s ease-in-out infinite; }
        `}</style>
      </Head>

      <Header />
      <MobileSideNav />

      <div className={`${inter.className} min-h-screen bg-[#f9c600] text-gray-900`}>
        <main id="hero" className="bg-gradient-to-br from-[#2f3237] via-[#2f3237] to-black text-white py-16 border-b-4 border-[#f9c600]">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between relative z-10">
            <div className="md:w-1/2 text-left mb-12 md:mb-0 relative z-20">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight uppercase">Zemní a výkopové práce</h1>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8 max-w-[60ch]">Provádíme <span className="text-[#f9c600] font-semibold">spolehlivé zemní a výkopové práce</span> minibagrem Hitachi v Karlovarském kraji a okolí.</p>
              <a href="#kontakt" className="inline-block bg-[#f9c600] text-[#2f3237] font-bold px-8 py-3.5 rounded-lg shadow-lg hover:bg-yellow-400 transition transform hover:-translate-y-0.5">Nezávazná poptávka</a>
            </div>
            <div className="md:w-1/2 flex justify-center relative z-10">
              <Image src="/images/bagr-hero.png" alt="Minibagr Hitachi" width={700} height={500} priority className="object-contain -mb-24 md:-mb-32 drop-shadow-2xl" />
            </div>
          </div>
        </main>

        {/* --- TADY JE SEKCE ZAKOMENTOVANÁ --- */}
        {/* <AktualneZTerenu /> */}

        <section id="sluzby" className="scroll-mt-24 bg-[#f9c600] text-black py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center uppercase tracking-wide">Naše služby</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              {[
                { id: 1, title: "Výkopové práce", desc: "Výkopy základových pasů, pro inženýrské sítě, bazény a další." },
                { id: 2, title: "Terénní úpravy", desc: "Svahování, zarovnávání a skrývka ornice. Příprava pozemku." },
                { id: 3, title: "Stavební práce", desc: "Stavební příprava pro pokládky chodníků a dlažby." },
                { id: 4, title: "Bourací práce", desc: "Bourání menších objektů, betonových konstrukcí a základů." },
                { id: 5, title: "Bagr s vrtákem", desc: "Vrtání děr pro plotové sloupky a drobné stavební prvky." }
              ].map((s) => (
                <article key={s.id} className="group relative flex flex-col h-full rounded-2xl bg-white p-6 shadow-sm hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 rounded-full bg-[#f9c600] flex items-center justify-center font-bold">{s.id}</div><h3 className="text-lg font-bold">{s.title}</h3></div>
                  <p className="mt-2 text-sm text-gray-600">{s.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ... Zbytek kódu zůstává stejný ... */}
        <section id="technika" className="scroll-mt-24 bg-white text-black py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-12 uppercase tracking-wide">Technika</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="bg-gray-50 rounded-xl shadow-lg p-6 border border-gray-100">
                <Image src="/images/valec.png" alt="Válec" width={300} height={200} className="mx-auto" />
                <h3 className="text-xl font-bold mt-4">Válec</h3>
                <ul className="text-sm text-gray-700 mt-3 space-y-2 text-left border-t pt-3">
                  <li className="flex items-center gap-2"><ScaleIcon className="w-5 h-5 text-yellow-500" /> Hmotnost: 2.7 t</li>
                  <li className="flex items-center gap-2"><ArrowsUpDownIcon className="w-5 h-5 text-yellow-500" /> Šířka: 1,2 m</li>
                </ul>
              </div>
              <div className="relative bg-gray-50 rounded-xl shadow-lg p-6 border border-gray-100">
                <Image src={`/images/${selectedAttachmentBagr || "bagr-technik"}.png`} alt="Bagr" width={400} height={300} className="mx-auto" />
                <button onClick={() => setShowAccessoriesBagr(true)} className="absolute top-3/4 left-[79%] bg-white rounded-full p-1 shadow-md hover:scale-110 transition"><PlusCircleIcon className="w-12 h-12 text-yellow-500" /></button>
                <h3 className="text-xl font-bold mt-4">Hitachi ZX 48-A5A</h3>
              </div>
              <div className="relative bg-gray-50 rounded-xl shadow-lg p-6 border border-gray-100">
                <Image src={`/images/${selectedAttachmentLoader || "nakladac"}.png`} alt="Nakladač" width={300} height={200} className="mx-auto" />
                <button onClick={() => setShowAccessoriesLoader(true)} className="absolute top-2/3 right-[60%] bg-white rounded-full p-1 shadow-md hover:scale-110 transition"><PlusCircleIcon className="w-12 h-12 text-yellow-500" /></button>
                <h3 className="text-xl font-bold mt-4">Nakladač</h3>
              </div>
            </div>
          </div>
        </section>

        <section id="cenik" className="scroll-mt-24 bg-gray-100 text-black py-16 overflow-hidden">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center uppercase tracking-wide">Ceník</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                <table className="w-full">
                  <thead className="bg-[#2f3237] text-white">
                    <tr><th className="py-5 px-6 text-left font-semibold uppercase text-xs">Položka</th><th className="py-5 px-6 text-right font-semibold uppercase text-xs">Cena</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {[{ name: "Bagr s obsluhou (hod)", price: "dle domluvy" }, { name: "Doprava stroje (km)", price: "dle domluvy" }, { name: "Terénní úpravy", price: "dle domluvy" }].map((item) => (
                      <tr key={item.name} className="hover:bg-yellow-50 transition-colors"><td className="py-4 px-6 font-medium">{item.name}</td><td className="py-4 px-6 text-right font-bold">{item.price}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="relative group animate-float-card flex justify-center py-10 lg:py-0">
                <div className="w-full max-w-[480px] aspect-[1.7/1] bg-[#f9c600] rounded-xl shadow-2xl p-7 border-2 border-yellow-400" style={{ transform: 'perspective(1500px) rotateY(-10deg)' }}>
                  <h3 className="text-3xl font-black uppercase text-black tracking-tighter">MILAN POPOV</h3>
                  <div className="flex items-center gap-3 border-l-4 border-black pl-3 mt-4"><PhoneIcon className="w-7 h-7 text-black" /><span className="text-2xl font-black text-black">725 319 300</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="kontakt" className="scroll-mt-24 bg-[#2f3237] text-white px-6 py-16 relative overflow-hidden">
          <div className="container mx-auto max-w-4xl relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-[#f9c600] text-center uppercase">Rychlá poptávka</h2>
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 text-gray-800">
              <form onSubmit={(e) => { e.preventDefault(); odeslat(); }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input type="email" required placeholder="E-mail" className="w-full p-3.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-[#f9c600]" />
                  <input type="tel" required placeholder="Telefon" className="w-full p-3.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-[#f9c600]" />
                </div>
                <div className="flex gap-2">
                  <input type="text" value={adresa} onChange={(e) => setAdresa(e.target.value)} required placeholder="Adresa realizace" className="flex-1 p-3.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-[#f9c600]" />
                  <button type="button" onClick={spocitatVzdalenost} className="bg-black text-white px-5 py-2 rounded-lg font-bold">KM</button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="border rounded-xl p-3 bg-gray-50"><Calendar selectRange tileDisabled={({ date }) => occupiedSet.has(formatLocalDate(date))} onChange={(r) => { if(Array.isArray(r)) { setDatumOd(formatLocalDate(r[0])); setDatumDo(formatLocalDate(r[1])); } }} /></div>
                  <textarea value={popisZK} onChange={(e) => setpopisZK(e.target.value)} required className="w-full p-4 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-[#f9c600] resize-none h-full min-h-[220px]" placeholder="Popište zakázku..."></textarea>
                </div>
                <button type="submit" disabled={sending} className="w-full bg-[#f9c600] text-[#2f3237] text-xl font-black uppercase py-4 rounded-xl shadow-lg hover:bg-yellow-400 transition">
                  {sending ? "Odesílám..." : "Odeslat nezávaznou poptávku"}
                </button>
              </form>
            </div>
          </div>
        </section>

        <footer className="bg-[#1a1c1f] text-white text-center py-8 text-sm border-t border-white/5">
          <p className="opacity-60 uppercase tracking-widest font-bold">Zevyp - Milan Popov • IČO: 73377619</p>
          <a href="mailto:kontakt@zevyp.cz" className="text-[#f9c600] hover:underline font-bold text-base">kontakt@zevyp.cz</a>
        </footer>
      </div>
    </>
  );
}
