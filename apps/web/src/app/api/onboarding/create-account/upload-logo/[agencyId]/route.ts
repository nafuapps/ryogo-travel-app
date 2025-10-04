import { NextResponse } from "next/server";
import { uploadFile } from "@ryogo-travel-app/db/storage";
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services";
import { AgencyRegex } from "@/lib/regex";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ agencyId: string }> }
) {
  try {
    //Get agencyId
    const { agencyId } = await params;
    if (!AgencyRegex.safeParse(agencyId).success) {
      return NextResponse.json({ error: "Invalid agencyId" }, { status: 400 });
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
    const data = await uploadFile(file, `${agencyId}/logo/${fileName}`);

    //Update logoUrl in DB
    const logoUrl = data!.fullPath;
    const updatedId = await agencyServices.updateAgencyLogo(agencyId, logoUrl);

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
