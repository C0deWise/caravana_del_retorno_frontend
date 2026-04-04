import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://caravana-api-dev.onrender.com";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const url = `${API_BASE}/${path.join("/")}`;

  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    redirect: "follow",
  });
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const url = `${API_BASE}/${path.join("/")}`;

  const body = await request.json();
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    redirect: "follow",
  });
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
