import { userServices } from "@ryogo-travel-app/api/services/user.services";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const resetData = await userServices.matchEmail(body.userId, body.email);

    return NextResponse.json(resetData, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 400 }
    );
  }
}
