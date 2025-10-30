import { ThemeProvider } from "@tracktor/design-system";
import { createContext, ReactNode, useContext, useState } from "react";

type ThemeMode = "light" | "dark";

interface ThemeModeContextValue {
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeModeContext = createContext<ThemeModeContextValue | undefined>(undefined);

export const ThemeModeProvider = ({ children }: { children: ReactNode }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>("dark");

  const toggleTheme = () => setThemeMode((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <ThemeModeContext.Provider value={{ setThemeMode, themeMode, toggleTheme }}>
      <ThemeProvider theme={themeMode}>{children}</ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export const useThemeMode = (): ThemeModeContextValue => {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) {
    throw new Error("useThemeMode must be used inside ThemeModeProvider");
  }
  return ctx;
};
