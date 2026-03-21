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
        <title>AR TECHNIK | Servis a opravy oken Praha</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* --- HEADER (Mobil: Logo na střed) --- */}
      <header className="py-4 md:py-6 px-6 md:px-12 border-b border-slate-50 sticky top-0 bg-white/90 backdrop-blur-md z-50">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-[180px] h-[60px] md:w-[200px] md:h-[70px]">
            <Image 
              src="/images/ar-technik-logo-okno.png" 
              alt="AR TECHNIK Logo" 
              fill
              priority
              className="object-contain"
            />
          </div>
          <div className="hidden lg:block text-slate-400 font-bold tracking-[0.3em] text-[10px] uppercase text-right leading-relaxed font-mono">
            Specialista na okenní systémy<br/>Praha a Střední Čechy
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* --- HERO SEKCE --- */}
        <section className="container mx-auto px-4 md:px-6 py-8 md:py-20 flex flex-col lg:grid lg:grid-cols-12 gap-8 md:gap-16 items-center">
          
          {/* Nadpis pro mobil (aby byl první) */}
          <div className="lg:hidden text-center space-y-4 mb-4">
            <h1 className="text-4xl md:text-7xl font-black text-slate-950 leading-[0.9] tracking-tighter italic uppercase">
              Vaše okna v <br/><span className="text-blue-700">top kondici.</span>
            </h1>
          </div>

          {/* FOTKA TECHNIKA (Mobil: přirozený poměr stran, žádný drastický ořez) */}
          <div className="w-full lg:col-span-8 relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl min-h-[400px] md:h-[700px] border-4 md:border-8 border-slate-50 group">
            <Image 
              src="/images/servis-oken-ar-technik.png" 
              alt="Servis oken v praxi" 
              fill
              className="object-cover md:object-center" // Na mobilu bere střed, na desktopu plný rozsah
              priority
            />
          </div>

          {/* OBSAH (Nadpis pro desktop + Služby) */}
          <div className="w-full lg:col-span-4 space-y-8 md:space-y-12">
            <div className="hidden lg:block space-y-4 text-left">
              <h1 className="text-7xl font-black text-slate-950 leading-[0.9] tracking-tighter italic uppercase">
                Vaše okna v <span className="text-blue-700">top kondici.</span>
              </h1>
            </div>

            {/* Cena */}
            <div className="flex items-center justify-center lg:justify-start gap-3 bg-blue-50 text-blue-700 px-6 py-4 rounded-2xl font-black shadow-sm border border-blue-100">
              <div className="text-left">
                <span className="uppercase text-[10px] tracking-widest opacity-60 block">Výjezd po Praze</span>
                <span className="text-3xl italic tracking-tighter">1 200 Kč</span>
                <span className="text-[10px] font-normal not-italic opacity-50 uppercase ml-2">bez DPH</span>
              </div>
            </div>
            
            {/* Seznam služeb */}
            <div className="grid grid-cols-1 gap-3">
              {sluzby.map((item) => (
                <div key={item.jmeno} className="flex items-center gap-4 p-4 md:p-5 bg-slate-50 rounded-2xl border border-slate-100 italic font-black uppercase text-xs md:text-sm tracking-tight hover:border-blue-200 transition-colors">
                  <div className="bg-blue-600 p-2 rounded-lg text-white shrink-0">
                    <item.ikona className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <span className="text-left">{item.jmeno}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- SEKCE: OBLAST PŮSOBNOSTI --- */}
        <section className="bg-slate-50 py-12 md:py-24 border-t border-slate-100">
          <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            
            <div className="space-y-6 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-1 rounded-full font-black text-[10px] uppercase tracking-widest mx-auto md:mx-0">
                <MapPinIcon className="w-4 h-4" />
                <span>Kde opravujeme</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tighter leading-none uppercase">
                Celá Praha <br />
                <span className="text-blue-700 italic">i blízké okolí.</span>
              </h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-slate-700 font-bold uppercase text-[10px] md:text-xs tracking-widest pt-4 max-w-sm mx-auto md:mx-0">
                {["Praha 1-22", "Kladno", "Říčany", "Beroun"].map(city => (
                  <div key={city} className="flex items-center gap-2 justify-start">
                    <CheckBadgeIcon className="w-4 h-4 md:w-5 md:h-5 text-blue-600 shrink-0" />
                    <span>{city}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* OBRÁZEK MAPY */}
            <div className="bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-xl border border-slate-200">
              <div className="relative w-full aspect-video md:h-[450px]">
                <Image 
                  src="/images/mapa-praha.png" 
                  alt="Mapa působnosti Praha" 
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        {/* --- KONTAKTNÍ KARTA (Mobil: Upravená velikost textu) --- */}
        <section className="py-12 md:py-24 bg-white px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-slate-950 rounded-[2rem] md:rounded-[3rem] p-8 md:p-14 text-white shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8 md:gap-10 relative overflow-hidden">
              <div className="text-center md:text-left space-y-2 relative z-10">
                <p className="text-blue-400 font-bold text-[10px] md:text-sm tracking-[0.2em] uppercase italic opacity-80">Rychlý kontakt</p>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-none">Lukáš Novák</h2>
                <p className="text-slate-400 text-sm md:text-lg font-medium italic">lukas.novak.85@seznam.cz</p>
              </div>
              
              <a href="tel:+420608025502" className="w-full md:w-auto relative z-10 flex items-center justify-center gap-4 bg-blue-600 hover:bg-blue-500 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] transition-all shadow-xl shadow-blue-600/30 active:scale-95 whitespace-nowrap">
                <PhoneIcon className="w-8 h-8 md:w-10 md:h-10 shrink-0" />
                <span className="text-2xl md:text-5xl font-black tracking-tighter">+420 608 025 502</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 md:py-10 text-center bg-white border-t border-slate-100 px-4">
        <p className="text-slate-400 text-[9px] md:text-[10px] uppercase font-bold tracking-[0.3em] leading-loose italic">
          AR TECHNIK • Lukáš Novák • IČO: [DOPLNIT]<br className="md:hidden"/>
          • Servis oken Praha
        </p>
      </footer>
    </div>
  );
}
