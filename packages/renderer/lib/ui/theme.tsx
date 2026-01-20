/* eslint-disable react-refresh/only-export-components */
import { theme } from "@formbox/hs-theme";
import type { Theme } from "@formbox/theme";
import { createContext, type PropsWithChildren, useContext } from "react";

const ThemeContext = createContext<Theme>(theme);

export function ThemeProvider({
  theme: providedTheme = theme,
  children,
}: PropsWithChildren<{ theme?: Theme | undefined }>) {
  return (
    <ThemeContext.Provider value={providedTheme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}
