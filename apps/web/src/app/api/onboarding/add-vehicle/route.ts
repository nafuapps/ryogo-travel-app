import { NextRequest, NextResponse } from "next/server";
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services";
import { OnboardingAddVehicleAPIRequestType } from "@ryogo-travel-app/api/types/vehicle.types";

export async function POST(req: NextRequest) {
  try {
    const body: OnboardingAddVehicleAPIRequestType = await req.json();
    const vehicle = await vehicleServices.addVehicle(body);
    return NextResponse.json(vehicle, { status: 201 });
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
