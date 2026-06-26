"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

const STORAGE_KEY = "design_builder_config";

/**
 * Represents a single column in the design grid.
 */
export interface ColumnData {
  id: number;
  image: string | null;
  text: string;
}

/**
 * The complete design configuration state.
 */
export interface DesignState {
  bannerImage: string | null;
  columns: ColumnData[];
}

/**
 * Context value shape exposed to consumers.
 */
interface DesignContextValue {
  design: DesignState;
  setBannerImage: (image: string | null) => void;
  setColumnImage: (columnId: number, image: string | null) => void;
  setColumnText: (columnId: number, text: string) => void;
  resetDesign: () => void;
  saveDesign: () => Promise<boolean>;
  isLoading: boolean;
  hasContent: boolean;
}

/** Default empty state for the 4 columns */
const createDefaultColumns = (): ColumnData[] =>
  Array.from({ length: 4 }, (_, i) => ({
    id: i + 1,
    image: null,
    text: "",
  }));

const initialDesignState: DesignState = {
  bannerImage: null,
  columns: createDefaultColumns(),
};

/** Load persisted design from localStorage, or return the default state. */
function loadFromStorage(): DesignState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialDesignState;
    const parsed = JSON.parse(raw) as Partial<DesignState>;

    // Ensure we always have exactly 4 columns
    const savedColumns: ColumnData[] = parsed.columns ?? [];
    const finalColumns = createDefaultColumns().map((defaultCol) => {
      const found = savedColumns.find((c) => c.id === defaultCol.id);
      return found ?? defaultCol;
    });

    return {
      bannerImage: parsed.bannerImage ?? null,
      columns: finalColumns,
    };
  } catch {
    return initialDesignState;
  }
}

/** Persist the design state to localStorage. */
function saveToStorage(state: DesignState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error("Failed to save design config to localStorage:", err);
  }
}

const DesignContext = createContext<DesignContextValue | undefined>(undefined);

/**
 * Provider that manages the shared design state and persists it
 * in the browser's localStorage (no backend required).
 */
export function DesignProvider({ children }: { children: ReactNode }) {
  const [design, setDesign] = useState<DesignState>(initialDesignState);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate state from localStorage on first render (client-side only)
  useEffect(() => {
    setDesign(loadFromStorage());
    setIsLoading(false);
  }, []);

  /** Save current design to localStorage and return true on success. */
  const saveDesign = useCallback(
    async (stateToSave: DesignState = design): Promise<boolean> => {
      saveToStorage(stateToSave);
      return true;
    },
    [design]
  );

  const setBannerImage = useCallback(
    (image: string | null) => {
      setDesign((prev) => {
        const updated = { ...prev, bannerImage: image };
        saveToStorage(updated);
        return updated;
      });
    },
    []
  );

  const setColumnImage = useCallback(
    (columnId: number, image: string | null) => {
      setDesign((prev) => {
        const updated = {
          ...prev,
          columns: prev.columns.map((col) =>
            col.id === columnId ? { ...col, image } : col
          ),
        };
        saveToStorage(updated);
        return updated;
      });
    },
    []
  );

  const setColumnText = useCallback((columnId: number, text: string) => {
    setDesign((prev) => {
      const updated = {
        ...prev,
        columns: prev.columns.map((col) =>
          col.id === columnId ? { ...col, text } : col
        ),
      };
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const resetDesign = useCallback(() => {
    const cleared: DesignState = {
      bannerImage: null,
      columns: createDefaultColumns(),
    };
    setDesign(cleared);
    saveToStorage(cleared);
  }, []);

  const hasContent =
    design.bannerImage !== null ||
    design.columns.some((col) => col.image !== null || col.text.trim() !== "");

  return (
    <DesignContext.Provider
      value={{
        design,
        setBannerImage,
        setColumnImage,
        setColumnText,
        resetDesign,
        saveDesign,
        isLoading,
        hasContent,
      }}
    >
      {children}
    </DesignContext.Provider>
  );
}

/**
 * Hook to access the design context.
 * Throws if used outside of DesignProvider.
 */
export function useDesign(): DesignContextValue {
  const context = useContext(DesignContext);
  if (!context) {
    throw new Error("useDesign must be used within a DesignProvider");
  }
  return context;
}
