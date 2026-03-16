import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * Proxies PDF requests from Convex storage to avoid CORS issues with pdf.js.
 * Only allows URLs from Convex storage (convex.cloud/api/storage).
 */
export async function GET(request: NextRequest) {
  await auth.protect();

  const urlParam = request.nextUrl.searchParams.get("url");
  if (!urlParam) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  let sourceUrl: URL;
  try {
    sourceUrl = new URL(urlParam);
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  if (sourceUrl.protocol !== "https:") {
    return NextResponse.json({ error: "Only HTTPS URLs allowed" }, { status: 400 });
  }

  const hostname = sourceUrl.hostname.toLowerCase();
  const pathname = sourceUrl.pathname;
  const isConvexStorage =
    hostname.endsWith(".convex.cloud") && pathname.startsWith("/api/storage");

  if (!isConvexStorage) {
    return NextResponse.json({ error: "Only Convex storage URLs allowed" }, { status: 400 });
  }

  try {
    const rangeHeader = request.headers.get("range");
    const response = await fetch(sourceUrl.toString(), {
      headers: {
        Accept: "application/pdf",
        ...(rangeHeader ? { Range: rangeHeader } : {}),
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Upstream returned ${response.status}` },
        { status: response.status }
      );
    }

    const headers = new Headers({
      "Cache-Control": "private, max-age=3600",
      "Content-Type": response.headers.get("content-type") ?? "application/pdf",
    });

    for (const headerName of [
      "accept-ranges",
      "content-disposition",
      "content-length",
      "content-range",
      "etag",
      "last-modified",
    ]) {
      const value = response.headers.get(headerName);
      if (value) {
        headers.set(headerName, value);
      }
    }

    return new NextResponse(response.body, {
      headers,
      status: response.status,
    });
  } catch (error) {
    console.error("PDF proxy error:", error);
    return NextResponse.json(
      { error: "Failed to fetch PDF" },
      { status: 502 }
    );
  }
}
