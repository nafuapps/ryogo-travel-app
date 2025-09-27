import { NextResponse } from "next/server";
import { uploadFile } from "@ryogo-travel-app/db/storage";
import { userServices } from "@ryogo-travel-app/api/services/user.services";
import { UserRegex } from "@/app/auth/components/regex";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    //Get userId
    const { userId } = await params;
    if (!UserRegex.safeParse(userId).success) {
      return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
    }

    //Get file
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    //Name file
    const fileName = `${Date.now()}-${file.name}`;

    // Upload to Supabase Storage
    const data = await uploadFile(file, `${userId}/photo/${fileName}`);

    //Update photoUrl in DB
    const photoUrl = data!.fullPath;
    const updatedId = await userServices.updateUserPhoto(userId, photoUrl);

    return NextResponse.json({ id: updatedId }, { status: 201 });
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
