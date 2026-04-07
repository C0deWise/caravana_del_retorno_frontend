import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://caravana-api-dev.onrender.com";

type RouteParams = { params: Promise<{ path: string[] }> };

async function forwardRequest(
  request: NextRequest,
  params: RouteParams["params"],
  method: string,
): Promise<NextResponse> {
  const { path } = await params;
  const url = `${API_BASE}/${path.join("/")}`;

  const isReadMethod = method === "GET" || method === "DELETE";
  const body = isReadMethod ? undefined : JSON.stringify(await request.json());

  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body,
    redirect: "follow",
  });

  const text = await response.text();

  let data: unknown;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { detail: text };
  }

  return NextResponse.json(data, { status: response.status });
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
