import { useEffect, useState } from "react";

export type Theme = "light" | "dark" | "midnight" | "rose";

const THEMES: { id: Theme; label: string; swatches: string[] }[] = [
  { id: "light", label: "Warm Dawn", swatches: ["#f8f3ed", "#e8845a", "#c97040"] },
  { id: "dark", label: "Charcoal", swatches: ["#141210", "#e8845a", "#e8a86e"] },
  { id: "midnight", label: "Midnight", swatches: ["#0b0f1c", "#e8845a", "#5bbdd6"] },
  { id: "rose", label: "Rose Gold", swatches: ["#160b10", "#c96882", "#e89558"] },
];

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("theme-dark", "theme-midnight", "theme-rose");
  if (theme !== "light") {
    root.classList.add(`theme-${theme}`);
  }
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("charm-theme") as Theme) ?? "light";
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Apply on mount
  useEffect(() => {
    applyTheme(theme);
  }, []);

  const changeTheme = (t: Theme) => {
    setTheme(t);
    localStorage.setItem("charm-theme", t);
  };

  return { theme, changeTheme, themes: THEMES };
}
