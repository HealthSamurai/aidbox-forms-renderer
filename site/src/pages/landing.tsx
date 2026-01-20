import CodeBlock from "../components/code-block.tsx";
import GlareHover from "../components/glare-hover.tsx";
import Magnet from "../components/magnet.tsx";
import SiteHeader from "../components/site-header.tsx";
import SplitText from "../components/split-text.tsx";
import Threads from "../components/threads.tsx";

export default function Landing() {
  const heroHeadline = "Render HL7® FHIR® Questionnaires across any UI system";

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
        href="#content"
      >
        Skip to content
      </a>
      <div className="border-b border-border/60 bg-muted/50">
        <div className="container flex items-center justify-between gap-3 px-4 py-2 text-xs text-muted-foreground sm:px-6 lg:px-8">
          <span className="rounded-full border border-border/60 bg-background/70 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-foreground/80">
            Alpha
          </span>
          <span className="flex-1">
            Expect breaking changes while the API stabilizes.
          </span>
          <a
            className="text-foreground/80 underline-offset-4 transition hover:text-foreground hover:underline"
            href="https://github.com/HealthSamurai/formbox-renderer/releases"
            target="_blank"
            rel="noreferrer"
          >
            Release notes
          </a>
        </div>
      </div>
      <SiteHeader
        links={[
          { href: "#features", label: "Features" },
          { href: "#themes", label: "Themes" },
          { href: "#customize", label: "Customize" },
          { href: "storybook/", label: "Storybook" },
          { href: "docs/", label: "Docs" },
          { href: "#quickstart", label: "Quickstart" },
        ]}
      />
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/40"></div>
          <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_30%_30%,hsl(var(--primary)/0.12),transparent_70%)] blur-3xl opacity-70"></div>
          <div className="absolute right-0 top-0 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle_at_30%_30%,hsl(var(--ring)/0.18),transparent_70%)] blur-3xl opacity-60"></div>
        </div>

        <main id="content">
          <section className="relative overflow-hidden pb-24 pt-32">
            <div
              className="pointer-events-none absolute inset-0"
              aria-hidden="true"
            >
              <div className="absolute inset-0 opacity-35 mix-blend-screen">
                <Threads
                  color={[0.9, 0.94, 1]}
                  amplitude={2}
                  distance={0.4}
                  enableMouseInteraction
                />
              </div>
            </div>

            <div className="container grid gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8">
              <div className="space-y-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/60 px-4 py-1 text-[0.72rem] uppercase tracking-[0.2em] text-muted-foreground animate-fade-up motion-reduce:animate-none [animation-delay:0ms]">
                  Open-source · FHIR R5 · React
                </span>
                <SplitText
                  text={heroHeadline}
                  tag="h1"
                  textAlign="left"
                  splitType="words"
                  delay={40}
                  duration={1.1}
                  from={{ opacity: 0, y: 32 }}
                  to={{ opacity: 1, y: 0 }}
                  className="block font-display text-4xl leading-tight text-foreground sm:text-5xl lg:text-6xl"
                />
                <p className="text-lg text-muted-foreground animate-fade-up motion-reduce:animate-none [animation-delay:240ms]">
                  Formbox Renderer is a typed React renderer for FHIR R5
                  Questionnaires. Build clinical forms once, then ship them with
                  pluggable themes, predictable state, and Storybook-ready
                  previews.
                </p>
                <div className="flex flex-wrap gap-4 animate-fade-up motion-reduce:animate-none [animation-delay:360ms]">
                  <Magnet
                    padding={100}
                    magnetStrength={2}
                    wrapperClassName="inline-flex"
                    innerClassName="inline-flex"
                  >
                    <a
                      className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-black/25 transition hover:bg-primary/90"
                      href="storybook/"
                    >
                      Explore Storybook
                    </a>
                  </Magnet>
                  <a
                    className="inline-flex items-center rounded-full border border-border/70 bg-muted/60 px-6 py-3 text-sm font-semibold text-foreground transition hover:border-foreground/40"
                    href="https://github.com/HealthSamurai/formbox-renderer"
                    target="_blank"
                    rel="noreferrer"
                  >
                    View on GitHub
                  </a>
                  <a
                    className="inline-flex items-center rounded-full border border-border/70 bg-background/60 px-6 py-3 text-sm font-semibold text-foreground transition hover:border-foreground/40"
                    href="docs/"
                  >
                    Read docs
                  </a>
                  <a
                    className="inline-flex items-center rounded-full border border-border/70 bg-background/60 px-6 py-3 text-sm font-semibold text-foreground transition hover:border-foreground/40"
                    href="#quickstart"
                  >
                    Get started
                  </a>
                </div>
                <div className="flex flex-wrap gap-3 text-sm animate-fade-up motion-reduce:animate-none [animation-delay:480ms]">
                  <span className="rounded-full border border-border/60 bg-muted/60 px-3 py-1 text-muted-foreground">
                    4 official themes
                  </span>
                  <span className="rounded-full border border-border/60 bg-muted/60 px-3 py-1 text-muted-foreground">
                    FHIR R5 ready
                  </span>
                  <span className="rounded-full border border-border/60 bg-muted/60 px-3 py-1 text-muted-foreground">
                    MIT license
                  </span>
                  <span className="rounded-full border border-border/60 bg-muted/60 px-3 py-1 text-muted-foreground">
                    Headless core
                  </span>
                </div>
              </div>

              <div className="rounded-3xl border border-border/70 bg-card/80 p-7 shadow-xl shadow-black/40 backdrop-blur animate-fade-up motion-reduce:animate-none [animation-delay:200ms]">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Quick install
                  </span>
                  <span className="rounded-full border border-border/60 bg-muted/60 px-2 py-1 text-[0.65rem] font-semibold text-foreground">
                    FHIR R5
                  </span>
                </div>
                <h2 className="mt-4 font-display text-lg text-foreground">
                  Render your first Questionnaire
                </h2>
                <CodeBlock
                  language="bash"
                  code="pnpm add @formbox/renderer @formbox/hs-theme"
                  className="mt-4"
                />
                <CodeBlock
                  className="mt-4"
                  language="tsx"
                  code={`
                    import "@formbox/hs-theme/style.css";
                    import { Renderer } from "@formbox/renderer";
                    import { theme } from "@formbox/hs-theme";

                    <Renderer questionnaire={questionnaire} theme={theme} />
                  `}
                />
                <div className="mt-5 space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-primary"></span>
                    <span>Swap themes without rewriting questionnaires.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-primary"></span>
                    <span>
                      Wire data pipelines with controlled value props.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-primary"></span>
                    <span>Validate clinical UX with Storybook previews.</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            id="features"
            className="scroll-mt-28 px-4 py-20 sm:px-6 lg:px-8"
          >
            <div className="container">
              <div className="max-w-2xl">
                <h2 className="font-display text-3xl text-foreground">
                  Everything you need to render at scale
                </h2>
                <p className="mt-3 text-base text-muted-foreground">
                  Purpose-built for FHIR R5 Questionnaires with a fully typed
                  renderer, tested helpers, and predictable state management.
                </p>
              </div>
              <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-6 lg:grid-cols-12">
                <article className="rounded-2xl border border-border/60 bg-card/70 p-6 shadow-lg shadow-black/30 transition hover:border-ring/60 md:col-span-6 lg:col-span-7">
                  <div className="flex items-center gap-3">
                    <svg
                      className="h-7 w-7 text-foreground/70"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 3l9 5-9 5-9-5 9-5z" />
                      <path d="M3 12l9 5 9-5" />
                      <path d="M3 17l9 5 9-5" />
                    </svg>
                    <h3 className="font-display text-lg text-foreground">
                      Typed renderer core
                    </h3>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Strict Questionnaire typing, composable renderers, and
                    validation utilities that scale from single forms to full
                    workflows.
                  </p>
                  <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                      <span>FHIR R5 Questionnaire ready</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                      <span>Predictable stores and helpers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                      <span>Built for clinical UX teams</span>
                    </div>
                  </div>
                </article>
                <article className="rounded-2xl border border-border/60 bg-card/70 p-6 shadow-lg shadow-black/30 transition hover:border-ring/60 md:col-span-6 lg:col-span-5">
                  <div className="flex items-center gap-3">
                    <svg
                      className="h-7 w-7 text-foreground/70"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M8 5L4 12l4 7" />
                      <path d="M16 5l4 7-4 7" />
                    </svg>
                    <h3 className="font-display text-lg text-foreground">
                      Customize themes
                    </h3>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    The renderer never touches DOM APIs directly. Your theme
                    defines markup, layout, and styling while data flows through
                    strict props.
                  </p>
                </article>
                <article className="rounded-2xl border border-border/60 bg-card/70 p-6 shadow-lg shadow-black/30 transition hover:border-ring/60 md:col-span-3 lg:col-span-4">
                  <div className="flex items-center gap-3">
                    <svg
                      className="h-7 w-7 text-foreground/70"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="7" height="7" rx="1.5" />
                      <rect x="14" y="3" width="7" height="7" rx="1.5" />
                      <rect x="3" y="14" width="7" height="7" rx="1.5" />
                      <rect x="14" y="14" width="7" height="7" rx="1.5" />
                    </svg>
                    <h3 className="font-display text-lg text-foreground">
                      Pre-built themes
                    </h3>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Start with NHS Design, Health Samurai, Ant Design, or
                    Mantine and keep your clinical workflows on-brand.
                  </p>
                </article>
                <article className="rounded-2xl border border-border/60 bg-card/70 p-6 shadow-lg shadow-black/30 transition hover:border-ring/60 md:col-span-3 lg:col-span-4">
                  <div className="flex items-center gap-3">
                    <svg
                      className="h-7 w-7 text-foreground/70"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 3l7 3v6c0 5-3 7-7 9-4-2-7-4-7-9V6l7-3z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                    <h3 className="font-display text-lg text-foreground">
                      SDC spec coverage
                    </h3>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Structured Data Capture behavior is covered and actively
                    expanding toward full parity.
                  </p>
                </article>
                <article className="rounded-2xl border border-border/60 bg-card/70 p-6 shadow-lg shadow-black/30 transition hover:border-ring/60 md:col-span-3 lg:col-span-4">
                  <div className="flex items-center gap-3">
                    <svg
                      className="h-7 w-7 text-foreground/70"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="7" y="7" width="10" height="10" rx="2" />
                      <path d="M4 9h3M4 15h3M17 9h3M17 15h3" />
                      <path d="M9 4v3M15 4v3M9 17v3M15 17v3" />
                    </svg>
                    <h3 className="font-display text-lg text-foreground">
                      Headless engine
                    </h3>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Core rendering logic works in React Native, CLI tooling, or
                    server-side environments.
                  </p>
                </article>
                <article className="rounded-2xl border border-border/60 bg-card/70 p-6 shadow-lg shadow-black/30 transition hover:border-ring/60 md:col-span-6 lg:col-span-6">
                  <div className="flex items-center gap-3">
                    <svg
                      className="h-7 w-7 text-foreground/70"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M10 13a5 5 0 0 1 0-7l1.5-1.5a5 5 0 0 1 7 7L17 13" />
                      <path d="M14 11a5 5 0 0 1 0 7L12.5 19.5a5 5 0 0 1-7-7L7 11" />
                    </svg>
                    <h3 className="font-display text-lg text-foreground">
                      Formbox Builder ready
                    </h3>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Integrated with Formbox Builder for end-to-end questionnaire
                    authoring and renderer delivery.
                  </p>
                </article>
                <article className="rounded-2xl border border-border/60 bg-card/70 p-6 shadow-lg shadow-black/30 transition hover:border-ring/60 md:col-span-6 lg:col-span-6">
                  <div className="flex items-center gap-3">
                    <svg
                      className="h-7 w-7 text-foreground/70"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="5" r="2.5" />
                      <path d="M4 9h16" />
                      <path d="M10 13l-2 8" />
                      <path d="M14 13l2 8" />
                      <path d="M12 9v11" />
                    </svg>
                    <h3 className="font-display text-lg text-foreground">
                      Accessibility-first rendering
                    </h3>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    ARIA ids, helper text, and error messaging flow through the
                    theme contract to support WCAG-ready experiences.
                  </p>
                </article>
              </div>
            </div>
          </section>

          <section
            id="customize"
            className="scroll-mt-28 border-y border-border/60 bg-muted/30 px-4 py-20 sm:px-6 lg:px-8"
          >
            <div className="container grid gap-10 lg:grid-cols-2">
              <div>
                <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Customize
                </span>
                <h2 className="mt-4 font-display text-3xl text-foreground">
                  Own the markup, keep the data flow clean
                </h2>
                <p className="mt-4 text-base text-muted-foreground">
                  A Theme is a full object with React components for every slot.
                  The renderer never touches DOM APIs directly, so your theme
                  controls layout and styling while data stays purely in props.
                </p>
                <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-4 w-4 shrink-0 rounded border border-border/60 bg-muted/60"></span>
                    <span>
                      Extend a base theme with object spread or build from
                      scratch.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-4 w-4 shrink-0 rounded border border-border/60 bg-muted/60"></span>
                    <span>Controlled-value props keep inputs predictable.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-4 w-4 shrink-0 rounded border border-border/60 bg-muted/60"></span>
                    <span>
                      Accessibility contract passes aria ids to your components.
                    </span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <div className="rounded-2xl border border-border/60 bg-card/70 p-6">
                  <h3 className="font-display text-base text-foreground">
                    Extend a base theme
                  </h3>
                  <CodeBlock
                    className="mt-4"
                    language="ts"
                    code={`
                      import type { Theme } from "@formbox/theme";
                      import { theme as baseTheme } from "@formbox/hs-theme";
                      
                      const theme: Theme = {
                        ...baseTheme,
                        Label: MyLabel,
                      };
                    `}
                  />
                </div>
                <div className="rounded-2xl border border-border/60 bg-card/70 p-6">
                  <h3 className="font-display text-base text-foreground">
                    Install the theme contract
                  </h3>
                  <CodeBlock
                    language="bash"
                    code="pnpm add @formbox/theme"
                    className="mt-4"
                  />
                  <p className="mt-4 text-sm text-muted-foreground">
                    The Theme type requires every component, so you always know
                    what to render.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section
            id="themes"
            className="scroll-mt-28 px-4 py-20 sm:px-6 lg:px-8"
          >
            <div className="container">
              <div className="max-w-2xl">
                <h2 className="font-display text-3xl text-foreground">
                  Theme kits ready to ship
                </h2>
                <p className="mt-3 text-base text-muted-foreground">
                  Start with the official themes or bring your own design system
                  to stay on-brand.
                </p>
              </div>
              <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                <article className="rounded-2xl border border-border/60 bg-card/70 p-6">
                  <h3 className="font-display text-lg text-foreground">
                    Health Samurai
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Clinical-ready layout density, contrast, and spacing tuned
                    for Formbox workflows, built on{" "}
                    <a
                      className="text-foreground/80 transition hover:text-foreground"
                      href="https://www.health-samurai.io/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Health Samurai Design System
                    </a>
                    .
                  </p>
                  <a
                    className="mt-4 inline-flex items-center text-sm font-semibold text-foreground/80 transition hover:text-foreground"
                    href="docs/hs-theme/"
                  >
                    Docs
                  </a>
                </article>
                <article className="rounded-2xl border border-border/60 bg-card/70 p-6">
                  <h3 className="font-display text-lg text-foreground">
                    NHS Design
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    NHS.UK-aligned typography, spacing, and component behavior
                    for public health services, built on{" "}
                    <a
                      className="text-foreground/80 transition hover:text-foreground"
                      href="https://service-manual.nhs.uk/design-system"
                      target="_blank"
                      rel="noreferrer"
                    >
                      NHS.UK Design System
                    </a>
                    .
                  </p>
                  <a
                    className="mt-4 inline-flex items-center text-sm font-semibold text-foreground/80 transition hover:text-foreground"
                    href="docs/nshuk-theme/"
                  >
                    Docs
                  </a>
                </article>
                <article className="rounded-2xl border border-border/60 bg-card/70 p-6">
                  <h3 className="font-display text-lg text-foreground">
                    Ant Design
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Enterprise-grade components and layout patterns for complex
                    clinical apps, powered by{" "}
                    <a
                      className="text-foreground/80 transition hover:text-foreground"
                      href="https://ant.design/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Ant Design
                    </a>
                    .
                  </p>
                  <a
                    className="mt-4 inline-flex items-center text-sm font-semibold text-foreground/80 transition hover:text-foreground"
                    href="docs/antd-theme/"
                  >
                    Docs
                  </a>
                </article>
                <article className="rounded-2xl border border-border/60 bg-card/70 p-6">
                  <h3 className="font-display text-lg text-foreground">
                    Mantine
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Mantine components with first-class Provider setup and theme
                    tokens, built on{" "}
                    <a
                      className="text-foreground/80 transition hover:text-foreground"
                      href="https://mantine.dev/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Mantine
                    </a>
                    .
                  </p>
                  <a
                    className="mt-4 inline-flex items-center text-sm font-semibold text-foreground/80 transition hover:text-foreground"
                    href="docs/mantine-theme/"
                  >
                    Docs
                  </a>
                </article>
                <article className="rounded-2xl border border-dashed border-border/60 bg-card/40 p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg text-foreground">
                      React Native
                    </h3>
                    <span className="rounded-full border border-border/60 bg-muted/60 px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Coming soon
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Gluestack-powered native layouts with accessible,
                    touch-friendly components, built on{" "}
                    <a
                      className="text-foreground/80 transition hover:text-foreground"
                      href="https://gluestack.io/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Gluestack UI
                    </a>
                    .
                  </p>
                </article>
                <article className="rounded-2xl border border-border/60 bg-card/70 p-6">
                  <h3 className="font-display text-lg text-foreground">
                    Build Your Own
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Map renderer slots to your design system while keeping data
                    flow predictable with the{" "}
                    <a
                      className="text-foreground/80 transition hover:text-foreground"
                      href="docs/theme/"
                    >
                      Theme guide
                    </a>
                    .
                  </p>
                  <a
                    className="mt-4 inline-flex items-center text-sm font-semibold text-foreground/80 transition hover:text-foreground"
                    href="docs/theme/"
                  >
                    Docs
                  </a>
                </article>
              </div>
            </div>
          </section>

          <section
            id="storybook"
            className="scroll-mt-28 px-4 pb-20 pt-6 sm:px-6 lg:px-8"
          >
            <div className="container">
              <GlareHover
                width="100%"
                height="auto"
                background="transparent"
                borderRadius="24px"
                borderColor="transparent"
                glareColor="#ffffff"
                glareOpacity={0.18}
                glareAngle={-20}
                glareSize={300}
                transitionDuration={1000}
                className="rounded-3xl"
              >
                <div className="w-full rounded-3xl border border-border/60 bg-gradient-to-br from-background/80 via-muted/60 to-background/80 p-8 shadow-xl shadow-black/40">
                  <h2 className="font-display text-2xl text-foreground">
                    Storybook as a living demo
                  </h2>
                  <p className="mt-3 text-base text-muted-foreground">
                    Browse every renderer, theme, and sample questionnaire. Use
                    the Storybook page as a living design system and QA
                    checklist.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-4">
                    <a
                      className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                      href="storybook/"
                    >
                      Open Storybook
                    </a>
                    <a
                      className="inline-flex items-center rounded-full border border-border/70 bg-background/40 px-6 py-3 text-sm font-semibold text-foreground transition hover:border-foreground/40"
                      href="#themes"
                    >
                      Browse themes
                    </a>
                  </div>
                </div>
              </GlareHover>
            </div>
          </section>

          <section
            id="quickstart"
            className="relative scroll-mt-28 border-y border-border/60 bg-muted/30 px-4 py-20 sm:px-6 lg:px-8"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_top_left,rgba(56,189,248,0.14),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.14),transparent_55%)]"
              aria-hidden="true"
            ></div>
            <div
              className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:140px_140px]"
              aria-hidden="true"
            ></div>
            <div className="container relative">
              <div className="max-w-3xl">
                <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
                  Quickstart
                </span>
                <h2 className="mt-3 font-display text-3xl text-foreground">
                  From install to first render in four moves
                </h2>
                <p className="mt-3 text-base text-muted-foreground">
                  Install the renderer, choose a theme, and wire it to your
                  Questionnaire data in minutes.
                </p>
              </div>
              <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
                <div className="relative space-y-6">
                  <div
                    className="absolute left-4 top-5 hidden h-[calc(100%-2.5rem)] w-px bg-border/60 sm:block"
                    aria-hidden="true"
                  ></div>
                  <div className="flex gap-4">
                    <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-background/70 text-[0.65rem] font-semibold text-foreground">
                      01
                    </div>
                    <div className="flex-1 rounded-2xl border border-border/60 bg-card/70 p-5 shadow-lg shadow-black/20">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        Install
                      </p>
                      <h3 className="mt-2 font-display text-base text-foreground">
                        Install renderer + theme
                      </h3>
                      <CodeBlock
                        className="mt-3"
                        language="bash"
                        code="pnpm add @formbox/renderer @formbox/hs-theme"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-background/70 text-[0.65rem] font-semibold text-foreground">
                      02
                    </div>
                    <div className="flex-1 rounded-2xl border border-border/60 bg-card/70 p-5 shadow-lg shadow-black/20">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        Style
                      </p>
                      <h3 className="mt-2 font-display text-base text-foreground">
                        Include the theme CSS
                      </h3>
                      <CodeBlock
                        className="mt-3"
                        language="ts"
                        code='import "@formbox/hs-theme/style.css";'
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-background/70 text-[0.65rem] font-semibold text-foreground">
                      03
                    </div>
                    <div className="flex-1 rounded-2xl border border-border/60 bg-card/70 p-5 shadow-lg shadow-black/20">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        Import
                      </p>
                      <h3 className="mt-2 font-display text-base text-foreground">
                        Import theme
                      </h3>
                      <CodeBlock
                        className="mt-3"
                        language="ts"
                        code='import { theme } from "@formbox/hs-theme";'
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-background/70 text-[0.65rem] font-semibold text-foreground">
                      04
                    </div>
                    <div className="flex-1 rounded-2xl border border-border/60 bg-card/70 p-5 shadow-lg shadow-black/20">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        Render
                      </p>
                      <h3 className="mt-2 font-display text-base text-foreground">
                        Render Questionnaire
                      </h3>
                      <CodeBlock
                        className="mt-3"
                        language="tsx"
                        code="<Renderer questionnaire={questionnaire} theme={theme} />"
                      />
                    </div>
                  </div>
                </div>
                <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-xl shadow-black/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      Full sample
                    </span>
                    <span className="rounded-full border border-border/60 bg-muted/60 px-2 py-1 text-[0.65rem] font-semibold text-muted-foreground">
                      ~5 min
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-lg text-foreground">
                    Ready-to-run snippet
                  </h3>
                  <CodeBlock
                    className="mt-4"
                    language="tsx"
                    code={`
                      import "@formbox/hs-theme/style.css";
                      import { Renderer } from "@formbox/renderer";
                      import { theme } from "@formbox/hs-theme";

                      <Renderer questionnaire={questionnaire} theme={theme} />
                    `}
                  />
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <a
                      className="inline-flex items-center justify-center rounded-full border border-border/70 bg-background/50 px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-foreground/40"
                      href="docs/"
                    >
                      Read docs
                    </a>
                    <a
                      className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                      href="storybook/"
                    >
                      Open Storybook
                    </a>
                  </div>
                  <div className="mt-5 rounded-xl border border-border/60 bg-muted/50 p-4 text-xs text-muted-foreground">
                    Pair Storybook with your questionnaires to audit UI,
                    accessibility, and validation rules before shipping.
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            id="community"
            className="scroll-mt-28 px-4 py-20 sm:px-6 lg:px-8"
          >
            <div className="container">
              <div className="max-w-2xl">
                <h2 className="font-display text-3xl text-foreground">
                  Open-source ready
                </h2>
                <p className="mt-3 text-base text-muted-foreground">
                  Built by the Formbox team and open to the community. File
                  issues, propose improvements, or ship a new theme.
                </p>
              </div>
              <div className="mt-10 grid gap-5 md:grid-cols-3">
                <article className="rounded-2xl border border-border/60 bg-card/70 p-6">
                  <div className="flex items-center gap-3">
                    <svg
                      className="h-7 w-7 text-foreground/70"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="6" cy="6" r="2" />
                      <circle cx="6" cy="18" r="2" />
                      <circle cx="18" cy="18" r="2" />
                      <path d="M6 8v6a4 4 0 0 0 4 4h6" />
                      <path d="M18 16v-2a4 4 0 0 0-4-4h-4" />
                    </svg>
                    <h3 className="font-display text-lg text-foreground">
                      Contribute
                    </h3>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Review the codebase, open pull requests, and help shape the
                    roadmap.
                  </p>
                </article>
                <article className="rounded-2xl border border-border/60 bg-card/70 p-6">
                  <div className="flex items-center gap-3">
                    <svg
                      className="h-7 w-7 text-foreground/70"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 7v4M15 7v4" />
                      <path d="M7 11h10v3a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4v-3z" />
                      <path d="M12 18v3" />
                    </svg>
                    <h3 className="font-display text-lg text-foreground">
                      Integrate
                    </h3>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Embed the renderer in patient portals, provider dashboards,
                    or EHR extensions.
                  </p>
                </article>
                <article className="rounded-2xl border border-border/60 bg-card/70 p-6">
                  <div className="flex items-center gap-3">
                    <svg
                      className="h-7 w-7 text-foreground/70"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M8 4h4a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v4h-2a2 2 0 0 0-2 2v2h-4a2 2 0 0 1-2-2v-2H6a2 2 0 0 1-2-2v-4h2a2 2 0 0 0 2-2V6a2 2 0 0 1 2-2z" />
                    </svg>
                    <h3 className="font-display text-lg text-foreground">
                      Extend
                    </h3>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Build custom themes or renderer overrides for unique
                    clinical workflows.
                  </p>
                </article>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-border/70 px-4 py-12 sm:px-6 lg:px-8">
          <div className="container text-sm text-muted-foreground">
            <p>
              Formbox Renderer is an MIT-licensed project by Health Samurai.
              View the source on{" "}
              <a
                className="text-foreground transition hover:text-primary"
                href="https://github.com/HealthSamurai/formbox-renderer"
              >
                GitHub
              </a>{" "}
              or explore the{" "}
              <a
                className="text-foreground transition hover:text-primary"
                href="storybook/"
              >
                Storybook demo
              </a>
              .
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
