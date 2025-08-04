import Head from "next/head";
import Image from "next/image";
import {
  ScaleIcon,
  Cog6ToothIcon,
  ArrowsUpDownIcon,
  WrenchScrewdriverIcon,
  BuildingOffice2Icon,
  TruckIcon,
  SquaresPlusIcon,
} from "@heroicons/react/24/outline";

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

      {/* Header */}
      <header className="bg-[#f9c600] text-black py-6 px-4 flex justify-between items-center shadow-md z-50 relative w-full">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo_update.png"
            alt="Zevyp logo"
            width={150}
            height={150}
            className="h-16 w-auto"
          />
        </div>
        <nav className="flex flex-wrap gap-2 md:space-x-4 text-base md:text-lg mt-4 md:mt-0">
          <a href="#sluzby" className="hover:underline">
            NAŠE SLUŽBY
          </a>
          <a href="#technika" className="hover:underline">
            TECHNIKA
          </a>
          <a href="#cenik" className="hover:underline">
            CENÍK
          </a>
          <a href="#kontakt" className="hover:underline">
            KONTAKT
          </a>
        </nav>
      </header>

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
