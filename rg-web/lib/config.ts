import type { HardwareItem } from "./types";

export const SITE_NAME = "Radar GTA";
export const SITE_TAGLINE = "GTA 6 en español: cuenta regresiva, crews y comunidad.";
export const LAUNCH_DATE = "2026-11-19T00:00:00Z";
export const DISCORD_URL = "https://discord.gg/radargta";
export const CREWS_API_URL = process.env.CREWS_API_URL ?? "http://localhost:8000/api/crews";

export const HARDWARE: HardwareItem[] = [
  {
    key: "ps5",
    name: "PlayStation 5",
    category: "Consola",
    description:
      "La PS5 es la plataforma principal para GTA 6 en su lanzamiento. Rendimiento de 60 FPS y tiempos de carga casi instantáneos con su SSD integrado.",
    priceHint: "Desde ~499 USD",
    amazonUrl: "https://www.amazon.com/dp/PLACEHOLDER-PS5",
    mlUrl: "https://www.mercadolibre.com.ar/PLACEHOLDER-PS5",
  },
  {
    key: "xbox-series-x",
    name: "Xbox Series X",
    category: "Consola",
    description:
      "La consola más potente de Microsoft, ideal para jugar GTA 6 con la mejor fidelidad visual y el ecosistema Xbox en 4K a 60 FPS.",
    priceHint: "Desde ~499 USD",
    amazonUrl: "https://www.amazon.com/dp/PLACEHOLDER-XSX",
    mlUrl: "https://www.mercadolibre.com.ar/PLACEHOLDER-XSX",
  },
  {
    key: "ssd-nvme-ps5",
    name: "SSD NVMe compatible PS5",
    category: "Almacenamiento",
    description:
      "GTA 6 ocupará más de 100 GB. Un SSD NVMe M.2 amplía el almacenamiento de tu PS5 sin perder velocidad ni tiempos de carga.",
    priceHint: "1 TB desde ~100 USD",
    amazonUrl: "https://www.amazon.com/dp/PLACEHOLDER-SSD",
    mlUrl: "https://www.mercadolibre.com.ar/PLACEHOLDER-SSD",
  },
  {
    key: "dualSense",
    name: "Mando DualSense",
    category: "Periférico",
    description:
      "Gatillos adaptativos y vibración háptica: la inmersión de Vice City se siente en las manos. Imprescindible para exprimir el juego.",
    priceHint: "~70 USD",
    amazonUrl: "https://www.amazon.com/dp/PLACEHOLDER-DUAL",
    mlUrl: "https://www.mercadolibre.com.ar/PLACEHOLDER-DUAL",
  },
  {
    key: "monitor-120hz",
    name: "Monitor 120Hz+ HDMI 2.1",
    category: "Pantalla",
    description:
      "Para jugar en modo rendimiento a 120 FPS necesitas un monitor con HDMI 2.1, baja latencia y soporte VRR. 27\" a 1440p es el punto dulce.",
    priceHint: "Desde ~250 USD",
    amazonUrl: "https://www.amazon.com/dp/PLACEHOLDER-MON",
    mlUrl: "https://www.mercadolibre.com.ar/PLACEHOLDER-MON",
  },
  {
    key: "auriculares",
    name: "Auriculares gaming",
    category: "Audio",
    description:
      "El audio espacial de Leonida (pasos, sirenas, hélices) marca la diferencia. Auriculares con micrófono para coordinar golpes con tu crew.",
    priceHint: "Desde ~50 USD",
    amazonUrl: "https://www.amazon.com/dp/PLACEHOLDER-AUD",
    mlUrl: "https://www.mercadolibre.com.ar/PLACEHOLDER-AUD",
  },
];