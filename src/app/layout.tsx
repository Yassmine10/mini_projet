import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { DesignProvider } from "@/context/DesignContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Design Builder — Mini Projet",
  description:
    "Configurez et prévisualisez un design web avec banner et colonnes personnalisables.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>
        <DesignProvider>
          <div className="app-container">
            <Navigation />
            <main className="main-content">{children}</main>
          </div>
        </DesignProvider>
      </body>
    </html>
  );
}
