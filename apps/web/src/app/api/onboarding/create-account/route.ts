import { NextRequest, NextResponse } from "next/server";
import { userServices } from "@ryogo-travel-app/api/services/user.services";
import { OnboardingCreateAccountAPIRequestType } from "@ryogo-travel-app/api/types/user.types";

export async function POST(req: NextRequest) {
  try {
    const body: OnboardingCreateAccountAPIRequestType = await req.json();
    const user = await userServices.addAgencyAndOwnerAccount(body);

    return NextResponse.json(user, { status: 201 });
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
