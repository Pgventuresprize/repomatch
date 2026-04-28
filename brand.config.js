// ─────────────────────────────────────────────────────────────────────────────
// brand.config.js — AI Summit Photo-Match
// ─────────────────────────────────────────────────────────────────────────────

// ── 1. Identidad ──────────────────────────────────────────────────────────────
export const BRAND_NAME     = "AI Summit Photo-Match";
export const BRAND_LOGO_URL = "https://www.aisummit.com.co/assets/logo-light-6CS0uqUm.png";
export const BRAND_LOGO_ALT = "AI Summit by Truora & CTW";

// ── 2. Colores ────────────────────────────────────────────────────────────────
export const BRAND_ACCENT       = "#6300FF";   // Purple Truora — botones, íconos, loaders
export const BRAND_ACCENT_DIM   = "#0800FF";   // Blue Truora — hover
export const BRAND_ACCENT_TEXT  = "#ffffff";   // Texto sobre botones (blanco sobre púrpura)
export const BRAND_ACCENT_TINT  = "#6300FF20"; // Fondo tint suave (íconos, badges)
export const BRAND_ACCENT_BORDER= "#6300FF60"; // Borde sutil

// ── 3. Textos del portal público ──────────────────────────────────────────────
export const PORTAL_COPY = {
  hero_badge:       "AI Summit · by Truora & CTW",
  hero_title_line1: "Encuentra tus fotos del",
  hero_title_line2: "AI Summit.",
  hero_subtitle:
    "Sube una selfie y nuestro sistema te identifica automáticamente " +
    "en todas las fotos del evento.",
  footer_tagline: "Del piloto a resultados reales.",
  footer_copy:    null,
};

// ── 4. Textos del panel de administración ─────────────────────────────────────
export const ADMIN_COPY = {
  header_subtitle: "Photo-Match",
  lock_title:      "Panel de administración",
  lock_subtitle:   "Ingresa la contraseña para continuar.",
};
