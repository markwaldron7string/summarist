"use client";

import { createContext, useContext, useState } from "react";

type FontContextType = {
  fontSize: number;
  setFontSize: (size: number) => void;
};

const FontSizeContext = createContext<FontContextType | null>(null);

const getInitialFontSize = () => {
  if (typeof window === "undefined") return 16;

  const saved = localStorage.getItem("reader-font-size");
  return saved ? Number(saved) : 16;
};

export function FontSizeProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSizeState] = useState(getInitialFontSize);

  const setFontSize = (size: number) => {
    setFontSizeState(size);
    localStorage.setItem("reader-font-size", size.toString());
  };

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
}

export function useFontSize() {
  const context = useContext(FontSizeContext);

  if (!context) {
    throw new Error("useFontSize must be used inside FontSizeProvider");
  }

  return context;
}
