import { useState, useEffect, useRef } from "react";
import {
  Camera, Loader, Download,
  X, ArrowLeft, ImageOff, CalendarDays, ChevronRight, Images,
  Search, Sparkles, FolderOpen, Image as ImageIcon, Check,
} from "lucide-react";
import {
  listPortalCohorts, getCohortPortalInfo,
  matchSelfieInCohort, getCohortPhotoUrl,
  prepareCohortZip, cohortZipUrl,
} from "../api";

// ── Marca blanca ──────────────────────────────────────────────────────────────
import {
  BRAND_NAME,
  BRAND_LOGO_URL,
  BRAND_LOGO_ALT,
  BRAND_ACCENT,
  BRAND_ACCENT_DIM,
  BRAND_ACCENT_TEXT,
  BRAND_ACCENT_TINT,
  BRAND_ACCENT_BORDER,
  PORTAL_COPY,
} from "../../../brand.config";

// ─────────────────────────────────────────────────────────────────────────────

// iOS-aware download/share.
async function shareOrDownloadBlob(blob, filename) {
  if (!blob) return false;
  const file = new File([blob], filename, { type: blob.type || "application/octet-stream" });
  if (navigator.canShare && navigator.canShare({ files: [file] }) && navigator.share) {
    try { await navigator.share({ files: [file] }); return true; }
    catch (e) {
      if (e?.name === "AbortError") return true;
    }
  }
  const url = URL.createObjectURL(blob);
  try {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return true;
  } catch {
    return false;
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }
}

function openDownloadInNewTab(url) {
  const w = window.open(url, "_blank", "noopener");
  if (!w) window.location.href = url;
}

// ── Logo o nombre en texto ────────────────────────────────────────────────────
function BrandLogo({ className = "h-7" }) {
  if (BRAND_LOGO_URL) {
    return <img src={BRAND_LOGO_URL} alt={BRAND_LOGO_ALT} className={className} />;
  }
  return (
    <span
      className="font-bold text-sm tracking-tight"
      style={{ color: "#fafafa" }}
    >
      {BRAND_NAME}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LANDING
// ─────────────────────────────────────────────────────────────────────────────
function Landing({ go }) {
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listPortalCohorts()
      .then(setCohorts)
      .finally(() => setLoading(false));
  }, []);

  const goToCohort = (cohortId) => {
    go(`/portal/${encodeURIComponent(cohortId)}`);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fafafa" }} className="flex flex-col">

      <header style={{ borderBottom: "1px solid #2d2d2d", background: "#0a0a0a" }} className="sticky top-0 z-10">
        <div className="max-w-xl mx-auto px-5 h-14 flex items-center justify-center">
          <BrandLogo className="h-7" />
        </div>
      </header>

      <section style={{ background: "#1c1c1c", borderBottom: "1px solid #2d2d2d" }}>
        <div className="max-w-xl mx-auto px-5 py-16 text-center">

          <span
            className="inline-block text-[10px] font-bold uppercase tracking-[0.18em] rounded-full px-3 py-1 mb-6"
            style={{
              background: BRAND_ACCENT_TINT,
              color: BRAND_ACCENT,
              border: `1px solid ${BRAND_ACCENT_BORDER}`,
            }}
          >
            {PORTAL_COPY.hero_badge}
          </span>

          <h1 className="text-4xl font-black leading-[1.1] mb-5" style={{ color: "#fafafa" }}>
            {PORTAL_COPY.hero_title_line1}<br />
            <span style={{ color: BRAND_ACCENT }}>{PORTAL_COPY.hero_title_line2}</span>
          </h1>

          <p className="text-base leading-relaxed max-w-sm mx-auto" style={{ color: "#a3a3a3" }}>
            {PORTAL_COPY.hero_subtitle}
          </p>
        </div>
      </section>

      <div className="max-w-xl mx-auto px-5 w-full pb-16 flex-1">

        <div className="mt-10 mb-10">
          <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: "#737373" }}>
            Cómo funciona
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: FolderOpen, title: "Selecciona tu cohort",   sub: "El programa al que perteneces" },
              { icon: Camera,     title: "Sube una selfie",        sub: "Una foto clara, de frente" },
              { icon: Sparkles,   title: "Te identificamos",       sub: "En todos los días del evento" },
              { icon: Download,   title: "Descarga tus fotos",     sub: "Agrupadas por día" },
            ].map(({ icon: Icon, title, sub }) => (
              <div
                key={title}
                className="rounded-2xl p-4"
                style={{ background: "#1c1c1c", border: "1px solid #2d2d2d" }}
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: BRAND_ACCENT_TINT }}
                >
                  <Icon size={15} style={{ color: BRAND_ACCENT }} />
                </div>
                <p className="text-xs font-bold mb-0.5" style={{ color: "#fafafa" }}>{title}</p>
                <p className="text-[11px] leading-relaxed" style={{ color: "#a3a3a3" }}>{sub}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#737373" }}>
          ¿En qué cohort estuviste?
        </p>

        {loading && (
          <div className="flex justify-center py-10">
            <Loader size={24} className="animate-spin" style={{ color: BRAND_ACCENT }} />
          </div>
        )}

        {!loading && cohorts.filter(c => c.total_photos > 0).length === 0 && (
          <div
            className="text-center py-14 rounded-2xl"
            style={{ border: "2px dashed #2d2d2d" }}
          >
            <CalendarDays size={28} className="mx-auto mb-3" style={{ color: BRAND_ACCENT }} />
            <p className="text-sm" style={{ color: "#a3a3a3" }}>Aún no hay eventos disponibles.</p>
          </div>
        )}

        {!loading && cohorts.filter(c => c.total_photos > 0).length > 0 && (
          <div className="space-y-2.5">
            {cohorts.filter(c => c.total_photos > 0).map(c => (
              <button
                key={c.cohort_id}
                onClick={() => goToCohort(c.cohort_id)}
                className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-left transition-all"
                style={{ background: "#1c1c1c", border: "1px solid #2d2d2d" }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = BRAND_ACCENT;
                  e.currentTarget.style.background = "#1f2410";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "#2d2d2d";
                  e.currentTarget.style.background = "#1c1c1c";
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: `${c.cover_color || BRAND_ACCENT}20`,
                    border: `1px solid ${c.cover_color || BRAND_ACCENT}50`,
                  }}
                >
                  <Images size={16} style={{ color: c.cover_color || BRAND_ACCENT_DIM }} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate" style={{ color: "#fafafa" }}>
                    {c.cohort_name}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#a3a3a3" }}>
                    {c.program && <span>{c.program} · </span>}
                    {c.total_photos} fotos
                    {c.event_count > 1 && <span> · {c.event_count} días</span>}
                  </p>
                </div>

                <ChevronRight size={16} style={{ color: BRAND_ACCENT }} />
              </button>
            ))}
          </div>
        )}

        {/* Footer */}
        {(PORTAL_COPY.footer_tagline || PORTAL_COPY.footer_copy) && (
          <div className="text-center mt-14">
            {PORTAL_COPY.footer_tagline && (
              <p className="text-xs leading-relaxed" style={{ color: "#a3a3a3" }}>
                {PORTAL_COPY.footer_tagline}
              </p>
            )}
            <p className="text-[10px] mt-2" style={{ color: "#2d2d2d" }}>
              {PORTAL_COPY.footer_copy
                ? PORTAL_COPY.footer_copy
                : `${BRAND_NAME} · ${new Date().getFullYear()}`}
            </p>
          </div>
        )}
        {!PORTAL_COPY.footer_tagline && (
          <p className="text-[10px] mt-14 text-center" style={{ color: "#2d2d2d" }}>
            {PORTAL_COPY.footer_copy || `${BRAND_NAME} · ${new Date().getFullYear()}`}
          </p>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COHORT PORTAL
// ─────────────────────────────────────────────────────────────────────────────
function CohortPortal({ cohortId, go }) {
  const [cohortInfo, setCohortInfo]     = useState(null);
  const [loadingInfo, setLoadingInfo]   = useState(true);
  const [infoError, setInfoError]       = useState(null);

  const [step, setStep]                   = useState("upload");
  const [selfieFile, setSelfieFile]       = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);
  const [matching, setMatching]           = useState(false);
  const [matchError, setMatchError]       = useState(null);
  const [resultPhotos, setResultPhotos]   = useState([]);
  const [usedWideSearch, setUsedWideSearch] = useState(false);
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [selected, setSelected]           = useState(() => new Set());

  const toggleSelect = (filename) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(filename)) next.delete(filename); else next.add(filename);
      return next;
    });
  };
  const clearSelection = () => setSelected(new Set());
  const totalMatches = resultPhotos.length;

  const cameraInputRef  = useRef(null);
  const galleryInputRef = useRef(null);

  useEffect(() => {
    getCohortPortalInfo(cohortId)
      .then(setCohortInfo)
      .catch(() => setInfoError("Cohort no encontrado o aún procesando."))
      .finally(() => setLoadingInfo(false));
  }, [cohortId]);

  const resetSelfie = () => {
    setSelfieFile(null);
    setSelfiePreview(null);
    setMatchError(null);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelfieFile(file);
    setSelfiePreview(URL.createObjectURL(file));
    setMatchError(null);
    e.target.value = "";
  };

  const handleMatch = async (wide = false) => {
    if (!selfieFile || !cohortInfo) return;
    setMatching(true);
    setUsedWideSearch(wide);
    setStep("matching");
    try {
      const result = await matchSelfieInCohort(cohortId, selfieFile, wide ? 0.62 : null);
      setResultPhotos(result.matched_photos || []);
      setStep("results");
    } catch {
      setMatchError("Error al procesar tu selfie. Intenta con otra foto.");
      setStep("upload");
    } finally {
      setMatching(false);
    }
  };

  const handleDownloadAll = async () => {
    if (downloadingAll) return;
    const pool       = resultPhotos;
    const selections = selected.size > 0 ? pool.filter(f => selected.has(f)) : pool;
    if (selections.length === 0) return;

    const w = window.open("about:blank", "_blank");
    setDownloadingAll(true);
    try {
      if (selections.length === 1) {
        const filename  = selections[0];
        const directUrl = `${getCohortPhotoUrl(cohortId, filename)}?download=1`;
        let shared = false;
        try {
          const res = await fetch(directUrl, { credentials: "omit" });
          if (res.ok) {
            const blob = await res.blob();
            shared = await shareOrDownloadBlob(blob, filename);
          }
        } catch { /* fall through */ }
        if (!shared) {
          if (w) w.location.href = directUrl;
          else openDownloadInNewTab(directUrl);
        } else if (w) {
          w.close();
        }
      } else {
        const { token } = await prepareCohortZip(cohortId, selections);
        const url       = cohortZipUrl(cohortId, token);
        if (w) w.location.href = url;
        else openDownloadInNewTab(url);
      }
    } catch {
      if (w) w.close();
      setMatchError("No pudimos preparar la descarga. Intenta de nuevo.");
    } finally {
      setDownloadingAll(false);
    }
  };

  const goBackToLanding = () => { go("/"); };

  const topBar = (title, subtitle, onBack) => (
    <header style={{ borderBottom: "1px solid #2d2d2d", background: "#0a0a0a" }} className="sticky top-0 z-10">
      <div className="max-w-xl mx-auto px-5 h-14 flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-xl transition-colors"
          style={{ border: "1px solid #2d2d2d", color: BRAND_ACCENT }}
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1 min-w-0">
          {subtitle && <p className="text-[11px]" style={{ color: "#a3a3a3" }}>{subtitle}</p>}
          {title    && <p className="text-sm font-bold truncate" style={{ color: "#fafafa" }}>{title}</p>}
        </div>
        <BrandLogo className="h-6 shrink-0" />
      </div>
    </header>
  );

  if (loadingInfo) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a" }} className="flex items-center justify-center">
      <Loader size={32} className="animate-spin" style={{ color: BRAND_ACCENT }} />
    </div>
  );

  if (infoError) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a" }} className="flex flex-col items-center justify-center p-6 text-center gap-4">
      <BrandLogo className="h-8" />
      <p className="text-sm" style={{ color: "#a3a3a3" }}>{infoError}</p>
      <button onClick={goBackToLanding} className="text-sm underline underline-offset-2" style={{ color: BRAND_ACCENT_DIM }}>
        Volver al inicio
      </button>
    </div>
  );

  const totalPhotosInCohort = cohortInfo.total_photos || 0;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fafafa" }}>
      {topBar(cohortInfo.cohort_name, cohortInfo.program || "Cohort", goBackToLanding)}

      <div className="max-w-xl mx-auto px-5 py-8">

        {/* ── Upload selfie ─────────────────────────────────────── */}
        {step === "upload" && (
          <div className="space-y-4">
            <div className="rounded-2xl p-6" style={{ background: "#1c1c1c", border: "1px solid #2d2d2d" }}>
              <div className="text-center mb-6">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: BRAND_ACCENT_TINT }}
                >
                  <Search size={24} style={{ color: BRAND_ACCENT }} />
                </div>
                <h2 className="font-bold text-lg mb-1" style={{ color: "#fafafa" }}>Encuéntrate en las fotos</h2>
                <p className="text-sm" style={{ color: "#a3a3a3" }}>
                  Sube una selfie y te buscamos en {totalPhotosInCohort} fotos.
                </p>
              </div>

              {selfiePreview ? (
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <img
                      src={selfiePreview}
                      alt="Tu selfie"
                      className="w-32 h-32 rounded-full object-cover"
                      style={{ border: `3px solid ${BRAND_ACCENT}` }}
                    />
                    <button
                      onClick={resetSelfie}
                      className="absolute -top-1 -right-1 rounded-full p-1"
                      style={{ background: "#0a0a0a", border: "1px solid #2d2d2d", color: BRAND_ACCENT }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex flex-col items-center justify-center gap-2 py-6 rounded-2xl transition-all"
                    style={{ background: "#0a0a0a", border: "1px solid #2d2d2d" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = BRAND_ACCENT; e.currentTarget.style.background = "#1f2410"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#2d2d2d"; e.currentTarget.style.background = "#0a0a0a"; }}
                  >
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{ background: BRAND_ACCENT_TINT }}
                    >
                      <Camera size={22} style={{ color: BRAND_ACCENT }} />
                    </div>
                    <span className="text-sm font-bold" style={{ color: "#fafafa" }}>Tomar selfie</span>
                    <span className="text-[11px]" style={{ color: "#a3a3a3" }}>Usar la cámara</span>
                  </button>

                  <button
                    onClick={() => galleryInputRef.current?.click()}
                    className="flex flex-col items-center justify-center gap-2 py-6 rounded-2xl transition-all"
                    style={{ background: "#0a0a0a", border: "1px solid #2d2d2d" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = BRAND_ACCENT; e.currentTarget.style.background = "#1f2410"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#2d2d2d"; e.currentTarget.style.background = "#0a0a0a"; }}
                  >
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{ background: "#272b2d" }}
                    >
                      <ImageIcon size={22} style={{ color: BRAND_ACCENT }} />
                    </div>
                    <span className="text-sm font-bold" style={{ color: "#fafafa" }}>Desde galería</span>
                    <span className="text-[11px]" style={{ color: "#a3a3a3" }}>Elegir una foto</span>
                  </button>

                  <input ref={cameraInputRef}  type="file" accept="image/*" capture="user" onChange={handleFileSelect} className="hidden" />
                  <input ref={galleryInputRef} type="file" accept="image/*"               onChange={handleFileSelect} className="hidden" />
                </div>
              )}

              {matchError && <p className="text-red-500 text-xs text-center mb-3">{matchError}</p>}

              <button
                onClick={() => handleMatch(false)}
                disabled={!selfieFile || matching}
                className="w-full font-bold py-3 rounded-xl transition-colors disabled:opacity-40"
                style={{ background: BRAND_ACCENT, color: BRAND_ACCENT_TEXT }}
                onMouseEnter={e => { if (selfieFile) e.currentTarget.style.background = BRAND_ACCENT_DIM; }}
                onMouseLeave={e => { e.currentTarget.style.background = BRAND_ACCENT; }}
              >
                Buscar mis fotos
              </button>
            </div>

            <p className="text-[11px] text-center" style={{ color: "#737373" }}>
              Tip: usa una foto con buena luz, de frente y con tu cara despejada.
            </p>
          </div>
        )}

        {/* ── Matching ───────────────────────────────────────────── */}
        {step === "matching" && (
          <div className="text-center py-24">
            <div className="relative inline-block mb-6">
              <Loader size={52} className="animate-spin" style={{ color: BRAND_ACCENT }} />
              <Sparkles size={20} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ color: BRAND_ACCENT }} />
            </div>
            <p className="font-bold text-lg mb-1" style={{ color: "#fafafa" }}>Buscando tu cara...</p>
            <p className="text-sm" style={{ color: "#a3a3a3" }}>
              Analizando {totalPhotosInCohort} fotos
            </p>
          </div>
        )}

        {/* ── Resultados ─────────────────────────────────────────── */}
        {step === "results" && (
          <div>
            <div
              className="rounded-2xl p-4 mb-6 flex items-center gap-3"
              style={{
                background: totalMatches > 0 ? "#14261c" : "#2a1517",
                border: `1px solid ${totalMatches > 0 ? "#258053" : "#942143"}`,
              }}
            >
              <button
                onClick={() => { setStep("upload"); setResultPhotos([]); clearSelection(); }}
                className="p-1.5 rounded-lg shrink-0"
                style={{ border: "1px solid #2d2d2d", color: BRAND_ACCENT, background: "#0a0a0a" }}
              >
                <ArrowLeft size={14} />
              </button>
              <div>
                <h2 className="font-bold text-sm" style={{ color: "#fafafa" }}>
                  {totalMatches > 0
                    ? `¡Apareces en ${totalMatches} foto${totalMatches !== 1 ? "s" : ""}!`
                    : "No te encontramos"}
                </h2>
                <p className="text-xs mt-0.5" style={{ color: "#a3a3a3" }}>
                  {totalMatches > 0
                    ? "Toca para seleccionar · descarga abajo"
                    : "Intenta con una foto más clara y de frente"}
                </p>
              </div>
            </div>

            {totalMatches > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {resultPhotos.map(filename => {
                    const isSelected = selected.has(filename);
                    return (
                      <div
                        key={filename}
                        role="button"
                        tabIndex={0}
                        onClick={() => toggleSelect(filename)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toggleSelect(filename);
                          }
                        }}
                        aria-label={isSelected ? "Quitar de selección" : "Seleccionar foto"}
                        aria-pressed={isSelected}
                        className="relative rounded-xl overflow-hidden transition-all active:scale-[0.98] cursor-pointer"
                        style={{ border: isSelected ? `3px solid ${BRAND_ACCENT}` : "1px solid #2d2d2d" }}
                      >
                        <img
                          src={`${getCohortPhotoUrl(cohortId, filename)}?thumb=1`}
                          alt={filename}
                          className="w-full aspect-square object-cover"
                          loading="lazy"
                          decoding="async"
                          draggable={false}
                          style={{ opacity: isSelected ? 0.88 : 1 }}
                        />
                        <div
                          className="absolute top-1.5 left-1.5 rounded-full flex items-center justify-center pointer-events-none transition-all"
                          style={{
                            width: 30, height: 30,
                            background: isSelected ? BRAND_ACCENT : "rgba(10,10,10,0.55)",
                            border: isSelected ? `2px solid ${BRAND_ACCENT}` : "1.5px solid rgba(250,250,250,0.45)",
                            color: isSelected ? BRAND_ACCENT_TEXT : "transparent",
                          }}
                        >
                          {isSelected && <Check size={16} strokeWidth={3} />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={handleDownloadAll}
                  disabled={downloadingAll}
                  className="w-full flex items-center justify-center gap-2 font-bold py-3 rounded-xl transition-colors disabled:opacity-60"
                  style={{ background: BRAND_ACCENT, color: BRAND_ACCENT_TEXT }}
                  onMouseEnter={e => { if (!downloadingAll) e.currentTarget.style.background = BRAND_ACCENT_DIM; }}
                  onMouseLeave={e => { e.currentTarget.style.background = BRAND_ACCENT; }}
                >
                  {downloadingAll
                    ? <><Loader size={16} className="animate-spin" /> Preparando ZIP…</>
                    : selected.size > 0
                      ? <><Download size={16} /> Descargar {selected.size} seleccionada{selected.size !== 1 ? "s" : ""}</>
                      : <><Download size={16} /> Descargar todas mis fotos</>}
                </button>

                {selected.size > 0 && !downloadingAll && (
                  <button
                    onClick={clearSelection}
                    className="w-full mt-2 text-xs underline underline-offset-2"
                    style={{ color: "#a3a3a3" }}
                  >
                    Limpiar selección
                  </button>
                )}
              </>
            ) : (
              <div className="text-center py-10 rounded-2xl" style={{ border: "2px dashed #2d2d2d" }}>
                <ImageOff size={32} className="mx-auto mb-3" style={{ color: BRAND_ACCENT }} />
                <p className="text-sm mb-1" style={{ color: "#fafafa" }}>No encontramos tu cara en este cohort.</p>
                <p className="text-xs" style={{ color: "#a3a3a3" }}>
                  {usedWideSearch
                    ? "Prueba con una foto más clara, de frente y con buena iluminación."
                    : "Puede que la foto no sea suficientemente clara."}
                </p>

                <div className="mt-5 flex flex-col items-center gap-2">
                  {!usedWideSearch && (
                    <button
                      onClick={() => handleMatch(true)}
                      className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                      style={{
                        background: BRAND_ACCENT_TINT,
                        border: `1px solid ${BRAND_ACCENT_BORDER}`,
                        color: BRAND_ACCENT,
                      }}
                    >
                      Buscar con menor precisión
                    </button>
                  )}
                  <button
                    onClick={() => { setStep("upload"); resetSelfie(); setResultPhotos([]); setUsedWideSearch(false); }}
                    className="px-5 py-2.5 rounded-xl text-sm transition-colors"
                    style={{ border: "1px solid #2d2d2d", color: "#fafafa", background: "#0a0a0a" }}
                  >
                    Intentar con otra foto
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export default function Portal({ cohortId, go: goProp }) {
  const go = goProp || ((path) => {
    if (window.location.pathname === path) return;
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  });

  if (!cohortId) return <Landing go={go} />;
  return <CohortPortal cohortId={cohortId} go={go} />;
}
