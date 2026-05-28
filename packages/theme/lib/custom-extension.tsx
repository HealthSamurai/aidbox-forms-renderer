import { createContext, type PropsWithChildren, useContext } from "react";

export type CustomExtensionTarget = "questionnaire" | "item";

type BivariantExtract<TContext, TValue> = {
  bivarianceHack(context: TContext): TValue;
}["bivarianceHack"];

export type CustomExtensionDefinition<
  TContext = unknown,
  TValue = unknown,
  TRepeats extends boolean = boolean,
> = {
  readonly target: CustomExtensionTarget;
  readonly url: string;
  readonly repeats: TRepeats;
  readonly extract: BivariantExtract<TContext, TValue>;
};

export type CustomExtensionDefinitions<TContext = unknown> = Readonly<
  Record<string, CustomExtensionDefinition<TContext, unknown, boolean>>
>;

type InferableCustomExtensionDefinition = {
  readonly repeats: boolean;
  readonly extract: (...arguments_: readonly never[]) => unknown;
};

type InferableCustomExtensionDefinitions = Readonly<
  Record<string, InferableCustomExtensionDefinition>
>;

type InferCustomExtensionValue<
  TDefinition extends InferableCustomExtensionDefinition,
> = TDefinition["repeats"] extends true
  ? ReadonlyArray<ReturnType<TDefinition["extract"]>>
  : ReturnType<TDefinition["extract"]> | undefined;

export type InferCustomExtensionValues<
  TDefinitions extends InferableCustomExtensionDefinitions,
> = {
  readonly [K in keyof TDefinitions]: InferCustomExtensionValue<
    TDefinitions[K]
  >;
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CustomExtensionValueRegistry {}

export type CustomExtensionValues = Readonly<Record<string, unknown>>;

const CustomQuestionnaireExtensionsContext = createContext<
  CustomExtensionValues | undefined
>(undefined);

const CustomItemExtensionsContext = createContext<
  CustomExtensionValues | undefined
>(undefined);

export function CustomQuestionnaireExtensionsProvider({
  value,
  children,
}: PropsWithChildren<{ value: CustomExtensionValues | undefined }>) {
  return (
    <CustomQuestionnaireExtensionsContext.Provider value={value}>
      {children}
    </CustomQuestionnaireExtensionsContext.Provider>
  );
}

export function CustomItemExtensionsProvider({
  value,
  children,
}: PropsWithChildren<{ value: CustomExtensionValues | undefined }>) {
  return (
    <CustomItemExtensionsContext.Provider value={value}>
      {children}
    </CustomItemExtensionsContext.Provider>
  );
}

export function useCustomExtension<
  TKey extends Extract<keyof CustomExtensionValueRegistry, string>,
>(key: TKey): CustomExtensionValueRegistry[TKey] | undefined {
  const itemExtensions = useContext(CustomItemExtensionsContext);
  const questionnaireExtensions = useContext(
    CustomQuestionnaireExtensionsContext,
  );
  const keyString = key as string;

  if (
    itemExtensions != undefined &&
    Object.prototype.hasOwnProperty.call(itemExtensions, keyString)
  ) {
    return itemExtensions[keyString] as
      | CustomExtensionValueRegistry[TKey]
      | undefined;
  }

  if (
    questionnaireExtensions != undefined &&
    Object.prototype.hasOwnProperty.call(questionnaireExtensions, keyString)
  ) {
    return questionnaireExtensions[keyString] as
      | CustomExtensionValueRegistry[TKey]
      | undefined;
  }

  return undefined;
}
