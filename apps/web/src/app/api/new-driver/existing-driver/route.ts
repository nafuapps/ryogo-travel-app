import { NextRequest, NextResponse } from "next/server"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { getCurrentUser } from "@/lib/auth"
import { AgencyRegex, EmailRegex, PhoneRegex } from "@/lib/regex"

export async function GET(req: NextRequest) {
  try {
    //Check user auth
    const user = await getCurrentUser()
    if (!user || !["owner", "agent"].includes(user.userRole)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = req.nextUrl.searchParams
    const phone = searchParams.get("phone")
    const email = searchParams.get("email")
    const agency = searchParams.get("agency")
    if (!phone || !email || !agency) {
      return NextResponse.json(
        { error: "Phone/Email/Agency not provided" },
        { status: 400 }
      )
    }
    if (!EmailRegex.safeParse(email).success) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }
    if (!PhoneRegex.safeParse(phone).success) {
      return NextResponse.json({ error: "Invalid phone" }, { status: 400 })
    }
    if (!AgencyRegex.safeParse(agency).success) {
      return NextResponse.json({ error: "Invalid agency" }, { status: 400 })
    }
    const users = await userServices.findExistingDriverByPhoneEmailAgency(
      phone,
      email,
      agency
    )

    return NextResponse.json(users, { status: 200 })
  } catch (err: unknown) {
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
