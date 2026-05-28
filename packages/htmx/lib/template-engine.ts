import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import Handlebars from "handlebars";

import type {
  HtmlAttributes,
  Template,
  TemplateName,
  TemplateProperties,
  RequiredTemplates,
  Templates,
} from "./template.ts";
import { attribute, htmlAttributes, templateNames } from "./template.ts";

const TEMPLATE_EXTENSION = ".html.hbs";
const templateNameSet = new Set<string>(templateNames);

const handlebars = Handlebars.create();

handlebars.registerHelper("attr", (name: unknown, value: unknown) =>
  safeString(typeof name === "string" ? attribute(name, value) : ""),
);

handlebars.registerHelper("attrs", (value: unknown) =>
  safeString(htmlAttributes(toHtmlAttributes(value))),
);

handlebars.registerHelper(
  "fieldAttributes",
  function fieldAttributes(this: unknown, value?: unknown) {
    return safeString(
      fieldAttributeHtml(isHandlebarsOptions(value) ? this : value),
    );
  },
);

export type TemplateSource<TProperties extends TemplateProperties> =
  | Template<TProperties>
  | string;

export type TemplateSources = {
  readonly [K in keyof Templates]?: NonNullable<Templates[K]> | string;
};

export function compileTemplate<TProperties extends TemplateProperties>(
  source: TemplateSource<TProperties>,
): Template<TProperties> {
  if (typeof source === "function") {
    return source;
  }

  return compileHtml<TProperties>(source);
}

function compileHtml<TProperties extends object>(
  source: string,
): (properties: TProperties) => string {
  const template = handlebars.compile<TProperties>(source);
  return (properties) => template(properties);
}

export function compileTemplates(sources: TemplateSources): Templates {
  return Object.fromEntries(
    templateNames.flatMap((name) => {
      const source = sources[name] as
        | TemplateSource<TemplateProperties>
        | undefined;
      return source === undefined ? [] : [[name, compileTemplate(source)]];
    }),
  ) as Templates;
}

export async function loadDefaultTemplates(): Promise<RequiredTemplates> {
  const templates = await loadTemplates(
    new URL(/* @vite-ignore */ "templates/", import.meta.url),
  );
  const missing = templateNames.filter((name) => templates[name] === undefined);
  if (missing.length > 0) {
    throw new Error(`Missing default template files: ${missing.join(", ")}`);
  }

  return templates as RequiredTemplates;
}

export async function loadTemplates(
  directory: string | URL,
): Promise<Templates> {
  const sources: Partial<Record<TemplateName, string>> = {};
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(TEMPLATE_EXTENSION)) {
      continue;
    }

    const templateName = entry.name.slice(0, -TEMPLATE_EXTENSION.length);
    if (!isTemplateName(templateName)) {
      throw new Error(`Unknown template file: ${entry.name}`);
    }

    const source = await readFile(templateFile(directory, entry.name), "utf8");
    sources[templateName] = source.replace(/\r?\n$/u, "");
  }

  return compileTemplates(sources);
}

function templateFile(directory: string | URL, file: string): string | URL {
  return typeof directory === "string"
    ? path.join(directory, file)
    : new URL(file, directory);
}

function isTemplateName(value: string): value is TemplateName {
  return templateNameSet.has(value);
}

function safeString(value: string): Handlebars.SafeString {
  return new handlebars.SafeString(value);
}

function toHtmlAttributes(value: unknown): HtmlAttributes {
  if (!isRecord(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).filter((entry): entry is [string, HtmlAttribute] =>
      isHtmlAttribute(entry[1]),
    ),
  );
}

type HtmlAttribute = string | number | boolean | null | undefined;

function isHtmlAttribute(value: unknown): value is HtmlAttribute {
  return (
    value === undefined ||
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

function fieldAttributeHtml(value: unknown): string {
  if (!isRecord(value)) {
    return "";
  }

  return [
    attribute("data-fb-link-id", value["data-fb-link-id"]),
    attribute("data-fb-field", value["data-fb-field"]),
    attribute("name", value["name"]),
    attribute("hx-include", value["hx-include"]),
  ].join("");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isHandlebarsOptions(value: unknown): boolean {
  return isRecord(value) && "lookupProperty" in value && "name" in value;
}
