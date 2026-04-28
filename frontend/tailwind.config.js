/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // ── AI Summit brand — Purple Truora como acento ───────────────────────
        lime: {
          DEFAULT: "#6300FF",   // Purple Truora — botones CTA, tab activo
          dim:     "#0800FF",   // Blue Truora — hover
          muted:   "#6300FF18", // tint transparente
          border:  "#6300FF40", // borde sutil
        },

        // ── Paleta de fondo (no cambiar) ──────────────────────────────────────
        x: {
          bg:      "#0a0a0a",
          surface: "#1c1c1c",
          surface2:"#272b2d",
          border:  "#2d2d2d",
          border2: "#404040",
          text:    "#fafafa",
          muted:   "#a3a3a3",
          faint:   "#737373",
          ink:     "#ffffff",   // texto sobre botones púrpura → blanco
        },

        // ── Colores semánticos ────────────────────────────────────────────────
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
