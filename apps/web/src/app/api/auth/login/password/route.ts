import { NextRequest, NextResponse } from "next/server";
import { login } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const loginStatus = await login(body.userId, body.password);

    return NextResponse.json(loginStatus, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 400 }
    );
  }
}
