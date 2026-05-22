# Opción A — Asistente con IA real (Claude)

Esta guía explica cómo cambiar el Asistente Virtual del **modo offline (Opción B)**
al **modo con IA real (Opción A)**, usando el modelo Claude de Anthropic a través
de una función serverless.

> **¿Por qué una función serverless?** Para que tu **API key esté segura**.
> La llave NUNCA debe ir en el código del navegador (cualquiera podría verla y
> gastar tu saldo). Por eso vive en el servidor, como variable de entorno.

El sitio incluye la misma función en dos formatos; usa el que corresponda a tu
hosting:

- **Netlify:** `netlify/functions/chat.js`
- **Vercel:** `api/chat.js`

---

## 1) Consigue tu API key de Anthropic

1. Entra a <https://console.anthropic.com> y crea una cuenta.
2. Agrega saldo (Billing) — basta con unos pocos dólares.
3. Ve a **API Keys → Create Key** y copia la llave (empieza con `sk-ant-...`).

---

## 2A) Desplegar en Netlify

1. Sube el proyecto a Netlify (arrastrando la carpeta o conectando tu repo).
2. En el panel de tu sitio: **Site settings → Environment variables → Add a variable**
   - **Key:** `ANTHROPIC_API_KEY`
   - **Value:** tu llave `sk-ant-...`
3. Vuelve a desplegar (**Deploys → Trigger deploy**) para que tome la variable.
4. La función queda disponible en `/.netlify/functions/chat` (ya configurado).

## 2B) Desplegar en Vercel

1. Importa el proyecto en <https://vercel.com>.
2. En **Settings → Environment Variables** agrega:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** tu llave `sk-ant-...`
3. Despliega de nuevo.
4. En `script.js` cambia el endpoint a la ruta de Vercel:
   ```js
   LIVE_ENDPOINT: "/api/chat",
   ```

---

## 3) Activa el modo IA en el sitio

Abre `script.js` y, hasta arriba, en `CHAT_CONFIG`, cambia una sola línea:

```js
const CHAT_CONFIG = {
  CHAT_MODE: "live",   // <— cámbialo de "offline" a "live"
  ...
};
```

Guarda, vuelve a desplegar y listo. El cliente verá el mismo chat, pero ahora
las respuestas las genera Claude. Si la IA falla por cualquier motivo, el chat
automáticamente ofrece el botón de WhatsApp.

> Para volver al modo gratuito en cualquier momento, regresa `CHAT_MODE` a
> `"offline"`.

---

## 4) ¿Cuánto cuesta?

- El modelo configurado por defecto es **Claude Haiku 4.5**, el más económico.
- Cada conversación corta cuesta una fracción de centavo de dólar.
- Como referencia, **miles de preguntas** suelen costar **unos pocos dólares**.
- El prompt del sistema usa *prompt caching* para abaratar aún más las llamadas
  repetidas.
- Puedes poner un **límite de gasto mensual** en la consola de Anthropic
  (Billing → Limits) para no llevarte sorpresas.

> El precio exacto depende de las tarifas vigentes de Anthropic. Revisa
> <https://www.anthropic.com/pricing> para los números actuales.

---

## Personalizar lo que sabe la IA

Toda la información del hotel está en la variable `SYSTEM_PROMPT`, dentro de
`chat.js` (tanto en la versión de Netlify como en la de Vercel). Si cambian los
precios, el horario o las amenidades, edítalos ahí y vuelve a desplegar.
