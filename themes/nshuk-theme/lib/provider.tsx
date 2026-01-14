import { PropsWithChildren } from "react";

export function Provider({ children }: PropsWithChildren) {
  return <div className="nhsuk-frontend-supported">{children}</div>;
}
