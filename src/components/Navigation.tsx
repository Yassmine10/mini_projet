"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Top navigation bar with links to Paramétrage and Aperçu pages.
 * Highlights the active route.
 */
export function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Paramétrage", icon: "⚙️" },
    { href: "/apercu", label: "Aperçu", icon: "👁️" },
  ];

  return (
    <nav className="nav" id="main-nav">
      <Link href="/" className="nav-logo">
        DesignBuilder
      </Link>

      <div className="nav-links">
        {links.map((link) => {
          const isActive =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${isActive ? "active" : ""}`}
              id={`nav-link-${link.href === "/" ? "parametrage" : "apercu"}`}
            >
              <span className="nav-link-icon">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
