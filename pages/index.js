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
  // Teď jsou skoro všechny sekce světlé nebo žluté, takže navigace musí být tmavá, aby byla vidět
  const lightBackgroundSections = ['hero', 'sluzby', 'technika', 'cenik'];
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
  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");
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
    if (!popisZK || !adresa || !datumOd || !datumDo || !email || !telefon) { 
      setMsg("Vyplňte prosím všechna povinná pole včetně kontaktu."); 
      return; 
    }
    setSending(true); setMsg("");
    try {
      const res = await fetch("/api/objednavka", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          popisZK, adresa, email, telefon, datumOd, datumDo, 
          typZeminy: znameRozmery ? typZeminy : null, 
          rozmerZeminy: znameRozmery ? rozmerZeminy : null, km 
        }),
      });
      if (res.ok) { 
        setMsg("Poptávka byla odeslána!"); 
        setpopisZK(""); setAdresa(""); setEmail(""); setTelefon("");
      } else { 
        const data = await res.json(); 
        setMsg(data.error || "Chyba při odesílání."); 
      }
    } catch (e) { setMsg("Nepodařilo se připojit k serveru."); } 
    finally { setSending(false); }
  };

  const jsonLdLocalBusiness = {
    "@context": "https://schema.org", "@type": "LocalBusiness", "@id": "https://www.zevyp-kp.cz/#company", "name": "Zevyp – Zemní a výkopové práce", "url": "https://www.zevyp-kp.cz/", "telephone": "+420777123456", "image": "https://www.zevyp.cz/images/bagr-hero.png", "priceRange": "$$", "address": { "@type": "PostalAddress", "streetAddress": "Horní Částkov ev. č. 2", "addressLocality": "Habartov", "postalCode": "357 09", "addressCountry": "CZ" }, "areaServed": ["Karlovy Vary", "Karlovarský kraj"], "description": "Profesionální zemní a výkopové práce minibagrem Hitachi v Karlovarském kraji a okolí.", "geo": { "@type": "GeoCoordinates", "latitude": 50.181, "longitude": 12.634 }
  };

  return (
    <>
      <Head>
        <title>Zemní a výkopové práce Karlovarský kraj | Zevyp-kp.cz</title>
        <meta name="description" content="Zemní a výkopové práce minibagrem Hitachi – Karlovarský kraj a okolí. Výkopy základů, zásypy, úpravy terénu." />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdLocalBusiness) }} />
        <style>{`
          @keyframes float-card { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
          .animate-float-card { animation: float-card 4s ease-in-out infinite; }
        `}</style>
      </Head>

      <Header />
      <MobileSideNav />

      <div className={`${inter.className} min-h-screen bg-white text-gray-900`}>
        {/* --- HERO SEKCE (PROSVĚTLENÁ) --- */}
        <main id="hero" className="bg-[#f9c600] text-[#2f3237] py-16 overflow-hidden relative">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 text-left mb-12 md:mb-0 relative z-20">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight tracking-tighter">ZEMNÍ A VÝKOPOVÉ PRÁCE</h1>
              <p className="text-lg md:text-xl text-[#2f3237]/80 leading-relaxed mb-8 max-w-[50ch]">
                Provádíme <span className="font-bold border-b-2 border-[#2f3237]">spolehlivé zemní a výkopové práce</span> minibagrem Hitachi v Karlovarském kraji a okolí.
              </p>
              <a href="#kontakt" className="inline-block bg-[#2f3237] text-white font-bold px-8 py-4 rounded-xl shadow-2xl hover:bg-black transition-all transform hover:-translate-y-1">Nezávazná poptávka</a>
            </div>
            <div className="md:w-1/2 flex justify-center relative z-10">
              {/* Bagr na žlutém pozadí s jemným stínem pro hloubku */}
              <Image src="/images/bagr-hero.png" alt="Minibagr Hitachi při práci" width={750} height={550} priority className="object-contain -mb-24 md:-mb-32 drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)]" />
            </div>
          </div>
        </main>

        {/* --- SLUŽBY --- */}
        <section id="sluzby" className="scroll-mt-24 bg-white text-black py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center mb-12 text-center">
                <h2 className="text-2xl md:text-4xl font-black mb-2 text-[#2f3237] tracking-tight">NAŠE SLUŽBY</h2>
                <div className="w-20 h-1.5 bg-[#f9c600] rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {['Výkopové práce', 'Terénní úpravy', 'Stavební práce', 'Bourací práce', 'Bagr s vrtákem', 'Zimní údržba'].map((service, idx) => (
                <article key={idx} className="group relative flex flex-col h-full rounded-3xl bg-gray-50 border border-gray-100 p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#f9c600] flex items-center justify-center text-[#2f3237] font-black text-xl shadow-sm">{idx + 1}</div>
                    <h3 className="text-xl font-bold text-[#2f3237]">{service}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {idx === 0 && "Výkopy základových pasů, patek, inženýrských sítí, bazénů a jímek."}
                    {idx === 1 && "Svahování, zarovnávání pozemku a skrývka ornice pro stavbu."}
                    {idx === 2 && "Příprava pro pokládky chodníků, dlažeb a zpevněných ploch."}
                    {idx === 3 && "Demolice menších objektů, plotů a betonových konstrukcí."}
                    {idx === 4 && "Vrtání děr pro plotové sloupky a drobné stavební prvky."}
                    {idx === 5 && "Odklízení sněhu a údržba areálů v zimních měsících."}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* --- TECHNIKA (ŠEDÁ PRO KONTRAST) --- */}
        <section id="technika" className="scroll-mt-24 bg-[#2f3237] text-white py-20 relative">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-4xl font-black mb-16 tracking-tight">PROFESIONÁLNÍ TECHNIKA</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
              {[
                { name: "Válec Ammann AV 32", img: "valec", specs: ["3.2 t", "Yanmar 21,6 kW", "Šířka 1,24 m"] },
                { name: "Hitachi ZX 48-A5A", img: selectedAttachmentBagr || "bagr-technik", specs: ["4.3 t", "Yanmar 25.2 kW", "Hloubka 3.74 m"], isSpecial: true },
                { name: "Nakladač", img: selectedAttachmentLoader || "nakladac", specs: ["4.5 t", "Deutz 55 kW", "Nosnost 3,5 t"], isSpecial: true }
              ].map((item, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:border-[#f9c600]/50 transition-all duration-300">
                  <div className="relative mb-6">
                    <Image src={`/images/${item.img}.png`} alt={item.name} width={400} height={300} className="mx-auto drop-shadow-2xl" />
                    {item.isSpecial && (
                      <button onClick={() => i === 1 ? setShowAccessoriesBagr(true) : setShowAccessoriesLoader(true)} className="absolute bottom-0 right-0 p-3 bg-[#f9c600] rounded-full text-[#2f3237] shadow-xl hover:scale-110 transition">
                        <PlusCircleIcon className="w-8 h-8" />
                      </button>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{item.name}</h3>
                  <ul className="space-y-2">
                    {item.specs.map((s, si) => <li key={si} className="text-gray-400 flex items-center justify-center gap-2 text-sm"><div className="w-1.5 h-1.5 bg-[#f9c600] rounded-full"></div> {s}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- CENÍK --- */}
        <section id="cenik" className="scroll-mt-24 bg-white py-20 overflow-hidden">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-4xl font-black mb-16 text-[#2f3237] text-center">CENÍK SLUŽEB</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="bg-gray-50 rounded-3xl p-2 shadow-inner">
                <table className="w-full">
                  <thead className="bg-[#2f3237] text-white">
                    <tr><th className="py-6 px-8 text-left rounded-tl-2xl">Položka</th><th className="py-6 px-8 text-right rounded-tr-2xl">Cena</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[{ n: "Bagr s obsluhou", p: "Dle domluvy" }, { n: "Doprava stroje", p: "Dle domluvy" }, { n: "Terénní úpravy", p: "Dle domluvy" }, { n: "Zimní údržba", p: "Dle domluvy" }].map((item, i) => (
                      <tr key={i} className="hover:bg-white transition-colors">
                        <td className="py-6 px-8 font-bold text-gray-700">{item.n}</td>
                        <td className="py-6 px-8 text-right font-black text-[#2f3237]">{item.p}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* VIZITKA (Prémiová žlutá) */}
              <div className="flex justify-center">
                <div className="relative animate-float-card">
                  <div className="relative w-[340px] md:w-[480px] aspect-[1.7/1] bg-[#f9c600] rounded-2xl shadow-[20px_20px_60px_rgba(0,0,0,0.1)] p-8 border-t-4 border-white/30 overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                     <h3 className="text-2xl md:text-3xl font-black text-[#2f3237] mb-8 border-b-2 border-[#2f3237] pb-2 inline-block uppercase">Klára Pudilová</h3>
                     <div className="space-y-4">
                        <div className="flex items-center gap-4 text-[#2f3237] font-black text-xl md:text-3xl">
                          <PhoneIcon className="w-6 h-6 md:w-8 md:h-8" /> 725 319 300
                        </div>
                        <div className="flex items-center gap-4 text-[#2f3237] font-bold text-lg">
                          <GlobeAltIcon className="w-6 h-6" /> ZEVYP-KP.CZ
                        </div>
                        <div className="flex items-center gap-4 text-[#2f3237] font-bold text-lg">
                          <IdentificationIcon className="w-6 h-6" /> IČO: 73377619
                        </div>
                     </div>
                     <img src="/images/flotila_nejlepsi_transparentni.png" alt="Bagr" className="absolute bottom-4 right-4 w-40 opacity-90" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- KONTAKT (TMAVÝ PRO ZÁVĚR) --- */}
        <section id="kontakt" className="scroll-mt-24 bg-[#2f3237] text-white py-20 relative">
          <div className="container mx-auto max-w-4xl relative z-10 px-4">
            <div className="text-center mb-12">
               <h2 className="text-3xl md:text-5xl font-black mb-4 text-[#f9c600]">MÁTE DOTAZY?</h2>
               <p className="text-gray-400">Napište nám a my se vám ozveme s nezávaznou kalkulací.</p>
            </div>

            <div className="bg-white rounded-3xl p-8 md:p-12 text-gray-800 shadow-2xl">
              <form onSubmit={(e) => { e.preventDefault(); odeslat(); }} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-xs font-black uppercase text-gray-400 mb-2">E-mail</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-[#f9c600] outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-gray-400 mb-2">Telefon</label>
                    <input type="tel" required value={telefon} onChange={(e) => setTelefon(e.target.value)} className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-[#f9c600] outline-none transition-all" />
                  </div>
                </div>
                <div className="bg-[#f9c600]/10 p-6 rounded-2xl border-2 border-dashed border-[#f9c600]/30">
                   <Calendar selectRange className="brand-calendar w-full border-none bg-transparent" tileDisabled={({ date }) => occupiedSet.has(formatLocalDate(date))} onChange={(range) => { if (Array.isArray(range)) { setDatumOd(formatLocalDate(range[0])); setDatumDo(formatLocalDate(range[1])); } }} />
                </div>
                <textarea required className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-[#f9c600] outline-none transition-all h-32" value={popisZK} onChange={(e) => setpopisZK(e.target.value)} placeholder="Popište vaši poptávku..."></textarea>
                <button type="submit" disabled={sending} className="w-full bg-[#f9c600] text-[#2f3237] py-6 rounded-2xl font-black uppercase tracking-widest text-xl hover:bg-yellow-400 shadow-xl transition-all">
                  {sending ? "Odesílám..." : "Odeslat poptávku"}
                </button>
              </form>
            </div>
          </div>
        </section>

        <footer className="bg-[#1a1c1e] text-white/50 text-center py-10 border-t border-white/5">
          <p className="mb-2">Zemní a Výkopové Práce • Milan Popov • IČO: 73377619</p>
          <a href="mailto:kontakt@zevyp-kp.cz" className="text-[#f9c600] font-bold hover:underline text-lg">kontakt@zevyp-kp.cz</a>
        </footer>
      </div>

      {/* MODALY PRO PŘÍSLUŠENSTVÍ (Logika beze změny) */}
      {showAccessoriesBagr && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4" onClick={() => setShowAccessoriesBagr(false)}>
              <div className="bg-white rounded-3xl p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-2xl font-black mb-6 text-[#2f3237]">Příslušenství bagru</h3>
                <div className="grid gap-3">
                  {[["bagr-vrtak", "Vrták"], ["bagr-sbijecka", "Sbíječka"], ["bagr-lzice30", "Lžíce 30cm"], ["bagr-lzice50", "Lžíce 50cm"], ["bagr-lzicesvahova", "Svahovka"]].map(([key, label]) => (
                    <button key={key} onClick={() => { setSelectedAttachmentBagr(key); setShowAccessoriesBagr(false); }} className="p-4 text-left border-2 border-gray-100 rounded-2xl hover:bg-[#f9c600] font-bold transition-all">{label}</button>
                  ))}
                </div>
              </div>
            </div>
          )}
    </>
  );
}
