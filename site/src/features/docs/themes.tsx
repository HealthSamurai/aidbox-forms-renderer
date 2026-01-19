import ExploreCards from "@/components/explore-cards.tsx";

import { routes, sidebar } from "./manifest.ts";

export default function Themes() {
  const themesSection = sidebar.find((section) => section.label === "Themes");
  const availableThemes =
    themesSection?.groups.find((group) => group.label === "Available Themes")
      ?.pages ?? [];
  const customThemes =
    themesSection?.groups.find((group) => group.label === "Custom Theme")
      ?.pages ?? [];
  const availableCards = availableThemes.map((theme) => ({
    href: theme.href,
    eyebrow: "Available Themes",
    title: theme.label,
    description: routes.get(theme.href)?.description,
  }));
  const customCards = customThemes.map((theme) => ({
    href: theme.href,
    eyebrow: "Custom Theme",
    title: theme.label,
    description: routes.get(theme.href)?.description,
  }));

  return (
    <main id="content" className="relative py-6">
      <div className="mx-auto w-full min-w-0 space-y-10">
        <div className="space-y-2">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Themes
          </h1>
          <p className="text-muted-foreground pt-1 text-lg">
            Browse the available themes or build a custom experience from the
            theme contract.
          </p>
        </div>
        <div className="space-y-4">
          <p className="text-muted-foreground text-base leading-7">
            Start with a ready-made UI kit, review how each theme wires inputs
            and layouts, and treat them as reference implementations when you
            want a consistent UI fast.
          </p>
          <ExploreCards cards={availableCards} />
        </div>
        <div className="space-y-4">
          <p className="text-muted-foreground text-base leading-7">
            Use the Theme contract to build your own design system, align
            behavior with renderer guarantees, and keep styling fully in your
            control.
          </p>
          <ExploreCards cards={customCards} />
        </div>
      </div>
    </main>
  );
}
