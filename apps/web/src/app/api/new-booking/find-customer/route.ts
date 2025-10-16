import { NextRequest, NextResponse } from "next/server";
import { AgencyRegex, PhoneRegex } from "@/lib/regex";
import { customerServices } from "@ryogo-travel-app/api/services/customer.services";

export async function GET(req: NextRequest) {
  // Example: Find existing cusomer info
  try {
    const searchParams = req.nextUrl.searchParams;
    const phone = searchParams.get("phone");
    const agencyId = searchParams.get("agencyId");
    if (!phone || !agencyId) {
      return NextResponse.json(
        { error: "Phone/AgencyId not provided" },
        { status: 400 }
      );
    }
    if (!AgencyRegex.safeParse(agencyId).success) {
      return NextResponse.json({ error: "Invalid agencyId" }, { status: 400 });
    }
    if (!PhoneRegex.safeParse(phone).success) {
      return NextResponse.json({ error: "Invalid phone" }, { status: 400 });
    }

    const customer = await customerServices.findCustomerByPhoneInAgency(
      phone,
      agencyId
    );

    return NextResponse.json(customer, { status: 200 });
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
