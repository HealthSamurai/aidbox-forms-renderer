export type NodePath = readonly NodePathSegment[];

export interface NodePathSegment {
  readonly linkId: string;
  readonly index?: number | undefined;
}
