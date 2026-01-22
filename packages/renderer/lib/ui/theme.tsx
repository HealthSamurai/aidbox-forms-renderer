/* eslint-disable react-refresh/only-export-components */
import type { Theme } from "@formbox/theme";
import { createContext, type PropsWithChildren, useContext } from "react";
import { assertDefined } from "../utilities.ts";

const ThemeContext = createContext<Theme | undefined>(undefined);

export function ThemeProvider({
  theme: providedTheme,
  children,
}: PropsWithChildren<{ theme: Theme }>) {
  return (
    <ThemeContext.Provider value={providedTheme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): Theme {
  const theme = useContext(ThemeContext);
  assertDefined(theme, "ThemeProvider is required to render the form.");
  return theme;
}
