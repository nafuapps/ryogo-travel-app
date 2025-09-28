import { NextRequest, NextResponse } from "next/server";
import { userServices } from "@ryogo-travel-app/api/services/user.services";
import { AgencyRegex } from "@/app/auth/components/regex";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ agencyId: string }> }
) {
  // Fetch existing agents in agency
  try {
    const { agencyId } = await params;
    if (!AgencyRegex.safeParse(agencyId).success) {
      return NextResponse.json({ error: "Invalid agencyId" }, { status: 400 });
    }
    const agents = await userServices.getAgentsInAgency(agencyId);

    return NextResponse.json(agents, { status: 200 });
  } catch (err: unknown) {
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
