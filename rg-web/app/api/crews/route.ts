import type { NextRequest } from "next/server";
import { CREWS_API_URL } from "@/lib/config";
import type { Platform, Playstyle, Region } from "@/lib/types";
import { PLATFORMS, PLAYSTYLES, REGIONS } from "@/lib/types";

export const runtime = "nodejs";

const TIMEOUT_MS = 4000;

function slugify(name: string): string {
  const slug = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "crew";
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

type CrewPayload = {
  name: string;
  tagline?: string;
  logoUrl?: string;
  platform: Platform;
  region: Region;
  playstyle: Playstyle;
  memberCount: number;
  discordUrl?: string;
  whatsappUrl?: string;
  slug: string;
};

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { ok: false, error: "JSON_INVALIDO" },
      { status: 400 },
    );
  }

  if (typeof body !== "object" || body === null) {
    return Response.json(
      { ok: false, error: "VALIDACION_FALLIDA", errors: { form: "Cuerpo inválido." } },
      { status: 400 },
    );
  }

  const raw = body as Record<string, unknown>;
  const errors: Record<string, string> = {};

  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  if (!name) {
    errors.name = "El nombre de la crew es obligatorio.";
  } else if (name.length < 3) {
    errors.name = "El nombre debe tener al menos 3 caracteres.";
  } else if (name.length > 80) {
    errors.name = "El nombre no puede superar los 80 caracteres.";
  }

  const tagline = typeof raw.tagline === "string" ? raw.tagline.trim() : "";
  if (tagline.length > 140) {
    errors.tagline = "El eslogan no puede superar los 140 caracteres.";
  }

  const logoUrl = typeof raw.logoUrl === "string" ? raw.logoUrl.trim() : "";
  if (logoUrl && !isHttpUrl(logoUrl)) {
    errors.logoUrl = "La URL del logo no es válida.";
  }

  if (!PLATFORMS.includes(raw.platform as Platform)) {
    errors.platform = "Plataforma inválida.";
  }
  if (!REGIONS.includes(raw.region as Region)) {
    errors.region = "Región inválida.";
  }
  if (!PLAYSTYLES.includes(raw.playstyle as Playstyle)) {
    errors.playstyle = "Estilo de juego inválido.";
  }

  const memberCount = Number(raw.memberCount);
  if (!Number.isInteger(memberCount) || memberCount < 1 || memberCount > 10000) {
    errors.memberCount = "El número de miembros debe estar entre 1 y 10000.";
  }

  const discordUrl = typeof raw.discordUrl === "string" ? raw.discordUrl.trim() : "";
  if (discordUrl && !isHttpUrl(discordUrl)) {
    errors.discordUrl = "La URL de Discord no es válida.";
  }

  const whatsappUrl = typeof raw.whatsappUrl === "string" ? raw.whatsappUrl.trim() : "";
  if (whatsappUrl && !isHttpUrl(whatsappUrl)) {
    errors.whatsappUrl = "La URL de WhatsApp no es válida.";
  }

  if (Object.keys(errors).length > 0) {
    return Response.json(
      { ok: false, error: "VALIDACION_FALLIDA", errors },
      { status: 400 },
    );
  }

  const payload: CrewPayload = {
    name,
    tagline: tagline || undefined,
    logoUrl: logoUrl || undefined,
    platform: raw.platform as Platform,
    region: raw.region as Region,
    playstyle: raw.playstyle as Playstyle,
    memberCount,
    discordUrl: discordUrl || undefined,
    whatsappUrl: whatsappUrl || undefined,
    slug: slugify(name),
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(CREWS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
      cache: "no-store",
    });

    if (!response.ok) {
      return Response.json(
        { ok: false, error: "SERVICIO_NO_DISPONIBLE" },
        { status: 503 },
      );
    }

    const crew = await response.json();
    return Response.json({ ok: true, crew }, { status: 201 });
  } catch {
    return Response.json(
      { ok: false, error: "SERVICIO_NO_DISPONIBLE" },
      { status: 503 },
    );
  } finally {
    clearTimeout(timeout);
  }
}