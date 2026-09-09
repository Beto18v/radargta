import type { Crew } from "@/lib/types";
import { PLATFORM_LABELS, PLAYSTYLE_LABELS, REGION_LABELS } from "@/lib/types";

const PLATFORM_BADGE_STYLES: Record<Crew["platform"], string> = {
  PS5: "bg-cobalt/25 text-[#9db4ff] border-cobalt/50",
  XBOX_SERIES: "bg-[#107C10]/25 text-[#7dff7d] border-[#107C10]/50",
  CROSSPLAY: "bg-cyan/10 text-cyan border-cyan/40",
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

function memberCountLabel(count: number): string {
  return `${new Intl.NumberFormat("es-ES").format(count)} miembros`;
}

export default function CrewCard({ crew }: { crew: Crew }) {
  const badge = PLATFORM_BADGE_STYLES[crew.platform];

  return (
    <article
      data-reveal
      className="glass-card group flex flex-col gap-4 p-6 transition duration-300 hover:-translate-y-1 hover:border-neon-pink/40 hover:shadow-[0_0_24px_rgba(255,47,179,0.18),0_0_60px_rgba(0,229,255,0.08)]"
    >
      <div className="flex items-center gap-4">
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-neon-pink to-purple-deep font-display text-xl text-white">
          {!crew.logoUrl ? (
            <span aria-hidden="true">{initials(crew.name)}</span>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- external user logos with unknown dimensions; next/image would require remotePatterns config (overkill for MVP avatars)
            <img
              src={crew.logoUrl}
              alt={`Logo de ${crew.name}`}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          )}
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-display text-xl uppercase tracking-wide text-mist">
            {crew.name}
          </h3>
          {crew.tagline ? (
            <p className="truncate text-sm text-muted">{crew.tagline}</p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className={`tag ${badge}`}>{PLATFORM_LABELS[crew.platform]}</span>
        <span className="tag">{REGION_LABELS[crew.region]}</span>
        <span className="tag text-violet">{PLAYSTYLE_LABELS[crew.playstyle]}</span>
        <span className="tag">{memberCountLabel(crew.memberCount)}</span>
        {crew.isVerified ? (
          <span className="tag border-cyan/40 bg-cyan/10 text-cyan">
            ✓ Verificado
          </span>
        ) : null}
        {crew.isFeatured ? (
          <span className="tag border-sunset/40 bg-sunset/10 text-sunset">
            ★ Destacado
          </span>
        ) : null}
      </div>

      {crew.description ? (
        <p className="line-clamp-3 text-sm leading-relaxed text-mist/80">
          {crew.description}
        </p>
      ) : null}

      <div className="mt-auto flex flex-wrap gap-2 pt-1">
        {crew.discordUrl ? (
          <a
            href={crew.discordUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[#5865F2]/50 px-3 py-1.5 text-xs font-semibold text-[#b8c0ff] transition hover:bg-[#5865F2]/20"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            Discord
          </a>
        ) : null}
        {crew.whatsappUrl ? (
          <a
            href={crew.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[#25D366]/50 px-3 py-1.5 text-xs font-semibold text-[#a8f0c4] transition hover:bg-[#25D366]/20"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
            </svg>
            WhatsApp
          </a>
        ) : null}
      </div>
    </article>
  );
}
