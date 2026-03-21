import Head from "next/head";
import Image from "next/image";
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon,
  CheckBadgeIcon,
  WrenchIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  FireIcon
} from "@heroicons/react/24/solid";

export default function ArTechnik() {
  const sluzby = [
    { jmeno: "Servis a seřízení oken", ikona: WrenchIcon },
    { jmeno: "Oprava kování", ikona: ExclamationTriangleIcon },
    { jmeno: "Výměna těsnění", ikona: ShieldCheckIcon },
    { jmeno: "Měření úniku tepla", ikona: FireIcon },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900 overflow-x-hidden">
      <Head>
        <title>AR TECHNIK | Servis a opravy oken Praha | Lukáš Novák</title>
        <meta name="description" content="Profesionální servis, seřízení a opravy oken v Praze. Rychlý výjezd, férová cena. Lukáš Novák - AR TECHNIK." />
      </Head>

      {/* --- HEADER --- */}
      <header className="py-6 px-6 md:px-12 border-b border-slate-50 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Image 
            src="/images/ar-technik-logo-okno.png" 
            alt="AR TECHNIK Logo" 
            width={200} 
            height={70} 
            priority
            className="object-contain"
          />
          <div className="hidden lg:block text-slate-400 font-bold tracking-[0.3em] text-[10px] uppercase text-right leading-relaxed">
            Specialista na okenní systémy<br/>Praha a Střední Čechy
          </div>
        </div>
      </header>

      {/* --- HLAVNÍ SEKCE (HERO) --- */}
      <main className="flex-grow">
        <section className="container mx-auto px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* FOTKA (Levá strana - nyní extra široká 8/12 pro Single Screen efekt) */}
          <div className="lg:col-span-8 relative rounded-[2.5rem] overflow-hidden shadow-2xl h-[500px] md:h-[700px] group border-8 border-slate-50">
            <Image 
              src="/images/servis-oken-ar-technik.png" 
              alt="Servis oken v praxi" 
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-1000"
              priority
            />
          </div>

          {/* OBSAH (Pravá strana - 4/12) */}
          <div className="lg:col-span-4 space-y-12 py-4">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-black text-slate-950 leading-[0.9] tracking-tighter">
                Vaše okna v <br />
                <span className="text-blue-700 italic">top kondici.</span>
              </h1>
              <div className="flex items-center gap-3 bg-blue-50 text-blue-700 px-6 py-3 rounded-2xl inline-flex font-black shadow-sm shadow-blue-100">
                <span className="uppercase text-xs tracking-widest opacity-60 font-bold">Výjezd po Praze</span>
                <span className="text-2xl italic tracking-tight font-black">1 200 Kč</span>
                <span className="text-[10px] font-normal opacity-50 uppercase">bez DPH</span>
              </div>
            </div>

            {/* JEDNODUCHÝ SEZNAM SLUŽEB */}
            <div className="grid grid-cols-1 gap-4">
              {sluzby.map((item) => (
                <div key={item.jmeno} className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-white transition-all shadow-sm group cursor-default">
                  <div className="bg-blue-600 p-2.5 rounded-xl text-white group-hover:bg-blue-700 transition-colors">
                    <item.ikona className="w-6 h-6" />
                  </div>
                  <span className="font-extrabold text-slate-800 text-lg uppercase tracking-tight italic">{item.jmeno}</span>
                </div>
              ))}
            </div>
            
            {/* Prázdné místo pod službami, abySingle Screen držel tvar */}
            <div className="hidden lg:block h-24"></div>
          </div>
        </section>

        {/* --- SEKCE: OBLAST PŮSOBNOSTI (MAPA) --- */}
        <section className="bg-slate-50 py-24 border-t border-slate-100">
          <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            
            {/* Text k mapě */}
            <div className="space-y-6 order-2 md:order-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-1 rounded-full font-black text-[10px] uppercase tracking-widest mx-auto md:mx-0">
                <MapPinIcon className="w-4 h-4" />
                <span>Oblast působnosti</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tighter leading-none">
                Celá Praha <br />
                <span className="text-blue-700 font-black italic">i blízké okolí.</span>
              </h2>
              <p className="text-xl text-slate-500 font-medium max-w-md mx-auto md:mx-0">
                Garantujeme rychlý výjezd a férové jednání bez skrytých poplatků po celé metropoli.
              </p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-slate-700 font-bold uppercase text-xs tracking-widest pt-4 max-w-sm mx-auto md:mx-0">
                {["Praha 1-22", "Kladno", "Říčany", "Beroun"].map(city => (
                  <div key={city} className="flex items-center gap-2 justify-center md:justify-start">
                    <CheckBadgeIcon className="w-5 h-5 text-blue-600" />
                    <span>{city}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SVG MAPA ČR (Zvětšená a čistá, Prahy se zvýrazní) */}
            <div className="order-1 md:order-2 bg-white p-10 md:p-12 rounded-[3rem] shadow-xl border border-slate-200 flex flex-col items-center group">
              {/* Celá mapa ČR */}
              <svg viewBox="0 0 1000 600" className="w-full h-auto text-slate-200 drop-shadow-sm transition-all" xmlns="http://www.w3.org/2000/svg">
                <path d="M327.3 118.9l-22.1-41.5-22 17.5-13.3-17.5L250 118.9l-11.1 41.5-33.1 17.5L166.7 190.4l-22.2-22.1L100 190.4l22.2 41.5-22.2 41.5H77.8l-22.2 41.5 11.1 41.5-11.1 41.5 22.2 41.5 22.2 11.1 41.5 22.2 41.5-11.1 41.5 22.2h41.5l22.2-22.2 41.5 22.2 41.5-22.2L427.3 538l22.2 11.1 41.5-22.2 22.2 22.2 41.5-22.2 22.2-41.5 41.5 22.2 41.5-22.2 22.2-41.5-11.1-41.5 22.2-41.5-11.1-41.5 22.2-11.1-22.2-41.5 22.2-41.5-22.2-41.5h11.1l-22.2-41.5 22.2-22.2L700 118.9l-22.2-22.2L650 118.9l-11.1-41.5-33.1 17.5-22.2-22.1-13.3 17.5-22.2-17.5-33.1 17.5-22.1-41.5-33.1 17.5L427.3 118.9l-33.1-17.5-22.2 17.5-44.7-17.5z" fill="currentColor" />
                {/* Zvýrazněná Praha */}
                <path d="M360 210l20 5 15 25 30 15 25-10 15 15 20-5 5 15 20 10 15-5 5-20 20-5 10 15-5 25 15 15 5 20-10 15 5 20 15 15-5 15 10 10-5 15H550l-10 20-20-5-15-15-20 5-10-15-20-5-5-20-20-5-15 15-15-10-10 15-15-5-10 10-15-5-15-15-10-10-15-5-15-15-5-20 10-15-10-15 15-15-5-20 10-20 15-15 10-10-10-15 10-20-10-10 5-15 10-10-10-15 10-20z" fill="#1d4ed8" className="group-hover:fill-blue-600 transition-colors duration-500" />
                <circle cx="450" cy="270" r="14" fill="white" stroke="#1d4ed8" strokeWidth="6" />
              </svg>
              <div className="mt-8 flex gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
                <div className="flex items-center gap-2"><span className="w-3 h-3 bg-blue-700 rounded-sm"></span> Praha a Středočeský kraj</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 bg-slate-200 rounded-sm"></span> Ostatní regiony</div>
              </div>
            </div>
          </div>
        </section>

        {/* --- KONTAKTNÍ KARTA LUKÁŠE NOVÁKA (Přesunuto sem pod oblast působnosti) --- */}
        <section className="py-20 md:py-24 bg-white">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="bg-slate-950 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden group">
              {/* Dekorativní prvek na pozadí */}
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-600/20 transition-all duration-700"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                <div className="text-center md:text-left space-y-2">
                  <p className="text-blue-400 font-bold text-sm tracking-widest uppercase italic font-mono">Specialista na servis oken</p>
                  <h2 className="text-4xl md:text-5xl font-black tracking-tight font-sans leading-none">Lukáš Novák</h2>
                  <p className="text-slate-400 text-lg font-medium pt-1">lukas.novak.85@seznam.cz</p>
                </div>
                
                <a href="tel:+420608025502" className="flex items-center justify-center md:justify-start gap-5 bg-blue-600 hover:bg-blue-500 p-6 rounded-3xl transition-all shadow-xl shadow-blue-600/30 active:scale-95 whitespace-nowrap">
                  <PhoneIcon className="w-10 h-10" />
                  <span className="text-4xl font-black tracking-tighter">+420 608 025 502</span>
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* --- FOOTER --- */}
      <footer className="py-12 text-center bg-white border-t border-slate-100">
        <p className="text-slate-400 text-[10px] uppercase font-bold tracking-[0.4em] leading-relaxed">
          AR TECHNIK • Lukáš Novák • IČO: [DOPLNIT]<br/>
          Rychlý a spolehlivý servis oken Praha
        </p>
      </footer>
    </div>
  );
}
