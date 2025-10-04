import { NextResponse } from "next/server";
import { uploadFile } from "@ryogo-travel-app/db/storage";
import { DriverRegex } from "@/lib/regex";
import { driverServices } from "@ryogo-travel-app/api/services/driver.services";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ driverId: string }> }
) {
  try {
    //Get userId
    const { driverId } = await params;
    if (!DriverRegex.safeParse(driverId).success) {
      return NextResponse.json({ error: "Invalid driverId" }, { status: 400 });
    }

    //Get file
    const formData = await req.formData();
    const file = formData.get("license") as File;
    if (!file) {
      return NextResponse.json(
        { error: "No license uploaded" },
        { status: 400 }
      );
    }

    //Name file
    const fileName = `${Date.now()}-${file.name}`;

    // Upload to Supabase Storage
    const data = await uploadFile(file, `${driverId}/license/${fileName}`);

    //Update photoUrl in DB
    const photoUrl = data!.fullPath;
    const updatedId = await driverServices.updateDriverLicensePhoto(
      driverId,
      photoUrl
    );

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
