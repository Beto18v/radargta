import { preload } from "react-dom";
import Countdown from "./Countdown";
import HeroScrollFx from "./HeroScrollFx";
import { DISCORD_URL, LAUNCH_DATE } from "@/lib/config";

// Hero cityscape (LCP) integration flag. The AVIF/WebP source files live in
// public/hero/ (see docs/technical/hero-cityscape-prompt.md §Provenance for
// the generation record and docs/technical/frontend-rg-web.md §Asset
// provenance for the drop-in paths and specs).
// When `true`:
//   - #hero-art renders the <picture> (AVIF + WebP, art-directed 9:16 for
//     mobile) as the full-bleed hero background.
//   - two media-scoped preload <link>s are emitted (16:9 >=768px / 9:16 <=767px).
// Flip to `false` only if the assets are removed again (fallback gradient +
// --mask-art-fallback wordmark take over, intentional not broken).
const HERO_CITYSCAPE_READY = true;

// PR4 ladder: widthless AVIF dupes were removed (design D5) — these point at
// the largest real rung (also the <link href> the browser fetches first).
const HERO_ART_16X9 = "/hero/cityscape-16x9-2560.avif";
const HERO_ART_9X16 = "/hero/cityscape-9x16-1920.avif";

// Wordmark fill (hero redesign, Option C): solid Vice gradient (gold ->
// magenta) instead of the cityscape text-fill. User report was "no se notan
// las letras" — solid light-on-dark reads clean with zero stroke/shadow
// (official GTA landing uses zero shadows; depth comes from color). Passed as
// --mask-art so .mask-base keeps the text-clip + --bg-zoom scroll-mask
// choreography; when the flag is off the .mask-base dusk-gradient fallback
// takes over.
const HERO_WORDMARK_GRADIENT =
  "linear-gradient(180deg, #ffd27b 0%, #df3a93 100%)";

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
  if (HERO_CITYSCAPE_READY) {
    // Media-scoped preloads: 16:9 srcset for desktop (>=768px), 9:16
    // art-directed crop for mobile. NOT next/image's preload prop (cannot
    // art-direct crops or carry a media attribute; the legacy prop it replaced
    // is deprecated in Next 16). Deliberate deviation — see ADR 0009.
    preload(HERO_ART_16X9, {
      as: "image",
      media: "(min-width: 768px)",
      // sizes=130vw (design D6, PR4): FHD (1920px x 1.3 = 2496px effective)
      // requests the new 2560w rung — full-res on Full HD instead of 2400w.
      imageSrcSet:
        "/hero/cityscape-16x9-640.avif 640w, /hero/cityscape-16x9-1280.avif 1280w, /hero/cityscape-16x9-1920.avif 1920w, /hero/cityscape-16x9-2400.avif 2400w, /hero/cityscape-16x9-2560.avif 2560w",
      imageSizes: "130vw",
      fetchPriority: "high",
    });
    preload(HERO_ART_9X16, {
      as: "image",
      media: "(max-width: 767px)",
      // Deviation G (PR4): 9:16 keeps sizes=100vw — at 130vw a DPR3 <=767px
      // phone would request 9x16-1920 (q78, ~825 KB) as LCP, breaking the
      // <=2.5s 4G budget; 100vw caps the common mobile LCP at 1280w.
      imageSrcSet:
        "/hero/cityscape-9x16-640.avif 640w, /hero/cityscape-9x16-1280.avif 1280w, /hero/cityscape-9x16-1920.avif 1920w",
      imageSizes: "100vw",
      fetchPriority: "high",
    });
  }

  return (
    <section
      id="hero"
      className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24 text-center"
    >
      <HeroScrollFx />

      {/* Art layer (z 0) — full-bleed cityscape background. */}
      <div id="hero-art" aria-hidden="true" className="hero-art">
        <div className="hero-ambient absolute inset-0" />
        {HERO_CITYSCAPE_READY ? (
          <picture>
            {/* Mobile 9:16 (art-directed portrait). sizes stays 100vw — deviation G. */}
            <source
              media="(max-width: 767px)"
              srcSet="/hero/cityscape-9x16-640.avif 640w, /hero/cityscape-9x16-1280.avif 1280w, /hero/cityscape-9x16-1920.avif 1920w"
              sizes="100vw"
              type="image/avif"
            />
            <source
              media="(max-width: 767px)"
              srcSet="/hero/cityscape-9x16-640.webp 640w, /hero/cityscape-9x16-1280.webp 1280w, /hero/cityscape-9x16-1920.webp 1920w"
              sizes="100vw"
              type="image/webp"
            />
            {/* Desktop 16:9 — sizes=130vw so FHD requests the 2560w rung. */}
            <source
              srcSet="/hero/cityscape-16x9-640.avif 640w, /hero/cityscape-16x9-1280.avif 1280w, /hero/cityscape-16x9-1920.avif 1920w, /hero/cityscape-16x9-2400.avif 2400w, /hero/cityscape-16x9-2560.avif 2560w"
              sizes="130vw"
              type="image/avif"
            />
            {/* WebP twin mirrors every served width (design D5 — no missing
                fallback rung on non-AVIF browsers). */}
            <source
              srcSet="/hero/cityscape-16x9-640.webp 640w, /hero/cityscape-16x9-1280.webp 1280w, /hero/cityscape-16x9-1920.webp 1920w, /hero/cityscape-16x9-2400.webp 2400w, /hero/cityscape-16x9-2560.webp 2560w"
              sizes="130vw"
              type="image/webp"
            />
            <img
              src="/hero/cityscape-16x9-1280.webp"
              alt=""
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </picture>
        ) : (
          <div className="hero-art-fallback absolute inset-0" />
        )}
      </div>

      {/* Legibility scrim (z 5) — static overlay behind the text block, above
          the art (z 0), below the title mask (z 10) / content (z 20). Keeps
          badge, wordmark and countdown readable over the bright cityscape
          without dimming it to flat. Always on — the GSAP .hero-wash is the
          separate scroll-driven layer. */}
      <div id="hero-scrim" aria-hidden="true" className="hero-scrim" />

      {/* Wash layer (z 30) — fades in during P2 (40-70% scroll). */}
      <div id="hero-wash" aria-hidden="true" className="hero-wash" />

      {/* Title block (z 10) — badge + gradient wordmark + tagline (Option C).
          Sizing: the previous clamp(5rem,22vw,15rem) drove "GTA 6" past the
          centered container and wrapped/clipped (height ≈ 1.3 lines). The
          viewport-relative clamp stays under the container width on every
          breakpoint and `whitespace-nowrap` hard-guarantees one line. The
          GSAP scroll-mask choreography (scale + --bg-zoom) targets this
          wrapper. */}
      <div id="hero-title-mask" className="relative z-10 mb-10">
        <span className="hero-badge">LA COMUNIDAD HISPANA DE GTA 6</span>
        <h1
          className="mask-base font-display text-[clamp(3.5rem,12vw,10rem)] uppercase leading-none tracking-tight whitespace-nowrap"
          style={
            HERO_CITYSCAPE_READY
              ? ({ "--mask-art": HERO_WORDMARK_GRADIENT } as React.CSSProperties)
              : undefined
          }
        >
          RADAR GTA
        </h1>
        <span className="hero-tagline">LA ESCENA SE ORGANIZA</span>
      </div>

      {/* Content layer (z 20) — countdown framing + CTAs. */}
      <div id="hero-content" className="relative z-20 flex flex-col items-center">
        <div
          id="hero-countdown"
          className="mb-12 flex flex-col items-center gap-3"
        >
          <span className="countdown-label">LANZAMIENTO GTA 6</span>
          <Countdown />
          <span className="date-line">19 NOV 2026</span>
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
      </div>

      {/* Scroll cue (z 20) — fades early (0.15-0.30) on scroll. */}
      <div id="hero-cue" className="hero-cue">
        <span className="hero-cue-line" aria-hidden="true" />
        <span className="sr-only">Scroll</span>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdEvent) }}
      />
    </section>
  );
}
