import Head from "next/head";
import Image from "next/image";
import { 
  PhoneIcon, 
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
        <meta name="description" content="Profesionální servis oken v Praze. Lukáš Novák - AR TECHNIK." />
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

      <main className="flex-grow text-center md:text-left">
        {/* --- HERO SEKCE --- */}
        <section className="container mx-auto px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* FOTKA TECHNIKA (Zvětšená na 8 sloupců) */}
          <div className="lg:col-span-8 relative rounded-[2.5rem] overflow-hidden shadow-2xl h-[500px] md:h-[700px] border-8 border-slate-50 group">
            <Image 
              src="/images/servis-oken-ar-technik.png" 
              alt="Servis oken v praxi" 
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-1000"
              priority
            />
          </div>

          {/* SLUŽBY (4 sloupce) */}
          <div className="lg:col-span-4 space-y-10">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-black text-slate-950 leading-[0.9] tracking-tighter italic">
                Vaše okna v <span className="text-blue-700">top kondici.</span>
              </h1>
              <div className="flex items-center gap-3 bg-blue-50 text-blue-700 px-6 py-3 rounded-2xl inline-flex font-black shadow-sm border border-blue-100">
                <span className="uppercase text-[10px] tracking-widest opacity-60">Výjezd po Praze</span>
                <span className="text-2xl italic">1 200 Kč</span>
                <span className="text-[10px] font-normal not-italic opacity-50 uppercase tracking-normal">bez DPH</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {sluzby.map((item) => (
                <div key={item.jmeno} className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 italic font-black uppercase text-sm tracking-tight hover:border-blue-200 transition-colors">
                  <div className="bg-blue-600 p-2 rounded-lg text-white">
                    <item.ikona className="w-5 h-5" />
                  </div>
                  {item.jmeno}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- SEKCE: OBLAST PŮSOBNOSTI (MAPA-PRAHA.PNG) --- */}
        <section className="bg-slate-50 py-24 border-t border-slate-100">
          <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-6 order-2 md:order-1">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-1 rounded-full font-black text-[10px] uppercase tracking-widest mx-auto md:mx-0">
                <MapPinIcon className="w-4 h-4" />
                <span>Oblast působnosti</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tighter leading-none">
                Celá Praha <br />
                <span className="text-blue-700 italic font-black">i blízké okolí.</span>
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

            {/* ODKAZ NA TVŮJ OBRÁZEK MAPA-PRAHA.PNG */}
            <div className="order-1 md:order-2 bg-white p-10 md:p-12 rounded-[3rem] shadow-xl border border-slate-200 flex flex-col items-center">
              <div className="relative w-full h-[350px] md:h-[450px]">
                <Image 
                  src="/images/mapa-praha.png" 
                  alt="Mapa působnosti Praha" 
                  fill
                  className="object-contain"
                />
              </div>
              <div className="mt-8 flex gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-blue-600 rounded-sm"></span> 
                  Oblast působnosti AR TECHNIK
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- KONTAKTNÍ KARTA --- */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="bg-slate-950 rounded-[3rem] p-8 md:p-14 text-white shadow-2xl flex flex-col md:flex-row justify-between items-center gap-10 relative overflow-hidden group">
              <div className="relative z-10 text-center md:text-left space-y-2">
                <p className="text-blue-400 font-bold text-sm tracking-widest uppercase italic font-mono opacity-80">Servis oken</p>
                <h2 className="text-5xl font-black tracking-tight leading-none font-sans">Lukáš Novák</h2>
                <p className="text-slate-400 text-lg font-medium italic">lukas.novak.85@seznam.cz</p>
              </div>
              
              <a href="tel:+420608025502" className="relative z-10 flex items-center gap-5 bg-blue-600 hover:bg-blue-500 p-6 md:p-8 rounded-[2.5rem] transition-all shadow-xl shadow-blue-600/30 active:scale-95 whitespace-nowrap">
                <PhoneIcon className="w-10 h-10" />
                <span className="text-4xl md:text-5xl font-black tracking-tighter">+420 608 025 502</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="py-10 text-center bg-white border-t border-slate-100">
        <p className="text-slate-400 text-[10px] uppercase font-bold tracking-[0.4em] leading-relaxed italic">
          AR TECHNIK • Lukáš Novák • IČO: [DOPLNIT]<br/>
          Rychlý a spolehlivý servis oken Praha
        </p>
      </footer>
    </div>
  );
}
