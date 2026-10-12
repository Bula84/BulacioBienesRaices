import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";
import { SocialRail } from "@/components/SocialBand";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Serif editorial para display/títulos — "quiet luxury"
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "Bulacio Bienes Raíces – Propiedades, Tasaciones y Fondos de Comercio",
    template: "%s | Bulacio Bienes Raíces",
  },
  description:
    "Encontrá propiedades en venta y alquiler, tasaciones profesionales, fondos de comercio y gestión legal de cobranza de mora en Bulacio Bienes Raíces.",
  keywords: [
    "bienes raices",
    "propiedades",
    "inmuebles",
    "tasaciones",
    "fondos de comercio",
    "gestion legal",
    "cobranza de mora",
    "alquiler",
    "venta",
    "argentina",
  ],
  authors: [{ name: "Bulacio Bienes Raíces" }],
  creator: "Bulacio Bienes Raíces",
  metadataBase: new URL("https://bulaciobienesraices.com"),
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://bulaciobienesraices.com",
    siteName: "Bulacio Bienes Raíces",
    title: "Bulacio Bienes Raíces – Propiedades, Tasaciones y Fondos de Comercio",
    description:
      "Propiedades en venta y alquiler, tasaciones, fondos de comercio y gestión legal de cobranza de mora.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#0b1f3a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        {/* Security meta tags */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-[var(--bg-page)] text-[var(--text-main)] font-sans`}
      >
        <AuthProvider>
          <Analytics />
          <Navbar />
          <SocialRail />
          <main className="min-h-screen pt-20">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
