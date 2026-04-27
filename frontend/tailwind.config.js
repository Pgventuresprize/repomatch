// tailwind.config.js
//
// INSTRUCCIONES MARCA BLANCA:
// Los colores "lime" y "x" son usados por el panel de administración.
// Para cambiar el color de acento del ADMIN (botones, tabs activos):
//   → Edita lime.DEFAULT y lime.dim para que coincidan con BRAND_ACCENT y BRAND_ACCENT_DIM en brand.config.js
//   → El portal público (Portal.jsx) usa los colores directamente desde brand.config.js,
//     así que Tailwind solo aplica al panel de admin.
//
// Ejemplo para un cliente con acento azul:
//   lime: { DEFAULT: "#3b82f6", dim: "#2563eb", ... }
//   x: { ink: "#ffffff", ... }  ← asegúrate que el texto sobre el acento sea legible

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // ── Acento principal (panel admin) ────────────────────────────────────
        // Mantén sincronizado con BRAND_ACCENT en brand.config.js
        lime: {
          DEFAULT: "#ebff6f",   // color de acento — botones CTA, tab activo
          dim:     "#babe60",   // hover del acento
          muted:   "#ebff6f18", // tint transparente
          border:  "#ebff6f40", // borde sutil
        },

        // ── Paleta de fondo (no cambiar salvo rediseño completo) ──────────────
        x: {
          bg:      "#0a0a0a",   // fondo de página
          surface: "#1c1c1c",   // fondo de tarjetas
          surface2:"#272b2d",   // superficie elevada / inputs
          border:  "#2d2d2d",   // borde por defecto
          border2: "#404040",   // borde más fuerte
          text:    "#fafafa",   // texto primario
          muted:   "#a3a3a3",   // texto secundario
          faint:   "#737373",   // placeholder / muy tenue
          ink:     "#1c1c1c",   // texto sobre botones con acento (ajustar si acento es oscuro)
        },

        // ── Colores semánticos del admin ──────────────────────────────────────
        wine:   "#942143",
        navy:   "#172452",
        forest: "#258053",
        sand:   "#efebe2",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};
