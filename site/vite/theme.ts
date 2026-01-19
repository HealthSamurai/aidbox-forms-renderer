type Theme = {
  colors?: Record<string, string>;
};

export const DOCS_CODE_THEME = "github-dark";

const getTheme = async (): Promise<Theme> => {
  const { bundledThemes } = await import("shiki");
  const load = bundledThemes[DOCS_CODE_THEME];
  if (!load) {
    throw new Error(`Shiki theme "${DOCS_CODE_THEME}" was not found.`);
  }
  const theme = await load();
  return (theme.default ?? theme) as Theme;
};

export const getCodeBlockBackground = async () => {
  const theme = await getTheme();
  const colors = theme.colors ?? {};
  return (
    colors["textCodeBlock.background"] ||
    colors["editor.background"] ||
    colors["background"] ||
    colors["panel.background"] ||
    colors["sideBar.background"] ||
    ""
  );
};

export const getThemeVariables = async () => {
  const theme = await getTheme();
  const colors = theme.colors ?? {};
  const background =
    colors["editor.background"] ||
    colors["background"] ||
    colors["panel.background"] ||
    colors["sideBar.background"] ||
    colors["activityBar.background"] ||
    colors["statusBar.background"];
  const foreground =
    colors["editor.foreground"] ||
    colors["foreground"] ||
    colors["textPreformat.foreground"] ||
    colors["descriptionForeground"];
  const border =
    colors["panel.border"] ||
    colors["editorGroup.border"] ||
    colors["sideBar.border"] ||
    colors["input.border"] ||
    colors["textSeparator.foreground"];
  const primaryColor =
    colors["panel.background"] ||
    colors["editorWidget.background"] ||
    colors["tab.inactiveBackground"] ||
    colors["list.hoverBackground"] ||
    colors["editor.lineHighlightBackground"];
  const lineColor =
    colors["textSeparator.foreground"] ||
    colors["editorIndentGuide.activeBackground"] ||
    colors["editorIndentGuide.background"] ||
    colors["editorLineNumber.foreground"] ||
    colors["editorWhitespace.foreground"] ||
    foreground ||
    border;
  const themeVariables: Record<string, string> = {};
  if (background) {
    themeVariables["background"] = background;
    themeVariables["mainBkg"] = background;
  }
  if (primaryColor) {
    themeVariables["primaryColor"] = primaryColor;
  }
  if (foreground) {
    themeVariables["textColor"] = foreground;
    themeVariables["primaryTextColor"] = foreground;
  }
  if (border) {
    themeVariables["primaryBorderColor"] = border;
  }
  if (lineColor) {
    themeVariables["lineColor"] = lineColor;
  }
  return themeVariables;
};
