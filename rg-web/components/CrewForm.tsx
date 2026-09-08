"use client";

import { FormEvent, useState } from "react";
import {
  PLATFORM_LABELS,
  PLATFORMS,
  PLAYSTYLE_LABELS,
  PLAYSTYLES,
  REGION_LABELS,
  REGIONS,
} from "@/lib/types";

type FormState = {
  name: string;
  tagline: string;
  logoUrl: string;
  platform: string;
  region: string;
  playstyle: string;
  memberCount: string;
  discordUrl: string;
  whatsappUrl: string;
  website: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

type Status = "idle" | "submitting" | "success" | "serverError";

const INITIAL_FORM: FormState = {
  name: "",
  tagline: "",
  logoUrl: "",
  platform: "",
  region: "",
  playstyle: "",
  memberCount: "1",
  discordUrl: "",
  whatsappUrl: "",
  website: "",
};

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

export default function CrewForm() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [logoFailed, setLogoFailed] = useState(false);

  const setField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (values: FormState): FieldErrors => {
    const next: FieldErrors = {};

    const name = values.name.trim();
    if (!name) {
      next.name = "El nombre de la crew es obligatorio.";
    } else if (name.length < 3) {
      next.name = "El nombre debe tener al menos 3 caracteres.";
    }

    if (values.logoUrl.trim() && !isValidHttpUrl(values.logoUrl.trim())) {
      next.logoUrl = "Introduce una URL válida (https://...).";
    }
    if (values.discordUrl.trim() && !isValidHttpUrl(values.discordUrl.trim())) {
      next.discordUrl = "Introduce una URL válida de Discord.";
    }
    if (values.whatsappUrl.trim() && !isValidHttpUrl(values.whatsappUrl.trim())) {
      next.whatsappUrl = "Introduce una URL válida de WhatsApp.";
    }

    if (!values.platform) {
      next.platform = "Selecciona la plataforma.";
    }
    if (!values.region) {
      next.region = "Selecciona la región.";
    }
    if (!values.playstyle) {
      next.playstyle = "Selecciona el estilo de juego.";
    }

    const members = Number(values.memberCount);
    if (!Number.isInteger(members) || members < 1 || members > 10000) {
      next.memberCount = "El número de miembros debe estar entre 1 y 10000.";
    }

    return next;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (form.website) return;

    const nextErrors = validate(form);
    if (Object.values(nextErrors).some(Boolean)) {
      setErrors(nextErrors);
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch("/api/crews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          tagline: form.tagline.trim(),
          logoUrl: form.logoUrl.trim(),
          platform: form.platform,
          region: form.region,
          playstyle: form.playstyle,
          memberCount: Number(form.memberCount),
          discordUrl: form.discordUrl.trim(),
          whatsappUrl: form.whatsappUrl.trim(),
        }),
      });

      if (response.status === 201) {
        setStatus("success");
        return;
      }

      if (response.status === 400) {
        const data = (await response.json().catch(() => null)) as {
          errors?: FieldErrors;
        } | null;
        setErrors(data?.errors ?? {});
        setStatus("idle");
        return;
      }

      setStatus("serverError");
    } catch {
      setStatus("serverError");
    }
  };

  const showLogoPreview = form.logoUrl.trim() && isValidHttpUrl(form.logoUrl.trim()) && !logoFailed;

  if (status === "success") {
    return (
      <div className="glass-card flex flex-col items-center gap-4 border-neon-pink/40 p-10 text-center">
        <span className="font-display text-3xl text-neon-pink neon-glow-pink">
          ¡Crew registrado!
        </span>
        <p className="max-w-md text-muted">
          ¡Tu crew quedó registrado! Revisa tu enlace: podrás reclutar miembros
          en breve.
        </p>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => {
            setForm(INITIAL_FORM);
            setLogoFailed(false);
            setStatus("idle");
          }}
        >
          Registrar otra crew
        </button>
      </div>
    );
  }

  const inputErrorClass = (field: keyof FormState) =>
    errors[field] ? "border-neon-pink/60" : "";

  return (
    <div data-reveal className="glass-card p-6 sm:p-8">
      <form onSubmit={handleSubmit} noValidate>
        <div
          className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden"
          aria-hidden="true"
        >
          <label htmlFor="website">No rellenes este campo</label>
          <input
            type="text"
            id="website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(event) => setField("website", event.target.value)}
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-semibold text-mist"
            >
              Nombre de la crew <span className="text-neon-pink">*</span>
            </label>
            <input
              id="name"
              type="text"
              required
              aria-required="true"
              className={`input-field ${inputErrorClass("name")}`}
              placeholder="Ej: Vice City Latinos"
              maxLength={80}
              value={form.name}
              onChange={(event) => setField("name", event.target.value)}
            />
            {errors.name ? (
              <p className="mt-1 text-sm text-neon-pink">{errors.name}</p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="tagline"
              className="mb-2 block text-sm font-semibold text-mist"
            >
              Eslogan
            </label>
            <input
              id="tagline"
              type="text"
              className="input-field"
              placeholder="Ej: Los primeros en pisar Leonida"
              maxLength={140}
              value={form.tagline}
              onChange={(event) => setField("tagline", event.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="logoUrl"
              className="mb-2 block text-sm font-semibold text-mist"
            >
              URL del logo
            </label>
            <div className="flex items-center gap-3">
              <input
                id="logoUrl"
                type="url"
                className={`input-field ${inputErrorClass("logoUrl")}`}
                placeholder="https://..."
                value={form.logoUrl}
                onChange={(event) => {
                  setLogoFailed(false);
                  setField("logoUrl", event.target.value);
                }}
              />
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-neon-pink to-purple-deep font-display text-sm text-white"
                aria-hidden="true"
              >
                {showLogoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element -- external user logos with unknown dimensions; next/image would require remotePatterns config (overkill for MVP previews)
                  <img
                    src={form.logoUrl.trim()}
                    alt=""
                    className="h-full w-full object-cover"
                    onError={() => setLogoFailed(true)}
                  />
                ) : (
                  initials(form.name)
                )}
              </span>
            </div>
            {errors.logoUrl ? (
              <p className="mt-1 text-sm text-neon-pink">{errors.logoUrl}</p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="platform"
              className="mb-2 block text-sm font-semibold text-mist"
            >
              Plataforma <span className="text-neon-pink">*</span>
            </label>
            <select
              id="platform"
              required
              aria-required="true"
              className={`input-field ${inputErrorClass("platform")}`}
              value={form.platform}
              onChange={(event) => setField("platform", event.target.value)}
            >
              <option value="">Selecciona...</option>
              {PLATFORMS.map((platform) => (
                <option key={platform} value={platform}>
                  {PLATFORM_LABELS[platform]}
                </option>
              ))}
            </select>
            {errors.platform ? (
              <p className="mt-1 text-sm text-neon-pink">{errors.platform}</p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="region"
              className="mb-2 block text-sm font-semibold text-mist"
            >
              Región <span className="text-neon-pink">*</span>
            </label>
            <select
              id="region"
              required
              aria-required="true"
              className={`input-field ${inputErrorClass("region")}`}
              value={form.region}
              onChange={(event) => setField("region", event.target.value)}
            >
              <option value="">Selecciona...</option>
              {REGIONS.map((region) => (
                <option key={region} value={region}>
                  {REGION_LABELS[region]}
                </option>
              ))}
            </select>
            {errors.region ? (
              <p className="mt-1 text-sm text-neon-pink">{errors.region}</p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="playstyle"
              className="mb-2 block text-sm font-semibold text-mist"
            >
              Estilo de juego <span className="text-neon-pink">*</span>
            </label>
            <select
              id="playstyle"
              required
              aria-required="true"
              className={`input-field ${inputErrorClass("playstyle")}`}
              value={form.playstyle}
              onChange={(event) => setField("playstyle", event.target.value)}
            >
              <option value="">Selecciona...</option>
              {PLAYSTYLES.map((playstyle) => (
                <option key={playstyle} value={playstyle}>
                  {PLAYSTYLE_LABELS[playstyle]}
                </option>
              ))}
            </select>
            {errors.playstyle ? (
              <p className="mt-1 text-sm text-neon-pink">{errors.playstyle}</p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="memberCount"
              className="mb-2 block text-sm font-semibold text-mist"
            >
              Nº de miembros
            </label>
            <input
              id="memberCount"
              type="number"
              min={1}
              max={10000}
              className={`input-field ${inputErrorClass("memberCount")}`}
              value={form.memberCount}
              onChange={(event) => setField("memberCount", event.target.value)}
            />
            {errors.memberCount ? (
              <p className="mt-1 text-sm text-neon-pink">{errors.memberCount}</p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="discordUrl"
              className="mb-2 block text-sm font-semibold text-mist"
            >
              URL de Discord
            </label>
            <input
              id="discordUrl"
              type="url"
              className={`input-field ${inputErrorClass("discordUrl")}`}
              placeholder="https://discord.gg/..."
              value={form.discordUrl}
              onChange={(event) => setField("discordUrl", event.target.value)}
            />
            {errors.discordUrl ? (
              <p className="mt-1 text-sm text-neon-pink">{errors.discordUrl}</p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="whatsappUrl"
              className="mb-2 block text-sm font-semibold text-mist"
            >
              URL de WhatsApp
            </label>
            <input
              id="whatsappUrl"
              type="url"
              className={`input-field ${inputErrorClass("whatsappUrl")}`}
              placeholder="https://chat.whatsapp.com/..."
              value={form.whatsappUrl}
              onChange={(event) => setField("whatsappUrl", event.target.value)}
            />
            {errors.whatsappUrl ? (
              <p className="mt-1 text-sm text-neon-pink">{errors.whatsappUrl}</p>
            ) : null}
          </div>
        </div>

        {status === "serverError" ? (
          <p className="mt-5 rounded-lg border border-sunset/40 bg-sunset/10 p-3 text-sm text-sunset">
            El servicio de registro no está disponible ahora. Inténtalo más
            tarde.
          </p>
        ) : null}

        <button
          type="submit"
          className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-60"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Registrando..." : "Registrar mi crew"}
        </button>
      </form>
    </div>
  );
}
