export type DemoExample = {
  readonly id: string;
  readonly questionnaire: Record<string, unknown>;
};

const exampleIds = [
  "basic",
  "answer-types",
  "item-controls",
  "pages",
  "expressions",
  "visibility",
  "repeats",
] as const;

export async function loadExamples(): Promise<readonly DemoExample[]> {
  return await Promise.all(exampleIds.map((id) => loadExample(id)));
}

export async function loadExample(id: string): Promise<DemoExample> {
  if (!exampleIds.includes(id as (typeof exampleIds)[number])) {
    throw new Response("Not found", { status: 404 });
  }

  const questionnaire = (await Bun.file(
    new URL(`./examples/${id}.json`, import.meta.url),
  ).json()) as Record<string, unknown>;

  return { id, questionnaire };
}
