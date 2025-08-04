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

      <main className="bg-[#2f3237] text-white px-4 py-12">
  <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
    <div className="md:w-1/2 text-left mb-8 md:mb-0">
      <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">ZEMNÍ A VÝKOPOVÉ PRÁCE</h2>
      <p className="text-base md:text-lg">Provádíme zemní a výkopové práce pomocí pásového rypadla.</p>
    </div>
    <div className="md:w-1/2 flex justify-center">
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

      <section id="sluzby" className="bg-[#f9c600] text-black px-6 py-12">
        <h3 className="text-2xl md:text-3xl font-bold mb-6 text-left max-w-4xl mx-auto md:mx-auto md:pl-12 text-[#2f3237] drop-shadow">NAŠE SLUŽBY</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xl max-w-3xl mx-auto">
          <div className="flex items-center gap-2">
            <span>✔️</span>
            <p>Výkopy základů</p>
          </div>
          <div className="flex items-center gap-2">
            <span>✔️</span>
            <p>Zásypy a zasypávání</p>
          </div>
          <div className="flex items-center gap-2">
            <span>✔️</span>
            <p>Zarovnání terénu</p>
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

      <section id="cenik" className="bg-[#f9c600] text-black px-6 py-12 text-center">
        <h3 className="text-2xl md:text-3xl font-bold mb-6 text-left max-w-4xl mx-auto md:mx-auto md:pl-12 text-[#2f3237] drop-shadow">CENÍK</h3>
        <ul className="space-y-2 text-lg">
          <li>Bagr s obsluhou: <strong>990 Kč/hod</strong></li>
          <li>Doprava stroje: <strong>30 Kč/km</strong></li>
          <li>Výkop základů do 1 m: <strong>od 66 Kč/m²</strong></li>
          <li>Zásypy, zarovnání: <strong>dle domluvy</strong></li>
        </ul>
        <p className="text-sm text-gray-700 mt-4">*Konečnou cenu předanastavíme e-mailem podle vzdálenosti a požadavků.</p>
      </section>

      <section id="kontakt" className="bg-[#2f3237] text-white px-6 py-12">
        <h3 className="text-2xl md:text-3xl font-bold mb-6 text-left max-w-4xl mx-auto md:mx-auto md:pl-12 text-[#2f3237] drop-shadow">KONTAKT</h3>
        <form className="max-w-md mx-auto space-y-4 text-black">
          <input type="text" placeholder="Jméno" className="w-full px-4 py-2 rounded" />
          <input type="email" placeholder="E-mail" className="w-full px-4 py-2 rounded" />
          <textarea placeholder="Zpráva" rows="4" className="w-full px-4 py-2 rounded"></textarea>
          <button type="submit" className="bg-[#f9c600] px-6 py-2 font-bold rounded">ODESLAT</button>
        </form>
      </section>

      <footer className="bg-[#2f3237] text-white text-center py-4 text-sm">
        Zemní a Výkopové práce • IČO:73377619 • info@zevyp.cz • Habartov, Horní Částkov ev. č. 2, 357 09
      </footer>      </div>
    </>
  );
}
