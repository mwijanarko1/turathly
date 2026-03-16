import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const protect = vi.fn();

vi.mock("@clerk/nextjs/server", () => ({
  auth: { protect },
}));

describe("PDF proxy route", () => {
  beforeEach(() => {
    protect.mockReset();
    protect.mockResolvedValue(undefined);
    vi.restoreAllMocks();
  });

  it("requires authentication before proxying", async () => {
    const { GET } = await import("./route");
    const request = new NextRequest("https://example.com/api/pdf?url=https://demo.convex.cloud/api/storage/file.pdf");

    await GET(request);

    expect(protect).toHaveBeenCalledTimes(1);
  });

  it("rejects missing urls", async () => {
    const { GET } = await import("./route");
    const request = new NextRequest("https://example.com/api/pdf");

    const response = await GET(request);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Missing url parameter" });
  });

  it("rejects non-Convex storage urls", async () => {
    const { GET } = await import("./route");
    const request = new NextRequest("https://example.com/api/pdf?url=https://example.com/file.pdf");

    const response = await GET(request);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Only Convex storage URLs allowed" });
  });

  it("proxies valid Convex storage responses", async () => {
    const { GET } = await import("./route");
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue(
      new Response("pdf-bytes", {
        status: 206,
        headers: {
          "content-type": "application/pdf",
          "content-length": "9",
          "content-range": "bytes 0-8/9",
          "accept-ranges": "bytes",
        },
      })
    );

    const request = new NextRequest("https://example.com/api/pdf?url=https://demo.convex.cloud/api/storage/file.pdf", {
      headers: { range: "bytes=0-8" },
    });

    const response = await GET(request);

    expect(fetchSpy).toHaveBeenCalledWith("https://demo.convex.cloud/api/storage/file.pdf", {
      headers: {
        Accept: "application/pdf",
        Range: "bytes=0-8",
      },
    });
    expect(response.status).toBe(206);
    expect(response.headers.get("content-type")).toBe("application/pdf");
    expect(response.headers.get("content-range")).toBe("bytes 0-8/9");
    await expect(response.text()).resolves.toBe("pdf-bytes");
  });
});
