/* ===================================================================
   OPCIÓN A — Función serverless para Netlify
   Asistente con IA real (Claude) para Hotel Central Plaza.
   -------------------------------------------------------------------
   La API key NUNCA va en el navegador: vive aquí, como variable de
   entorno ANTHROPIC_API_KEY en el panel de Netlify.
   Ruta pública resultante:  /.netlify/functions/chat
   =================================================================== */

// Prompt de sistema: aquí viven TODOS los datos del hotel.
// Edita precios, amenidades u horario si cambian.
const SYSTEM_PROMPT = `
Eres el asistente virtual de "Hotel Central Plaza", un motel para parejas en
Ecatepec de Morelos, Estado de México. Respondes SIEMPRE en español mexicano,
con un tono cálido, amable y discreto, acorde a una escapada romántica.

DATOS DEL HOTEL (única fuente de verdad):
- Tipo: motel para parejas, discreto, cómodo y romántico.
- Dirección: Av. Carlos Hank González y Av. Gobernadora, Col. Santa María
  Tulpetlac, CP 55400, Ecatepec de Morelos, Estado de México.
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

exports.handler = async (event) => {
  // Solo aceptamos POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Método no permitido" }) };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: "Falta ANTHROPIC_API_KEY" }) };
  }

  let userMessage = "";
  try {
    userMessage = (JSON.parse(event.body).message || "").toString().slice(0, 1000);
  } catch (_) {
    return { statusCode: 400, body: JSON.stringify({ error: "Cuerpo inválido" }) };
  }
  if (!userMessage.trim()) {
    return { statusCode: 400, body: JSON.stringify({ error: "Mensaje vacío" }) };
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
      return { statusCode: 502, body: JSON.stringify({ error: "Error de la API", detail }) };
    }

    const data = await resp.json();
    const reply = (data.content || []).map((b) => b.text || "").join("").trim();

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: "Error interno", detail: String(err) }) };
  }
};
