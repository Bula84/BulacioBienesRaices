import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Antigravity Enterprise | Plataforma Inmobiliaria",
  description: "Transformamos la experiencia inmobiliaria con tecnología innovadora. Encuentra tu propiedad ideal con nuestro explorador inmersivo.",
  keywords: ["inmobiliaria", "propiedades", "venta", "alquiler", "casas", "departamentos", "Buenos Aires"],
  authors: [{ name: "Antigravity Enterprise" }],
  openGraph: {
    title: "Antigravity Enterprise | Plataforma Inmobiliaria",
    description: "Encuentra tu propiedad ideal con nuestro explorador inmersivo",
    type: "website",
    locale: "es_AR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.variable} antialiased`}>
        <Navbar />
        <main className="min-h-screen pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
