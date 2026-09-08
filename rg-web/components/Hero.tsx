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

// Wordmark fill (PR4 HUD, was hero redesign Option C): solid Vice gradient
// (gold -> magenta) instead of the cityscape text-fill. User report was "no se
// notan las letras" — solid light-on-dark reads clean with zero stroke/shadow
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

      {/* Art layer (z 0) — full-bleed cityscape background. The <picture>
          (AVIF/WebP) stays the base layer AND the LCP + the video poster;
          the background video overlays it (object-cover). Both live INSIDE
          #hero-art so the GSAP scroll-mask scale (1.3 -> 1.0) applies to the
          moving art (P1 lockstep). */}
      <div id="hero-art" aria-hidden="true" className="hero-art">
        <div className="hero-ambient absolute inset-0" />
        {HERO_CITYSCAPE_READY ? (
          <>
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

            {/* Hero background video (PR4, marketing verdict: video only in
                Hero for now — DiscordCTA later). Decorative overlay ON TOP of
                the picture still (object-cover). preload="none" + poster=AVIF
                (hero-16x9-poster.avif = frame 0 OF THE VIDEO — must match the
                first frame so there's no visual jump at start): the AVIF
                poster/ladder is still the LCP, the video loads after and never
                blocks LCP. muted autoplay + loop + playsInline (iOS). Under
                prefers-reduced-motion CSS hides .hero-video -> the still
                picture shows. aria-hidden + tabIndex={-1} (decorative, never
                focused). Sources per breakpoint: 16:9 desktop >=768px, 9:16
                mobile <=767px (720x1280, object-cover fills). */}
            <video
              className="hero-video"
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              poster="/hero/hero-16x9-poster.avif"
              aria-hidden="true"
              tabIndex={-1}
            >
              <source
                media="(min-width: 768px)"
                src="/hero/hero-16x9-loop.mp4"
                type="video/mp4"
              />
              <source
                media="(max-width: 767px)"
                src="/hero/hero-9x16.mp4"
                type="video/mp4"
              />
            </video>
          </>
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

      {/* Title block (z 10) — RADAR eyebrow + "GTA VI" wordmark (PR4 HUD).
          Single h1, Anton display; the viewport clamp + whitespace-nowrap keep
          it on one line at every breakpoint. The GSAP scroll-mask
          choreography (scale + --bg-zoom) targets this wrapper — unchanged. */}
      <div
        id="hero-title-mask"
        className="relative z-10 mb-10 flex flex-col items-center"
      >
        <span className="hero-eyebrow">RADAR</span>
        <h1
          className="mask-base font-display text-[clamp(4rem,14vw,12rem)] uppercase leading-none tracking-tight whitespace-nowrap"
          style={
            HERO_CITYSCAPE_READY
              ? ({ "--mask-art": HERO_WORDMARK_GRADIENT } as React.CSSProperties)
              : undefined
          }
        >
          GTA VI
        </h1>
      </div>

      {/* Content layer (z 20) — HUD telemetry panel + CTAs. All inside the
          unchanged #hero-content scrub target (P3 parallax-out);
          HeroScrollFx.tsx needed zero changes (design D1). */}
      <div
        id="hero-content"
        className="relative z-20 flex w-full flex-col items-center"
      >
        {/* Telemetry panel — the HUD focal point, dead-center. */}
        <div className="mb-4 flex w-full flex-col items-center">
          <div
            id="hero-countdown"
            className="hud-panel mx-auto"
          >
            <span className="hud-label">LANZAMIENTO GTA VI</span>
            <Countdown />
            <div className="hud-rows">
              <div className="hud-row">
                <span className="hud-key">FECHA</span>
                <span className="hud-value">19 NOV 2026</span>
              </div>
              <div className="hud-row">
                <span className="hud-key">UBICACIÓN</span>
                <span className="hud-value">LEONIDA // VICE CITY</span>
              </div>
            </div>
          </div>
        </div>

        {/* Belonging micro-status (marketing winner) — HUD label language
            (small caps, wide tracking, ▸ prefix), real sentence-case text +
            CSS uppercase (a11y reads the sentence). In-flow between the
            telemetry panel and the CTAs; centered, so it never collides with
            the radar dial (absolute bottom-right) or the CTA row. */}
        <p className="hud-status">▸ Tu crew ya se está formando aquí.</p>

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

      {/* Radar dial — decorative (aria-hidden, pointer-events none), zero
          runtime deps: plain CSS keyframes on the sweep group, NOT gated by
          the Track 1 @supports (spec WARNING). Original concentric rings +
          amber blips geometry, NOT a Rockstar minimap (ADR 0008).
          Reduced-motion freezes the sweep via .hero-radar-sweep.
          Position: absolute bottom-right corner of the hero (HUD minimap
          convention), below the content layer so it never blocks CTAs. */}
      <div
        id="hero-radar"
        aria-hidden="true"
        className="hero-radar pointer-events-none absolute bottom-2 right-2 z-[15] md:bottom-10 md:right-10"
      >
        <svg viewBox="0 0 200 200">
          <defs>
            <linearGradient id="radarSweepGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#00e5ff" stopOpacity="0" />
              <stop offset="100%" stopColor="#00e5ff" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          {/* Concentric rings (thin cyan strokes). */}
          <g fill="none" stroke="#00e5ff" strokeWidth="1">
            <circle cx="100" cy="100" r="88" strokeOpacity="0.6" />
            <circle cx="100" cy="100" r="60" strokeOpacity="0.35" />
            <circle cx="100" cy="100" r="32" strokeOpacity="0.25" />
          </g>
          {/* Crosshair hairlines. */}
          <g stroke="#00e5ff" strokeWidth="1" strokeOpacity="0.18">
            <line x1="100" y1="12" x2="100" y2="188" />
            <line x1="12" y1="100" x2="188" y2="100" />
          </g>
          {/* Rotating sweep (plain keyframes, 4s linear). */}
          <g className="hero-radar-sweep">
            <path
              d="M100 100 L100 12 A88 88 0 0 1 176.2 56 Z"
              fill="url(#radarSweepGrad)"
            />
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="12"
              stroke="#00e5ff"
              strokeWidth="1.25"
              strokeOpacity="0.9"
            />
          </g>
          {/* Amber blips (contacts). */}
          <g fill="#ffd27b">
            <circle cx="141" cy="66" r="3" />
            <circle cx="62" cy="148" r="2.5" />
            <circle cx="153" cy="142" r="2" fillOpacity="0.75" />
          </g>
          {/* Origin dot. */}
          <circle cx="100" cy="100" r="3" fill="#00e5ff" />
        </svg>
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
