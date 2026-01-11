import { describe, expect, it } from "vitest";
import type { Questionnaire } from "fhir/r5";

import { FormStore } from "../../form/form-store.ts";
import {
  assertQuestionNode,
  isQuestionNode,
} from "../../question/question-store.ts";
import {
  assertGroupListStore,
  isGroupListStore,
} from "../../group/group-list-store.ts";
import { EXT } from "../../../utilities.ts";

describe("preferredTerminologyServer resolution", () => {
  it("uses the node-level preferredTerminologyServer extension when present", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "direct",
          type: "coding",
          extension: [
            {
              url: EXT.PREFERRED_TERMINOLOGY_SERVER,
              valueUrl: "https://terminology.example/direct",
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const node = form.scope.lookupNode("direct");
    expect(node?.preferredTerminologyServers).toEqual([
      "https://terminology.example/direct",
    ]);
  });

  it("falls back to the Questionnaire-level preferredTerminologyServer extension", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      extension: [
        {
          url: EXT.PREFERRED_TERMINOLOGY_SERVER,
          valueUrl: "https://terminology.example/questionnaire",
        },
      ],
      item: [
        {
          linkId: "root-question",
          type: "coding",
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const node = form.scope.lookupNode("root-question");
    expect(node?.preferredTerminologyServers).toEqual([
      "https://terminology.example/questionnaire",
    ]);
  });

  it("orders preferred servers by ancestry while deduplicating entries", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      extension: [
        {
          url: EXT.PREFERRED_TERMINOLOGY_SERVER,
          valueUrl: "https://terminology.example/questionnaire",
        },
        {
          url: EXT.PREFERRED_TERMINOLOGY_SERVER,
          valueUrl: "https://terminology.example/shared",
        },
      ],
      item: [
        {
          linkId: "group",
          type: "group",
          extension: [
            {
              url: EXT.PREFERRED_TERMINOLOGY_SERVER,
              valueUrl: "https://terminology.example/group-only",
            },
            {
              url: EXT.PREFERRED_TERMINOLOGY_SERVER,
              valueUrl: "https://terminology.example/shared",
            },
          ],
          item: [
            {
              linkId: "question",
              type: "coding",
              extension: [
                {
                  url: EXT.PREFERRED_TERMINOLOGY_SERVER,
                  valueUrl: "https://terminology.example/item-first",
                },
                {
                  url: EXT.PREFERRED_TERMINOLOGY_SERVER,
                  valueUrl: "https://terminology.example/shared",
                },
                {
                  url: EXT.PREFERRED_TERMINOLOGY_SERVER,
                  valueUrl: "https://terminology.example/item-second",
                },
              ],
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const node = form.scope.lookupNode("question");
    expect(node?.preferredTerminologyServers).toEqual([
      "https://terminology.example/item-first",
      "https://terminology.example/shared",
      "https://terminology.example/item-second",
      "https://terminology.example/group-only",
      "https://terminology.example/questionnaire",
    ]);
  });

  it("inherits preferredTerminologyServer from an ancestor repeating group", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "repeating-group",
          type: "group",
          repeats: true,
          required: true,
          extension: [
            {
              url: EXT.PREFERRED_TERMINOLOGY_SERVER,
              valueUrl: "https://terminology.example/group",
            },
          ],
          item: [
            {
              linkId: "group-question",
              type: "coding",
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const list = form.scope.lookupNode("repeating-group");
    expect(list && isGroupListStore(list)).toBe(true);
    assertGroupListStore(list);

    const node = list.nodes[0];
    expect(node).toBeDefined();
    const childQuestion = node?.nodes.find(
      (node) => node.linkId === "group-question",
    );
    expect(childQuestion?.preferredTerminologyServers[0]).toBe(
      "https://terminology.example/group",
    );
  });

  it("inherits preferredTerminologyServer through answer instances", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "parent-question",
          type: "string",
          extension: [
            {
              url: EXT.PREFERRED_TERMINOLOGY_SERVER,
              valueUrl: "https://terminology.example/parent",
            },
          ],
          item: [
            {
              linkId: "answer-child",
              type: "string",
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const parent = form.scope.lookupNode("parent-question");
    expect(parent && isQuestionNode(parent)).toBe(true);
    assertQuestionNode(parent);

    const firstAnswer = parent.answers[0];
    expect(firstAnswer).toBeDefined();
    const childNode = firstAnswer?.nodes.find(
      (node) => node.linkId === "answer-child",
    );

    expect(childNode?.preferredTerminologyServers[0]).toBe(
      "https://terminology.example/parent",
    );
  });

  it("propagates through repeating group nodes into nested answer child nodes", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      item: [
        {
          linkId: "rg",
          type: "group",
          repeats: true,
          required: true,
          extension: [
            {
              url: EXT.PREFERRED_TERMINOLOGY_SERVER,
              valueUrl: "https://terminology.example/repeating-group",
            },
          ],
          item: [
            {
              linkId: "rg-question",
              type: "string",
              item: [
                {
                  linkId: "nested-answer-child",
                  type: "coding",
                },
              ],
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const list = form.scope.lookupNode("rg");
    expect(list && isGroupListStore(list)).toBe(true);
    assertGroupListStore(list);

    const node = list.nodes[0];
    const question = node?.nodes.find((node) => node.linkId === "rg-question");
    expect(question && isQuestionNode(question)).toBe(true);
    assertQuestionNode(question);

    const answerChild = question.answers[0]?.nodes.find(
      (node) => node.linkId === "nested-answer-child",
    );

    expect(answerChild?.preferredTerminologyServers[0]).toBe(
      "https://terminology.example/repeating-group",
    );
  });

  it("prefers node-level extension when ancestors also declare preferred server", () => {
    const questionnaire: Questionnaire = {
      resourceType: "Questionnaire",
      status: "active",
      extension: [
        {
          url: EXT.PREFERRED_TERMINOLOGY_SERVER,
          valueUrl: "https://terminology.example/questionnaire",
        },
      ],
      item: [
        {
          linkId: "group",
          type: "group",
          extension: [
            {
              url: EXT.PREFERRED_TERMINOLOGY_SERVER,
              valueUrl: "https://terminology.example/group",
            },
          ],
          item: [
            {
              linkId: "question",
              type: "coding",
              extension: [
                {
                  url: EXT.PREFERRED_TERMINOLOGY_SERVER,
                  valueUrl: "https://terminology.example/question",
                },
              ],
            },
          ],
        },
      ],
    };

    const form = new FormStore(questionnaire);
    const node = form.scope.lookupNode("question");
    expect(node?.preferredTerminologyServers[0]).toBe(
      "https://terminology.example/question",
    );
  });
});
