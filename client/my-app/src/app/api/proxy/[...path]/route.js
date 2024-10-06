import { NextResponse } from "next/server";

export async function GET(request) {
  const { pathname, search } = new URL(request.url);
  const path = pathname.replace("/api/proxy", "");

  const response = await fetch(`https://api.iucnredlist.org/${path}${search}`, {
    headers: {
      Authorization: request.headers.get("Authorization"),
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  return NextResponse.json(data);
}

export async function POST(request) {
  const { pathname, search } = new URL(request.url);
  const path = pathname.replace("/api/proxy", "");

  const body = await request.json();

  const response = await fetch(`https://api.iucnredlist.org/${path}${search}`, {
    method: "POST",
    headers: {
      Authorization: request.headers.get("Authorization"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return NextResponse.json(data);
}
