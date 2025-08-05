import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  ScaleIcon,
  Cog6ToothIcon,
  ArrowsUpDownIcon,
  WrenchScrewdriverIcon,
  BuildingOffice2Icon,
  TruckIcon,
  SquaresPlusIcon,
} from "@heroicons/react/24/outline";

function Header() {
  const [open, setOpen] = useState(false);

  const navClasses =
    "px-4 py-2 rounded-lg font-semibold uppercase tracking-wide transition hover:bg-[#2f3237] hover:text-white";

  return (
    <header className="bg-[#f9c600] text-black py-4 px-4 shadow-md relative z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo_update.png"
            alt="Zevyp logo"
            width={150}
            height={150}
            className="h-12 w-auto"
          />
        </div>

        {/* Desktop menu */}
        <nav className="hidden md:flex gap-4 text-base md:text-lg">
          <a href="#sluzby" className={navClasses}>Služby</a>
          <a href="#technika" className={navClasses}>Technika</a>
          <a href="#cenik" className={navClasses}>Ceník</a>
          <a href="#kontakt" className={navClasses}>Kontakt</a>
          <a href="/vypocet" className={navClasses}>Výpočet</a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? (
            <XMarkIcon className="w-8 h-8" />
          ) : (
            <Bars3Icon className="w-8 h-8" />
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden bg-[#f9c600] py-4 px-6 flex flex-col gap-3 shadow-lg">
          <a href="#sluzby" className={navClasses} onClick={() => setOpen(false)}>Služby</a>
          <a href="#technika" className={navClasses} onClick={() => setOpen(false)}>Technika</a>
          <a href="#cenik" className={navClasses} onClick={() => setOpen(false)}>Ceník</a>
          <a href="#kontakt" className={navClasses} onClick={() => setOpen(false)}>Kontakt</a>
          <a href="/vypocet" className={navClasses} onClick={() => setOpen(false)}>Výpočet</a>
        </div>
      )}
    </header>
  );
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Zemní a výkopové práce – Zevyp.cz</title>
        <meta
          name="description"
          content="Výkopové a zemní práce minibagrem Hitachi – Praha a okolí."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <div className="min-h-screen bg-[#f9c600] font-sans text-gray-900">
        {/* Hero */}
        <main className="bg-[#2f3237] text-white py-16">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 text-left mb-12 md:mb-0 relative z-20">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                ZEMNÍ A VÝKOPOVÉ PRÁCE
              </h2>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8">
                Provádíme{" "}
                <span className="text-[#f9c600] font-semibold">
                  spolehlivé zemní a výkopové práce
                </span>{" "}
                minibagrem Hitachi v Praze a okolí.
              </p>
              <a
                href="#kontakt"
                className="inline-block bg-[#f9c600] text-[#2f3237] font-bold px-6 py-3 rounded-lg shadow hover:bg-yellow-400 transition"
              >
                Nezávazná poptávka
              </a>
            </div>
            <div className="md:w-1/2 flex justify-center relative z-10">
              <Image
                src="/images/bagr-hero.png"
                alt="Bagr"
                width={700}
                height={500}
                className="object-contain -mb-24 md:-mb-32"
              />
            </div>
          </div>
        </main>

        {/* SLUŽBY */}
        <section id="sluzby" className="bg-[#f9c600] text-black py-16">
          <div className="container mx-auto px-4">
            <h3 className="text-2xl md:text-3xl font-bold mb-12 text-[#2f3237] drop-shadow text-center">
              NAŠE SLUŽBY
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition text-center">
                <BuildingOffice2Icon className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2 text-[#2f3237]">
                  Výkopy základů
                </h4>
                <p className="text-gray-600 text-sm">
                  Přesné a rychlé výkopy základových pasů a desek pro rodinné
                  domy či stavby.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition text-center">
                <TruckIcon className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2 text-[#2f3237]">
                  Zásypy a zasypávání
                </h4>
                <p className="text-gray-600 text-sm">
                  Kvalitní a efektivní zásypy základů, rýh i inženýrských sítí.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition text-center">
                <SquaresPlusIcon className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2 text-[#2f3237]">
                  Zarovnání terénu
                </h4>
                <p className="text-gray-600 text-sm">
                  Úpravy a modelace terénu pro zahrady, příjezdové cesty či
                  stavební plochy.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TECHNIKA */}
        <section id="technika" className="bg-white text-black py-16">
          <div className="container mx-auto px-4">
            <h3 className="text-2xl md:text-3xl font-bold mb-12 text-[#2f3237] drop-shadow text-center">
              TECHNIKA
            </h3>
            <div className="flex flex-col md:flex-row items-center gap-10 max-w-5xl mx-auto bg-gray-50 rounded-xl shadow-lg p-8">
              <Image
                src="/images/bagr-technik.png"
                alt="Bagr Technika"
                width={400}
                height={300}
                className="rounded-lg shadow"
              />
              <div className="text-left text-lg space-y-4">
                <h4 className="text-2xl font-bold text-[#2f3237]">
                  Hitachi ZX 48-A5A
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <ScaleIcon className="w-6 h-6 text-yellow-500" />
                    <span>Hmotnost: 4.3 tuny</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Cog6ToothIcon className="w-6 h-6 text-yellow-500" />
                    <span>Motor: Yanmar 4TNV88 – 25.2 KW</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <ArrowsUpDownIcon className="w-6 h-6 text-yellow-500" />
                    <span>Max. hloubka výkopu: 3.74 m</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <WrenchScrewdriverIcon className="w-6 h-6 text-yellow-500" />
                    <span>Vhodný pro základy, inženýrské sítě a úpravy terénu</span>
                  </li>
                </ul>
                <a
                  href="#kontakt"
                  className="inline-block mt-6 bg-[#f9c600] text-[#2f3237] font-bold px-6 py-3 rounded-lg shadow hover:bg-yellow-400 transition"
                >
                  Poptat tuto techniku
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CENÍK */}
        <section id="cenik" className="bg-[#f9c600] text-black py-16">
          <div className="container mx-auto px-4">
            <h3 className="text-2xl md:text-3xl font-bold mb-12 text-[#2f3237] drop-shadow text-center">
              CENÍK
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full max-w-3xl mx-auto border border-gray-300 rounded-lg overflow-hidden">
                <tbody className="divide-y divide-gray-300">
                  <tr>
                    <td className="py-4 px-6 font-semibold">Bagr s obsluhou</td>
                    <td className="py-4 px-6 text-right font-bold">
                      990 Kč / hod
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-semibold">Doprava stroje</td>
                    <td className="py-4 px-6 text-right font-bold">30 Kč / km</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-semibold">
                      Výkop základů do 1 m
                    </td>
                    <td className="py-4 px-6 text-right font-bold">
                      od 66 Kč / m²
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-semibold">Zásypy, zarovnání</td>
                    <td className="py-4 px-6 text-right font-bold">
                      dle domluvy
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-700 mt-6 text-center max-w-xl mx-auto">
              *Konečnou cenu stanovíme individuálně podle vzdálenosti a
              požadavků.
            </p>
          </div>
        </section>

{/* KONTAKT */}
<section id="kontakt" className="bg-[#2f3237] text-white px-6 py-12">
  <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center text-[#f9c600] drop-shadow">
    KONTAKT & POPTÁVKA
  </h3>
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
    
    {/* Kontaktni formulář */}
    <form className="bg-white rounded-lg shadow-lg p-6 space-y-5">
      <h4 className="text-xl font-bold text-[#2f3237] mb-4">Kontaktujte nás</h4>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Jméno</label>
        <input type="text" placeholder="Vaše jméno"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f9c600] focus:outline-none"/>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">E-mail</label>
        <input type="email" placeholder="vas@email.cz"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f9c600] focus:outline-none"/>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Telefon</label>
        <input type="tel" placeholder="+420 ..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f9c600] focus:outline-none"/>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Zpráva</label>
        <textarea rows="4" placeholder="Sem napište svou poptávku..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f9c600] focus:outline-none"></textarea>
      </div>
      <button type="submit"
        className="w-full bg-[#f9c600] text-[#2f3237] font-bold py-3 rounded-lg shadow hover:bg-yellow-400 transition">
        ODESLAT POPTÁVKU
      </button>
    </form>

    {/* Poptávkový formulář */}
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h4 className="text-xl font-bold text-[#2f3237] mb-4">Rezervace termínu</h4>
      <div className="space-y-4">
        {/* Název projektu */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Název projektu</label>
          <input type="text" placeholder="Např. výkop základů"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f9c600] focus:outline-none"/>
        </div>

        {/* Adresa */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Adresa zakázky</label>
          <div className="flex space-x-2">
            <input type="text" placeholder="Zadejte adresu"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f9c600] focus:outline-none"/>
            <button type="button"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              Zjistit km
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">Vzdálenost: 0 km</p>
        </div>

        {/* Typ práce */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Typ prací</label>
          <div className="grid gap-3">
            <button className="flex items-center justify-between p-4 border rounded-lg hover:shadow transition border-gray-300">
              <span>Výkopové práce</span><span className="text-sm">★</span>
            </button>
            <button className="flex items-center justify-between p-4 border rounded-lg hover:shadow transition border-gray-300">
              <span>Výkop + zásypové práce</span><span className="text-sm">★★</span>
            </button>
            <button className="flex items-center justify-between p-4 border rounded-lg hover:shadow transition border-gray-300">
              <span>Komplexní práce</span><span className="text-sm">★★★</span>
            </button>
          </div>
        </div>

        {/* Kalendář */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Vyberte rozsah dní</label>
          <div className="bg-gray-100 rounded p-4 text-center text-gray-600 text-sm">
            Zde bude kalendář (React-Calendar)
          </div>
        </div>

        <button type="submit"
          className="w-full bg-green-600 text-white font-bold py-3 rounded-lg shadow hover:bg-green-700 transition">
          ODESLAT OBJEDNÁVKU
        </button>
      </div>
    </div>
  </div>
</section>


        {/* Footer */}
        <footer className="bg-[#2f3237] text-white text-center py-4 text-sm">
          Zemní a Výkopové Práce • IČO:73377619 • info@zevyp.cz • Habartov,
          Horní Částkov ev. č. 2, 357 09
        </footer>
      </div>
    </>
  );
}
