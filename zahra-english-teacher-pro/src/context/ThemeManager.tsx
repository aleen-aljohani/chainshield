"use client";

import { useEffect } from "react";
import { useStore } from "./StoreProvider";

/** Applies theme, language direction, and reduced-motion to <html>. */
export function ThemeManager() {
  const { state } = useStore();
  const { theme, language, reducedMotion } = state.settings;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.setAttribute("lang", language);
    root.setAttribute("dir", language === "ar" ? "rtl" : "ltr");
    root.classList.toggle("reduce-motion", reducedMotion);
  }, [theme, language, reducedMotion]);

  return null;
}
