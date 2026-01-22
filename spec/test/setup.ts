import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import { theme as hsTheme } from "@formbox/hs-theme";

vi.mock("@formbox/renderer/ui/theme.tsx", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  useTheme: () => hsTheme,
}));

afterEach(() => {
  cleanup();
});
