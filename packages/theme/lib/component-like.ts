import type { ReactElement } from "react";

export type ComponentLike<P> = (props: P) => ReactElement | null;
