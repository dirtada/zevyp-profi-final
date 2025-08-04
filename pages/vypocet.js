import { useState } from "react";

export default function Vypocet() {
  const [hodiny, setHodiny] = useState(0);
  const [km, setKm] = useState(0);
  const [cena, setCena] = useState(null);

  const spocitat = () => {
    const cenaPrace = hodiny * 990; // cena za hodinu bagru
    const cenaDopravy = km * 30; // doprava za km
    setCena(cenaPrace + cenaDopravy);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#2f3237]">
          Kalkulace výkopových prací
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Počet hodin</label>
            <input
              type="number"
              className="w-full border px-4 py-2 rounded"
              value={hodiny}
              onChange={(e) => setHodiny(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Kilometry dopravy</label>
            <input
              type="number"
              className="w-full border px-4 py-2 rounded"
              value={km}
              onChange={(e) => setKm(Number(e.target.value))}
            />
          </div>

          <button
            onClick={spocitat}
            className="w-full bg-[#f9c600] text-[#2f3237] font-bold py-3 rounded hover:bg-yellow-400 transition"
          >
            Spočítat cenu
          </button>

          {cena !== null && (
            <div className="mt-6 text-center">
              <p className="text-lg font-semibold">
                Celková cena: {cena.toLocaleString()} Kč
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
