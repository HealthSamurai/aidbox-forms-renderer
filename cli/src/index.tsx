import Renderer from "@aidbox-forms/renderer";
import {
  Provider as FocusProvider,
  theme as opentuiTheme,
} from "@aidbox-forms/opentui-theme";
import { createCliRenderer } from "@opentui/core";
import { createRoot, useKeyboard, useRenderer } from "@opentui/react";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import type { Questionnaire, QuestionnaireResponse } from "fhir/r5";
import { useCallback, useEffect, useMemo } from "react";

type CliOptions = {
  questionnairePath: string;
  initialResponsePath: string | undefined;
  terminologyServerUrl: string | undefined;
  outputPath: string | undefined;
};

type CompletionState =
  | { status: "submit"; response: QuestionnaireResponse }
  | { status: "exit" };

type CompletionHandler = (state: CompletionState) => void;

type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason?: unknown) => void;
};

function createDeferred<T>(): Deferred<T> {
  let resolve: ((value: T) => void) | undefined;
  let reject: ((reason?: unknown) => void) | undefined;

  const promise = new Promise<T>((resolveFunction, rejectFunction) => {
    resolve = resolveFunction;
    reject = rejectFunction;
  });

  if (!resolve || !reject) {
    throw new Error("Failed to create deferred promise.");
  }

  return { promise, resolve, reject };
}

function usage(): string {
  return `Usage:
  pnpm -C cli dev -- --questionnaire <path> [--initial-response <path>] [--terminology-server-url <url>] [--output <path>]

Flags:
  --questionnaire           Path to Questionnaire JSON (required)
  --initial-response        Path to QuestionnaireResponse JSON
  --terminology-server-url  FHIR terminology server base URL
  --output                  Write response JSON to this file on submit
`;
}

function findAttachmentItems(items: unknown): boolean {
  if (!Array.isArray(items)) return false;

  for (const entry of items) {
    if (!entry || typeof entry !== "object") continue;

    const item = entry as { type?: unknown; item?: unknown };

    if (item.type === "attachment") {
      return true;
    }

    if (findAttachmentItems(item.item)) {
      return true;
    }
  }

  return false;
}

async function readJsonFile<T>(filePath: string): Promise<T> {
  const text = await readFile(filePath, "utf8");
  return JSON.parse(text) as T;
}

function stringifyPretty(value: unknown): string {
  return JSON.stringify(value, undefined, 2);
}

function App({
  questionnaire,
  initialResponse,
  terminologyServerUrl,
  hasAttachments,
  onComplete,
}: {
  questionnaire: Questionnaire;
  initialResponse: QuestionnaireResponse | undefined;
  terminologyServerUrl: string | undefined;
  hasAttachments: boolean;
  onComplete: CompletionHandler;
}) {
  const renderer = useRenderer();

  useEffect(() => {
    if (!hasAttachments) return;

    renderer.console.show();
    console.warn(
      "This Questionnaire contains attachment items. Upload is not supported in the TUI (TBD).",
    );
  }, [hasAttachments, renderer]);

  useKeyboard((key) => {
    if (key.eventType !== "press") return;

    if (key.name === "escape") {
      key.preventDefault();
      key.stopPropagation();
      onComplete({ status: "exit" });
    }
  });

  const onSubmit = useCallback(
    (response: QuestionnaireResponse) => {
      onComplete({ status: "submit", response });
    },
    [onComplete],
  );

  const header = useMemo(() => {
    return (
      <box flexDirection="column" style={{ gap: 0, marginBottom: 1 }}>
        <text>
          Aidbox Forms TUI <span fg="#666666">(OpenTUI)</span>
        </text>
        <text fg="#666666">Tab navigate • Ctrl+S submit • Esc quit</text>
      </box>
    );
  }, []);

  return (
    <FocusProvider>
      <box flexDirection="column">
        {header}
        <Renderer
          questionnaire={questionnaire}
          initialResponse={initialResponse}
          terminologyServerUrl={terminologyServerUrl}
          theme={opentuiTheme}
          onSubmit={onSubmit}
        />
      </box>
    </FocusProvider>
  );
}

const moduleFilePath = fileURLToPath(import.meta.url);
const moduleDirectoryPath = path.dirname(moduleFilePath);
const workspaceRootPath = path.resolve(moduleDirectoryPath, "..", "..");
if (process.cwd() !== workspaceRootPath) {
  process.chdir(workspaceRootPath);
}

const { values } = parseArgs({
  options: {
    questionnaire: { type: "string" },
    "initial-response": { type: "string" },
    "terminology-server-url": { type: "string" },
    output: { type: "string" },
    help: { type: "boolean" },
  },
  allowPositionals: false,
});

if (values.help) {
  console.log(usage());
} else if (values.questionnaire) {
  const options: CliOptions = {
    questionnairePath: path.resolve(process.cwd(), values.questionnaire),
    initialResponsePath: values["initial-response"]
      ? path.resolve(process.cwd(), values["initial-response"])
      : undefined,
    terminologyServerUrl: values["terminology-server-url"],
    outputPath: values.output
      ? path.resolve(process.cwd(), values.output)
      : undefined,
  };

  const questionnaire = await readJsonFile<Questionnaire>(
    options.questionnairePath,
  );
  const initialResponse = options.initialResponsePath
    ? await readJsonFile<QuestionnaireResponse>(options.initialResponsePath)
    : undefined;

  const hasAttachments = findAttachmentItems(questionnaire.item);

  if (hasAttachments) {
    console.warn(
      "Warning: attachment items detected; upload is not supported in the TUI (TBD).",
    );
  }

  const renderer = await createCliRenderer();

  const completion = createDeferred<CompletionState>();
  let isCompleted = false;

  const completeOnce: CompletionHandler = (state) => {
    if (isCompleted) return;
    isCompleted = true;
    completion.resolve(state);
  };

  renderer.once("destroy", () => {
    completeOnce({ status: "exit" });
  });

  const root = createRoot(renderer);
  root.render(
    <App
      questionnaire={questionnaire}
      initialResponse={initialResponse}
      terminologyServerUrl={options.terminologyServerUrl}
      hasAttachments={hasAttachments}
      onComplete={completeOnce}
    />,
  );

  const completionState = await completion.promise;

  renderer.destroy();

  if (completionState.status === "submit") {
    const serialized = stringifyPretty(completionState.response);

    try {
      if (options.outputPath) {
        await writeFile(options.outputPath, serialized, "utf8");
      } else {
        process.stdout.write(`${serialized}\n`);
      }

      process.exitCode = 0;
    } catch (error) {
      console.error(error);
      process.exitCode = 1;
    }
  } else {
    process.exitCode = 0;
  }
} else {
  console.error("Missing required flag: --questionnaire");
  console.log(usage());
  process.exitCode = 1;
}
