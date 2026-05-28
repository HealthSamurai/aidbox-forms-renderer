import { when } from "mobx";

import type { IForm, IQuestionNode } from "@formbox/renderer";

export async function waitForOptions(store: IForm): Promise<void> {
  if (!hasLoadingOptions(store)) {
    return;
  }

  await when(() => !hasLoadingOptions(store));
}

export async function waitForQuestionOptions(
  question: IQuestionNode,
): Promise<void> {
  if (!hasLoadingQuestionOptions(question)) {
    return;
  }

  await when(() => !hasLoadingQuestionOptions(question));
}

function hasLoadingOptions(store: IForm): boolean {
  let loading = false;
  store.walkNodes({
    question(question) {
      if (hasLoadingQuestionOptions(question)) {
        loading = true;
      }
    },
  });
  return loading;
}

function hasLoadingQuestionOptions(question: IQuestionNode): boolean {
  const answerOptionsLoading = question.answerOption.select.isLoading;
  const unitOptionsLoading =
    question.type === "quantity" &&
    (question as IQuestionNode<"quantity">).unitOption.isLoading;

  return answerOptionsLoading || unitOptionsLoading;
}
