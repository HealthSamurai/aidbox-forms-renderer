import type { ComponentType } from "react";

export type LanguageOption = {
  value: string;
  label: string;
};

export type LanguageSelectorProperties = {
  id?: string | undefined;
  options: readonly LanguageOption[];
  value: string;
  onChange: (value: string) => void;
};

export type LanguageSelectorComponent =
  ComponentType<LanguageSelectorProperties>;
