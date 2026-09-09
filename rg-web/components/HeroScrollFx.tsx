"use client";

import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

// Register once at module scope (GSAP 3.x recommended pattern; avoids
// duplicate registrations under React 19 StrictMode double-mounting).
gsap.registerPlugin(ScrollTrigger);

/**
 * Track 2 (ADR 0009) — the ONLY consumer of gsap/lenis in rg-web.
 *
 * Scrubs the hero mask choreography (design D2) against scroll:
 *   p 0.0       P0  mask + art overfill (scale 1.3), no motion until scroll
 *   p 0.0-0.4   P1  mask + art lockstep 1.3 -> 1.0 (text-clip --bg-zoom + transform)
 *   p 0.4-0.7   P2  wash autoAlpha 0 -> 1, headline autoAlpha 0 + rise
 *   p 0.7-1.0   P3  hero content parallax-out (y +80 + fade); cue fades 0.15-0.30
 *
 * - gsap.context("#hero") + revert => StrictMode-safe cleanup, no duplicate tweens.
 * - prefers-reduced-motion => bail out entirely (static final state, native scroll).
 * - Lenis anchors:true => #crews / #crews-form / #hardware anchor links keep working.
 */
export default function HeroScrollFx() {
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return; // static final state, native scroll — no GSAP, no Lenis
    }

    const lenis = new Lenis({ lerp: 0.1, anchors: true });
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis from GSAP's ticker so both share one time base (no jitter).
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context((self) => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          // Use the scoped element itself (self.scope = "#hero"), NOT the
          // selector "#hero" — inside a context that selector would resolve
          // as "#hero inside #hero" (not found → "Element not found" warning).
          trigger: self.scope,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // P1 (0 -> 0.4): mask + art overfill 1.15 -> 1.0 in lockstep.
      // --bg-zoom (text-clip background size) tweened in sync with transform.
      // Overfill lowered from 1.3 -> 1.15 (user feedback: hero looked too
      // zoomed-in at P0; 1.15 keeps the scroll-mask motion without the
      // excessive close-up).
      tl.fromTo(
        "#hero-title-mask",
        { scale: 1.15 },
        { scale: 1, duration: 0.4 },
        0,
      )
        .fromTo(
          "#hero-title-mask",
          { "--bg-zoom": "115%" },
          { "--bg-zoom": "100%", duration: 0.4 },
          0,
        )
        .fromTo("#hero-art", { scale: 1.15 }, { scale: 1, duration: 0.4 }, 0);

      // P2 (0.4 -> 0.7): wash fades in; headline fades out + rises.
      tl.fromTo(
        "#hero-wash",
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.3 },
        0.4,
      ).fromTo(
        "#hero-title-mask",
        { autoAlpha: 1, y: 0 },
        { autoAlpha: 0, y: -40, duration: 0.3 },
        0.4,
      );

      // P3 (0.7 -> 1.0): hero content parallax-out.
      tl.fromTo(
        "#hero-content",
        { autoAlpha: 1, y: 0 },
        { autoAlpha: 0, y: 80, duration: 0.3 },
        0.7,
      );

      // Scroll cue fades early (0.15 -> 0.30).
      tl.fromTo(
        "#hero-cue",
        { autoAlpha: 1 },
        { autoAlpha: 0, duration: 0.15 },
        0.15,
      );
    }, "#hero");

    return () => {
      ctx.revert();
      lenis.destroy();
      gsap.ticker.remove(tick);
    };
  }, []);

  return null;
}
