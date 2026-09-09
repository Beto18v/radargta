"use client";

import { useMemo, useState } from "react";
import CrewCard from "./CrewCard";
import CrewForm from "./CrewForm";
import SectionHeading from "./SectionHeading";
import type { Crew, Platform, Playstyle, Region } from "@/lib/types";
import {
  PLATFORM_LABELS,
  PLATFORMS,
  PLAYSTYLE_LABELS,
  PLAYSTYLES,
  REGION_LABELS,
  REGIONS,
} from "@/lib/types";

type Filter<T> = "ALL" | T;

export default function CrewGrid({ crews }: { crews: Crew[] }) {
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState<Filter<Platform>>("ALL");
  const [region, setRegion] = useState<Filter<Region>>("ALL");
  const [playstyle, setPlaystyle] = useState<Filter<Playstyle>>("ALL");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return crews.filter((crew) => {
      if (
        query &&
        !`${crew.name} ${crew.tagline ?? ""}`.toLowerCase().includes(query)
      ) {
        return false;
      }
      if (platform !== "ALL" && crew.platform !== platform) return false;
      if (region !== "ALL" && crew.region !== region) return false;
      if (playstyle !== "ALL" && crew.playstyle !== playstyle) return false;
      return true;
    });
  }, [crews, search, platform, region, playstyle]);

  return (
    <section id="crews" className="mx-auto w-full max-w-6xl px-6 py-24">
      <SectionHeading
        eyebrow="Comunidad"
        title="Crews en español"
        description="Encuentra tu equipo por plataforma, región y estilo de juego, o registra el tuyo para empezar a reclutar antes del lanzamiento."
      />

      <div className="glass-card mb-6 flex flex-col gap-4 p-5 md:flex-row md:items-end">
        <div className="flex-1">
          <label htmlFor="crew-search" className="mb-2 block text-sm font-semibold text-mist">
            Buscar
          </label>
          <input
            id="crew-search"
            type="search"
            className="input-field"
            placeholder="Buscar por nombre o eslogan..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="filter-platform" className="mb-2 block text-sm font-semibold text-mist">
            Plataforma
          </label>
          <select
            id="filter-platform"
            className="input-field md:w-44"
            value={platform}
            onChange={(event) => setPlatform(event.target.value as Filter<Platform>)}
          >
            <option value="ALL">Todas</option>
            {PLATFORMS.map((value) => (
              <option key={value} value={value}>
                {PLATFORM_LABELS[value]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="filter-region" className="mb-2 block text-sm font-semibold text-mist">
            Región
          </label>
          <select
            id="filter-region"
            className="input-field md:w-40"
            value={region}
            onChange={(event) => setRegion(event.target.value as Filter<Region>)}
          >
            <option value="ALL">Todas</option>
            {REGIONS.map((value) => (
              <option key={value} value={value}>
                {REGION_LABELS[value]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="filter-playstyle" className="mb-2 block text-sm font-semibold text-mist">
            Estilo
          </label>
          <select
            id="filter-playstyle"
            className="input-field md:w-44"
            value={playstyle}
            onChange={(event) => setPlaystyle(event.target.value as Filter<Playstyle>)}
          >
            <option value="ALL">Todos</option>
            {PLAYSTYLES.map((value) => (
              <option key={value} value={value}>
                {PLAYSTYLE_LABELS[value]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="mb-8 text-sm text-muted" aria-live="polite">
        Mostrando {filtered.length} de {crews.length} crews
      </p>

      {filtered.length > 0 ? (
        <div data-reveal className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((crew) => (
            <CrewCard key={crew.id} crew={crew} />
          ))}
        </div>
      ) : (
        <div className="glass-card flex flex-col items-center gap-4 p-12 text-center">
          <p className="text-muted">No hay crews con esos filtros.</p>
          <button type="button" className="btn-ghost" onClick={() => {
            setSearch("");
            setPlatform("ALL");
            setRegion("ALL");
            setPlaystyle("ALL");
          }}>
            Limpiar filtros
          </button>
        </div>
      )}

      <div className="mt-14 flex flex-col items-center gap-8">
        <a href="#crews-form" className="btn-primary">
          Registra tu crew
        </a>
        <div id="crews-form" className="w-full max-w-3xl scroll-mt-8">
          <CrewForm />
        </div>
      </div>
    </section>
  );
}
