import { NextRequest, NextResponse } from "next/server"
import { uploadFile } from "@ryogo-travel-app/db/storage"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { UserRegex } from "@/lib/regex"
import { getCurrentUser } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    //Check user auth
    const user = await getCurrentUser()
    if (!user || !["owner", "agent"].includes(user.userRole)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    //Get file
    const formData = await req.formData()
    const file = formData.get("photo") as File
    const userId = formData.get("userId") as string

    if (!UserRegex.safeParse(userId).success) {
      return NextResponse.json({ error: "Invalid userId" }, { status: 400 })
    }
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    //Name file
    const fileName = `${Date.now()}-${file.name}`

    // Upload to Supabase Storage
    const data = await uploadFile(file, `${userId}/photo/${fileName}`)

    //Update photoUrl in DB
    const photoUrl = data!.path
    const updatedId = await userServices.updateUserPhoto(userId, photoUrl)

    return NextResponse.json({ id: updatedId }, { status: 201 })
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
