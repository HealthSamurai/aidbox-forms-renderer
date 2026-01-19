import { MDXProvider } from "@mdx-js/react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import Diagram from "@/components/diagram.tsx";
import { cn, resolveHeadingId } from "@/lib/utilities.ts";

const mdxComponents = {
  Diagram,
  h1: ({ className, ...properties }: ComponentPropsWithoutRef<"h1">) => (
    <h1
      className={cn(
        "scroll-m-20 break-words text-4xl font-extrabold tracking-tight lg:text-5xl [&:not(:first-child)]:mt-10",
        className,
      )}
      {...properties}
    />
  ),
  h2: ({
    id,
    className,
    children,
    ...properties
  }: ComponentPropsWithoutRef<"h2">) => {
    const headingId = resolveHeadingId(id, children);
    return (
      <h2
        id={headingId}
        className={cn(
          "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight [&:not(:first-child)]:mt-10",
          className,
        )}
        {...properties}
      >
        {headingId ? (
          <a href={`#${headingId}`} className="no-underline hover:no-underline">
            {children}
          </a>
        ) : (
          children
        )}
      </h2>
    );
  },
  h3: ({
    id,
    className,
    children,
    ...properties
  }: ComponentPropsWithoutRef<"h3">) => {
    const headingId = resolveHeadingId(id, children);
    return (
      <h3
        id={headingId}
        className={cn(
          "scroll-m-20 text-2xl font-semibold tracking-tight [&:not(:first-child)]:mt-10",
          className,
        )}
        {...properties}
      >
        {headingId ? (
          <a href={`#${headingId}`} className="no-underline hover:no-underline">
            {children}
          </a>
        ) : (
          children
        )}
      </h3>
    );
  },
  h4: ({
    id,
    className,
    children,
    ...properties
  }: ComponentPropsWithoutRef<"h4">) => {
    const headingId = resolveHeadingId(id, children);
    return (
      <h4
        id={headingId}
        className={cn(
          "scroll-m-20 text-xl font-semibold tracking-tight [&:not(:first-child)]:mt-10",
          className,
        )}
        {...properties}
      >
        {headingId ? (
          <a href={`#${headingId}`} className="no-underline hover:no-underline">
            {children}
          </a>
        ) : (
          children
        )}
      </h4>
    );
  },
  h5: ({ className, ...properties }: ComponentPropsWithoutRef<"h5">) => (
    <h5
      className={cn(
        "scroll-m-20 text-lg font-semibold tracking-tight [&:not(:first-child)]:mt-10",
        className,
      )}
      {...properties}
    />
  ),
  h6: ({ className, ...properties }: ComponentPropsWithoutRef<"h6">) => (
    <h6
      className={cn(
        "scroll-m-20 text-lg font-semibold tracking-tight [&:not(:first-child)]:mt-10",
        className,
      )}
      {...properties}
    />
  ),
  p: ({ className, ...properties }: ComponentPropsWithoutRef<"p">) => (
    <p
      className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
      {...properties}
    />
  ),
  a: ({ className, ...properties }: ComponentPropsWithoutRef<"a">) => (
    <a
      className={cn("font-semibold underline underline-offset-4", className)}
      {...properties}
    />
  ),
  ul: ({ className, ...properties }: ComponentPropsWithoutRef<"ul">) => (
    <ul
      className={cn(
        "[&:not(:first-child)]:mt-6 ml-6 list-disc [&>li]:mt-2",
        className,
      )}
      {...properties}
    />
  ),
  ol: ({ className, ...properties }: ComponentPropsWithoutRef<"ol">) => (
    <ol
      className={cn(
        "[&:not(:first-child)]:mt-6 ml-6 list-decimal [&>li]:mt-2",
        className,
      )}
      {...properties}
    />
  ),
  li: ({ className, ...properties }: ComponentPropsWithoutRef<"li">) => (
    <li className={cn(className)} {...properties} />
  ),
  blockquote: ({
    className,
    ...properties
  }: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className={cn(
        "[&:not(:first-child)]:mt-6 border-l-2 pl-6 italic",
        className,
      )}
      {...properties}
    />
  ),
  pre: ({ className, ...properties }: ComponentPropsWithoutRef<"pre">) => (
    <pre
      className={cn(
        "relative overflow-x-auto rounded-lg border p-4 font-mono text-sm [&:not(:first-child)]:mt-6",
        className,
      )}
      {...properties}
    />
  ),
  table: ({ className, ...properties }: ComponentPropsWithoutRef<"table">) => (
    <div className="w-full overflow-y-auto [&:not(:first-child)]:mt-6">
      <table className={cn("w-full", className)} {...properties} />
    </div>
  ),
  tr: ({ className, ...properties }: ComponentPropsWithoutRef<"tr">) => (
    <tr
      className={cn("m-0 border-t p-0 even:bg-muted", className)}
      {...properties}
    />
  ),
  th: ({ className, ...properties }: ComponentPropsWithoutRef<"th">) => (
    <th
      className={cn(
        "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
        className,
      )}
      {...properties}
    />
  ),
  td: ({ className, ...properties }: ComponentPropsWithoutRef<"td">) => (
    <td
      className={cn(
        "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
        className,
      )}
      {...properties}
    />
  ),
  hr: ({ className, ...properties }: ComponentPropsWithoutRef<"hr">) => (
    <hr
      className={cn("[&:not(:first-child)]:mt-6", className)}
      {...properties}
    />
  ),
  strong: ({
    className,
    ...properties
  }: ComponentPropsWithoutRef<"strong">) => (
    <strong className={cn("font-semibold", className)} {...properties} />
  ),
};

export default function Markdown({
  children,
  contentId,
  className,
}: {
  children: ReactNode;
  contentId: string;
  className?: string;
}) {
  return (
    <MDXProvider components={mdxComponents}>
      <div
        id={contentId}
        className={cn(
          "[&_:not(pre)>code]:bg-muted [&_:not(pre)>code]:relative [&_:not(pre)>code]:rounded [&_:not(pre)>code]:px-[0.3rem] [&_:not(pre)>code]:py-[0.2rem] [&_:not(pre)>code]:font-mono [&_:not(pre)>code]:text-sm [&_:not(pre)>code]:font-semibold",
          className,
        )}
      >
        {children}
      </div>
    </MDXProvider>
  );
}
