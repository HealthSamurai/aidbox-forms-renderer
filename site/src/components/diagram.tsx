import { cn } from "@/lib/utilities.ts";

type Properties = {
  svg: string;
  className?: string;
};

export default function Diagram({ svg, className }: Properties) {
  return (
    <div
      className={cn(
        "overflow-x-auto rounded-lg p-4 [&:not(:first-child)]:mt-6",
        className,
      )}
      style={{ backgroundColor: __DOCS_CODE_BLOCK_BG__ }}
    >
      <div
        className="flex justify-center [&>svg]:h-auto [&>svg]:max-w-full [&>svg]:w-full"
        aria-label="Mermaid diagram"
        role="img"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
}
