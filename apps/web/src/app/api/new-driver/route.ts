import { NextRequest, NextResponse } from "next/server"
import {
  NewDriverAPIRequestType,
  NewDriverAPIResponseType,
} from "@ryogo-travel-app/api/types/driver.types"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { getCurrentUser } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    //Check user auth
    const user = await getCurrentUser()
    if (!user || !["owner", "agent"].includes(user.userRole)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body: NewDriverAPIRequestType = await req.json()
    const driver: NewDriverAPIResponseType = await userServices.addDriverUser(
      body
    )
    return NextResponse.json(driver, { status: 201 })
  } catch (err) {
    const errorMessage =
      typeof err === "object" && err !== null && "message" in err
        ? (err as { message?: string }).message
        : undefined
    return NextResponse.json(
      { error: errorMessage || "Something went wrong" },
      { status: 400 }
    )
  }
}
