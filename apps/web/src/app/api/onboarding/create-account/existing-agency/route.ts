import { NextRequest, NextResponse } from "next/server";
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services";

export async function GET(req: NextRequest) {
  // Fetch existing agency info
  try {
    const searchParams = req.nextUrl.searchParams;
    const phone = searchParams.get("phone");
    const email = searchParams.get("email");
    const agencies = await agencyServices.findAgencyByPhoneEmail(
      phone!,
      email!
    );

    return NextResponse.json(agencies, { status: 200 });
  } catch (err: unknown) {
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
