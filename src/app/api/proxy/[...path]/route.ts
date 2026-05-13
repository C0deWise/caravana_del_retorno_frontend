import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_BASE_URL;
type RouteParams = { params: Promise<{ path: string[] }> };

interface FetchError extends Error {
  code?: string;
  cause?: { code?: string };
}

async function fetchWithRetry(url: string, init: RequestInit, retries = 3) {
  let lastError: unknown;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url, {
        ...init,
        signal: AbortSignal.timeout(30000),
        cache: "no-store",
      });

      return response;
    } catch (error) {
      lastError = error;
      const fetchError = error as FetchError;
      
      const isTimeout = error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError");
      const code = fetchError.cause?.code || fetchError.code;

      const retryableCodes = ["ENOTFOUND", "ECONNRESET", "ETIMEDOUT"];
      const isRetryable = isTimeout || (code && retryableCodes.includes(code));

      if (!isRetryable || attempt === retries - 1) {
        throw error;
      }

      await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
    }
  }

  throw lastError;
}

async function handleApiResponse(response: Response): Promise<NextResponse> {
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
}

function handleProxyError(error: unknown, method: string, url: string): NextResponse {
  console.error(`[Proxy Error] ${method} ${url}:`, error);

  const isTimeout = error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError");
  const status = isTimeout ? 504 : 502;
  
  const fetchError = error as FetchError;
  const code = fetchError.cause?.code || fetchError.code || (isTimeout ? "TIMEOUT" : "FETCH_ERROR");

  return NextResponse.json(
    {
      error: isTimeout ? "Gateway Timeout" : "Proxy request failed",
      message: error instanceof Error ? error.message : "An unexpected error occurred",
      code,
      url,
    },
    { status },
  );
}

async function forwardRequest(
  request: NextRequest,
  params: RouteParams["params"],
  method: string,
): Promise<NextResponse> {
  const { path } = await params;
  const url = `${API_BASE}/${path.join("/")}/`;
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

    return handleApiResponse(response);
  } catch (error) {
    return handleProxyError(error, method, url);
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