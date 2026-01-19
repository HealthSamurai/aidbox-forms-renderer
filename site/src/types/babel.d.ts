declare module "@babel/generator" {
  export type GeneratorResult = {
    code: string;
    map: import("rollup").SourceMapInput | undefined;
  };
  const generate: (...arguments_: unknown[]) => GeneratorResult;
  export default generate;
}

declare module "@babel/traverse" {
  export type NodePath<T = unknown> = {
    node: T;
  };
  const traverse: (ast: unknown, visitors: unknown) => void;
  export default traverse;
}
