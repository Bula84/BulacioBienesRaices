// Supabase Edge Function — Agente IA inmobiliario (Gemini)
// Deploy: npx supabase functions deploy property-agent
//
// Secretos requeridos:
//   supabase secrets set GEMINI_API_KEY=...        (obligatorio)
//   supabase secrets set GEMINI_MODEL=...          (opcional, default gemini-2.5-flash)

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GEMINI_MODEL = Deno.env.get("GEMINI_MODEL") ?? "gemini-2.5-flash";
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}

interface AgentRequest {
  conversation_id?: string | null;
  property_id?: string;
  message: string;
  history?: ChatMsg[];
}

interface PropertyRow {
  id: string;
  title: string;
  description?: string;
  full_description?: string;
  price: number;
  operation: string;
  type: string;
  m2?: number;
  m2_covered?: number;
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  address?: string;
  neighborhood?: string;
  city?: string;
  expensas?: number;
  requisitos?: string;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

function buildSystemPrompt(p: PropertyRow): string {
  const parts = [
    "Sos el asistente virtual de Bulacio Bienes Raíces, una inmobiliaria argentina.",
    "Tu objetivo es responder consultas sobre la propiedad indicada y calificar al interesado.",
    "Reglas:",
    "- Respondé siempre en español rioplatense, breve y con buena onda.",
    "- No inventes datos que no estén en el resumen de la propiedad. Si no figura, decí que lo confirmás con el corredor.",
    "- Los precios están en dólares estadounidenses (USD).",
    "- No des consejos legales ni impositivos.",
    "- Si el interesado lo pide o muestra intención clara de comprar/alquilar, pedile nombre, teléfono y email.",
    "- Máximo 5 líneas por respuesta, salvo que te pidan detalle.",
    "",
    "PROPIEDAD ACTUAL:",
    `- Título: ${p.title}`,
    `- Operación: ${p.operation}`,
    `- Tipo: ${p.type}`,
    `- Precio: USD ${p.price}`,
    p.m2 ? `- Superficie: ${p.m2} m²${p.m2_covered ? ` (${p.m2_covered} m² cubiertos)` : ""}` : "",
    p.bedrooms ? `- Ambientes/Dormitorios: ${p.bedrooms}` : "",
    p.bathrooms ? `- Baños: ${p.bathrooms}` : "",
    p.parking ? `- Cocheras: ${p.parking}` : "",
    p.address ? `- Dirección: ${p.address}` : "",
    p.neighborhood ? `- Barrio: ${p.neighborhood}` : "",
    p.city ? `- Ciudad: ${p.city}` : "",
    p.expensas ? `- Expensas: $${p.expensas}/mes` : "",
    p.requisitos ? `- Requisitos: ${p.requisitos}` : "",
    p.description ? `- Descripción: ${p.description}` : "",
  ].filter(Boolean);
  return parts.join("\n");
}

async function callGemini(systemPrompt: string, history: ChatMsg[], message: string) {
  if (!GEMINI_API_KEY) return null;

  const contents = [...(history ?? []), { role: "user", content: message }]
    .slice(-16)
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: { temperature: 0.6, maxOutputTokens: 600 },
      }),
    },
  );

  if (!res.ok) {
    console.error("Gemini error:", res.status, await res.text());
    return null;
  }

  const data = await res.json();
  const text: string | undefined = data?.candidates?.[0]?.content?.parts
    ?.map((p: { text?: string }) => p.text ?? "")
    .join("");
  return text?.trim() || null;
}

function localFallback(message: string, p: PropertyRow): string {
  const m = message.toLowerCase();
  if (m.includes("precio") || m.includes("valor") || m.includes("cuanto")) {
    return `El valor de ${p.title} es USD ${p.price.toLocaleString("es-AR")}.${p.expensas ? ` Expensas: $${p.expensas.toLocaleString("es-AR")}/mes.` : ""}`;
  }
  if (m.includes("visita") || m.includes("ver") || m.includes("agenda")) {
    return "¡Perfecto! Para coordinar la visita dejame tu nombre, teléfono y email, y un corredor te contacta a la brevedad.";
  }
  if (m.includes("expensa")) {
    return p.expensas
      ? `Las expensas son de $${p.expensas.toLocaleString("es-AR")}/mes.`
      : "Las expensas no están publicadas; te confirmo con el corredor.";
  }
  if (m.includes("ubicaci") || m.includes("donde") || m.includes("dónde")) {
    return `La propiedad está en ${[p.address, p.neighborhood, p.city].filter(Boolean).join(", ") || "ubicación a confirmar"}.`;
  }
  return "Puedo ayudarte con precio y expensas, requisitos, ubicación, características o coordinar una visita. ¿Qué te gustaría saber?";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body: AgentRequest = await req.json();
    const { conversation_id, property_id, message, history } = body;

    if (!property_id || !message) {
      return json({ error: "Faltan property_id o message" }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: property } = await supabase
      .from("propiedades")
      .select("*")
      .eq("id", property_id)
      .single();

    if (!property) {
      return json({ reply: "No encontré esa propiedad. ¿Podés recargar la página?" });
    }

    const systemPrompt = buildSystemPrompt(property as PropertyRow);
    let reply = await callGemini(systemPrompt, history ?? [], message);

    if (!reply) {
      reply = localFallback(message, property as PropertyRow);
    }

    // Persistir el mensaje del usuario en la conversación
    if (conversation_id) {
      const { data: conv } = await supabase
        .from("chat_conversations")
        .select("messages")
        .eq("id", conversation_id)
        .single();

      const existing: ChatMsg[] = Array.isArray(conv?.messages) ? conv.messages : [];
      const next = [
        ...existing,
        { role: "user", content: message },
        { role: "assistant", content: reply },
      ].slice(-40);

      await supabase
        .from("chat_conversations")
        .update({ messages: next, updated_at: new Date().toISOString() })
        .eq("id", conversation_id);
    }

    const low = `${message} ${reply}`.toLowerCase();
    const qualified =
      /\d{6,}/.test(low) ||
      /@/.test(low) ||
      low.includes("quiero verlo") ||
      low.includes("me interesa");
    const visitScheduled =
      low.includes("visita") &&
      (low.includes("coordin") || low.includes("agen") || low.includes("cuando puedo"));

    return json({ reply, qualified, visitScheduled });
  } catch (e) {
    console.error("property-agent error:", e);
    return json({ error: "Error interno del agente" }, 500);
  }
});
