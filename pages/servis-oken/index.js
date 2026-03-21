import Head from "next/head";
import Image from "next/image";
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon,
  CheckBadgeIcon,
  FireIcon,
  WrenchIcon,
  ArrowsRightLeftIcon
} from "@heroicons/react/24/solid";

export default function ArTechnik() {
  const sluzby = [
    { jmeno: "Servis a seřízení", ikona: WrenchIcon },
    { jmeno: "Oprava kování", ikona: CheckBadgeIcon },
    { jmeno: "Výměna těsnění", ikona: ArrowsRightLeftIcon },
    { jmeno: "Měření úniku tepla", ikona: FireIcon },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900">
      <Head>
        <title>AR TECHNIK | Servis a opravy oken Praha</title>
        <meta name="description" content="Profesionální servis oken v Praze. Lukáš Novák - AR TECHNIK." />
      </Head>

      {/* Header s Logem */}
      <header className="py-6 px-10 border-b border-slate-100">
        <div className="container mx-auto flex justify-between items-center">
          <Image 
            src="/images/ar-technik-logo-okno.jpg" 
            alt="AR TECHNIK Logo" 
            width={180} 
            height={60} 
            priority
            className="object-contain"
          />
          <div className="hidden md:block text-slate-400 font-medium tracking-[0.2em] text-xs uppercase">
            Specialista na okenní systémy
          </div>
        </div>
      </header>

      {/* Hlavní Sekce - Single Screen Layout */}
      <main className="flex-grow flex items-center px-6 py-10 md:py-0">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* FOTKA (Levá strana) */}
          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl h-[400px] md:h-[550px]">
            <Image 
              src="/images/servis-oken-ar-technik.png" 
              alt="Servis oken v praxi" 
              layout="fill"
              objectFit="cover"
              priority
            />
          </div>

          {/* OBSAH (Pravá strana) */}
          <div className="space-y-10">
            <div>
              <h1 className="text-5xl font-black text-slate-950 leading-tight tracking-tighter mb-4">
                Vaše okna v <br />
                <span className="text-blue-700 italic">nejlepší kondici.</span>
              </h1>
              <div className="flex items-baseline gap-2 bg-blue-50 text-blue-800 px-4 py-2 rounded-full inline-block font-bold">
                <span>Výjezd po Praze:</span>
                <span className="text-xl">1 200 Kč</span>
                <span className="text-xs font-normal opacity-70 italic">bez DPH</span>
              </div>
            </div>

            {/* JEDNODUCHÝ SEZNAM SLUŽEB */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sluzby.map((item) => (
                <div key={item.jmeno} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-hover hover:border-blue-200">
                  <item.ikona className="w-6 h-6 text-blue-600" />
                  <span className="font-bold text-slate-700">{item.jmeno}</span>
                </div>
              ))}
            </div>

            {/* KONTAKTNÍ KARTA */}
            <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                  <p className="text-blue-400 font-bold uppercase tracking-widest text-xs mb-1">Kontakt</p>
                  <h2 className="text-2xl font-bold">Lukáš Novák</h2>
                  <p className="text-slate-400 text-sm italic">lukas.novak.85@seznam.cz</p>
                </div>
                
                <a href="tel:+420608025502" className="flex items-center gap-4 bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-600/30">
                  <PhoneIcon className="w-6 h-6" />
                  <span className="text-xl font-black tracking-tight">+420 608 025 502</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Jednoduchý Footer */}
      <footer className="py-6 text-center text-slate-300 text-[10px] uppercase tracking-[0.3em]">
        AR TECHNIK • PRAHA • IČO: [DOPLNIT]
      </footer>
    </div>
  );
}
