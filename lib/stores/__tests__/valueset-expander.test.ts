import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ValueSetExpander } from "../services/valueset-expander.ts";

const buildFetchResponse = (contains = [{ system: "sys", code: "code" }]) =>
  ({
    ok: true,
    status: 200,
    statusText: "OK",
    json: () =>
      Promise.resolve({
        expansion: {
          contains,
        },
      }),
  }) as unknown as Response;

const buildErrorResponse = (status: number) =>
  ({
    ok: false,
    status,
    statusText: `Error ${status}`,
    json: () => Promise.resolve({}),
  }) as unknown as Response;

describe("valueset expander", () => {
  const canonical = "http://example.org/ValueSet/demo";
  const globalWithFetch = globalThis as typeof globalThis & {
    fetch: typeof fetch;
  };
  let originalFetch: typeof fetch;
  let fetchSpy: ReturnType<typeof vi.fn<typeof fetch>>;

  beforeEach(() => {
    originalFetch = globalWithFetch.fetch;
    fetchSpy = vi.fn<typeof fetch>().mockResolvedValue(buildFetchResponse());
    globalWithFetch.fetch = fetchSpy;
  });

  afterEach(() => {
    globalWithFetch.fetch = originalFetch;
  });

  it("uses the default server when no override is provided", async () => {
    const expander = new ValueSetExpander("https://tx.example/r5");

    const codings = await expander.expand(canonical, []);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy.mock.calls[0]?.[0]).toBe(
      "https://tx.example/r5/ValueSet/$expand?url=http%3A%2F%2Fexample.org%2FValueSet%2Fdemo",
    );
    expect(codings).toEqual([
      { system: "sys", code: "code", display: undefined, version: undefined },
    ]);
  });

  it("keeps separate caches per terminology server", async () => {
    const expander = new ValueSetExpander("https://first.example");

    await expander.expand(canonical, []);
    await expander.expand(canonical, []); // cached

    expect(fetchSpy).toHaveBeenCalledTimes(1);

    await expander.expand(canonical, ["https://second.example"]);
    await expander.expand(canonical, ["https://second.example"]);

    expect(fetchSpy).toHaveBeenCalledTimes(2);
    expect(fetchSpy.mock.calls[1]?.[0]).toBe(
      "https://second.example/ValueSet/$expand?url=http%3A%2F%2Fexample.org%2FValueSet%2Fdemo",
    );
  });

  it("tries preferred servers sequentially before falling back to default", async () => {
    fetchSpy
      .mockRejectedValueOnce(new Error("first failed"))
      .mockResolvedValueOnce(buildFetchResponse());

    const expander = new ValueSetExpander();

    const codings = await expander.expand(canonical, [
      "https://first.example",
      "https://second.example",
    ]);

    expect(codings).toEqual([
      { system: "sys", code: "code", display: undefined, version: undefined },
    ]);
    expect(fetchSpy).toHaveBeenCalledTimes(2);
    expect(fetchSpy.mock.calls[0]?.[0]).toBe(
      "https://first.example/ValueSet/$expand?url=http%3A%2F%2Fexample.org%2FValueSet%2Fdemo",
    );
    expect(fetchSpy.mock.calls[1]?.[0]).toBe(
      "https://second.example/ValueSet/$expand?url=http%3A%2F%2Fexample.org%2FValueSet%2Fdemo",
    );
  });

  it("attempts the default server when all preferred servers fail", async () => {
    fetchSpy
      .mockRejectedValueOnce(new Error("first failed"))
      .mockResolvedValueOnce(
        buildFetchResponse([{ system: "sys", code: "default" }]),
      );

    const expander = new ValueSetExpander("https://fallback.example");

    const codings = await expander.expand(canonical, ["https://first.example"]);

    expect(codings).toEqual([
      {
        system: "sys",
        code: "default",
        display: undefined,
        version: undefined,
      },
    ]);
    expect(fetchSpy).toHaveBeenCalledTimes(2);
    expect(fetchSpy.mock.calls[0]?.[0]).toBe(
      "https://first.example/ValueSet/$expand?url=http%3A%2F%2Fexample.org%2FValueSet%2Fdemo",
    );
    expect(fetchSpy.mock.calls[1]?.[0]).toBe(
      "https://fallback.example/ValueSet/$expand?url=http%3A%2F%2Fexample.org%2FValueSet%2Fdemo",
    );
  });

  it("retains cached 4xx failures", async () => {
    fetchSpy.mockResolvedValue(buildErrorResponse(404));

    const expander = new ValueSetExpander("https://tx.example/r5");

    await expect(expander.expand(canonical, [])).rejects.toThrow(/404/);
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    await expect(expander.expand(canonical, [])).rejects.toThrow(/404/);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("evicts cached entries for 5xx failures", async () => {
    fetchSpy
      .mockResolvedValueOnce(buildErrorResponse(500))
      .mockResolvedValueOnce(buildFetchResponse());

    const expander = new ValueSetExpander("https://tx.example/r5");

    await expect(expander.expand(canonical, [])).rejects.toThrow(/500/);
    await expander.expand(canonical, []);

    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });
});
