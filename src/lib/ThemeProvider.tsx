"use client";

import { createContext, useContext, useCallback, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{
  theme: Theme;
  mounted: boolean;
  toggle: () => void;
}>({ theme: "light", mounted: false, toggle: () => {} });

/* ── tiny external store so we never call setState inside an effect ── */
let _theme: Theme = "light";
const _listeners = new Set<() => void>();
function _notify() { _listeners.forEach((l) => l()); }
function _subscribe(cb: () => void) { _listeners.add(cb); return () => { _listeners.delete(cb); }; }
function _getSnapshot(): Theme { return _theme; }
function _getServerSnapshot(): Theme { return "light"; }

function _setTheme(next: Theme) {
  _theme = next;
  document.documentElement.classList.toggle("dark", next === "dark");
  localStorage.setItem("bp-theme", next);
  _notify();
}

/* Initialise from localStorage once on the client */
let _initialised = false;
function _init() {
  if (_initialised || typeof window === "undefined") return;
  _initialised = true;
  const stored = localStorage.getItem("bp-theme") as Theme | null;
  _theme = stored || "light";
  document.documentElement.classList.toggle("dark", _theme === "dark");
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  _init();
  const theme = useSyncExternalStore(_subscribe, _getSnapshot, _getServerSnapshot);
  const mounted = typeof window !== "undefined" && _initialised;

  const toggle = useCallback(() => {
    _setTheme(theme === "light" ? "dark" : "light");
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, mounted, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
