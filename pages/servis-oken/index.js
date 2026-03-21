
import Head from "next/head";
import { WrenchIcon, CheckBadgeIcon, PhoneIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

export default function ServisOken() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Head>
        <title>Servis a oprava oken | [Jméno Podnikatele]</title>
        <meta name="description" content="Profesionální servis, seřízení a opravy plastových i dřevěných oken." />
      </Head>

      {/* Jednoduchý Header */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <span className="font-bold text-xl tracking-tight text-blue-700">SERVIS OKEN</span>
          <a href="tel:+420XXXXXXXXX" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
            <PhoneIcon className="w-5 h-5" /> 777 000 000
          </a>
        </div>
      </nav>

      {/* Hero sekce */}
      <header className="bg-white py-16 border-b border-slate-200">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
            Drhnou vám okna nebo jimi táhne?
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
            Provádím odborné seřízení, výměnu těsnění a opravy kování. 
            Vraťte svým oknům funkčnost a ušetřete za teplo.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#kontakt" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition">
              Poptat servis
            </a>
          </div>
        </div>
      </header>

      {/* Služby - ikony */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Seřízení oken", desc: "Promazání a nastavení kování pro hladký chod.", icon: WrenchIcon },
            { title: "Výměna těsnění", desc: "Zastavení průvanu a úniků tepla z interiéru.", icon: ShieldCheckIcon },
            { title: "Opravy kování", desc: "Výměna poškozených dílů a klik u všech typů oken.", icon: CheckBadgeIcon }
          ].map((s, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition text-center">
              <s.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">{s.title}</h3>
              <p className="text-slate-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer / Kontakt */}
      <footer id="kontakt" className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4 text-blue-400">Rychlý kontakt</h2>
          <p className="text-xl mb-6">Pracuji v Karlovarském kraji a okolí.</p>
          <div className="space-y-2">
            <p className="font-bold text-3xl">Jan Novák</p>
            <p className="text-slate-400 text-lg">IČO: 12345678</p>
            <p className="text-blue-400 font-bold text-xl">servis@okna-novak.cz</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
