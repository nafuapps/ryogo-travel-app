import { NextRequest, NextResponse } from "next/server";
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services";
import { AgencyRegex } from "@/app/auth/components/regex";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ agencyId: string }> }
) {
  // Fetch existing vehicles in agency
  try {
    const { agencyId } = await params;
    if (!AgencyRegex.safeParse(agencyId).success) {
      return NextResponse.json({ error: "Invalid agencyId" }, { status: 400 });
    }
    const vehicles = await vehicleServices.getVehiclesInAgency(agencyId);

    return NextResponse.json(vehicles, { status: 200 });
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
