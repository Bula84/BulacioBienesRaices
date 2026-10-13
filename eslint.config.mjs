import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Supabase Edge Functions corren en Deno, no en Node/Next.
    // Se despliegan con `supabase functions deploy` y quedan fuera
    // del build; aplicarles reglas de Next.js da falsos positivos.
    "supabase/functions/**",
  ]),
]);

export default eslintConfig;
