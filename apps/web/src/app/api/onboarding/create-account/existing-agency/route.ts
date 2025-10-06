import { NextRequest, NextResponse } from "next/server";
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services";
import { EmailRegex, PhoneRegex } from "@/lib/regex";

export async function GET(req: NextRequest) {
  // Fetch existing agency info
  try {
    const searchParams = req.nextUrl.searchParams;
    const phone = searchParams.get("phone");
    const email = searchParams.get("email");
    if (!phone || !email) {
      return NextResponse.json(
        { error: "Phone/Email not provided" },
        { status: 400 }
      );
    }
    if (!EmailRegex.safeParse(email).success) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    if (!PhoneRegex.safeParse(phone).success) {
      return NextResponse.json({ error: "Invalid phone" }, { status: 400 });
    }

    const agencies = await agencyServices.findAgencyByPhoneEmail(phone, email);

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
