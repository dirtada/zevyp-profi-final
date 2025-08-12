// pages/index2.js
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Bars3Icon, XMarkIcon, PhoneIcon } from "@heroicons/react/24/outline";
import {
  BuildingOffice2Icon,
  TruckIcon,
  SquaresPlusIcon,
} from "@heroicons/react/24/solid";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

/* ------------------------------------------------------------------
   helpers (safe for SSR)
   ------------------------------------------------------------------ */
function usePrefersReducedMotion() {
  const [prefers, setPrefers] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setPrefers(m.matches);
    onChange();
    m.addEventListener?.("change", onChange);
    return () => m.removeEventListener?.("change", onChange);
  }, []);
  return prefers;
}
function useIsHoverDevice() {
  const [isHover, setIsHover] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const onChange = () => setIsHover(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return isHover;
}
const formatLocalDate = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

/* ------------------------------------------------------------------
   mini components (Header, MobileMenu, SideDots)
   ------------------------------------------------------------------ */
function Header({ onOpenMobile }) {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#f9c600]/90 backdrop-blur supports-[backdrop-filter]:bg-[#f9c600]/80 border-b border-black/5">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo_update.png"
            alt="Zevyp logo"
            width={120}
            height={36}
            className="h-9 w-auto"
            priority
          />
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <a href="#hero" className="hover:underline">Úvod</a>
            <a href="#sluzby" className="hover:underline">Služby</a>
            <a href="#technika" className="hover:underline">Technika</a>
            <a href="#cenik" className="hover:underline">Ceník</a>
            <a href="#kontakt" className="hover:underline">Kontakt</a>
            <Link href="/" className="hover:underline">Klasická verze</Link>
          </nav>
        </div>

        {/* phone CTA */}
        <a
          href="tel:+420777888999"
          className="hidden sm:inline-flex items-center gap-2 rounded-full bg-white/90 hover:bg-white text-[#2f3237] px-3 py-1.5 font-semibold shadow-sm ring-1 ring-black/10 transition"
        >
          <PhoneIcon className="w-4 h-4" />
          <span>+420&nbsp;777&nbsp;888&nbsp;999</span>
        </a>

        <button
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-black/5"
          onClick={onOpenMobile}
          aria-label="Otevřít menu"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}

function MobileMenu({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute top-0 right-0 h-full w-72 bg-[#f9c600] shadow-xl p-4">
        <div className="flex items-center justify-between">
          <span className="font-bold">Menu</span>
          <button onClick={onClose} aria-label="Zavřít">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <nav className="mt-6 grid gap-3">
          {[
            ["Úvod", "#hero"],
            ["Služby", "#sluzby"],
            ["Technika", "#technika"],
            ["Ceník", "#cenik"],
            ["Kontakt", "#kontakt"],
          ].map(([label, href]) => (
            <a key={href} href={href} onClick={onClose} className="py-2">
              {label}
            </a>
          ))}
          <Link href="/" onClick={onClose} className="py-2 font-semibold">
            Klasická verze
          </Link>
          <a href="tel:+420777888999" className="mt-2 inline-flex items-center gap-2 rounded-full bg-white text-[#2f3237] px-3 py-2 font-semibold shadow ring-1 ring-black/10">
            <PhoneIcon className="w-4 h-4" /> +420 777 888 999
          </a>
        </nav>
      </div>
    </div>
  );
}

function SideDots({ sections, activeId, onClickId }) {
  return (
    <div className="fixed left-3 md:left-6 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col gap-2">
      {sections.map((s) => (
        <button
          key={s.id}
          onClick={() => onClickId(s.id)}
          className={`h-2.5 w-2.5 rounded-full transition-all ${activeId === s.id ? "bg-[#2f3237] w-8" : "bg-black/30 hover:bg-black/60"}`}
          aria-label={`Přejít na ${s.label}`}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------
   SLUŽBY – video karty (hover preview na desktopu)
   ------------------------------------------------------------------ */
function useIsHoverOnly() {
  const prefersReduced = usePrefersReducedMotion();
  const isHoverDevice = useIsHoverDevice();
  return isHoverDevice && !prefersReduced;
}

function VideoCard({ title, desc, poster, mp4, onCTA }) {
  const videoRef = useRef(null);
  const isHoverOnly = useIsHoverOnly();

  const enter = () => {
    if (!isHoverOnly) return;
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => {});
  };
  const leave = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };

  return (
    <article
      className="group relative rounded-2xl overflow-hidden ring-1 ring-black/10 bg-white shadow-sm hover:shadow-md transition"
      onMouseEnter={enter}
      onMouseLeave={leave}
    >
      <div className="relative w-full pb-[56.25%] bg-black">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
        >
          <source src={mp4} type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute left-0 right-0 bottom-0 p-4 text-white">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-white/80 mt-1">{desc}</p>
          <button
            onClick={onCTA}
            className="mt-3 inline-flex items-center rounded-full bg-[#f9c600] text-[#2f3237] font-semibold px-3 py-1.5 shadow-sm hover:bg-yellow-400 transition"
          >
            Poptat službu
          </button>
        </div>
      </div>
      {!isHoverOnly && (
        <div className="absolute top-2 right-2 text-[10px] px-2 py-1 rounded-full bg-black/60 text-white/90">
          Náhled videa na PC
        </div>
      )}
    </article>
  );
}

/* ------------------------------------------------------------------
   TECHNIKA – data (nezměněno, názvy souborů zachovány)
   ------------------------------------------------------------------ */
const EQUIPMENT = {
  bagr: {
    key: "bagr",
    title: "Bagr Hitachi ZX 48-A5A",
    bullet: [
      "Hmotnost 4,3 t • Motor Yanmar 25,2 kW",
      "Hloubka výkopu až 3,74 m",
      "Pro výkopy základů, rýhy a modelaci terénu",
    ],
    defaultAttachment: "lzice50",
    attachments: {
      lzice30: {
        label: "Lžíce 30 cm",
        poster: "/images/bagr-lzice30.png",
        mp4: "/videos/bagr-vykop.mp4",
        about: "Úzké rýhy pro kabeláž a vodu; přesné kopání v těsných místech.",
        tags: ["Úzké rýhy", "Instalace sítí", "Přesnost"],
      },
      lzice50: {
        label: "Lžíce 50 cm",
        poster: "/images/bagr-lzice50.png",
        mp4: "/videos/bagr-vykop.mp4",
        about: "Univerzální šířka pro většinu výkopových prací v hlíně a jílu.",
        tags: ["Univerzální", "Základy", "Rýhy"],
      },
      lzice60: {
        label: "Lžíce 60 cm",
        poster: "/images/bagr-lzice60.png",
        mp4: "/videos/bagr-vykop.mp4",
        about: "Větší objem pro rychlejší postup v měkkých zeminách.",
        tags: ["Rychlost", "Měkké zeminy"],
      },
      lzicesvahova: {
        label: "Lžíce svahová",
        poster: "/images/bagr-lzicesvahova.png",
        mp4: "/videos/bagr-zasyp.mp4",
        about: "Zarovnání, svahy a finální úpravy povrchu.",
        tags: ["Zarovnání", "Svahy", "Finální úpravy"],
      },
      vrtak: {
        label: "Vrták",
        poster: "/images/bagr-vrtak.png",
        mp4: "/videos/bagr-vrtak.mp4",
        about: "Vrtání děr na sloupky, ploty a patky.",
        tags: ["Sloupky", "Ploty", "Patky"],
      },
      sbijecka: {
        label: "Hydraulická sbíječka",
        poster: "/images/bagr-sbijecka.png",
        mp4: "/videos/bagr-sbijecka.mp4",
        about: "Bourání betonu a kameniva, rozpojování tvrdých vrstev.",
        tags: ["Beton", "Bourání", "Kamenivo"],
      },
    },
  },
  nakladac: {
    key: "nakladac",
    title: "Nakladač",
    bullet: [
      "Hmotnost 4,5 t • Motor Deutz 55 kW",
      "Nosnost až 3,5 t",
      "Přesun materiálu, paletizace, úpravy terénu",
    ],
    defaultAttachment: "lopa",
    attachments: {
      lopa: {
        label: "Lopata",
        poster: "/images/nakladac.png",
        mp4: "/videos/nakladani.mp4",
        about: "Nakládání a přesun zemin, štěrku a suti.",
        tags: ["Přesun materiálu", "Štěrk", "Zemina"],
      },
      vidle: {
        label: "Vidle na palety",
        poster: "/images/nakladac-vidle.png",
        mp4: "/videos/nakladani.mp4",
        about: "Manipulace s paletami a materiálem na stavbě.",
        tags: ["Palety", "Manipulace"],
      },
      pluh: {
        label: "Pluh",
        poster: "/images/nakladac-pluh.png",
        mp4: "/videos/nakladani.mp4",
        about: "Odklízení sněhu a sypkého materiálu.",
        tags: ["Sníh", "Úklid"],
      },
    },
  },
  valec: {
    key: "valec",
    title: "Válec",
    bullet: [
      "Hmotnost 2,7 t • Motor Kubota 33 kW",
      "Šířka válce 1,2 m",
      "Hutnění zemin a štěrků pro podkladní vrstvy",
    ],
    defaultAttachment: "vibracni-buben",
    attachments: {
      "vibracni-buben": {
        label: "Vibrační buben",
        poster: "/images/valec.png",
        mp4: "/videos/valec.mp4",
        about: "Zhutnění podkladních vrstev pro komunikace a plochy.",
        tags: ["Hutnění", "Podklad", "Štěrk"],
      },
    },
  },
};

/* ------------------------------------------------------------------
   TECHNIKA – UI (CardStack + TechnikaVideoPanel + AttachmentModal)
   ------------------------------------------------------------------ */
function CardStack({ machines, activeKey, onChange }) {
  const idx = machines.findIndex((m) => m.key === activeKey);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      if (e.key === "ArrowRight") {
        const next = machines[(idx + 1) % machines.length];
        onChange(next.key);
      } else {
        const prev = machines[(idx - 1 + machines.length) % machines.length];
        onChange(prev.key);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx, machines, onChange]);

  return (
    <div className="relative flex flex-col justify-center">
      <div className="relative h-[420px]">
        {machines.map((m, i) => {
          const offset = i - idx;
          const wrap =
            offset > machines.length / 2
              ? offset - machines.length
              : offset < -machines.length / 2
              ? offset + machines.length
              : offset;

          const isActive = m.key === activeKey;
          const z = 50 - Math.abs(wrap);
          const x = wrap * 24;
          const y = Math.abs(wrap) * 10;
          const s = isActive ? 1 : 0.94;
          const rot = wrap * 2;

          return (
            <motion.button
              key={m.key}
              onClick={() => onChange(m.key)}
              className="absolute inset-0 w-full h-full origin-center rounded-2xl overflow-hidden text-left"
              style={{ zIndex: z }}
              initial={false}
              animate={{ x, y, scale: s, rotate: rot }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
            >
              <div className={`h-full w-full rounded-2xl ring-1 ${isActive ? "ring-[#2f3237]" : "ring-black/10"} bg-white shadow-sm`}>
                <div className="p-6">
                  <div className="text-sm text-gray-500">{m.title.split(" ")[0]}</div>
                  <h3 className="text-xl font-bold text-[#2f3237]">{m.title}</h3>
                  <ul className="mt-3 space-y-1 text-gray-700">
                    {m.bullet.map((b, bi) => (
                      <li key={bi} className="flex gap-2">
                        <span>•</span><span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  {!isActive && <div className="absolute inset-0 bg-black/35 transition-opacity" />}
                  {!isActive && (
                    <div className="absolute bottom-4 right-4 text-xs text-white/90">
                      Klikni pro detail
                    </div>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-2">
        {machines.map((m) => (
          <button
            key={m.key}
            onClick={() => onChange(m.key)}
            className={`h-2 rounded-full transition-all ${m.key === activeKey ? "w-8 bg-[#2f3237]" : "w-2 bg-black/20"}`}
            aria-label={`Přepnout na ${m.title}`}
          />
        ))}
      </div>
      <p className="mt-2 text-xs text-gray-500">Tip: přepínej šipkami ← →</p>
    </div>
  );
}

// NOTE: hlavní panel s videem – zajišťuje přepínání videa při změně příslušenství
function TechnikaVideoPanel({ equip, attachment, attachmentKey, onOpenModal }) {
  const videoRef = useRef(null);
  const prefersReduced = usePrefersReducedMotion();
  const isHoverDevice = useIsHoverDevice();
  const hasVideo = !!attachment?.mp4;

  useEffect(() => {
    // NOTE: při změně zdroje provedeme hard reload videa (load) + bezpečné autoplay
    const v = videoRef.current;
    if (!v || !hasVideo || prefersReduced) return;
    try {
      v.pause?.();
      v.currentTime = 0;
      v.load?.(); // načti nový <source>
    } catch {}
    const t = setTimeout(() => v.play().catch(() => {}), 150);
    return () => {
      clearTimeout(t);
      v.pause?.();
    };
  }, [attachment?.mp4, prefersReduced, hasVideo]);

  return (
    <aside className="relative flex flex-col justify-center">
      <div className="relative rounded-2xl overflow-hidden ring-1 ring-black/10 bg-black">
        <div className="relative w-full pb-[56.25%]">
          {hasVideo ? (
            <video
              ref={videoRef}
              key={attachmentKey || attachment?.mp4} 
              className="absolute inset-0 w-full h-full object-cover"
              muted
              loop
              playsInline
              preload="metadata"
              poster={attachment.poster}
              controls={false}
            >
              <source src={attachment.mp4} type="video/mp4" />
            </video>
          ) : (
            <img
              key={attachmentKey || attachment?.poster}
              src={attachment?.poster}
              alt={attachment?.label}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {(prefersReduced || !isHoverDevice) && hasVideo && (
            <button
              onClick={() => videoRef.current?.play().catch(() => {})}
              className="absolute inset-0 grid place-items-center text-white/90"
              aria-label="Přehrát video"
            >
              <span className="rounded-full px-4 py-2 bg-black/60 ring-1 ring-white/20">Přehrát náhled</span>
            </button>
          )}
        </div>

        <div className="p-4 text-white bg-gradient-to-t from-black/70 via-black/30 to-transparent absolute left-0 right-0 bottom-0">
          <h3 className="text-lg font-semibold">{attachment?.label}</h3>
          <p className="text-sm text-white/80 mt-1">{attachment?.about}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {(attachment?.tags ?? []).map((t) => (
              <span key={t} className="text-[11px] px-2 py-1 rounded-full bg-white/15 ring-1 ring-white/20">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          <span className="font-semibold text-[#2f3237]">{equip.title}</span> — {attachment?.label}
        </div>
        <button
          onClick={onOpenModal}
          className="inline-flex items-center rounded-full bg-[#f9c600] text-[#2f3237] font-semibold px-4 py-2 shadow-sm hover:bg-yellow-400 transition"
        >
          Vybrat příslušenství
        </button>
      </div>
    </aside>
  );
}

function AttachmentModal({ equip, currentKey, onClose, onPick }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
          aria-label="Zavřít"
        >
          ×
        </button>
        <h3 className="text-xl font-bold text-[#2f3237]">Vyberte příslušenství</h3>
        <p className="text-sm text-gray-600 mb-4">{equip.title}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(equip.attachments).map(([key, a]) => {
            const active = key === currentKey;
            return (
              <button
                key={key}
                onClick={() => onPick(key)}
                className={`text-left rounded-xl ring-1 p-3 transition hover:shadow ${active ? "ring-yellow-500 bg-yellow-50" : "ring-black/10 bg-white"}`}
              >
                <div className="relative w-full pb-[56%] rounded-lg overflow-hidden bg-gray-100 mb-2">
                  <img src={a.poster} alt={a.label} className="absolute inset-0 w-full h-full object-cover" />
                </div>
                <div className="font-semibold text-[#2f3237]">{a.label}</div>
                <div className="text-sm text-gray-600">{a.about}</div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {(a.tags ?? []).map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-black/5">
                      {t}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   PAGE
   ------------------------------------------------------------------ */
export default function Index2() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // kontakt form state
  const [adresa, setAdresa] = useState("");
  const [znameRozmery, setZnameRozmery] = useState(false);
  const [typZeminy, setTypZeminy] = useState("");
  const [rozmerZeminy, setRozmerZeminy] = useState("");
  const [obsazene, setObsazene] = useState([]);
  const [popisZK, setpopisZK] = useState("");
  const [km, setKm] = useState(null);
  const [datumOd, setDatumOd] = useState("");
  const [datumDo, setDatumDo] = useState("");
  const [msg, setMsg] = useState("");
  const [loadingKm, setLoadingKm] = useState(false);
  const [sending, setSending] = useState(false);

  // technika state
  const machines = useMemo(() => Object.values(EQUIPMENT), []);
  const [selectedMachine, setSelectedMachine] = useState("bagr");
  const [attachmentKey, setAttachmentKey] = useState(EQUIPMENT.bagr.defaultAttachment);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);

  useEffect(() => {
    // NOTE: při změně stroje přepneme na jeho defaultní příslušenství
    setAttachmentKey(EQUIPMENT[selectedMachine].defaultAttachment);
  }, [selectedMachine]);

  // obsazené z API
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

  // snap nav tracking
  const containerRef = useRef(null);
  const [activeId, setActiveId] = useState("hero");
  const sections = useMemo(() => [
    { id: "hero", label: "Úvod" },
    { id: "sluzby", label: "Služby" },
    { id: "technika", label: "Technika" },
    { id: "cenik", label: "Ceník" },
    { id: "kontakt", label: "Kontakt" },
  ], []);

  useEffect(() => {
    if (!containerRef.current) return;
    const root = containerRef.current;
    const els = sections.map(s => document.getElementById(s.id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (vis[0]?.target?.id) setActiveId(vis[0].target.id);
      },
      { root, threshold: [0.5, 0.75, 1] }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (!el || !containerRef.current) return;
    el.scrollIntoView({ behavior: "smooth" });
  };

  const serviceVideos = [
    {
      key: "vykopy",
      title: "Výkopy základů",
      desc: "Přesné a rychlé výkopy pro základy a přípojky.",
      poster: "/images/vykopy-poster.jpg",
      mp4: "/videos/vykopy.mp4",
    },
    {
      key: "zasypy",
      title: "Zásypy a odvoz zeminy",
      desc: "Efektivní zásypy a odvoz přebytečného materiálu.",
      poster: "/images/zasypy-poster.jpg",
      mp4: "/videos/zasypy.mp4",
    },
    {
      key: "zarovnani",
      title: "Zarovnání terénu",
      desc: "Úpravy pozemků a příjezdových cest do finální podoby.",
      poster: "/images/zarovnani-poster.jpg",
      mp4: "/videos/zarovnani.mp4",
    },
  ];

  const equip = EQUIPMENT[selectedMachine];
  const attachment = EQUIPMENT[selectedMachine].attachments[attachmentKey];

  return (
    <>
      <Head>
        <title>Zevyp – Fullpage verze</title>
        <meta name="description" content="Zemní a výkopové práce – fullpage prezentace služeb, techniky a ceníku." />
        {/* nechceme duplicitu se / (klasikou) */}
        <meta name="robots" content="noindex,follow" />
        <link rel="canonical" href="https://zevyp-profi-final.vercel.app/" />
      </Head>

      <Header onOpenMobile={() => setMobileOpen(true)} />
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <SideDots sections={sections} activeId={activeId} onClickId={scrollToId} />

      {/* scroll container */}
      <main
        ref={containerRef}
        className="snap-y snap-mandatory h-screen overflow-y-scroll scroll-smooth"
      >
        {/* HERO */}
        <section id="hero" className="snap-start min-h-screen bg-[#2f3237] text-white pt-16 flex items-center">
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                ZEMNÍ A VÝKOPOVÉ PRÁCE
              </h1>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8">
                Spolehlivé zemní a výkopové práce minibagrem Hitachi v Praze a okolí.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="#kontakt"
                  className="inline-block bg-[#f9c600] text-[#2f3237] font-bold px-6 py-3 rounded-lg shadow hover:bg-yellow-400 transition"
                >
                  Nezávazná poptávka
                </a>
                <a
                  href="tel:+420777888999"
                  className="inline-flex items-center gap-2 rounded-lg bg-white/10 hover:bg-white/15 px-4 py-3 ring-1 ring-white/20"
                >
                  <PhoneIcon className="w-5 h-5" />
                  Zavolat
                </a>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/bagr-hero.png"
                alt="Bagr"
                width={800}
                height={600}
                className="object-contain"
                priority
              />
            </div>
          </div>
        </section>

        {/* SLUŽBY – video karty */}
        <section id="sluzby" className="snap-start min-h-screen bg-[#f9c600] text-black pt-20 flex items-center">
          <div className="container mx-auto px-4 w-full">
            <h2 className="text-2xl md:text-3xl font-bold mb-10 text-[#2f3237] text-center">NAŠE SLUŽBY</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {serviceVideos.map((s) => (
                <VideoCard
                  key={s.key}
                  title={s.title}
                  desc={s.desc}
                  poster={s.poster}
                  mp4={s.mp4}
                  onCTA={() => scrollToId("kontakt")}
                />
              ))}
            </div>
            <p className="mt-6 text-center text-sm text-[#2f3237]/70">
              Videa jsou ilustrační. Na vyžádání pošleme galerii realizací.
            </p>
          </div>
        </section>

        {/* TECHNIKA – stack karet + video panel */}
        <section id="technika" className="snap-start min-h-screen bg-gradient-to-br from-white to-gray-50 text-black pt-20 flex items-stretch">
          <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch w-full">
            <CardStack
              machines={machines}
              activeKey={selectedMachine}
              onChange={(k) => setSelectedMachine(k)}
            />
            <TechnikaVideoPanel
              equip={equip}
              attachment={attachment}
              attachmentKey={attachmentKey} {/* NOTE: důležité pro remount */}
              onOpenModal={() => setShowAttachmentModal(true)}
            />
          </div>

          {showAttachmentModal && (
            <AttachmentModal
              equip={equip}
              currentKey={attachmentKey}
              onClose={() => setShowAttachmentModal(false)}
              onPick={(key) => {
                // NOTE: po výběru se změní klíč, video panel se přemountuje a efekt zavolá load()
                setAttachmentKey(key);
                setShowAttachmentModal(false);
              }}
            />
          )}
        </section>

        {/* CENÍK */}
        <section id="cenik" className="snap-start min-h-screen bg-[#f9c600] text-black pt-20 flex items-center">
          <div className="container mx-auto px-4 w-full">
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
            <p className="text-sm text-[#2f3237] mt-6 text-center">
              *Konečnou cenu stanovíme individuálně podle vzdálenosti a požadavků.
            </p>
          </div>
        </section>

        {/* KONTAKT */}
        <section id="kontakt" className="snap-start min-h-screen bg-[#2f3237] text-white pt-20 flex items-center">
          <div className="container mx-auto px-4 w-full">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center text-[#f9c600]">KONTAKTNÍ FORMULÁŘ</h3>
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6 space-y-5 text-gray-800">
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
                  tileDisabled={({ date }) => obsazene.includes(formatLocalDate(date))}
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
                onClick={odeslat}
                disabled={sending}
                aria-busy={sending}
                className={`w-full bg-[#f9c600] text-[#2f3237] font-bold py-3 rounded hover:bg-yellow-400 ${sending ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                {sending ? "Odesílám…" : "ODESLAT OBJEDNÁVKU"}
              </button>
              {msg && <p className="text-sm text-red-600 mt-2">{msg}</p>}
            </div>

            <footer className="text-center text-white/70 text-sm mt-8">
              Zemní a Výkopové Práce • IČO:73377619 • info@zevyp.cz • Habartov, Horní Částkov ev. č. 2, 357 09
            </footer>
          </div>
        </section>
      </main>
    </>
  );
}
