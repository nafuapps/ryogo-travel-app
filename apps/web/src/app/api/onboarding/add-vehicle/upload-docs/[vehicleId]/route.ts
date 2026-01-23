import { NextRequest, NextResponse } from "next/server"
import { uploadFile } from "@ryogo-travel-app/db/storage"
import { VehicleRegex } from "@/lib/regex"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { getCurrentUser } from "@/lib/auth"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ vehicleId: string }> },
) {
  try {
    //Check user auth
    const user = await getCurrentUser()
    if (!user || user.userRole != UserRolesEnum.OWNER) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    //Get vehicleId
    const { vehicleId } = await params
    if (!VehicleRegex.safeParse(vehicleId).success) {
      return NextResponse.json({ error: "Invalid vehicleId" }, { status: 400 })
    }

    //Get files
    const formData = await req.formData()
    const rc = formData.get("rc") as File
    const puc = formData.get("puc") as File
    const insurance = formData.get("insurance") as File
    const vehiclePhoto = formData.get("vehicle") as File
    if (!rc && !puc && !insurance && !vehiclePhoto) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    let rcUrl = ""
    let pucUrl = ""
    let insuranceUrl = ""
    let vehiclePhotoUrl = ""

    // Upload files to Supabase Storage
    if (rc) {
      const data = await uploadFile(
        rc,
        `${vehicleId}/rc/${Date.now()}-${rc.name}`,
      )
      rcUrl = data?.path
      // await vehicleServices.renewRcURL(vehicleId, rcUrl);
    }
    if (puc) {
      const data = await uploadFile(
        puc,
        `${vehicleId}/puc/${Date.now()}-${puc.name}`,
      )
      pucUrl = data?.path
      // await vehicleServices.renewPucURL(vehicleId, pucUrl);
    }
    if (insurance) {
      const data = await uploadFile(
        insurance,
        `${vehicleId}/insurance/${Date.now()}-${insurance.name}`,
      )
      insuranceUrl = data?.path
      // await vehicleServices.renewInsuranceURL(vehicleId, insuranceUrl);
    }
    if (vehiclePhoto) {
      const data = await uploadFile(
        vehiclePhoto,
        `${vehicleId}/vehiclePhoto/${Date.now()}-${vehiclePhoto.name}`,
      )
      vehiclePhotoUrl = data?.path
      // await vehicleServices.renewVehiclePhotoURL(vehicleId, vehiclePhotoUrl);
    }

    await vehicleServices.renewVehicleDocURLs(
      vehicleId,
      rcUrl,
      pucUrl,
      insuranceUrl,
      vehiclePhotoUrl,
    )
    return NextResponse.json({ id: vehicleId }, { status: 201 })
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
