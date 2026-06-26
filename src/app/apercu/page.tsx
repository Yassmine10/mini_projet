"use client";

import React from "react";
import Link from "next/link";
import { useDesign } from "@/context/DesignContext";

/**
 * Page 2 — Aperçu
 *
 * Displays a live preview of the design configured
 * on the Paramétrage page.
 */
export default function ApercuPage() {
  const { design, hasContent, isLoading } = useDesign();

  if (isLoading) {
    return (
      <div className="loader-container">
        <div className="spinner" />
        <span style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Chargement de l'aperçu...
        </span>
      </div>
    );
  }

  return (
    <>
      {/* Page Header */}
      <div className="page-header fade-in">
        <h1 className="page-title">Aperçu du Design</h1>
        <p className="page-subtitle">
          Visualisez le rendu final de votre configuration.
        </p>
      </div>

      {hasContent ? (
        <div className="preview-container fade-in fade-in-delay-1" id="preview-container">
          {/* Banner Preview */}
          <div className="preview-banner" id="preview-banner">
            {design.bannerImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={design.bannerImage} alt="Banner" />
            ) : (
              <div className="preview-banner-placeholder">
                <span className="preview-banner-placeholder-icon">🖼️</span>
                <span>Aucun banner configuré</span>
              </div>
            )}
          </div>

          {/* Columns Preview */}
          <div className="preview-columns" id="preview-columns">
            {design.columns.map((col, index) => (
              <div
                key={col.id}
                className={`preview-column fade-in fade-in-delay-${index + 1}`}
                id={`preview-column-${col.id}`}
              >
                <div className="preview-column-img-wrapper">
                  {col.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={col.image} alt={`Column ${col.id}`} />
                  ) : (
                    <div className="preview-column-placeholder">🖼️</div>
                  )}
                </div>
                <p className="preview-column-text">
                  {col.text || (
                    <span style={{ opacity: 0.4, fontStyle: "italic" }}>
                      Aucun texte
                    </span>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="section-card fade-in fade-in-delay-1">
          <div className="empty-state" id="empty-state">
            <div className="empty-state-icon">✨</div>
            <h2 className="empty-state-title">Aucun contenu configuré</h2>
            <p className="empty-state-text">
              Retournez à la page de paramétrage pour configurer votre banner et
              vos colonnes, puis revenez ici pour voir l&apos;aperçu.
            </p>
            <Link href="/" className="btn btn-primary" id="go-to-settings-btn">
              ⚙️ Aller au paramétrage
            </Link>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="action-bar fade-in fade-in-delay-3">
        <div className="action-bar-left">
          <Link href="/" className="btn btn-ghost" id="back-to-settings-btn">
            ← Retour au paramétrage
          </Link>
        </div>
      </div>
    </>
  );
}
