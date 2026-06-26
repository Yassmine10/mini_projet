"use client";

import React, { useState, useCallback, type DragEvent, type ChangeEvent } from "react";
import { useDesign } from "@/context/DesignContext";

/**
 * Reads a File as a data URL string.
 */
function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Page 1 — Paramétrage
 *
 * Allows the user to:
 * - Upload a banner image (drag & drop or click)
 * - Configure 4 columns, each with an image upload and text area
 */
export default function ParametragePage() {
  const {
    design,
    setBannerImage,
    setColumnImage,
    setColumnText,
    resetDesign,
    hasContent,
    isLoading,
  } = useDesign();

  const [bannerDragOver, setBannerDragOver] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [toastExiting, setToastExiting] = useState(false);

  // --- Toast helper ---
  const showToast = useCallback((message: string) => {
    setToast(message);
    setToastExiting(false);
    setTimeout(() => {
      setToastExiting(true);
      setTimeout(() => setToast(null), 300);
    }, 2500);
  }, []);

  // --- Banner handlers ---
  const handleBannerFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const dataUrl = await readFileAsDataURL(file);
      setBannerImage(dataUrl);
      showToast("✅ Banner mis à jour");
    },
    [setBannerImage, showToast]
  );

  const onBannerDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setBannerDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleBannerFile(file);
    },
    [handleBannerFile]
  );

  const onBannerChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleBannerFile(file);
      e.target.value = "";
    },
    [handleBannerFile]
  );

  // --- Column image handler ---
  const handleColumnFile = useCallback(
    async (columnId: number, file: File) => {
      if (!file.type.startsWith("image/")) return;
      const dataUrl = await readFileAsDataURL(file);
      setColumnImage(columnId, dataUrl);
      showToast(`✅ Image colonne ${columnId} ajoutée`);
    },
    [setColumnImage, showToast]
  );

  const onColumnChange = useCallback(
    (columnId: number, e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleColumnFile(columnId, file);
      e.target.value = "";
    },
    [handleColumnFile]
  );

  if (isLoading) {
    return (
      <div className="loader-container">
        <div className="spinner" />
        <span style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Chargement de la configuration...
        </span>
      </div>
    );
  }

  return (
    <>
      {/* Page Header */}
      <div className="page-header fade-in">
        <h1 className="page-title">Paramétrage du Design</h1>
        <p className="page-subtitle">
          Configurez votre banner et vos 4 colonnes pour créer un design unique.
        </p>
      </div>

      {/* Banner Section */}
      <section className="section-card fade-in fade-in-delay-1" id="banner-section">
        <h2 className="section-title">
          <span className="section-title-icon">🖼️</span>
          Banner
        </h2>
        <p className="section-description">
          Uploadez une image pour votre bannière principale. Formats acceptés : JPG, PNG, WebP.
        </p>

        <div
          className={`upload-zone ${bannerDragOver ? "drag-over" : ""} ${
            design.bannerImage ? "has-image" : ""
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setBannerDragOver(true);
          }}
          onDragLeave={() => setBannerDragOver(false)}
          onDrop={onBannerDrop}
          id="banner-upload"
        >
          {design.bannerImage ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={design.bannerImage}
                alt="Banner preview"
                className="upload-preview"
              />
              <div className="upload-overlay">
                <span className="upload-overlay-text">Changer l&apos;image</span>
              </div>
            </>
          ) : (
            <>
              <div className="upload-zone-icon">📸</div>
              <div className="upload-zone-text">
                <p className="upload-zone-text-main">
                  Glissez-déposez votre image ici
                </p>
                <p className="upload-zone-text-sub">
                  ou cliquez pour parcourir vos fichiers
                </p>
              </div>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            className="upload-zone-input"
            onChange={onBannerChange}
            aria-label="Upload banner image"
          />
        </div>

        {design.bannerImage && (
          <div style={{ marginTop: "var(--space-md)", textAlign: "right" }}>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => {
                setBannerImage(null);
                showToast("🗑️ Banner supprimé");
              }}
              id="remove-banner-btn"
            >
              Supprimer le banner
            </button>
          </div>
        )}
      </section>

      {/* Columns Section */}
      <section className="section-card fade-in fade-in-delay-2" id="columns-section">
        <h2 className="section-title">
          <span className="section-title-icon">📐</span>
          Colonnes
        </h2>
        <p className="section-description">
          Configurez les 4 colonnes avec une image et un texte pour chacune.
        </p>

        <div className="columns-grid">
          {design.columns.map((col, index) => (
            <div
              key={col.id}
              className={`column-card fade-in fade-in-delay-${index + 1}`}
              id={`column-card-${col.id}`}
            >
              <div className="column-number">{col.id}</div>

              {/* Column Image Upload */}
              <div
                className={`column-upload ${col.image ? "has-image" : ""}`}
                id={`column-upload-${col.id}`}
              >
                {col.image ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={col.image}
                      alt={`Column ${col.id} preview`}
                      className="column-preview-img"
                    />
                    <div className="column-upload-overlay">
                      <span className="column-upload-overlay-text">Changer</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="column-upload-icon">🖼️</div>
                    <span className="column-upload-text">Ajouter une image</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="column-upload-input"
                  onChange={(e) => onColumnChange(col.id, e)}
                  aria-label={`Upload image for column ${col.id}`}
                />
              </div>

              {col.image && (
                <button
                  className="btn btn-danger btn-sm"
                  style={{ width: "100%", justifyContent: "center", marginBottom: "var(--space-md)" }}
                  onClick={() => {
                    setColumnImage(col.id, null);
                    showToast(`🗑️ Image colonne ${col.id} supprimée`);
                  }}
                  id={`remove-column-img-${col.id}`}
                >
                  Supprimer
                </button>
              )}

              {/* Column Text */}
              <label className="input-label" htmlFor={`column-text-${col.id}`}>
                Texte
              </label>
              <textarea
                id={`column-text-${col.id}`}
                className="text-input"
                placeholder={`Texte de la colonne ${col.id}...`}
                value={col.text}
                onChange={(e) => setColumnText(col.id, e.target.value)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Action Bar */}
      <div className="action-bar fade-in fade-in-delay-3">
        <div className="action-bar-left">
          {hasContent && (
            <button
              className="btn btn-ghost"
              onClick={() => {
                resetDesign();
                showToast("🔄 Design réinitialisé");
              }}
              id="reset-btn"
            >
              🔄 Réinitialiser
            </button>
          )}
        </div>
        <div className="action-bar-right">
          <a href="/apercu" className="btn btn-primary" id="preview-btn">
            👁️ Voir l&apos;aperçu
          </a>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`toast ${toastExiting ? "toast-exit" : ""}`}>
          <span className="toast-message">{toast}</span>
        </div>
      )}
    </>
  );
}
