import { SITE_NAME, SITE_TAGLINE } from "@/lib/config";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 py-10">
      <div
        data-reveal
        className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-6 text-center"
      >
        <div className="font-display text-2xl uppercase tracking-wide text-mist">
          Radar<span className="text-vice-gradient"> GTA</span>
        </div>
        <p className="text-sm text-muted">{SITE_TAGLINE}</p>
        <p className="max-w-xl text-xs text-muted/70">
          Proyecto fan sin afiliación con Rockstar Games / Take-Two
          Interactive. Grand Theft Auto y Vice City son marcas de sus
          respectivos propietarios.
        </p>
        <p className="text-xs text-muted/50">
          © {year} {SITE_NAME}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
