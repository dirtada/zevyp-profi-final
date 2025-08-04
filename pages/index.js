import Head from "next/head";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Head>
        <title>Zemní a výkopové práce – Zevyp.cz</title>
        <meta name="description" content="Výkopové a zemní práce minibagrem Hitachi – Praha a okolí." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

<header className="bg-[#f9c600] text-black py-6 px-4 flex justify-between items-center shadow-md z-50 relative w-full">
  <div className="flex items-center gap-3">
    <Image src="/images/logo_update.png" alt="Zevyp logo" width={150} height={150} className="h-16 w-auto" />
    <h1 className="text-2xl font-extrabold"></h1>
  </div>
  <nav className="flex flex-wrap gap-2 md:space-x-4 text-base md:text-lg mt-4 md:mt-0">
    <a href="#sluzby" className="hover:underline">NAŠE SLUŽBY</a>
    <a href="#technika" className="hover:underline">TECHNIKA</a>
    <a href="#cenik" className="hover:underline">CENÍK</a>
    <a href="#kontakt" className="hover:underline">KONTAKT</a>
  </nav>
</header>

<div className="min-h-screen bg-[#f9c600] font-sans text-gray-900">




<main className="bg-[#2f3237] text-white py-16">
  <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
    {/* Textový blok */}
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

    {/* Obrázek */}
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

<section id="sluzby" className="bg-[#f9c600] text-black py-16">
  <div className="container mx-auto px-4">
    <h3 className="text-2xl md:text-3xl font-bold mb-12 text-[#2f3237] drop-shadow text-center">
      NAŠE SLUŽBY
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition text-center">
        <div className="text-4xl mb-4">🏗️</div>
        <h4 className="text-xl font-semibold mb-2 text-[#2f3237]">
          Výkopy základů
        </h4>
        <p className="text-gray-600 text-sm">
          Přesné a rychlé výkopy základových pasů a desek pro rodinné domy či stavby.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition text-center">
        <div className="text-4xl mb-4">🪣</div>
        <h4 className="text-xl font-semibold mb-2 text-[#2f3237]">
          Zásypy a zasypávání
        </h4>
        <p className="text-gray-600 text-sm">
          Kvalitní a efektivní zásypy základů, rýh i inženýrských sítí.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition text-center">
        <div className="text-4xl mb-4">🌍</div>
        <h4 className="text-xl font-semibold mb-2 text-[#2f3237]">
          Zarovnání terénu
        </h4>
        <p className="text-gray-600 text-sm">
          Úpravy a modelace terénu pro zahrady, příjezdové cesty či stavební plochy.
        </p>
      </div>
    </div>
  </div>
</section>


      <section id="technika" className="bg-white text-black px-6 py-12">
        <h3 className="text-2xl md:text-3xl font-bold mb-6 text-left max-w-4xl mx-auto md:mx-auto md:pl-12 text-[#2f3237] drop-shadow">TECHNIKA</h3>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-4xl mx-auto">
          <Image src="/images/bagr-technik.png" alt="Bagr Technika" width={400} height={300} />
          <div className="text-left text-lg">
            <h4 className="text-lg md:text-xl font-bold mb-2">Hitachi ZX 48-A5A</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Hmotnost: 4.3 tuny</li>
              <li>Motor: Yanmar 4TNV88 – 25.2 KW</li>
              <li>Max. hloubka výkopu: 3.74 m</li>
              <li>Vhodný pro výkopy základů, inženýrské sítě, úpravy terénu</li>
            </ul>
          </div>
        </div>
      </section>

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
    </div>

    <p className="text-sm text-gray-700 mt-6 text-center max-w-xl mx-auto">
      *Konečnou cenu stanovíme individuálně podle vzdálenosti a požadavků.
    </p>
  </div>
</section>

          
          <section id="kontakt" className="bg-[#2f3237] text-white px-6 py-12">
  <h3 className="text-2xl md:text-3xl font-bold mb-6 text-left max-w-4xl mx-auto md:pl-12 text-[#f9c600] drop-shadow">
    KONTAKT
  </h3>
  
  <form className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-6 space-y-5">
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        Jméno
      </label>
      <input
        type="text"
        placeholder="Vaše jméno"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f9c600] focus:outline-none"
      />
    </div>
    
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        E-mail
      </label>
      <input
        type="email"
        placeholder="vas@email.cz"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f9c600] focus:outline-none"
      />
    </div>

    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        Telefon
      </label>
      <input
        type="tel"
        placeholder="+420 ..."
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f9c600] focus:outline-none"
      />
    </div>
    
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        Zpráva
      </label>
      <textarea
        rows="4"
        placeholder="Sem napište svou poptávku..."
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f9c600] focus:outline-none"
      ></textarea>
    </div>
    
    <button
      type="submit"
      className="w-full bg-[#f9c600] text-[#2f3237] font-bold py-3 rounded-lg shadow hover:bg-yellow-400 transition"
    >
      ODESLAT POPTÁVKU
    </button>
  </form>
</section>

        
      <footer className="bg-[#2f3237] text-white text-center py-4 text-sm">
        Zemní a Výkopové práce • IČO:73377619 • info@zevyp.cz • Habartov, Horní Částkov ev. č. 2, 357 09
      </footer>      </div>
    </>
  );
}
