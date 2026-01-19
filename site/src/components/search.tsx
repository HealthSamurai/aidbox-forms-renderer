import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Search as SearchIcon } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

import { Button } from "@/components/ui/button.tsx";
import type { FlattenedSidebarEntry } from "@/components/sidebar.tsx";
import { withBase } from "@/lib/base-url.ts";

const normalizeQuery = (value: string) => value.trim().toLowerCase();

const Kbd = ({ children }: { children: ReactNode }) => (
  <kbd className="border-border bg-muted pointer-events-none inline-flex h-5 min-h-5 select-none items-center gap-1 rounded border px-1 font-sans text-[11px] font-medium">
    {children}
  </kbd>
);

export default function Search({
  inAside = false,
  pages,
}: {
  inAside?: boolean;
  pages: FlattenedSidebarEntry[];
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputReference = useRef<HTMLInputElement | null>(
    undefined as unknown as HTMLInputElement | null,
  );

  const filtered = useMemo(() => {
    const normalized = normalizeQuery(query);
    if (!normalized) return pages;

    return pages.filter((item) => {
      const label = `${item.label} ${item.sectionLabel} ${item.groupLabel}`;
      return label.toLowerCase().includes(normalized);
    });
  }, [pages, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, FlattenedSidebarEntry[]>();
    for (const item of filtered) {
      const section = item.sectionLabel || "Docs";
      const items = map.get(section) ?? [];
      items.push(item);
      map.set(section, items);
    }
    return [...map.entries()];
  }, [filtered]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    };

    globalThis.addEventListener("keydown", handler);
    return () => globalThis.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    const frame = globalThis.requestAnimationFrame(() =>
      inputReference.current?.focus(),
    );
    return () => globalThis.cancelAnimationFrame(frame);
  }, [open]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      setQuery("");
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <Button
          variant="outline"
          className={
            inAside
              ? "text-muted-foreground hover:text-accent-foreground mb-4 h-8 w-full self-center rounded-md pr-1.5 font-normal"
              : "text-muted-foreground hover:text-accent-foreground h-8 self-center rounded-md pr-1.5 font-normal md:w-40 lg:w-60"
          }
        >
          <span className="mr-auto overflow-hidden">
            Search documentation...
          </span>
          <span className="ml-auto hidden md:block">
            <Kbd>
              <span className="text-xs">⌘</span>K
            </Kbd>
          </span>
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(90vw,680px)] -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-background p-0 shadow-lg">
          <Dialog.Title className="sr-only">Search documentation</Dialog.Title>
          <Dialog.Description className="sr-only">
            Search the Aidbox Forms Renderer docs
          </Dialog.Description>
          <div className="flex items-center gap-2 border-b px-3 py-3 text-sm">
            <SearchIcon className="text-muted-foreground size-[18px]" />
            <input
              ref={inputReference}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Type to search..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="max-h-[60vh] overflow-y-auto p-1 text-sm">
            {grouped.length === 0 ? (
              <div className="text-muted-foreground py-6 text-center">
                No results found.
              </div>
            ) : (
              grouped.map(([section, items]) => (
                <div key={section} className="p-1.5">
                  <p className="text-muted-foreground px-2 py-1.5 text-xs font-medium">
                    {section}
                  </p>
                  {items.map((item) => (
                    <a
                      key={item.href}
                      href={withBase(item.href)}
                      onClick={() => setOpen(false)}
                      className="hover:bg-muted flex w-full select-none items-center gap-3 rounded-md px-2 py-2"
                    >
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {item.label}
                        </div>
                        <div className="text-muted-foreground text-xs">
                          {item.groupLabel
                            ? `${item.sectionLabel} / ${item.groupLabel}`
                            : item.sectionLabel}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              ))
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
