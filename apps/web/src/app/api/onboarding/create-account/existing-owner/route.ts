import { NextRequest, NextResponse } from "next/server";
import { userServices } from "@ryogo-travel-app/api/services/user.services";

export async function GET(req: NextRequest) {
  // Example: Fetch existing owner account info
  try {
    const searchParams = req.nextUrl.searchParams;
    const phone = searchParams.get("phone");
    const email = searchParams.get("email");
    const users = await userServices.findOwnerByPhoneEmail(phone!, email!);

    return NextResponse.json(users, { status: 200 });
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
