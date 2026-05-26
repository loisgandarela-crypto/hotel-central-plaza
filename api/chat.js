/* ===================================================================
   OPCIÓN A — Función serverless para Vercel
   Asistente con IA real (Claude) para Hotel Central Plaza.
   -------------------------------------------------------------------
   La API key NUNCA va en el navegador: vive aquí, como variable de
   entorno ANTHROPIC_API_KEY en el panel de Vercel.
   Ruta pública resultante:  /api/chat
   -------------------------------------------------------------------
   NOTA: si usas Vercel, en script.js cambia LIVE_ENDPOINT a "/api/chat".
   =================================================================== */

// Prompt de sistema: aquí viven TODOS los datos del hotel.
const SYSTEM_PROMPT = `
Eres el asistente virtual de "Hotel Central Plaza", un motel para parejas en
Ecatepec de Morelos, Estado de México. Respondes SIEMPRE en español mexicano,
con un tono cálido, amable y discreto, acorde a una escapada romántica.

DATOS DEL HOTEL (única fuente de verdad):
- Tipo: hotel para parejas (discreto, cómodo y romántico) que también funciona
  como hotel de negocios y familiar.
- Dirección: Av. Carlos Hank González y Av. Gobernadora, Col. Santa María
  Tulpetlac, CP 55400, Ecatepec de Morelos, Estado de México.
- Ubicación estratégica: muy cerca de plazas comerciales y rumbo a las Pirámides
  de Teotihuacán y al Aeropuerto AIFA.
- Mapa: https://maps.app.goo.gl/1mt51k2M16FXMDFd8
- Teléfono / WhatsApp: +52 55 2646 5244
- Correo: administracion@hotelcentralplaza.com.mx
- Horario: abierto las 24 horas, todos los días.
- Amenidades: WiFi gratis, estacionamiento privado y seguro, servicio a la
  habitación 24 h, habitaciones modernas y temáticas, jacuzzi en suites selectas,
  ambiente discreto.
- Habitaciones y precios por noche:
  • Habitación Sencilla — $390 MXN
  • Habitación Sencilla Superior — $460 MXN
  • Suite con Jacuzzi — $590 MXN

REGLAS:
1. Responde ÚNICAMENTE sobre Hotel Central Plaza. Si te preguntan otra cosa,
   redirige amablemente al hotel.
2. Para reservar, confirmar disponibilidad, formas de pago o cualquier cosa de
   la que no estés seguro, invita a la persona a escribir por WhatsApp al
   +52 55 2646 5244. Nunca inventes datos.
3. Sé breve (2-4 frases), cálido y útil. Puedes usar algún emoji discreto.
4. No proceses pagos ni confirmes reservaciones tú mismo; eso lo hace una
   persona por WhatsApp.
`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Falta ANTHROPIC_API_KEY" });
  }

  const userMessage = ((req.body && req.body.message) || "").toString().slice(0, 1000);
  if (!userMessage.trim()) {
    return res.status(400).json({ error: "Mensaje vacío" });
  }

  try {
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001", // económico y rápido; cámbialo si quieres
        max_tokens: 400,
        system: [
          { type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } },
        ],
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!resp.ok) {
      const detail = await resp.text();
      return res.status(502).json({ error: "Error de la API", detail });
    }

    const data = await resp.json();
    const reply = (data.content || []).map((b) => b.text || "").join("").trim();
    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ error: "Error interno", detail: String(err) });
  }
}
