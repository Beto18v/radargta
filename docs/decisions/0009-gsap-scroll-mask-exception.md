# ADR 0009 — GSAP/ScrollTrigger/Lenis exception for the hero scroll mask

- **Status:** Accepted
- **Date:** 2026-09-07
- **Amends:** [ADR 0002](0002-frontend-stack-fase1.md)

## Context

- ADR 0002 established **zero runtime dependencies in Fase 1** (`next`, `react`, `react-dom` only) and explicitly anticipated this change: *"Fase 2 will add GSAP/ScrollTrigger/Lenis for the Rockstar-style scroll mask."*
- The vice-landing-overhaul change implements that Fase 2 centerpiece: a scroll-scrubbed hero mask (wordmark as a window onto the cityscape art) with a multi-phase choreography (mask overfill → lockstep counter-zoom → wash → headline parallax-out).
- Pure CSS scroll-driven animations (`view()`/`scroll()` timelines, ~87–90% browser support in 2026) are sufficient for section reveals, parallax, and gradient sweeps — and ship zero-dep (Track 1). They are NOT sufficient for the signature hero moment: CSS cannot reproduce Lenis inertia or a scrubbed, easing-controlled multi-phase timeline with the fidelity the GTA VI recipe requires.
- The runtime cost is bounded: GSAP + ScrollTrigger + Lenis ≈ 20 KB gzip, isolated to ONE client component (`HeroScrollFx`), lazy-coupled to nothing above the fold.

## Decision

- Amend ADR 0002: allow `gsap`, `gsap/ScrollTrigger`, and `lenis` as runtime dependencies for the hero scroll mask, **scoped to a single client component `HeroScrollFx`**.
- GSAP/Lenis MUST NOT be used anywhere else in `rg-web`; all other page motion stays on the zero-dep CSS track (`@supports`-guarded utilities in `app/globals.css`).
- The component MUST:
  - Use `gsap.context()` scoped to `#hero` with revert cleanup (React 19 StrictMode double-mount safe).
  - Bail out entirely under `prefers-reduced-motion: reduce` (static final state, native scroll, Lenis NOT initialized).
  - Initialize Lenis with `anchors: true` and keep native keyboard scroll, focus, and the visible scrollbar (no focus trap).
  - Tween the mask via CSS variable `--bg-zoom` (text-clip mechanism, see design D2) in lockstep with the art transform.
- The hero art is loaded with a raw `<picture>` + `ReactDOM.preload` (media-scoped), NOT `next/image`'s `preload` prop: `priority` is deprecated in Next 16 and the `preload` prop cannot art-direct crops or carry a `media` attribute.

## Consequences

- **Positive:** the cinematic scroll-mask centerpiece ships with the exact GTA VI recipe; Track 1 CSS motion still covers every other page effect zero-dep.
- **Cost:** ~20 KB gzip of runtime JS on the landing; a wheel-interception dependency (Lenis) that requires the a11y mitigations above; `rg-web` loses its zero-dependency purity (documented, bounded exception).
- **Rollback:** revert this ADR + delete `HeroScrollFx` + remove the three deps → zero-dep policy restored; Track 1 CSS motion remains functional in all browsers regardless.
- **Risk:** if the review budget or perf budget rejects Track 2, the hero degrades gracefully to its static final state (no-JS/reduced-motion/unsupported scenarios already render that state by default).
