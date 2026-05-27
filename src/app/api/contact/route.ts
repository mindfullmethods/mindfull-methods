import { NextResponse } from "next/server";

type ContactRequest = {
  name: string;
  email: string;
  phone?: string;
  interest: string;
  message: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ContactRequest;

    // Basic server-side guard (client already validates).
    if (!body?.name?.trim() || !body?.email?.trim() || !body?.message?.trim()) {
      return NextResponse.json({ ok: false, error: "Missing required fields." }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
}

