import { NextRequest, NextResponse } from "next/server";
import { userServices } from "@ryogo-travel-app/api/services/user.services";
import { OnboardingChangePasswordAPIRequestType } from "@ryogo-travel-app/api/types/user.types";
import { getCurrentUser } from "@/lib/auth";
import { UserRegex } from "@/lib/regex";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    //Check user auth
    const user = await getCurrentUser();
    if (!user || user.userRole !== "owner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await params;

    if (!UserRegex.safeParse(userId).success) {
      return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
    }

    const body: OnboardingChangePasswordAPIRequestType = await req.json();
    const oldPassword = body.oldPassword;
    const newPassword = body.newPassword;

    const updatedUser = await userServices.changePassword(
      userId,
      oldPassword,
      newPassword
    );

    return NextResponse.json(updatedUser, { status: 201 });
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
