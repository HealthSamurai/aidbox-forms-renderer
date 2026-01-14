import { parseKeypress } from "@opentui/core";
import { useRenderer } from "@opentui/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type FocusState = {
  ids: string[];
  activeId: string | undefined;
};

type FocusContextValue = {
  state: FocusState;
  register: (id: string) => void;
  unregister: (id: string) => void;
  setActive: (id: string) => void;
  focusNext: () => void;
  focusPrev: () => void;
};

const FocusContext = createContext<FocusContextValue | undefined>(undefined);

export function Provider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FocusState>({
    ids: [],
    activeId: undefined,
  });

  const register = useCallback((id: string) => {
    setState((previous) => {
      if (previous.ids.includes(id)) return previous;

      const ids = [...previous.ids, id];
      const activeId = previous.activeId ?? id;
      return { ids, activeId };
    });
  }, []);

  const unregister = useCallback((id: string) => {
    setState((previous) => {
      if (!previous.ids.includes(id)) return previous;

      const ids = previous.ids.filter((entry) => entry !== id);
      const nextActiveId =
        previous.activeId === id
          ? ids.at(0)
          : previous.activeId && ids.includes(previous.activeId)
            ? previous.activeId
            : ids.at(0);

      return { ids, activeId: nextActiveId };
    });
  }, []);

  const setActive = useCallback((id: string) => {
    setState((previous) => {
      if (!previous.ids.includes(id) || previous.activeId === id) {
        return previous;
      }

      return { ...previous, activeId: id };
    });
  }, []);

  const focusNext = useCallback(() => {
    setState((previous) => {
      if (previous.ids.length === 0) return previous;

      if (previous.activeId === undefined) {
        return { ...previous, activeId: previous.ids[0] };
      }

      const index = previous.ids.indexOf(previous.activeId);
      const nextIndex = index === -1 ? 0 : (index + 1) % previous.ids.length;
      return { ...previous, activeId: previous.ids[nextIndex] };
    });
  }, []);

  const focusPrevious = useCallback(() => {
    setState((previous) => {
      if (previous.ids.length === 0) return previous;

      if (previous.activeId === undefined) {
        return { ...previous, activeId: previous.ids[0] };
      }

      const index = previous.ids.indexOf(previous.activeId);
      const previousIndex =
        index === -1
          ? 0
          : (index - 1 + previous.ids.length) % previous.ids.length;

      return { ...previous, activeId: previous.ids[previousIndex] };
    });
  }, []);

  const renderer = useRenderer();

  useEffect(() => {
    const handler = (sequence: string): boolean => {
      const key = parseKeypress(sequence, { useKittyKeyboard: true });
      if (!key) return false;

      if (key.name !== "tab") return false;
      if (key.ctrl || key.meta || key.option) return false;

      if (key.eventType !== "release") {
        if (key.shift) {
          focusPrevious();
        } else {
          focusNext();
        }
      }

      return true;
    };

    renderer.prependInputHandler(handler);

    return () => {
      renderer.removeInputHandler(handler);
    };
  }, [focusNext, focusPrevious, renderer]);

  const value = useMemo<FocusContextValue>(() => {
    return {
      state,
      register,
      unregister,
      setActive,
      focusNext,
      focusPrev: focusPrevious,
    };
  }, [focusNext, focusPrevious, register, setActive, state, unregister]);

  return (
    <FocusContext.Provider value={value}>{children}</FocusContext.Provider>
  );
}

export function useFocusable(
  id: string,
  enabled: boolean,
): {
  focused: boolean;
  focus: () => void;
  focusNext: () => void;
  focusPrev: () => void;
} {
  const context = useContext(FocusContext);

  const register = context?.register;
  const unregister = context?.unregister;

  useEffect(() => {
    if (!register || !unregister || !enabled) return;

    register(id);
    return () => {
      unregister(id);
    };
  }, [enabled, id, register, unregister]);

  const focus = useCallback(() => {
    if (!context) return;
    if (!enabled) return;

    context.setActive(id);
  }, [context, enabled, id]);

  return {
    focused: Boolean(context && enabled && context.state.activeId === id),
    focus,
    focusNext: context?.focusNext ?? (() => {}),
    focusPrev: context?.focusPrev ?? (() => {}),
  };
}
