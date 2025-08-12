// pages/index2.js
import Head from "next/head";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { Inter } from "next/font/google";
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
import "react-calendar/dist/Calendar.css";

const Calendar = dynamic(() => import("react-calendar"), { ssr: false });
const inter = Inter({ subsets: ["latin", "latin-ext"] });

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 left-0 right-0 bg-[#f9c600]/90 backdrop-blur supports-[backdrop-filter]:bg-[#f9c600]/80 border-b border-black/5 z-50">
      <div className="container mx-auto flex justify-between items-center px-4 py-2">
        <Image
          src="/images/logo_update.png"
          alt="Zevyp logo"
          width={150}
          height={150}
          priority
          sizes="150px"
          className="h-12 w-auto"
        />
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex gap-6 text-base md:text-lg">
            <a href="#hero" className="hover:underline">ÚVOD</a>
            <a href="#sluzby" className="hover:underline">SLUŽBY</a>
            <a href="#technika" className="hover:underline">TECHNIKA</a>
            <a href="#cenik" className="hover:underline">CENÍK</a>
            <a href="#kontakt" className="hover:underline">KONTAKT</a>
          </nav>
          <a
            href="tel:+420777123456"
            aria-label="Zavolat +420 777 123 456"
            className="inline-flex items-center gap-2 bg-white/90 hover:bg-white text-[#2f3237] font-semibold px-4 py-2 rounded-full shadow-sm ring-1 ring-black/10 transition whitespace-nowrap"
          >
            <PhoneIcon className="w-5 h-5" />
            <span>+420&nbsp;777&nbsp;123&nbsp;456</span>
          </a>
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Otevřít menu">
          {open ? <XMarkIcon className="w-8 h-8" /> : <Bars3Icon className="w-8 h-8" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-[#f9c600] py-4 px-6 flex flex-col gap-4 shadow-lg">
          <a href="#hero" onClick={() => setOpen(false)}>ÚVOD</a>
          <a href="#sluzby" onClick={() => setOpen(false)}>SLUŽBY</a>
          <a href="#technika" onClick={() => setOpen(false)}>TECHNIKA</a>
          <a href="#cenik" onClick={() => setOpen(false)}>CENÍK</a>
          <a href="#kontakt" onClick={() => setOpen(false)}>KONTAKT</a>
          <a
            href="tel:+420777123456"
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

function SideSteps({ sections, active, onGo }) {
  return (
    <aside className="hidden md:flex fixed left-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-3">
      {sections.map((s) => {
        const isActive = active === s.id;
        return (
          <button
            key={s.id}
            onClick={() => onGo(s.id)}
            className={`group flex items-center gap-2`}
            aria-current={isActive ? "step" : undefined}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full transition ${
                isActive ? "bg-[#f9c600]" : "bg-white/60 border border-white/50"
              }`}
              aria-hidden
            />
            <span
              className={`text-xs uppercase tracking-wide transition ${
                isActive ? "text-white/90" : "text-white/50 group-hover:text-white/80"
              }`}
            >
              {s.label}
            </span>
          </button>
        );
      })}
    </aside>
  );
}

export default function Index2() {
  // --- původní stavy / logika ---
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

  const sections = [
    { id: "hero", label: "Úvod" },
    { id: "sluzby", label: "Služby" },
    { id: "technika", label: "Technika" },
    { id: "cenik", label: "Ceník" },
    { id: "kontakt", label: "Kontakt" },
  ];

  // YYYY-MM-DD bez UTC
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
      } catch (e) {
        console.error(e);
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
      if (res.ok) setMsg("Poptávka byla odeslána!");
      else setMsg(data.error || "Chyba při odesílání.");
    } catch (e) {
      console.error(e);
      setMsg("Nepodařilo se připojit k serveru.");
    } finally {
      setSending(false);
    }
  };

  // --- full-page scroll snap + aktivní sekce ---
  const scrollRef = useRef(null);
  const [active, setActive] = useState(sections[0].id);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const opts = { root, threshold: 0.6 };
    const obs = new IntersectionObserver((entries) => {
      const vis = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (vis[0]) setActive(vis[0].target.id);
    }, opts);

    sections.forEach((s) => {
      const el = root.querySelector(`#${s.id}`);
      if (el) obs.observe(el);
    });

    return () => obs.disconnect();
  }, []);

  const goTo = (id) => {
    const root = scrollRef.current;
    const el = root?.querySelector(`#${id}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <Head>
        <title>Zevyp.cz – Fullpage</title>
        <meta name="robots" content="noindex,follow" />
      </Head>

      <Header />

      {/* scroll kontejner */}
      <div
        ref={scrollRef}
        className={`${inter.className} h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth bg-black`}
      >
        {/* side steps */}
        <SideSteps sections={sections} active={active} onGo={goTo} />

        {/* HERO */}
        <section
          id="hero"
          className="snap-start h-screen relative bg-gradient-to-br from-[#2f3237] via-[#2f3237] to-black text-white"
        >
          <div className="container mx-auto px-4 h-full flex items-center justify-between gap-6">
            <div className="md:w-1/2 z-10">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                ZEMNÍ A VÝKOPOVÉ PRÁCE
              </h1>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8 max-w-[60ch]">
                Provádíme <span className="text-[#f9c600] font-semibold">spolehlivé zemní a výkopové práce</span> minibagrem Hitachi v Praze a okolí.
              </p>
              <a
                href="#kontakt"
                onClick={(e) => { e.preventDefault(); goTo("kontakt"); }}
                className="inline-block bg-[#f9c600] text-[#2f3237] font-bold px-6 py-3 rounded-lg shadow hover:bg-yellow-400 transition
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#f9c600] focus-visible:ring-offset-[#2f3237]"
              >
                Nezávazná poptávka
              </a>
            </div>
            <div className="hidden md:flex md:w-1/2 justify-center">
              <Image
                src="/images/bagr-hero.png"
                alt="Minibagr Hitachi při práci"
                width={700}
                height={500}
                priority
                sizes="(min-width: 768px) 700px, 100vw"
                className="object-contain"
              />
            </div>
          </div>
        </section>

        {/* SLUŽBY */}
        <section id="sluzby" className="snap-start min-h-screen bg-[#f9c600] text-black flex items-center py-16">
          <div className="container mx-auto px-4 w-full">
            <h2 className="text-2xl md:text-3xl font-bold mb-10 text-[#2f3237] text-center">
              NAŠE SLUŽBY
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <article className="rounded-2xl bg-white ring-1 ring-black/10 p-6">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 rounded-lg bg-yellow-100 p-3">
                    <BuildingOffice2Icon className="w-7 h-7 text-[#2f3237]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#2f3237]">Výkopy základů</h3>
                    <p className="mt-1 text-sm text-gray-600">Přesné a rychlé výkopy základů.</p>
                  </div>
                </div>
              </article>

              <article className="rounded-2xl bg-white ring-1 ring-black/10 p-6">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 rounded-lg bg-yellow-100 p-3">
                    <TruckIcon className="w-7 h-7 text-[#2f3237]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#2f3237]">Zásypy a zasypávání</h3>
                    <p className="mt-1 text-sm text-gray-600">Kvalitní a efektivní zásypy.</p>
                  </div>
                </div>
              </article>

              <article className="rounded-2xl bg-white ring-1 ring-black/10 p-6">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 rounded-lg bg-yellow-100 p-3">
                    <SquaresPlusIcon className="w-7 h-7 text-[#2f3237]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#2f3237]">Zarovnání terénu</h3>
                    <p className="mt-1 text-sm text-gray-600">Úpravy terénu a příjezdových cest.</p>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* TECHNIKA */}
        <section id="technika" className="snap-start min-h-screen bg-white text-black flex items-center py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-[#2f3237]">TECHNIKA</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start justify-center">
              <div className="bg-gray-50 rounded-xl shadow-lg p-6">
                <Image src="/images/valec.png" alt="Válec" width={300} height={200} className="mx-auto" />
                <h3 className="text-xl font-bold mt-4 text-[#2f3237]">Válec</h3>
                <ul className="text-sm text-gray-700 mt-3 space-y-2 text-left">
                  <li className="flex items-center gap-2"><ScaleIcon className="w-5 h-5 text-yellow-500" /> Hmotnost: 2.7 t</li>
                  <li className="flex items-center gap-2"><Cog6ToothIcon className="w-5 h-5 text-yellow-500" /> Motor: Kubota 33 kW</li>
                  <li className="flex items-center gap-2"><ArrowsUpDownIcon className="w-5 h-5 text-yellow-500" /> Šířka válce: 1,2 m</li>
                  <li className="flex items-center gap-2"><WrenchScrewdriverIcon className="w-5 h-5 text-yellow-500" /> Pro hutnění zemin a štěrku</li>
                </ul>
              </div>

              {/* Bagr */}
              <div className="relative bg-gray-50 rounded-xl shadow-lg p-6">
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
                    className="absolute top-3/4 left-[79%] -translate-x-1/2 -translate-y-1/2"
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

              {/* Nakladač */}
              <div className="relative bg-gray-50 rounded-xl shadow-lg p-6">
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
                    className="absolute top-2/3 right-[60%] -translate-x-1/2 -translate-y-1/2"
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

          {/* Modal Bagr */}
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
                    ["bagr-lzicesvahova", "Lžíce svahová", "/images/bagr-lzice-svahova.png"],
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

          {/* Modal Nakladač */}
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
        <section id="cenik" className="snap-start min-h-screen bg-[#f9c600] text-black flex items-center py-16">
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
        <section id="kontakt" className="snap-start min-h-screen bg-[#2f3237] text-white py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-[#f9c600]">
              KONTAKTNÍ FORMULÁŘ
            </h2>

            <form
              onSubmit={(e) => { e.preventDefault(); odeslat(); }}
              className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6 space-y-5 text-gray-800"
            >
              <div>
                <label className="block font-semibold">Popis požadovaných prací</label>
                <textarea
                  className="w-full border px-4 py-3 rounded min-h-[140px] resize-y placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  value={popisZK}
                  onChange={(e) => setpopisZK(e.target.value)}
                  placeholder={`Např.: Poptávám výkop rýhy pro elektriku cca 12 m, hloubka 70 cm, šířka 30 cm.\nOdvoz přebytečné zeminy, zarovnání terénu. Místo: Praha 5.`}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tip: uveďte rozměry (délka/šířka/hloubka), místo realizace a případně odvoz zeminy.
                </p>
              </div>

              <div>
                <label className="block font-semibold">E-mail</label>
                <input type="email" className="w-full border px-4 py-2 rounded" />
              </div>

              <div>
                <label className="block font-semibold">Telefon</label>
                <input type="tel" className="w-full border px-4 py-2 rounded" />
              </div>

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
                    className={`bg-blue-600 text-white px-4 py-2 rounded ${loadingKm ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    {loadingKm ? "Počítám…" : "Zjistit km"}
                  </button>
                </div>
                {km && <p className="text-sm mt-1 text-gray-600">Vzdálenost: {km} km</p>}
              </div>

              <div>
                <label className="block font-semibold">Máte informace o typu a rozměru zeminy?</label>
                <div className="grid gap-2 mt-2">
                  <button
                    onClick={() => setZnameRozmery(false)}
                    type="button"
                    className={`p-3 border rounded ${!znameRozmery ? "bg-yellow-100 border-yellow-500" : ""}`}
                  >
                    Ne, neznám rozměry
                  </button>
                  <button
                    onClick={() => setZnameRozmery(true)}
                    type="button"
                    className={`p-3 border rounded ${znameRozmery ? "bg-yellow-100 border-yellow-500" : ""}`}
                  >
                    Ano, znám rozměr a typ zeminy
                  </button>
                </div>

                {znameRozmery && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block font-semibold">Typ zeminy</label>
                      <input
                        type="text"
                        className="w-full border px-4 py-2 rounded"
                        value={typZeminy}
                        onChange={(e) => setTypZeminy(e.target.value)}
                        placeholder="např. jíl, hlína, štěrk"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold">Rozměr zeminy</label>
                      <input
                        type="text"
                        className="w-full border px-4 py-2 rounded"
                        value={rozmerZeminy}
                        onChange={(e) => setRozmerZeminy(e.target.value)}
                        placeholder="např. 15 m³"
                      />
                    </div>
                  </div>
                )}
              </div>

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
                  <p className="text-sm mt-2 text-gray-600">
                    Vybraný termín: {datumOd} až {datumDo}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={sending}
                aria-busy={sending}
                className={`w-full bg-[#f9c600] text-[#2f3237] font-bold py-3 rounded hover:bg-yellow-400 ${sending ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                {sending ? "Odesílám…" : "ODESLAT OBJEDNÁVKU"}
              </button>
              {msg && <p className="text-sm text-red-600 mt-2">{msg}</p>}
            </form>

            <p className="text-center text-xs text-white/60 mt-4">
              Pozn.: Tato sekce může být delší než výška okna – scrollujte v rámci stránky.
            </p>
          </div>

          <footer className="text-white text-center py-6 text-sm opacity-80">
            Zemní a Výkopové Práce • IČO:73377619 • info@zevyp.cz • Habartov, Horní Částkov ev. č. 2, 357 09
          </footer>
        </section>
      </div>
    </>
  );
}
