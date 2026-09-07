export const PLATFORMS = ["PS5", "XBOX_SERIES", "CROSSPLAY"] as const;
export const REGIONS = ["LATAM", "ESPANA", "INTERNACIONAL"] as const;
export const PLAYSTYLES = ["COMPETITIVO", "HEISTS_GOLPES", "CASUAL", "ROLEPLAY"] as const;

export type Platform = (typeof PLATFORMS)[number];
export type Region = (typeof REGIONS)[number];
export type Playstyle = (typeof PLAYSTYLES)[number];

export const PLATFORM_LABELS: Record<Platform, string> = {
  PS5: "PS5",
  XBOX_SERIES: "Xbox Series X|S",
  CROSSPLAY: "Crossplay",
};

export const REGION_LABELS: Record<Region, string> = {
  LATAM: "LatAm",
  ESPANA: "España",
  INTERNACIONAL: "Internacional",
};

export const PLAYSTYLE_LABELS: Record<Playstyle, string> = {
  COMPETITIVO: "Competitivo",
  HEISTS_GOLPES: "Golpes y Heists",
  CASUAL: "Casual",
  ROLEPLAY: "Roleplay",
};

export interface Crew {
  id: string;
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  logoUrl?: string;
  platform: Platform;
  region: Region;
  playstyle: Playstyle;
  discordUrl?: string;
  whatsappUrl?: string;
  memberCount: number;
  isVerified: boolean;
  isFeatured: boolean;
  createdAt: string;
}

export interface HardwareItem {
  key: string;
  name: string;
  category: string;
  description: string;
  priceHint?: string;
  amazonUrl: string;
  mlUrl: string;
}