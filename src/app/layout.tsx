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
    default: "Bulacio Bienes Raíces – Propiedades, Emprendimientos y Servicios",
    template: "%s | Bulacio Bienes Raíces",
  },
  description:
    "Encuentra propiedades, emprendimientos y servicios profesionales en Bulacio Bienes Raíces. La plataforma inmobiliaria líder de Argentina.",
  keywords: [
    "bienes raices",
    "propiedades",
    "inmuebles",
    "emprendimientos",
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
    title: "Bulacio Bienes Raíces – Propiedades, Emprendimientos y Servicios",
    description:
      "Encuentra propiedades, emprendimientos y servicios profesionales en Bulacio Bienes Raíces.",
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
