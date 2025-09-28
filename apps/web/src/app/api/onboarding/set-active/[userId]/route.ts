import { NextRequest, NextResponse } from "next/server";
import { userServices } from "@ryogo-travel-app/api/services/user.services";
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services";
import { updateSessionUserStatus } from "@/lib/session";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const user = await userServices.activateUser(userId);

    const agency = await agencyServices.activateAgency(user.agencyId);

    console.log("DB update successful");

    //Update status in session cookie
    await updateSessionUserStatus("active");

    return NextResponse.json({ agencyId: agency.id }, { status: 201 });
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
