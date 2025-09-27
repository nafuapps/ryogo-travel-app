import { NextRequest, NextResponse } from "next/server";
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services";

export async function GET(req: NextRequest) {
  // Fetch existing owner account info
  try {
    const searchParams = req.nextUrl.searchParams;
    const vehicleNumber = searchParams.get("vehicleNumber");
    const agencyId = searchParams.get("agencyId");
    const vehicles = await vehicleServices.findVehicleByNumberInAgency(
      vehicleNumber!,
      agencyId!
    );

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
