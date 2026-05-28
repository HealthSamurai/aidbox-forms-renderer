import type { NodePath } from "@formbox/renderer";

import type { ActionKind } from "./template.ts";
import type { PathSegment } from "./types.ts";

export interface ParsedAction {
  readonly kind: ActionKind;
  readonly path: NodePath;
}

export function appendPath(
  path: readonly PathSegment[],
  linkId: string,
): readonly PathSegment[] {
  const last = path.at(-1);
  return last?.linkId === linkId ? path : [...path, { linkId }];
}

export function withLastIndex(
  path: readonly PathSegment[],
  index: number,
): readonly PathSegment[] {
  const last = path.at(-1);
  if (!last) {
    return path;
  }

  return [...path.slice(0, -1), { ...last, index }];
}

export function withoutLastIndex(
  path: readonly PathSegment[],
): readonly PathSegment[] {
  const last = path.at(-1);
  if (!last) {
    return path;
  }

  return [...path.slice(0, -1), { linkId: last.linkId }];
}

export function parseAction(action: string): ParsedAction | undefined {
  const match = /^([a-z-]+)((?:\[[^\]]*\])*)$/u.exec(action);
  const kind = match?.[1];
  if (!isActionKind(kind)) {
    return undefined;
  }

  const path = safeParsePath(match?.[2] ?? "");
  if (path.length === 0) {
    return undefined;
  }

  return { kind, path };
}

export function parseNonNegativeInteger(
  value: string | undefined,
): number | undefined {
  const parsed = parsePositiveInteger(value);
  return parsed === undefined ? undefined : Math.max(0, parsed);
}

function safeParsePath(value: string): NodePath {
  try {
    return parsePath(value);
  } catch {
    return [];
  }
}

function isActionKind(value: string | undefined): value is ActionKind {
  return (
    value === "add-group" ||
    value === "remove-group" ||
    value === "add-answer" ||
    value === "remove-answer" ||
    value === "toggle-expanded" ||
    value === "select-tab"
  );
}

function parsePath(value: string): NodePath {
  const parts = bracketParts(value);
  if (!parts) {
    return [];
  }

  const path: PathSegment[] = [];
  for (const part of parts) {
    if (part.startsWith("i:")) {
      const index = parseNonNegativeInteger(part.slice(2));
      const last = path.at(-1);
      if (!last || index === undefined) {
        return [];
      }
      path[path.length - 1] = { ...last, index };
      continue;
    }

    path.push({ linkId: decodeURIComponent(part) });
  }

  return path;
}

function bracketParts(value: string): string[] | undefined {
  const parts: string[] = [];
  let consumed = "";
  for (const match of value.matchAll(/\[([^\]]*)\]/gu)) {
    consumed += match[0];
    parts.push(match[1] ?? "");
  }

  return consumed === value ? parts : undefined;
}

function parsePositiveInteger(value: string | undefined): number | undefined {
  if (!value || !/^\d+$/u.test(value)) {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}
