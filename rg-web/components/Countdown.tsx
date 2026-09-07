"use client";

import { Fragment, useEffect, useSyncExternalStore, useState } from "react";
import { LAUNCH_DATE } from "@/lib/config";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(): TimeLeft | null {
  const diff = new Date(LAUNCH_DATE).getTime() - Date.now();
  if (diff <= 0) return null;
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

const CELLS = [
  { label: "DÍAS", key: "days" },
  { label: "HORAS", key: "hours" },
  { label: "MINUTOS", key: "minutes" },
  { label: "SEGUNDOS", key: "seconds" },
] as const;

function subscribeReducedMotion(onStoreChange: () => void): () => void {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot(): boolean {
  return false;
}

export default function Countdown() {
  const [ready, setReady] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  useEffect(() => {
    const update = () => {
      setTimeLeft(getTimeLeft());
      setReady(true);
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  if (ready && timeLeft === null) {
    return (
      <div className="flex flex-col items-center gap-3">
        <span className="font-display text-4xl uppercase tracking-wide text-neon-pink neon-glow-pink sm:text-6xl">
          ¡GTA 6 YA ESTÁ AQUÍ!
        </span>
        <span className="text-muted">Bienvenido a Leonida.</span>
      </div>
    );
  }

  const values: Record<(typeof CELLS)[number]["key"], string> = {
    days: timeLeft ? String(timeLeft.days).padStart(2, "0") : "00",
    hours: timeLeft ? String(timeLeft.hours).padStart(2, "0") : "00",
    minutes: timeLeft ? String(timeLeft.minutes).padStart(2, "0") : "00",
    seconds: timeLeft ? String(timeLeft.seconds).padStart(2, "0") : "00",
  };

  return (
    <div
      className="flex items-start justify-center gap-2 sm:gap-4"
      role="timer"
      aria-label="Cuenta regresiva para el lanzamiento de GTA 6"
    >
      {CELLS.map((cell, index) => (
        <Fragment key={cell.key}>
          {index > 0 ? (
            <span
              className={`count-sep ${reducedMotion || !ready ? "opacity-60" : ""}`}
              aria-hidden="true"
            >
              :
            </span>
          ) : null}
          <div className="count-cell">
            <span className={`count-digit ${!ready ? "opacity-40" : ""}`}>
              {values[cell.key]}
            </span>
            <span className="count-label">{cell.label}</span>
          </div>
        </Fragment>
      ))}
    </div>
  );
}