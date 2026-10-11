// Supabase Edge Function — Gestión Legal (asistente + derivación de casos)
// Deploy: npx supabase functions deploy gestion-legal
//
// Secretos requeridos:
//   supabase secrets set GEMINI_API_KEY=...      (asistente IA)
//   supabase secrets set RESEND_API_KEY=...      (notificación al asesor, opcional)
//   supabase secrets set LEGAL_NOTIFY_TO=...     (email del asesor)
//   supabase secrets set LEGAL_NOTIFY_FROM=...   (opcional, default onboarding@resend.dev)
//   supabase secrets set GEMINI_MODEL=...        (opcional)

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GEMINI_MODEL = Deno.env.get("GEMINI_MODEL") ?? "gemini-2.5-flash";
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const NOTIFY_TO = Deno.env.get("LEGAL_NOTIFY_TO");
const NOTIFY_FROM = Deno.env.get("LEGAL_NOTIFY_FROM") ?? "onboarding@resend.dev";

interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}

interface LegalCase {
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  contact_role?: string;
  debtor_name?: string;
  contract_type?: string;
  amount?: number | null;
  days_overdue?: number | null;
  stage?: string;
  details?: string;
}

interface LegalRequest {
  action: "chat" | "submit";
  message?: string;
  history?: ChatMsg[];
  caso?: LegalCase;
  resumen?: string;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const SYSTEM_PROMPT = `Sos el asistente de captación de **Gestión Legal**, la unidad de cobranza de mora de Bulacio Bienes Raíces.

Tu trabajo: calificar el caso de forma amable y breve, y armar un resumen ejecutivo para el asesor humano.

SERVICIOS QUE OFRECEMOS:
1. Cobranza extrajudicial — notificaciones, mediación y acuerdo de pago antes de litigar.
2. Cobranza judicial — ejecución de instrumentos, desalojo por falta de pago y cobro de deudas.
3. Asesoramiento jurídico — contratos, garantías, revisión documental y prevención de morosidad.

CÓMO DEBES CONVERSAR:
- Español rioplatense, tono profesional pero cercano. Máximo 5 líneas por respuesta.
- Hacé UNA pregunta por vez. Orden sugerido:
  1) Quién consulta y su rol (propietario / inmobiliaria / administración)
  2) Tipo de contrato (alquiler, expensas, servicios, fondo de comercio)
  3) Nombre del deudor
  4) Monto adeudado y cuántos días de mora lleva
  5) Si ya hubo intentos de cobro o está iniciado un juicio
  6) Nombre, email y teléfono de quien consulta
- No des consejos legales ni prometas plazos, montos ni resultados.
- Aclará cuando corresponda que el asesor humano hace la evaluación final.
- Nunca inventes datos.

CUANDO TENGAS LOS DATOS CLAVE (nombre, contacto, deudor, monto, días de mora):
- Respondé con un cierre corto confirmando que el asesor recibe el caso,
  y finalizá tu última respuesta con la línea exacta: [RESUMEN]
  seguida de un resumen en formato:
  Contacto: ... | Rol: ... | Deudor: ... | Contrato: ... | Monto: ... | Días de mora: ... | Etapa: ... | Detalle: ...`;

async function callGemini(history: ChatMsg[], message: string): Promise<string | null> {
  if (!GEMINI_API_KEY) return null;

  const contents = [...(history ?? []), { role: "user" as const, content: message }]
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
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: { temperature: 0.5, maxOutputTokens: 700 },
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

function localGreeting(): string {
  return [
    "Hola 👋 Soy el asistente de **Gestión Legal** de Bulacio Bienes Raíces.",
    "",
    "Trabajamos con cobranza de mora en instancia extrajudicial y judicial, más asesoramiento jurídico.",
    "",
    "Para derivarte con un asesor, contame: ¿quién consulta (propietario, inmobiliaria o administración)?",
  ].join("\n");
}

async function sendNotification(caso: LegalCase, resumen: string) {
  if (!RESEND_API_KEY || !NOTIFY_TO) return false;

  const fila = [
    ["Contacto", caso.contact_name],
    ["Email", caso.contact_email],
    ["Teléfono", caso.contact_phone ?? "—"],
    ["Rol", caso.contact_role ?? "—"],
    ["Deudor", caso.debtor_name ?? "—"],
    ["Contrato", caso.contract_type ?? "—"],
    ["Monto", caso.amount != null ? `USD ${caso.amount}` : "—"],
    ["Días de mora", caso.days_overdue != null ? String(caso.days_overdue) : "—"],
    ["Etapa", caso.stage ?? "—"],
    ["Detalle", caso.details ?? "—"],
  ]
    .map(([k, v]) => `<tr><td style="padding:6px 12px;color:#64748b;font-weight:600">${k}</td><td style="padding:6px 12px">${v ?? "—"}</td></tr>`)
    .join("");

  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:640px;margin:auto">
      <h2 style="color:#0f766e">Nuevo caso de Gestión Legal</h2>
      <p>Se recibió una consulta desde el sitio web y el asistente derivó el caso.</p>
      <table style="width:100%;border-collapse:collapse;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px">
        ${fila}
      </table>
      ${resumen ? `<h3 style="color:#334155;margin-top:24px">Resumen del asistente</h3><p style="white-space:pre-wrap;background:#f1f5f9;padding:12px;border-radius:8px">${resumen}</p>` : ""}
      <p style="color:#94a3b8;font-size:12px;margin-top:24px">Bulacio Bienes Raíces — Gestión Legal</p>
    </div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: NOTIFY_FROM,
        to: [NOTIFY_TO],
        reply_to: caso.contact_email,
        subject: `Nuevo caso de cobranza — ${caso.debtor_name ?? caso.contact_name}`,
        html,
      }),
    });
    if (!res.ok) {
      console.error("Resend error:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (e) {
    console.error("Resend exception:", e);
    return false;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body: LegalRequest = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // ---------- ACCIÓN: CHAT DEL ASISTENTE ----------
    if (body.action === "chat") {
      const message = body.message?.trim();
      if (!message) return json({ error: "Falta el mensaje" }, 400);

      let reply = await callGemini(body.history ?? [], message);
      if (!reply) reply = localGreeting();

      // ¿El asistente marcó que ya tiene el resumen?
      const tieneResumen = reply.includes("[RESUMEN]");
      const resumen = tieneResumen
        ? reply.split("[RESUMEN]").slice(1).join("[RESUMEN]").trim()
        : "";
      if (tieneResumen) reply = reply.split("[RESUMEN]")[0].trim();

      return json({ reply, resumen: resumen || null });
    }

    // ---------- ACCIÓN: DERIVAR CASO ----------
    if (body.action === "submit") {
      const caso = body.caso;
      if (!caso?.contact_name || !caso?.contact_email) {
        return json({ error: "Faltan datos de contacto" }, 400);
      }

      const { data, error } = await supabase
        .from("legal_cases")
        .insert({
          contact_name: caso.contact_name,
          contact_email: caso.contact_email,
          contact_phone: caso.contact_phone ?? null,
          contact_role: caso.contact_role ?? null,
          debtor_name: caso.debtor_name ?? null,
          contract_type: caso.contract_type ?? null,
          amount: caso.amount ?? null,
          days_overdue: caso.days_overdue ?? null,
          stage: caso.stage ?? "sin_determinar",
          details: caso.details ?? null,
          ai_summary: body.resumen ?? null,
          status: "nuevo",
        })
        .select("id")
        .single();

      if (error) {
        console.error("Error guardando legal_case:", error);
        return json({ error: "No se pudo guardar el caso" }, 500);
      }

      const notified = await sendNotification(caso, body.resumen ?? "");

      await supabase
        .from("legal_cases")
        .update({ notified_at: notified ? new Date().toISOString() : null })
        .eq("id", data.id);

      return json({ ok: true, id: data.id, notified });
    }

    return json({ error: "Acción desconocida" }, 400);
  } catch (e) {
    console.error("gestion-legal error:", e);
    return json({ error: "Error interno" }, 500);
  }
});
