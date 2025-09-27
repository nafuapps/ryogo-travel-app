import { NextRequest, NextResponse } from "next/server";
import { userServices } from "@ryogo-travel-app/api/services/user.services";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const users = await userServices.findUsersByPhone(body.phone);

    return NextResponse.json(users, { status: 201 });
  } catch (err) {
    const errorMessage =
      typeof err === "object" && err !== null && "message" in err
        ? (err as { message?: string }).message
        : undefined;
    return NextResponse.json(
      { error: errorMessage || "Something went wrong" },
      { status: 400 }
    );
  }
}
