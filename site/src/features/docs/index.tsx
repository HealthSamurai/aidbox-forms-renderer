import ExploreCards from "@/components/explore-cards.tsx";

export default function Index() {
  const cards = [
    {
      href: "/docs/renderer/",
      eyebrow: "Core",
      title: "Renderer",
      description:
        "Learn how to wire questionnaires, themes, and state management.",
    },
    {
      href: "/docs/themes/",
      eyebrow: "Themes",
      title: "Available Themes",
      description: "Explore the bundled UI themes and pick a starting point.",
    },
    {
      href: "/docs/theme/",
      eyebrow: "Themes",
      title: "Custom Theme",
      description: "Review the theme contract and renderer guarantees.",
    },
    {
      href: "/storybook/",
      eyebrow: "Demos",
      title: "Storybook",
      description: "Preview components and review supported question types.",
    },
  ];

  return (
    <main id="content" className="relative py-6">
      <div className="mx-auto w-full min-w-0">
        <div className="mb-8">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Formbox Renderer docs
          </h1>
          <p className="text-muted-foreground pt-1 text-lg">
            Read the package docs and guides. Each package keeps its own
            reference material alongside the code.
          </p>
        </div>

        <ExploreCards cards={cards} />
      </div>
    </main>
  );
}
