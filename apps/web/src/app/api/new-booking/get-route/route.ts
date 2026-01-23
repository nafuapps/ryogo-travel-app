import { NextRequest, NextResponse } from "next/server"
import { routeServices } from "@ryogo-travel-app/api/services/route.services"
import { getCurrentUser } from "@/lib/auth"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

export async function GET(req: NextRequest) {
  // Find route info
  try {
    //Check user auth
    const user = await getCurrentUser()
    if (
      !user ||
      ![UserRolesEnum.OWNER, UserRolesEnum.AGENT].includes(user.userRole)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const searchParams = req.nextUrl.searchParams
    const sourceCity = searchParams.get("sourceCity")
    const sourceState = searchParams.get("sourceState")
    const destinationCity = searchParams.get("destinationCity")
    const destinationState = searchParams.get("destinationState")

    if (!sourceCity || !sourceState || !destinationCity || !destinationState) {
      return NextResponse.json(
        { error: "Source/destination not provided" },
        { status: 400 },
      )
    }

    const route = await routeServices.findOrCreateRouteByLocations(
      sourceCity,
      sourceState,
      destinationCity,
      destinationState,
    )

    return NextResponse.json(route ?? null, { status: 200 })
  } catch (err: unknown) {
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
