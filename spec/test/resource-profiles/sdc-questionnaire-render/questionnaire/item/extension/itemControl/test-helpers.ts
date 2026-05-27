import { expect } from "vitest";

import { FormStore } from "@formbox/renderer/store/form/form-store.ts";
import { isGroupNode } from "@formbox/renderer/store/group/group-store.ts";
import { isGroupListStore } from "@formbox/renderer/store/group/group-list-store.ts";
import { isQuestionNode } from "@formbox/renderer/store/question/question-store.ts";
import { EXT, ITEM_CONTROL_SYSTEM } from "@formbox/renderer/utilities.ts";

import type {
  IGroupList,
  IGroupNode,
  IQuestionNode,
  ItemControl,
} from "@formbox/renderer/types.ts";

export function itemControlExtension(code: ItemControl) {
  return {
    url: EXT.ITEM_CONTROL,
    valueCodeableConcept: {
      coding: [
        {
          system: ITEM_CONTROL_SYSTEM,
          code,
        },
      ],
    },
  };
}

export function getQuestionNode(
  form: FormStore,
  linkId: string,
): IQuestionNode {
  const node = form.scope.lookupNode(linkId);
  expect(node && isQuestionNode(node)).toBe(true);
  if (!node || !isQuestionNode(node)) {
    throw new Error(`Expected question node for ${linkId}`);
  }
  return node;
}

export function getGroupNode(form: FormStore, linkId: string): IGroupNode {
  const node = form.scope.lookupNode(linkId);
  expect(node && isGroupNode(node)).toBe(true);
  if (!node || !isGroupNode(node)) {
    throw new Error(`Expected group node for ${linkId}`);
  }
  return node;
}

export function getGroupListNode(form: FormStore, linkId: string): IGroupList {
  const node = form.scope.lookupNode(linkId);
  expect(node && isGroupListStore(node)).toBe(true);
  if (!node || !isGroupListStore(node)) {
    throw new Error(`Expected group list node for ${linkId}`);
  }
  return node;
}
