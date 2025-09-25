import { NextRequest, NextResponse } from "next/server";
import { userServices } from "@ryogo-travel-app/api/services/user.services";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const users = await userServices.findUsersByPhone(body.phone);

    return NextResponse.json(users, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 400 }
    );
  }
}
