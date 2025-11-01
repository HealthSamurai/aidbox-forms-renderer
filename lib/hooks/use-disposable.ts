import { useLayoutEffect, useState } from "react";
import type { DependencyList } from "react";

type Disposable = {
  dispose: () => void;
};

export function useDisposable<T extends Disposable>(
  factory: () => T,
  deps: DependencyList,
): T | null {
  const [value, setValue] = useState<T | null>(null);

  useLayoutEffect(() => {
    const next = factory();
    setValue(next);
    return () => {
      next.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return value;
}
