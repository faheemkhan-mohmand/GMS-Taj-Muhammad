import { useState, useEffect, useCallback } from "react";

/** System preference is the default; explicit bright/dark choices persist. */
export type ThemeMode = "system" | "bright" | "dark";

const STORAGE_KEY = "gms-theme";
const LEGACY_CLASSES = ["theme-midnight", "theme-forest", "theme-violet", "theme-lantern"];

function getSystemPrefersDark(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function readInitial(): ThemeMode {
  if (typeof window === "undefined") return "system";
  let saved: string | null = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch { /* storage may be blocked */ }
  if (saved === "dark" || saved === "midnight" || saved === "lantern") return "dark";
  if (saved === "bright" || saved === "light") return "bright";
  return "system";
}

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  LEGACY_CLASSES.forEach((c) => root.classList.remove(c));
  const isDark = mode === "dark" || (mode === "system" && getSystemPrefersDark());
  root.dataset.theme = isDark ? "dark" : "bright";
  root.classList.toggle("dark", isDark);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", isDark ? "#0B1F14" : "#FAFDF7");
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>(() => readInitial());

  useEffect(() => {
    applyTheme(theme);
    if (theme !== "system" || typeof window === "undefined") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => applyTheme("system");
    mql.addEventListener("change", listener);
    return () => mql.removeEventListener("change", listener);
  }, [theme]);

  const setTheme = useCallback((mode: ThemeMode) => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
      localStorage.removeItem("gms-dark-mode");
      localStorage.removeItem("gms-dark-mode-manual");
    } catch { /* theme remains usable for this page even if storage is blocked */ }
    applyTheme(mode);
    setThemeState(mode);
  }, []);

  return { theme, setTheme };
}
