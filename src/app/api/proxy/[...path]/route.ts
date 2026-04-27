import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_BASE_URL!;

type RouteParams = { params: Promise<{ path: string[] }> };

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
  if (body) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
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
    const data = JSON.parse(text);
    return NextResponse.json(data, { status: response.status });
  } catch {
    return new NextResponse(text, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") ?? "text/plain",
      },
    });
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
