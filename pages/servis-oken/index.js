import Head from "next/head";
import { 
  WrenchScrewdriverIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon,
  CheckCircleIcon,
  CurrencyBanknotesIcon
} from "@heroicons/react/24/solid";

export default function ArTechnik() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans text-slate-900">
      <Head>
        <title>AR TECHNIK | Servis a opravy oken Praha</title>
        <meta name="description" content="Profesionální servis a seřízení oken v Praze. Lukáš Novák - AR TECHNIK." />
      </Head>

      {/* Horní lišta / Logo */}
      <header className="bg-white border-b border-slate-200 py-4 shadow-sm">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-700 p-1.5 rounded-lg">
              <WrenchScrewdriverIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-800">AR<span className="text-blue-700">TECHNIK</span></span>
          </div>
          <div className="hidden md:block text-sm font-semibold text-slate-500 uppercase tracking-widest">
            Servis & Opravy Oken
          </div>
        </div>
      </header>

      {/* Hlavní obsah - Bez scrollu na desktopu */}
      <main className="flex-grow flex items-center py-10">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Levá strana - Texty */}
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-slate-900 mb-4">
                Vaše okna <br />
                <span className="text-blue-700 font-black">jako nová.</span>
              </h1>
              <p className="text-xl text-slate-600 max-w-md">
                Odborné seřízení, výměna těsnění a kompletní servis oken pro celou Prahu a okolí.
              </p>
            </div>

            <ul className="space-y-3">
              {["Seřízení a promazání kování", "Výměna poškozeného těsnění", "Opravy klik a funkčních částí"].map((text) => (
                <li key={text} className="flex items-center gap-3 font-bold text-slate-700 text-lg">
                  <CheckCircleIcon className="w-6 h-6 text-blue-600" /> {text}
                </li>
              ))}
            </ul>

            {/* Cenová doložka - Zakomponováno dle požadavku */}
            <div className="inline-flex items-center gap-4 bg-white border-2 border-blue-100 p-5 rounded-2xl shadow-sm">
              <div className="bg-blue-50 p-3 rounded-full text-blue-700">
                <CurrencyBanknotesIcon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-tight">Výjezd po Praze</p>
                <p className="text-2xl font-black text-slate-900">1 200 Kč <span className="text-sm font-normal text-slate-400">bez DPH</span></p>
              </div>
            </div>
          </div>

          {/* Pravá strana - Kontakt (Karta) */}
          <div className="bg-slate-900 rounded-3xl p-8 md:p-10 shadow-2xl text-white relative overflow-hidden">
            {/* Dekorace na pozadí karty */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-1">Lukáš Novák</h2>
                <p className="text-blue-400 font-medium uppercase tracking-[0.2em] text-sm">Specialista na servis oken</p>
              </div>

              <div className="space-y-6 pt-4 border-t border-white/10">
                <a href="tel:+420608025502" className="flex items-center gap-5 group">
                  <div className="bg-blue-600 p-3 rounded-xl group-hover:bg-blue-500 transition-colors">
                    <PhoneIcon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold tracking-tight group-hover:text-blue-400 transition-colors">+420 608 025 502</span>
                </a>

                <a href="mailto:lukas.novak.85@seznam.cz" className="flex items-center gap-5 group">
                  <div className="bg-white/10 p-3 rounded-xl group-hover:bg-white/20 transition-colors text-white">
                    <EnvelopeIcon className="w-6 h-6" />
                  </div>
                  <span className="text-lg font-medium group-hover:text-blue-300 transition-colors">lukas.novak.85@seznam.cz</span>
                </a>

                <div className="flex items-center gap-5">
                  <div className="bg-white/10 p-3 rounded-xl">
                    <MapPinIcon className="w-6 h-6 text-blue-400" />
                  </div>
                  <span className="text-lg text-slate-300">Praha a okolí</span>
                </div>
              </div>

              <div className="pt-6">
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center text-xs text-slate-400 uppercase tracking-widest font-bold">
                  IČO: [DOPLNIT IČO]
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-slate-400 text-xs border-t border-slate-200 bg-white">
        © {new Date().getFullYear()} AR TECHNIK • Rychlý a spolehlivý servis oken v Praze
      </footer>
    </div>
  );
}
