import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_BASE_URL!;
type RouteParams = { params: Promise<{ path: string[] }> };

async function fetchWithRetry(url: string, init: RequestInit, retries = 3) {
  let lastError: unknown;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(url, {
        ...init,
        signal: controller.signal,
        cache: "no-store",
      });

      clearTimeout(timeout);
      return response;
    } catch (error) {
      lastError = error;
      const code =
        (error as any)?.cause?.code ||
        (error as any)?.code;

      if (!["ENOTFOUND", "ECONNRESET", "ETIMEDOUT"].includes(code) || attempt === retries - 1) {
        throw error;
      }

      await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
    }
  }

  throw lastError;
}

async function forwardRequest(
  request: NextRequest,
  params: RouteParams["params"],
  method: string,
): Promise<NextResponse> {
  const { path } = await params;
  const url = `${API_BASE}/${path.join("/")}`;
  const isReadMethod = method === "GET" || method === "DELETE";

  let body: string | undefined;
  if (!isReadMethod) {
    const rawBody = await request.text();
    body = rawBody.trim() ? rawBody : undefined;
  }

  const headers: HeadersInit = {};
  if (body) headers["Content-Type"] = "application/json";

  try {
    const response = await fetchWithRetry(url, {
      method,
      headers,
      body,
      redirect: "follow",
    });

    const text = await response.text();

    if (response.status === 204 || !text) {
      return new NextResponse(null, { status: response.status });
    }

    try {
      return NextResponse.json(JSON.parse(text), { status: response.status });
    } catch {
      return new NextResponse(text, {
        status: response.status,
        headers: {
          "Content-Type": response.headers.get("content-type") ?? "text/plain",
        },
      });
    }
  } catch (error: any) {
    const code = error?.cause?.code || error?.code || "FETCH_ERROR";

    return NextResponse.json(
      {
        error: "Proxy request failed",
        code,
        url,
      },
      { status: 502 },
    );
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  return forwardRequest(request, params, "GET");
}
export async function POST(request: NextRequest, { params }: RouteParams) {
  return forwardRequest(request, params, "POST");
}
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  return forwardRequest(request, params, "PATCH");
}
export async function PUT(request: NextRequest, { params }: RouteParams) {
  return forwardRequest(request, params, "PUT");
}
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  return forwardRequest(request, params, "DELETE");
}