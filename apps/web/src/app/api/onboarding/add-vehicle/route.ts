import { NextRequest, NextResponse } from "next/server"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { OnboardingAddVehicleAPIRequestType } from "@ryogo-travel-app/api/types/vehicle.types"
import { getCurrentUser } from "@/lib/auth"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

export async function POST(req: NextRequest) {
  try {
    //Check user auth
    const user = await getCurrentUser()
    if (!user || user.userRole != UserRolesEnum.OWNER) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const body: OnboardingAddVehicleAPIRequestType = await req.json()
    const vehicle = await vehicleServices.addVehicle(body)
    return NextResponse.json(vehicle, { status: 201 })
  } catch (err) {
    const errorMessage =
      typeof err === "object" && err !== null && "message" in err
        ? (err as { message?: string }).message
        : undefined
    return NextResponse.json(
      { error: errorMessage || "Something went wrong" },
      { status: 400 },
    )
  }
}
