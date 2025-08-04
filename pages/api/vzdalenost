export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { adresa } = req.body;
  if (!adresa) {
    return res.status(400).json({ error: "Adresa nebyla zadána." });
  }

  try {
    const baseAdresa = "Karlovy Vary, Česká republika";
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
      baseAdresa
    )}&destinations=${encodeURIComponent(adresa)}&key=${apiKey}&language=cs&units=metric`;

    const response = await fetch(url);
    const data = await response.json();

    if (
      !data.rows ||
      !data.rows[0] ||
      !data.rows[0].elements ||
      data.rows[0].elements[0].status !== "OK"
    ) {
      return res.status(400).json({ error: "Nepodařilo se zjistit vzdálenost." });
    }

    const vzdalenostKm = data.rows[0].elements[0].distance.value / 1000;
    res.status(200).json({ km: Math.round(vzdalenostKm) });
  } catch (error) {
    console.error("Chyba při výpočtu vzdálenosti:", error);
    res.status(500).json({ error: "Server error." });
  }
}
