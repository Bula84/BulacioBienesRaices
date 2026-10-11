import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Imágenes remotas que usa el sitio:
    //  - Unsplash: placeholders hasta que lleguen las fotos propias
    //  - Supabase Storage: el bucket `media` con las fotos de las propiedades
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.supabase.storage.in" },
    ],
  },
};

export default nextConfig;
