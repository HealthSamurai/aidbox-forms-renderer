import { cn } from "@/lib/utilities.ts";

type Properties = {
  html?: string;
  code?: string;
  language?: string;
  className?: string;
};

export default function CodeBlock({ html, code, className }: Properties) {
  return (
    <div
      className={cn(
        "overflow-x-auto rounded-xl border border-border/60 bg-muted/60 p-4 text-xs text-foreground [&_pre]:m-0 [&_pre]:bg-transparent [&_pre]:p-0 [&_pre]:font-mono [&_code]:font-mono [&_code]:text-xs",
        className,
      )}
    >
      {html ? (
        <div dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <pre>
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}
