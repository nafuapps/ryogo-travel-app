import { NextRequest, NextResponse } from "next/server";
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services";
import { AgencyRegex } from "@/lib/regex";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ agencyId: string }> }
) {
  // Fetch agency data (vehicles, drivers, agents)
  try {
    //Check user auth
    const user = await getCurrentUser();
    if (!user || user.userRole !== "owner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { agencyId } = await params;
    if (!AgencyRegex.safeParse(agencyId).success) {
      return NextResponse.json({ error: "Invalid agencyId" }, { status: 400 });
    }
    const agencyData = await agencyServices.getAgencyData(agencyId);

    return NextResponse.json(agencyData, { status: 200 });
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
