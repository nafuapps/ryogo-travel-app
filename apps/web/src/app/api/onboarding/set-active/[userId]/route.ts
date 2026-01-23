import { NextRequest, NextResponse } from "next/server"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { updateSessionUserStatus } from "@/lib/session"
import { getCurrentUser } from "@/lib/auth"
import { UserRegex } from "@/lib/regex"
import { UserRolesEnum, UserStatusEnum } from "@ryogo-travel-app/db/schema"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    //Check user auth
    const user = await getCurrentUser()
    if (!user || user.userRole != UserRolesEnum.OWNER) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    //Get userId from params
    const { userId } = await params
    if (!UserRegex.safeParse(userId).success) {
      return NextResponse.json({ error: "Invalid userId" }, { status: 400 })
    }

    const resultUser = await userServices.activateUser(userId)

    const agency = await agencyServices.activateAgency(resultUser.agencyId)

    //Update status in session cookie
    await updateSessionUserStatus(UserStatusEnum.ACTIVE)

    return NextResponse.json({ agencyId: agency.id }, { status: 201 })
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
