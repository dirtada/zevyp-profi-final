
import Image from "next/image";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Zevyp.cz – Zemní a výkopové práce</title>
        <meta name="description" content="Profesionální zemní a výkopové práce s pásovým bagrem." />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;600;800&display=swap" rel="stylesheet" />
      </Head>
      <div className="min-h-screen bg-[#f9c600] font-[Rubik] text-gray-900">
        <header className="bg-black text-white py-6 px-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image src="/images/logo.png" alt="Zevyp logo" width={40} height={40} />
            <h1 className="text-2xl font-extrabold">ZEVYP.CZ</h1>
          </div>
          <nav className="space-x-4 text-lg hidden md:block">
            <a href="#sluzby" className="hover:underline">NAŠE SLUŽBY</a>
            <a href="#technika" className="hover:underline">TECHNIKA</a>
            <a href="#cenik" className="hover:underline">CENÍK</a>
            <a href="#kontakt" className="hover:underline">KONTAKT</a>
          </nav>
        </header>

        <main className="bg-black text-white px-4 py-12 text-center">
          <h2 className="text-5xl font-extrabold mb-4">ZEMNÍ A VÝKOPOVÉ PRÁCE</h2>
          <p className="text-lg mb-6">Provádíme zemní a výkopové práce pomocí pásového rypadla.</p>
          <div className="flex justify-center">
            <Image
              src="/images/hitachi-zx48u.png"
              alt="Bagr"
              width={600}
              height={400}
              className="rounded"
            />
          </div>
        </main>

        <section id="sluzby" className="bg-[#f9c600] text-black px-6 py-12">
          <h3 className="text-3xl font-bold mb-6 text-center">NAŠE SLUŽBY</h3>
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
            <div className="flex items-center gap-2">
              <span>✔️</span>
              <p>Demolice a odvoz sutě</p>
            </div>
          </div>
        </section>

        <section id="technika" className="bg-white px-6 py-12 text-center">
          <h3 className="text-3xl font-bold mb-6">POUŽÍVANÁ TECHNIKA</h3>
          <p className="text-lg max-w-2xl mx-auto mb-6">K práci využíváme moderní a kompaktní pásové rypadlo Hitachi ZX48U-5A s vysokou přesností a efektivitou.</p>
        </section>

        <section id="cenik" className="bg-[#f9c600] text-black px-6 py-12 text-center">
          <h3 className="text-3xl font-bold mb-6">CENÍK SLUŽEB</h3>
          <ul className="space-y-2 text-lg">
            <li>Bagr s obsluhou: <strong>990 Kč/hod</strong></li>
            <li>Doprava stroje: <strong>30 Kč/km</strong></li>
            <li>Výkop základů do 1 m hloubky: <strong>od 66 Kč/m²</strong></li>
          </ul>
        </section>

        <section id="kontakt" className="bg-white px-6 py-12 text-center">
          <h3 className="text-3xl font-bold mb-6">KONTAKTUJTE NÁS</h3>
          <p className="text-lg">Tel.: +420 777 123 456 • Email: info@zevyp.cz</p>
        </section>

        <footer className="bg-black text-white text-center py-4">
          © {new Date().getFullYear()} ZEVYP.CZ – Zemní a výkopové práce
        </footer>
      </div>
    </>
  );
}
