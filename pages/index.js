/* --- UPRAVENÁ KOMPONENTA: ŽIVÝ BANNER (BEZ EXTERNÍ MAPY) --- */
function AktualneZTerenu() {
  // DATA PRO ZAKÁZKU - Tady jen přepíšeš texty
  const stavkaData = {
    popis: "Výkop rýhy pro inženýrské sítě a zásyp pískem",
    obec: "Habartov - Úžlabí",
    fotoPath: "/images/aktualni-stavba.jpg" // Sem dáš ten obrázek s mapou
  };

  return (
    <section id="aktualne" className="scroll-mt-24 bg-white py-10 border-b-4 border-[#2f3237]">
      <div className="container mx-auto px-4">
        <div className="bg-gray-50 rounded-3xl p-6 md:p-10 shadow-xl border border-gray-100 flex flex-col md:flex-row items-center gap-10 hover:shadow-2xl transition-all duration-500 overflow-hidden relative">
          
          {/* Pulzující indikátor "LIVE" v rohu */}
          <div className="absolute top-4 right-6 flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">Aktuální stavba</span>
          </div>

          {/* Textová část */}
          <div className="flex-1 space-y-4 w-full text-center md:text-left">
            <h3 className="font-black text-[#f9c600] text-sm tracking-[0.2em] uppercase">Právě realizujeme</h3>
            <p className="text-3xl md:text-4xl font-extrabold text-[#2f3237] leading-tight">
              {stavkaData.popis}
            </p>
            <div className="flex items-center gap-2 text-xl font-bold text-gray-600 justify-center md:justify-start">
              <MapPinIcon className="w-6 h-6 text-[#f9c600]" />
              <span>{stavkaData.obec}</span>
            </div>
          </div>

          {/* Obrázek (ve kterém už máš tu mapu i fotku) */}
          <div className="flex-shrink-0 w-full md:w-[450px] lg:w-[550px]">
            <div className="aspect-video md:aspect-[16/9] rounded-2xl overflow-hidden relative border-4 border-white shadow-2xl group">
              <Image 
                src={stavkaData.fotoPath}
                alt={`Aktuální práce: ${stavkaData.popis}`}
                fill
                className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                priority
              />
              {/* Jemný overlay pro hloubku */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
