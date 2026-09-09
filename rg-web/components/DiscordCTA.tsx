import { DISCORD_URL } from "@/lib/config";

const BENEFITS = [
  "Salas de reclutamiento por plataforma y región",
  "Eventos de lanzamiento en directo",
  "Sorteos y guías exclusivas",
  "Directorio de crews verificado",
];

export default function DiscordCTA() {
  return (
    <section id="discord" className="mx-auto w-full max-w-4xl px-6 py-24">
      <div className="sheen-border rounded-3xl bg-gradient-to-r from-neon-pink via-magenta to-cyan p-px">
        <div data-reveal className="flex flex-col items-center gap-8 rounded-[calc(1.5rem-1px)] bg-abyss px-8 py-14 text-center">
          <h2 className="font-display text-4xl uppercase leading-none tracking-wide text-mist sm:text-6xl">
            Únete a la comunidad
          </h2>
          <p className="max-w-xl leading-relaxed text-muted">
            Más de 2.000 jugadores hispanos ya se preparan para el lanzamiento.
            Encuentra tu crew, coordina golpes y no te pierdas nada de la cuenta
            regresiva.
          </p>
          <ul className="flex flex-col items-center gap-2 text-sm text-mist/80">
            {BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-center gap-2">
                <span className="text-cyan" aria-hidden="true">
                  ▸
                </span>
                {benefit}
              </li>
            ))}
          </ul>
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Unirme al Discord
          </a>
        </div>
      </div>
    </section>
  );
}
