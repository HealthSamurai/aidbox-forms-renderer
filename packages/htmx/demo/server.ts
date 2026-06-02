import { loadExample, loadExamples } from "./examples.ts";
import { renderExampleForm, renderExamplePage, renderIndex } from "./render.ts";

const htmxScript = Bun.file(
  new URL("../node_modules/htmx.org/dist/htmx.min.js", import.meta.url),
);
const port = Number(Bun.env["PORT"] ?? 46892);

Bun.serve({
  port,
  async fetch(request) {
    const url = new URL(request.url);

    try {
      if (request.method === "GET" && url.pathname === "/") {
        return html(await renderIndex(await loadExamples()));
      }

      if (request.method === "GET" && url.pathname === "/htmx.min.js") {
        return javascript(htmxScript);
      }

      const match = /^\/examples\/([^/]+)$/u.exec(url.pathname);
      if (match?.[1]) {
        const example = await loadExample(match[1]);
        if (request.method === "GET") {
          return html(await renderExamplePage(example, request));
        }

        if (request.method === "POST") {
          return html(await renderExampleForm(example, request));
        }
      }

      return text("Not found", 404);
    } catch (error) {
      if (error instanceof Response) {
        return error;
      }

      return text(
        error instanceof Error ? (error.stack ?? error.message) : String(error),
        500,
      );
    }
  },
});

console.log(`Formbox HTMX demo: http://localhost:${port}/`);

function html(value: string): Response {
  return new Response(value, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function javascript(value: BunFile): Response {
  return new Response(value, {
    headers: { "content-type": "text/javascript; charset=utf-8" },
  });
}

function text(value: string, status: number): Response {
  return new Response(value, {
    status,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
