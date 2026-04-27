// ─────────────────────────────────────────────────────────────────────────────
// brand.config.js — Configuración de marca blanca
//
// INSTRUCCIONES PARA PERSONALIZAR UN CLIENTE NUEVO:
//
//   1. Cambia BRAND_NAME al nombre del producto para este cliente.
//   2. Cambia BRAND_LOGO_URL a la URL pública del logo (PNG o SVG, fondo transparente).
//      Si no tienes logo aún, deja null — se mostrará solo el nombre en texto.
//   3. Cambia BRAND_ACCENT al color primario del cliente (hex).
//      El sistema derivará automáticamente el hover y los tints.
//   4. Cambia BRAND_ACCENT_TEXT al color de texto que va sobre el acento
//      (casi siempre "#000000" para limas/amarillos, "#ffffff" para azules/oscuros).
//   5. Cambia PORTAL_COPY si quieres personalizar los textos del portal público.
//   6. Guarda el archivo y haz deploy. No hay nada más que tocar.
//
// ─────────────────────────────────────────────────────────────────────────────

// ── 1. Identidad ─────────────────────────────────────────────────────────────

/** Nombre visible del producto. Aparece en el header, títulos y footer. */
export const BRAND_NAME = "RepoMatch by PLG";

/** URL del logo. Usa null para mostrar solo el nombre en texto. */
export const BRAND_LOGO_URL = null;

/** Alt text del logo (para accesibilidad). */
export const BRAND_LOGO_ALT = "RepoMatch by PLG";

// ── 2. Colores ────────────────────────────────────────────────────────────────

/**
 * Color de acento principal — el "lime" del diseño original.
 * Úsalo para botones CTA, íconos activos, bordes de foco, loaders.
 * Ejemplo: "#ebff6f" (lima), "#3b82f6" (azul), "#10b981" (verde)
 */
export const BRAND_ACCENT = "#ebff6f";

/**
 * Variante más oscura del acento — para hover de botones.
 * Regla práctica: 15-20% más oscuro que BRAND_ACCENT.
 */
export const BRAND_ACCENT_DIM = "#babe60";

/**
 * Color del texto que va SOBRE el acento (en botones, badges).
 * Lima/amarillo → usa "#1c1c1c". Azul/rojo oscuro → usa "#ffffff".
 */
export const BRAND_ACCENT_TEXT = "#1c1c1c";

/** Tint transparente del acento (fondos de íconos, hover suave). */
export const BRAND_ACCENT_TINT = `${BRAND_ACCENT}20`;

/** Borde sutil del acento. */
export const BRAND_ACCENT_BORDER = `${BRAND_ACCENT}60`;

// ── 3. Textos del portal público ──────────────────────────────────────────────

export const PORTAL_COPY = {
  /** Badge encima del hero. Ejemplo: "Comunidad 30X", "Evento Acme Corp" */
  hero_badge: "RepoMatch by PLG",

  /** Línea 1 del título del hero (texto plano). */
  hero_title_line1: "Gracias por ser",

  /** Línea 2 del título del hero (resaltada con el color de acento). */
  hero_title_line2: "parte del evento.",

  /** Párrafo descriptivo debajo del título. */
  hero_subtitle:
    "Aquí encontrarás todas tus fotos del evento. " +
    "Solo sube una selfie y nuestro sistema te identifica automáticamente.",

  /** Texto del footer inferior. */
  footer_tagline: null, // null = no mostrar tagline

  /** Copyright del footer. null = solo año. */
  footer_copy: null,
};

// ── 4. Textos del panel de administración ─────────────────────────────────────

export const ADMIN_COPY = {
  /** Texto junto al logo en el header del admin. */
  header_subtitle: "Facematch",

  /** Título de la pantalla de login. */
  lock_title: "Panel de administración",

  /** Subtítulo de la pantalla de login. */
  lock_subtitle: "Ingresa la contraseña para continuar.",
};
