import { NextRequest, NextResponse } from "next/server";
import { OnboardingAddAgentAPIRequestType } from "@ryogo-travel-app/api/types/user.types";
import { userServices } from "@ryogo-travel-app/api/services/user.services";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    //Check user auth
    const user = await getCurrentUser();
    if (!user || user.userRole !== "owner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: OnboardingAddAgentAPIRequestType = await req.json();
    const agent = await userServices.addAgentUser(body);
    return NextResponse.json(agent, { status: 201 });
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
