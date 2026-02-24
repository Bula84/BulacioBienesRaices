import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BC BienesRaíces – Propiedades, Emprendimientos y Servicios",
    template: "%s | BC BienesRaíces",
  },
  description:
    "Encuentra propiedades, emprendimientos y servicios profesionales en BC BienesRaíces. La plataforma inmobiliaria líder de Argentina.",
  keywords: [
    "bienes raices",
    "propiedades",
    "inmuebles",
    "emprendimientos",
    "alquiler",
    "venta",
    "argentina",
  ],
  authors: [{ name: "BC BienesRaíces" }],
  creator: "BC BienesRaíces",
  metadataBase: new URL("https://bcbienesraices.com"),
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://bcbienesraices.com",
    siteName: "BC BienesRaíces",
    title: "BC BienesRaíces – Propiedades, Emprendimientos y Servicios",
    description:
      "Encuentra propiedades, emprendimientos y servicios profesionales en BC BienesRaíces.",
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
  themeColor: "#0D9488",
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
        className={`${inter.variable} antialiased bg-[var(--bg-page)] text-[var(--text-main)] font-sans`}
      >
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen pt-20">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
