/* ===================================================================
   HOTEL CENTRAL PLAZA — script.js
   Incluye: menú móvil, animaciones al hacer scroll y el ASISTENTE VIRTUAL.
   =================================================================== */

/* ===================================================================
   ⚙️  CONFIGURACIÓN DEL ASISTENTE  (lo más importante para editar)
   -------------------------------------------------------------------
   CHAT_MODE controla cómo responde el asistente:
     "offline" =  Opción B (por defecto) — responde con la base de
                  conocimiento de aquí abajo. NO necesita servidor ni
                  API key. Funciona en cualquier hosting gratuito.
     "live"    =  Opción A — usa Claude (IA real) a través de una
                  función serverless. Requiere desplegar la función y
                  configurar la API key. Ver los archivos de la carpeta
                  /netlify o /api y el README-OPCION-A.md.
   =================================================================== */
const CHAT_CONFIG = {
  CHAT_MODE: "offline",                 // "offline"  ó  "live"
  LIVE_ENDPOINT: "/.netlify/functions/chat", // ruta de la función serverless (Opción A)
  WHATSAPP_LINK:
    "https://wa.me/525526465244?text=Hola%2C%20me%20gustar%C3%ADa%20informaci%C3%B3n%20sobre%20una%20habitaci%C3%B3n%20en%20Hotel%20Central%20Plaza",
};

/* ===================================================================
   📚  BASE DE CONOCIMIENTO  (Opción B — edita libremente)
   -------------------------------------------------------------------
   Un NO-DESARROLLADOR puede cambiar aquí precios, horarios y respuestas.
   Cada entrada tiene:
     - id:        identificador interno
     - label:     texto del botón de respuesta rápida
     - keywords:  palabras que activan la respuesta si el cliente escribe
     - answer:    la respuesta que da el asistente (admite saltos de línea)
   =================================================================== */
const KNOWLEDGE_BASE = [
  {
    id: "precios",
    label: "💲 Precios de habitaciones",
    keywords: ["precio", "precios", "costo", "cuesta", "cuanto", "cuánto", "tarifa", "tarifas", "habitacion", "habitación", "cuarto", "valor"],
    answer:
      "Con gusto 😊 Estos son nuestros precios por noche:\n\n" +
      "• Habitación Sencilla — $390 MXN\n" +
      "• Habitación Sencilla Superior — $460 MXN\n" +
      "• Suite con Jacuzzi — $590 MXN\n\n" +
      "¿Te gustaría reservar alguna? Puedo ayudarte por WhatsApp.",
  },
  {
    id: "estacionamiento",
    label: "🚗 ¿Hay estacionamiento?",
    keywords: ["estacionamiento", "parking", "auto", "carro", "coche", "cochera", "garage", "garaje"],
    answer:
      "¡Sí! 🚗 Contamos con estacionamiento privado y seguro para tu auto, " +
      "con acceso protegido para tu total tranquilidad y discreción.",
  },
  {
    id: "jacuzzi",
    label: "🛁 ¿Tienen jacuzzi?",
    keywords: ["jacuzzi", "tina", "hidromasaje", "suite", "romantico", "romántico"],
    answer:
      "Sí 🛁✨ Nuestra *Suite con Jacuzzi* ($590 MXN) cuenta con jacuzzi privado, " +
      "perfecta para una ocasión especial y muy romántica. ¿Quieres reservarla?",
  },
  {
    id: "horario",
    label: "🕐 ¿Cuál es el horario?",
    keywords: ["horario", "hora", "abierto", "abren", "cierran", "24", "disponible", "abre"],
    answer:
      "Estamos abiertos las 24 horas, todos los días del año 🕐. " +
      "Puedes llegar a la hora que más te convenga.",
  },
  {
    id: "ubicacion",
    label: "📍 ¿Cómo llego?",
    keywords: ["llego", "ubicacion", "ubicación", "direccion", "dirección", "donde", "dónde", "mapa", "como llegar", "cómo llegar"],
    answer:
      "Estamos en Av. Carlos Hank González y Av. Gobernadora, Col. Santa María " +
      "Tulpetlac, CP 55400, Ecatepec de Morelos, Estado de México 📍.\n\n" +
      "Aquí el mapa: https://maps.app.goo.gl/1mt51k2M16FXMDFd8",
  },
  {
    id: "reservar",
    label: "📅 ¿Cómo reservo?",
    keywords: ["reservar", "reserva", "reservacion", "reservación", "apartar", "agendar"],
    answer:
      "¡Reservar es muy fácil! 📅 Escríbenos por WhatsApp y con gusto te apartamos " +
      "tu habitación al instante. También puedes llamarnos al +52 55 2646 5244.",
    showWhatsApp: true,
  },
  {
    id: "amenidades",
    label: "✨ Amenidades",
    keywords: ["amenidades", "servicios", "wifi", "internet", "room service", "comida", "incluye", "ofrecen"],
    answer:
      "Disfrutarás de ✨:\n\n" +
      "• WiFi gratis\n• Estacionamiento privado y seguro\n• Servicio a la habitación 24 h\n" +
      "• Jacuzzi (en suites selectas)\n• Habitaciones modernas y temáticas\n• Total discreción",
  },
  {
    id: "pago",
    label: "💳 Formas de pago",
    keywords: ["pago", "pagar", "tarjeta", "efectivo", "transferencia", "aceptan"],
    answer:
      "Para confirmar las formas de pago disponibles te recomendamos escribirnos " +
      "por WhatsApp 💳, así te damos la información más actualizada.",
    showWhatsApp: true,
  },
];

/* Saludo inicial del asistente */
const WELCOME_MESSAGE =
  "¡Hola! 👋 Bienvenido(a) a *Hotel Central Plaza*. Soy tu asistente virtual y " +
  "estoy aquí para ayudarte. ¿Qué te gustaría saber?";

/* Mensaje cuando NO se encuentra respuesta (deriva a WhatsApp con persona real) */
const FALLBACK_MESSAGE =
  "Con gusto te ayudamos con eso 😊 Para darte la mejor atención, escríbenos " +
  "por WhatsApp y una persona del hotel te atenderá personalmente.";

/* ===================================================================
   El resto del archivo es la lógica. Normalmente no necesitas tocarlo.
   =================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  initYear();
  initHeaderScroll();
  initMobileNav();
  initReveal();
  initAssistant();
});

/* ---------- Año actual en el footer ---------- */
function initYear() {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
}

/* ---------- Cambia el header al hacer scroll ---------- */
function initHeaderScroll() {
  const header = document.getElementById("siteHeader");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------- Menú móvil ---------- */
function initMobileNav() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  if (!toggle || !nav) return;

  const close = () => {
    nav.classList.remove("open");
    toggle.classList.remove("active");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.classList.toggle("active", open);
    toggle.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
}

/* ---------- Animaciones de aparición al hacer scroll ---------- */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || !items.length) {
    items.forEach((el) => el.classList.add("visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  items.forEach((el) => io.observe(el));
}

/* ===================================================================
   ASISTENTE VIRTUAL
   =================================================================== */
function initAssistant() {
  const root = document.getElementById("assistant");
  const launcher = document.getElementById("assistantLauncher");
  const win = document.getElementById("assistantWindow");
  const closeBtn = document.getElementById("assistantClose");
  const messages = document.getElementById("assistantMessages");
  const quick = document.getElementById("assistantQuick");
  const form = document.getElementById("assistantForm");
  const input = document.getElementById("assistantText");
  if (!root || !launcher || !win) return;

  let started = false;

  const open = () => {
    root.classList.add("open");
    launcher.setAttribute("aria-expanded", "true");
    win.setAttribute("aria-hidden", "false");
    if (!started) {
      started = true;
      botSay(WELCOME_MESSAGE);
      renderQuickReplies();
    }
    setTimeout(() => input && input.focus(), 350);
  };
  const close = () => {
    root.classList.remove("open");
    launcher.setAttribute("aria-expanded", "false");
    win.setAttribute("aria-hidden", "true");
  };

  launcher.addEventListener("click", open);
  closeBtn.addEventListener("click", close);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && root.classList.contains("open")) close();
  });

  /* --- Render de botones de respuesta rápida --- */
  function renderQuickReplies() {
    quick.innerHTML = "";
    KNOWLEDGE_BASE.forEach((item) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "quick-btn";
      b.textContent = item.label;
      b.addEventListener("click", () => {
        userSay(item.label.replace(/^[^\wÁÉÍÓÚÑáéíóúñ]+/, "").trim());
        respondWith(item);
      });
      quick.appendChild(b);
    });
  }

  /* --- Pintar un mensaje del bot --- */
  function botSay(text, opts = {}) {
    const el = document.createElement("div");
    el.className = "msg bot";
    el.innerHTML = formatText(text);
    if (opts.showWhatsApp) el.appendChild(makeWhatsAppButton());
    messages.appendChild(el);
    scrollDown();
  }

  /* --- Pintar un mensaje del usuario --- */
  function userSay(text) {
    const el = document.createElement("div");
    el.className = "msg user";
    el.textContent = text;
    messages.appendChild(el);
    scrollDown();
  }

  /* --- Indicador de "escribiendo..." --- */
  function showTyping() {
    const el = document.createElement("div");
    el.className = "msg bot typing-wrap";
    el.innerHTML = '<span class="typing"><span></span><span></span><span></span></span>';
    messages.appendChild(el);
    scrollDown();
    return el;
  }

  /* --- Responder con una entrada concreta de la base de conocimiento --- */
  function respondWith(item) {
    const typing = showTyping();
    setTimeout(() => {
      typing.remove();
      botSay(item.answer, { showWhatsApp: !!item.showWhatsApp });
    }, 600);
  }

  /* --- Procesar texto libre del usuario --- */
  async function handleUserText(text) {
    userSay(text);

    if (CHAT_CONFIG.CHAT_MODE === "live") {
      await handleLive(text);
      return;
    }

    // Opción B: buscar en la base de conocimiento
    const match = findAnswer(text);
    const typing = showTyping();
    setTimeout(() => {
      typing.remove();
      if (match) {
        botSay(match.answer, { showWhatsApp: !!match.showWhatsApp });
      } else {
        botSay(FALLBACK_MESSAGE, { showWhatsApp: true });
      }
    }, 600);
  }

  /* --- Opción A: llamar a la función serverless con Claude --- */
  async function handleLive(text) {
    const typing = showTyping();
    try {
      const res = await fetch(CHAT_CONFIG.LIVE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      if (!res.ok) throw new Error("bad response");
      const data = await res.json();
      typing.remove();
      botSay(data.reply || FALLBACK_MESSAGE, { showWhatsApp: !data.reply });
    } catch (err) {
      typing.remove();
      botSay(FALLBACK_MESSAGE, { showWhatsApp: true });
    }
  }

  /* --- Enviar desde el formulario --- */
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    handleUserText(text);
  });

  /* --- Utilidades internas --- */
  function scrollDown() {
    messages.scrollTop = messages.scrollHeight;
  }
}

/* Busca en la base de conocimiento por palabras clave */
function findAnswer(text) {
  const t = normalize(text);
  let best = null;
  let bestScore = 0;
  for (const item of KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of item.keywords) {
      if (t.includes(normalize(kw))) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  }
  return bestScore > 0 ? best : null;
}

/* Quita acentos y pasa a minúsculas para comparar */
function normalize(s) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/* Convierte *negritas*, saltos de línea y links en HTML seguro */
function formatText(text) {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped
    .replace(/\*(.+?)\*/g, "<strong>$1</strong>")
    .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
    .replace(/\n/g, "<br>");
}

/* Crea el botón "Abrir WhatsApp" dentro de un mensaje del bot */
function makeWhatsAppButton() {
  const a = document.createElement("a");
  a.className = "msg-wa";
  a.href = CHAT_CONFIG.WHATSAPP_LINK;
  a.target = "_blank";
  a.rel = "noopener";
  a.innerHTML =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.515 5.26l-.999 3.648 3.973-1.207zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413z"/></svg>' +
    " Abrir WhatsApp";
  return a;
}
