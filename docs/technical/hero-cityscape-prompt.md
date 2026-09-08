# Hero Cityscape — Generation Prompt (vice-landing-overhaul PR2)

Status: **pending user generation** (no image-generation tool available to the
apply executor). This file is the exact prompt contract for the asset; the
technical doc records provenance once generated (tool/model/date/prompt/seed/post).

## Target files (drop-in paths)

Generated files land in `rg-web/public/hero/` and are served at `/hero/...`:

| File | Spec |
|---|---|
| `cityscape-16x9.avif` | 16:9, min 2400×1350, AVIF q70, 150–350 KB |
| `cityscape-16x9-640.avif` / `-1280.avif` / `-1920.avif` / `-2400.avif` | srcset widths (640/1280/1920/2400w), same 16:9 generation |
| `cityscape-16x9-1280.webp` / `-2400.webp` | WebP fallback (older browsers) |
| `cityscape-9x16.avif` + `-640/-1280/-1920.avif` | **art-directed crop** of the SAME 16:9 generation (skyline consistency), 1080×1920 for mobile |
| `cityscape-9x16-640.webp` / `-1280.webp` / `-1920.webp` | WebP fallback for the 9:16 crop |

Integration gate in code: `rg-web/components/Hero.tsx` → `HERO_CITYSCAPE_READY`
flips from `false` to `true` once the files above exist (and the `<picture>`
sources / `--mask-art` / media-scoped `ReactDOM.preload` activate).

## Recommended tool

- **Primary:** Gemini 2.5 Flash Image ("Nano Banana") — strong at text-free
  neon dusk scenes, fast, cheap; regenerate until the skyline reads as
  original (no Rockstar/Take-Two likeness).
- **Fallback:** Midjourney v7 (same prompt + negative; use `--ar 16:9`, `--v 7`).

## Prompt (English — paste to the model verbatim)

> Cinematic wide establishing shot of an original neon-drenched coastal
> metropolis at dusk, inspired by 1980s Miami art-deco architecture. Dense
> downtown skyline with palm trees lining a bayfront boulevard, wet asphalt
> reflecting neon signage. The sun has just set: deep purple-blue twilight sky
> with a warm amber glow on the horizon. Dominant colors: hot pink
> (#ff2fb3), cyan (#00e5ff), warm sunset amber (#ffd27b), deep near-black
> purple void (#0a0910). Slight atmospheric haze, volumetric light, film
> grain. Vertical composition friendly: the skyline should read strongly in
> both a 16:9 landscape crop and a 9:16 portrait crop (tall buildings toward
> the center, sky above, reflections below). Photorealistic but stylized,
> high detail, no lens distortion, no text, no watermark, no border.

## Negative prompt (verbatim)

> No text, no letters, no logos, no watermarks, no signatures, no borders, no
> frames. NOT Grand Theft Auto, NOT Vice City, no Rockstar Games or Take-Two
> trademarks, no official game characters, no GTA artwork, no game UI, no HUD
> elements, no cars with game logos, no parodies of official posters. No
> people faces, no gore, no violence. No motion blur, no camera distortion,
> no oversaturation.

## On-screen text note

The hero art itself MUST be **text-free**: the "GTA 6" wordmark is applied by
CSS (`background-clip: text` mask over the art) in `rg-web/components/Hero.tsx`,
and the landing copy is Spanish (ADR 0007 — no extraction). Do not ask the
model to render any on-screen text.

## Post-processing (once generated)

1. Art-directed 9:16 crop from the SAME 16:9 generation (skyline consistency) — center-weighted, keep the vertical skyline.
2. Encode with sharp (build-time dev step via `npx`, NOT a runtime dep):
   - AVIF q70 at 640 / 1280 / 1920 / 2400w (16:9) and 640 / 1280 / 1920w (9:16).
   - WebP fallback at 1280 / 2400w (16:9) and 640 / 1280 / 1920w (9:16).
3. Verify each AVIF is 150–350 KB; re-encode if outside range.
4. Record provenance row in `docs/technical/frontend-rg-web.md` (tool, model+version, date, full prompt, negative prompt, seed, post).