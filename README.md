# Hotel Central Plaza — Sitio web

Sitio web de una sola página (single page) para **Hotel Central Plaza**,
motel para parejas en Ecatepec de Morelos, Estado de México.

Hecho con **HTML, CSS y JavaScript puro** (sin pasos de compilación), por lo
que se puede publicar gratis en cualquier hosting estático.

---

## 📁 Archivos del proyecto

```
hotel-central-plaza/
├── index.html              ← la página
├── styles.css              ← el diseño
├── script.js               ← interactividad + Asistente Virtual (Opción B)
├── images/                 ← AQUÍ van tus 3 fotos (ver abajo)
├── netlify/functions/chat.js   ← Opción A: IA real (Netlify)  [opcional]
├── api/chat.js                 ← Opción A: IA real (Vercel)   [opcional]
├── README.md               ← este archivo
└── README-OPCION-A.md      ← cómo activar la IA real con Claude
```

## 🖼️ Imágenes

Las fotos viven en la carpeta `images/`. Si quieres reemplazar alguna, sube tu
foto nueva con el MISMO nombre de archivo y listo:

| Archivo | Se usa en |
|---|---|
| `logo.png` | Logo del hotel (encabezado y pie de página) |
| `fachada.jpg` | Fondo del Hero (portada) + galería |
| `habitacion-sencilla.jpg` | Tarjeta Habitación Sencilla ($390) |
| `habitacion-superior.jpg` | Tarjeta Habitación Sencilla Superior ($460) + galería |
| `suite-jacuzzi.jpg` | Tarjeta Suite con Jacuzzi ($590) + galería |
| `galeria-rey.jpg` | Galería (habitación cama king) |
| `galeria-suite.jpg` | Galería (suite con sala) |
| `galeria-pasillo.jpg` | Galería (pasillos del hotel) |

> El logo es un PNG con fondo transparente; en la portada se muestra en blanco
> y al hacer scroll vuelve a su color original (esto se controla en `styles.css`).
> Si falta alguna imagen, la página muestra un marcador temporal para que el
> diseño nunca se rompa.

---

## ✏️ Cómo editar precios, textos y respuestas (sin ser programador)

- **Precios y descripciones de habitaciones:** abre `index.html` y busca la
  sección `HABITACIONES`. Cambia el texto que está entre las etiquetas.
- **Respuestas del Asistente Virtual:** abre `script.js` y edita el objeto
  `KNOWLEDGE_BASE` (está hasta arriba, bien comentado). Ahí cambias precios,
  horarios y respuestas del chat.
- **Número de WhatsApp:** está en `script.js` (`WHATSAPP_LINK`) y en varios
  enlaces de `index.html`. Si cambia el número, reemplaza `525526465244`.

---

## 👀 Cómo verlo en tu computadora (vista previa local)

Solo necesitas abrir `index.html`. Dos formas:

**Opción rápida:** haz doble clic en `index.html`.

**Opción recomendada** (para que todo funcione igual que en internet), abre una
terminal en la carpeta del proyecto y ejecuta UNA de estas:

```bash
# Si tienes Python instalado:
python3 -m http.server 8000

# O si tienes Node.js:
npx serve .
```

Luego abre en tu navegador: <http://localhost:8000>

---

## 🚀 Cómo publicarlo gratis

### Opción 1 — Netlify (la más fácil, recomendada)
1. Crea una cuenta gratis en <https://www.netlify.com>.
2. Arrastra y suelta la carpeta `hotel-central-plaza` completa en el panel de
   Netlify ("Deploys" → "Drag and drop").
3. ¡Listo! Te darán una dirección como `https://tu-sitio.netlify.app`.

### Opción 2 — GitHub Pages
1. Sube esta carpeta a un repositorio en <https://github.com>.
2. En el repositorio: **Settings → Pages → Branch: main → /(root) → Save**.
3. En unos minutos estará en `https://tu-usuario.github.io/tu-repo/`.

### Opción 3 — Vercel
1. Crea una cuenta en <https://vercel.com> e importa el proyecto.
2. Sin configuración especial, publica el sitio estático.

---

## 🤖 El Asistente Virtual

Por defecto el chat funciona en **modo offline (Opción B)**: responde solito con
la información del hotel, **sin servidor ni API key**, gratis para siempre.

¿Quieres que el chat use **inteligencia artificial real (Claude)** y responda
preguntas más libres? Eso es la **Opción A**. Lee
[`README-OPCION-A.md`](./README-OPCION-A.md) para activarla. Ambas opciones se
ven idénticas para el cliente.
