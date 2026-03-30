import Head from "next/head";
import Image from "next/image";
import { 
  PhoneIcon, 
  MapPinIcon, 
  CheckBadgeIcon, 
  WrenchIcon, 
  ExclamationTriangleIcon, 
  ShieldCheckIcon, 
  FireIcon,
  ClockIcon,
  CurrencyDollarIcon,
  HandThumbUpIcon
} from "@heroicons/react/24/solid";

export default function ArTechnik() {
  const sluzby = [
    { jmeno: "Servis a seřízení oken", ikona: WrenchIcon, popis: "Prevence před zadrháváním a profukováním." },
    { jmeno: "Oprava kování", ikona: ExclamationTriangleIcon, popis: "Výměna nefunkčních částí a mechanizmů." },
    { jmeno: "Výměna těsnění", ikona: ShieldCheckIcon, popis: "Zastavení úniku tepla a hluku z ulice." },
    { jmeno: "Měření úniku tepla", ikona: FireIcon, popis: "Termovizní kontrola kritických míst." },
  ];

  const vyhody = [
    { jmeno: "Rychlý výjezd", ikona: ClockIcon },
    { jmeno: "Férová cena", ikona: CurrencyDollarIcon },
    { jmeno: "Garance kvality", ikona: HandThumbUpIcon },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 overflow-x-hidden">
      <Head>
        <title>AR TECHNIK | Vaše okna, naše starost | Lukáš Novák</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* --- HEADER --- */}
      <header className="py-4 md:py-6 px-6 md:px-12 bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 text-center md:text-left">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-[180px] h-[60px] md:w-[220px] md:h-[70px]">
            <Image 
              src="/images/ar-technik-logo-okno.png" 
              alt="AR TECHNIK Logo" 
              fill
              priority
              className="object-contain"
            />
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden lg:block text-slate-500 font-semibold tracking-wider text-[11px] uppercase text-right leading-tight border-r pr-6 border-slate-200">
              Specialista na okenní systémy<br/>Praha a Střední Čechy
            </div>
            <a href="tel:+420608025502" className="flex items-center gap-2 text-blue-700 font-black text-lg hover:scale-105 transition-transform">
              <PhoneIcon className="w-5 h-5" />
              +420 608 025 502
            </a>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* --- HERO SEKCE --- */}
        <section className="container mx-auto px-4 md:px-6 py-8 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* TEXTOVÁ ČÁST */}
            <div className="lg:col-span-5 space-y-8 order-2 lg:order-1 text-center lg:text-left">
              <div className="space-y-4">
                <span className="bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">
                  Profesionální servis oken
                </span>
                <h1 className="text-5xl md:text-7xl font-black text-slate-950 leading-[0.95] tracking-tighter uppercase italic">
                  Vaše okna, <br/><span className="text-blue-700 underline decoration-blue-200 underline-offset-8">naše starost.</span>
                </h1>
                <p className="text-lg text-slate-600 font-medium max-w-md mx-auto lg:mx-0 leading-relaxed">
                  Kompletní péče o vaše okna a dveře. Šetříme vaše náklady na vytápění a vracíme oknům stoprocentní funkčnost.
                </p>
              </div>

              {/* SLUŽBY */}
              <div className="grid grid-cols-1 gap-4 text-left">
                {sluzby.map((item) => (
                  <div key={item.jmeno} className="group flex items-start gap-4 p-5 bg-white rounded-2xl border border-slate-200 hover:border-blue-500 transition-all shadow-sm">
                    <div className="bg-blue-50 group-hover:bg-blue-600 p-3 rounded-xl text-blue-600 group-hover:text-white transition-colors shrink-0">
                      <item.ikona className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 uppercase italic tracking-tight text-sm">{item.jmeno}</h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{item.popis}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* HLAVNÍ FOTKA */}
            <div className="lg:col-span-7 order-1 lg:order-2">
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl h-[450px] md:h-[750px] border-8 border-white group">
                <Image 
                  src="/images/servis-oken-ar-technik.png" 
                  alt="Servis oken Lukáš Novák" 
                  fill
                  className="object-cover object-[70%_center] md:object-center transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur p-6 rounded-3xl shadow-xl flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-black text-blue-600 uppercase tracking-widest">Jednotná cena výjezdu</span>
                    <span className="text-3xl font-black italic text-slate-900">1 200 Kč <span className="text-sm font-normal not-italic text-slate-400 uppercase font-sans">bez DPH</span></span>
                  </div>
                  <CheckBadgeIcon className="w-12 h-12 text-blue-600 opacity-20 hidden md:block" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- SEKCE: OBLAST PŮSOBNOSTI --- */}
        <section className="bg-slate-900 py-20 text-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8 text-center lg:text-left">
                <div className="space-y-4">
                  <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic leading-none">
                    Kde působíme? <br />
                    <span className="text-blue-500 underline decoration-blue-800 underline-offset-4 font-black">Celá Praha a okolí.</span>
                  </h2>
                  <p className="text-slate-400 text-lg max-w-md mx-auto lg:mx-0">
                    Jsme tam, kde nás potřebujete. Rychlé výjezdy po celé Praze a Středočeském kraji.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-6 pt-4 max-w-sm mx-auto lg:mx-0">
                  {vyhody.map(v => (
                    <div key={v.jmeno} className="flex items-center gap-3">
                      <v.ikona className="w-6 h-6 text-blue-500" />
                      <span className="font-bold uppercase tracking-widest text-[10px] text-slate-200">{v.jmeno}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* MAPA-PRAHA.PNG */}
              <div className="bg-white/5 p-4 rounded-[3rem] border border-white/10 backdrop-blur-sm shadow-inner">
                <div className="relative w-full aspect-video md:h-[450px]">
                  <Image 
                    src="/images/mapa-praha.png" 
                    alt="Mapa oblasti působnosti Praha" 
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- KONTAKTNÍ KARTA --- */}
        <section className="py-24 px-4 bg-white">
          <div className="container mx-auto max-w-5xl text-center space-y-12">
            <h2 className="text-4xl md:text-6xl font-black text-slate-950 tracking-tighter uppercase italic">
              Potřebujete servis?
            </h2>
            
            <div className="bg-slate-50 rounded-[3rem] p-8 md:p-12 shadow-2xl border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden">
              <div className="flex items-center gap-6 text-left relative z-10">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                  <MapPinIcon className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-4xl font-black text-slate-900 italic uppercase leading-none">Lukáš Novák</h3>
                  <p className="text-blue-600 font-bold tracking-widest text-xs uppercase mt-1 font-mono">lukas.novak.85@seznam.cz</p>
                </div>
              </div>
              
              <a href="tel:+420608025502" className="group w-full md:w-auto flex items-center justify-center gap-4 bg-blue-600 hover:bg-blue-700 p-8 rounded-[2rem] transition-all shadow-xl shadow-blue-600/30 active:scale-95">
                <PhoneIcon className="w-10 h-10 text-white group-hover:rotate-12 transition-transform" />
                <span className="text-3xl md:text-5xl font-black text-white tracking-tighter italic">+420 608 025 502</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 bg-white border-t border-slate-200">
        <div className="container mx-auto px-6 text-center">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.4em]">
            AR TECHNIK • Lukáš Novák • IČO: [DOPLNIT]
          </p>
        </div>
      </footer>
    </div>
  );
}
