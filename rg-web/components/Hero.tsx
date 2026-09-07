import Countdown from "./Countdown";
import { DISCORD_URL, LAUNCH_DATE } from "@/lib/config";

const jsonLdEvent = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Lanzamiento de Grand Theft Auto 6",
  startDate: LAUNCH_DATE,
  description:
    "Grand Theft Auto 6 llega a PlayStation 5 y Xbox Series X|S el 19 de noviembre de 2026. La cuenta regresiva de la comunidad Radar GTA.",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: {
    "@type": "Place",
    name: "Leonida",
  },
};

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24 text-center"
    >
      <div
        id="hero-backdrop"
        className="hero-ambient pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdEvent) }}
      />

      <span className="eyebrow mb-6">Comunidad GTA 6 en español</span>

      <div id="hero-title-mask" className="mb-6">
        <h1 className="font-display text-[clamp(5rem,22vw,15rem)] uppercase leading-none tracking-tight text-mist">
          GTA <span className="text-vice-gradient">6</span>
        </h1>
      </div>

      <p className="mb-10 max-w-2xl text-balance text-lg text-muted sm:text-xl">
        Vice City. Leonida. Cuando el sol se apaga y el neón enciende, todos
        tienen algo que ganar — y más que perder.
      </p>

      <div id="hero-countdown" className="mb-12">
        <Countdown />
      </div>

      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <a
          href={DISCORD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          Únete al Discord
        </a>
        <a href="#crews" className="btn-ghost">
          Registra tu Crew
        </a>
      </div>
    </section>
  );
}