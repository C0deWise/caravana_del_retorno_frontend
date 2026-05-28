import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_BASE_URL;
type RouteParams = { params: Promise<{ path: string[] }> };

interface FetchError extends Error {
  code?: string;
  cause?: { code?: string };
}

function buildTargetUrl(base: string, pathSegments: string[], preserveTrailingSlash: boolean): string {
  const normalizedBase = base.replace(/\/+$/, "");
  let relativePath = pathSegments.join("/").replace(/^\/+/, "");

  // If API_BASE already contains /api/v1, avoid duplicating it from proxied path.
  if (/\/api\/v1$/i.test(normalizedBase) && relativePath.startsWith("api/v1/")) {
    relativePath = relativePath.slice("api/v1/".length);
  }

  let target = `${normalizedBase}/${relativePath}`;
  if (preserveTrailingSlash && !target.endsWith("/")) {
    target += "/";
  }
  return target;
}

function shouldForceCollectionTrailingSlash(method: string, pathSegments: string[]): boolean {
  const isWriteMethod = method === "POST" || method === "PATCH" || method === "PUT" || method === "DELETE";
  const isCollectionRoot =
    pathSegments.length === 3 &&
    pathSegments[0]?.toLowerCase() === "api" &&
    pathSegments[1]?.toLowerCase() === "v1";

  return isWriteMethod && isCollectionRoot;
}

async function fetchWithRetry(
  url: string,
  buildInit: (attempt: number) => RequestInit,
  retries: number,
) {
  let lastError: unknown;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const init = buildInit(attempt);
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
  const contentType = response.headers.get("content-type")?.toLocaleLowerCase() || "";
  const setCookieHeader = response.headers.get("set-cookie");

  const appendProxyHeaders = (proxyResponse: NextResponse) => {
    if (setCookieHeader) {
      proxyResponse.headers.set("set-cookie", setCookieHeader);
    }
    return proxyResponse;
  };

  if (contentType.includes("application/json") || contentType.includes("text/")) {

    const text = await response.text();

    if (response.status === 204 || !text) {
      return appendProxyHeaders(new NextResponse(null, { status: response.status }));
    }

    try {
      return appendProxyHeaders(NextResponse.json(JSON.parse(text), { status: response.status }));
    } catch {
      return appendProxyHeaders(new NextResponse(text, {
        status: response.status,
        headers: {
          "Content-Type": response.headers.get("content-type") ?? "text/plain",
        },
      }));
    }
  }

  const arrayBuffer = await response.arrayBuffer();
  return appendProxyHeaders(new NextResponse(arrayBuffer, {
    status: response.status,
    headers: {
      "Content-Type": contentType,
    }
  }));
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
  if (!API_BASE) {
    return NextResponse.json(
      {
        error: "Proxy misconfiguration",
        message: "API_BASE_URL is not configured",
      },
      { status: 500 },
    );
  }

  const preserveTrailingSlash =
    request.nextUrl.pathname.endsWith("/") || shouldForceCollectionTrailingSlash(method, path);
  const url = buildTargetUrl(API_BASE, path, preserveTrailingSlash);
  const isReadMethod = method === "GET" || method === "HEAD";
  const retries = isReadMethod ? 3 : 1;

  // Copiar headers originales
  const headers = new Headers();
  const allowedHeaders = new Set(["content-type", "authorization", "accept", "cookie"]);
  request.headers.forEach((value, key) => {
    if (allowedHeaders.has(key.toLowerCase()) || key.toLowerCase().startsWith("x-")) {
      headers.set(key, value);
    }
  });

  let rawBodyBytes: number[] | undefined;
  if (!isReadMethod) {
    const bodyBuffer = await request.arrayBuffer();
    if (bodyBuffer.byteLength > 0) {
      rawBodyBytes = Array.from(new Uint8Array(bodyBuffer));
    }
  }

  try {
    const response = await fetchWithRetry(
      url,
      () => {
        const body = rawBodyBytes ? Uint8Array.from(rawBodyBytes) : undefined;
        return {
          method,
          headers,
          body,
          redirect: "follow",
        };
      },
      retries,
    );

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