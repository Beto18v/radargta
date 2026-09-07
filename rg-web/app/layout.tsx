import type { Metadata, Viewport } from "next";
import { Anton, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Radar GTA — GTA 6 en Español | Comunidad, Crews y Cuenta Regresiva",
    template: "%s | Radar GTA",
  },
  description:
    "La comunidad GTA 6 en español. Cuenta regresiva al lanzamiento, directorio de crews por plataforma y región, guía de hardware y Discord para reclutar a tu equipo.",
  keywords: [
    "GTA 6",
    "Grand Theft Auto 6",
    "GTA 6 en español",
    "cuenta regresiva GTA 6",
    "fecha de lanzamiento GTA 6",
    "crews GTA 6",
    "comunidad GTA 6",
    "Vice City",
    "Leonida",
  ],
  openGraph: {
    title: "Radar GTA — GTA 6 en Español",
    description:
      "Comunidad, crews y cuenta regresiva al lanzamiento de GTA 6. Únete al Discord y prepárate para Vice City.",
    type: "website",
    locale: "es_ES",
    siteName: "Radar GTA",
  },
  twitter: {
    card: "summary",
    title: "Radar GTA — GTA 6 en Español",
    description:
      "Comunidad, crews y cuenta regresiva al lanzamiento de GTA 6. Únete al Discord y prepárate para Vice City.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0910",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${anton.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}