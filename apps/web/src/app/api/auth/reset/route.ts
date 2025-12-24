import { userServices } from "@ryogo-travel-app/api/services/user.services";
import { ResetPasswordAPIResponseType } from "@ryogo-travel-app/api/types/user.types"
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const resetData:ResetPasswordAPIResponseType = await userServices.resetPassword(body.userId, body.email);

    return NextResponse.json(resetData, { status: 201 });
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
