/* eslint-disable react-refresh/only-export-components */
import type { Theme } from "@aidbox-forms/theme";
import { createContext, type PropsWithChildren, useContext } from "react";

const fallbackTheme = {} as Theme;

let defaultTheme: Theme = fallbackTheme;

try {
  const module = await import("@aidbox-forms/hs-theme");
  defaultTheme = module.theme;
} catch {
  defaultTheme = fallbackTheme;
}

const ThemeContext = createContext<Theme>(defaultTheme);

export function ThemeProvider({
  theme,
  children,
}: PropsWithChildren<{ theme?: Theme | undefined }>) {
  return (
    <ThemeContext.Provider value={theme ?? defaultTheme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}
