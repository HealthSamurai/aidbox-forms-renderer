import type { IForm } from "@formbox/renderer";
import type { NodePath } from "@formbox/theme";

import { tabName } from "./template.ts";

const activeTabs = new WeakMap<IForm, Map<string, number>>();

export function getActiveTab(
  store: IForm,
  path: NodePath,
  total: number,
): number {
  const index = activeTabs.get(store)?.get(tabName(path)) ?? 0;
  return clampTabIndex(index, total);
}

export function setActiveTab(
  store: IForm,
  path: NodePath,
  index: number,
  total: number,
): void {
  let state = activeTabs.get(store);
  if (!state) {
    state = new Map();
    activeTabs.set(store, state);
  }

  state.set(tabName(path), clampTabIndex(index, total));
}

function clampTabIndex(index: number, total: number): number {
  if (!Number.isInteger(index) || index < 0 || total <= 0) {
    return 0;
  }

  return Math.min(index, total - 1);
}
