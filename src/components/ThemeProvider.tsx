"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type Theme = "dark" | "light";
type ColorScheme = "default" | "red" | "golden" | "emerald" | "ocean" | "rose" | "cyber" | "sunset" | "arctic" | "lavender" | "copper" | "lime" | "blood" | "sapphire" | "peach";

export const COLOR_SCHEMES: { id: ColorScheme; label: string; primary: string; accent: string }[] = [
  { id: "default", label: "Purple Haze", primary: "#6C63FF", accent: "#00D4FF" },
  { id: "red", label: "Crimson Red", primary: "#E5133A", accent: "#FF2D55" },
  { id: "golden", label: "Golden Cinematic", primary: "#D4A017", accent: "#C7944A" },
  { id: "emerald", label: "Emerald Noir", primary: "#00C853", accent: "#69F0AE" },
  { id: "ocean", label: "Deep Ocean", primary: "#0066FF", accent: "#00B4D8" },
  { id: "rose", label: "Rose Quartz", primary: "#E91E8C", accent: "#FF6FB5" },
  { id: "cyber", label: "Cyber Neon", primary: "#00FF9F", accent: "#00E5FF" },
  { id: "sunset", label: "Sunset Blaze", primary: "#FF6B35", accent: "#FFD166" },
  { id: "arctic", label: "Arctic Frost", primary: "#48CAE4", accent: "#ADE8F4" },
  { id: "lavender", label: "Lavender Dream", primary: "#9B5DE5", accent: "#C77DFF" },
  { id: "copper", label: "Burnished Copper", primary: "#B87333", accent: "#E8A87C" },
  { id: "lime", label: "Electric Lime", primary: "#AAFF00", accent: "#D4FF00" },
  { id: "blood", label: "Blood Moon", primary: "#8B0000", accent: "#DC143C" },
  { id: "sapphire", label: "Royal Sapphire", primary: "#0F52BA", accent: "#6495ED" },
  { id: "peach", label: "Peach Blossom", primary: "#FF6F61", accent: "#FFB5A7" },
];

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
  colorScheme: "default",
  setColorScheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

const schemeIds = COLOR_SCHEMES.map((s) => s.id);

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>("default");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("portfolio-theme") as Theme | null;
    const storedColor = localStorage.getItem("portfolio-color-scheme") as ColorScheme | null;
    if (stored) setTheme(stored);
    if (storedColor && schemeIds.includes(storedColor)) setColorSchemeState(storedColor);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
    localStorage.setItem("portfolio-theme", theme);
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    schemeIds.forEach((s) => root.classList.remove(`scheme-${s}`));
    root.classList.add(`scheme-${colorScheme}`);
    localStorage.setItem("portfolio-color-scheme", colorScheme);
  }, [colorScheme, mounted]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  const setColorScheme = (scheme: ColorScheme) => setColorSchemeState(scheme);

  if (!mounted) {
    return <div className="dark">{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colorScheme, setColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
