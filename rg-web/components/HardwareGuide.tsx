import SectionHeading from "./SectionHeading";
import { HARDWARE } from "@/lib/config";

export default function HardwareGuide() {
  return (
    <section id="hardware" className="mx-auto w-full max-w-6xl px-6 py-24">
      <SectionHeading
        eyebrow="Guía de afiliados"
        title="Prepárate para el lanzamiento"
        description="GTA 6 llega primero a consolas. Estos son los equipos recomendados para jugarlo desde el día 1 con la mejor experiencia."
      />

      <div data-reveal className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {HARDWARE.map((item) => (
          <article
            key={item.key}
            className="glass-card flex flex-col gap-4 p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan/40 hover:shadow-[0_0_24px_rgba(0,229,255,0.15),0_0_60px_rgba(255,47,179,0.06)]"
          >
            <span className="eyebrow">{item.category}</span>
            <h3 className="font-display text-2xl uppercase leading-tight text-mist">
              {item.name}
            </h3>
            <p className="text-sm leading-relaxed text-muted">{item.description}</p>
            {item.priceHint ? (
              <p className="text-xs font-semibold text-sunset">{item.priceHint}</p>
            ) : null}
            <div className="mt-auto flex flex-col gap-2 pt-2">
              <a
                href={item.amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full px-4 py-2.5 text-xs"
              >
                Ver en Amazon
              </a>
              <a
                href={item.mlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost w-full px-4 py-2.5 text-xs"
              >
                Ver en MercadoLibre
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
