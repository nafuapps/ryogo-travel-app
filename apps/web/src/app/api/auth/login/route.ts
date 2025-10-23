import { NextRequest, NextResponse } from "next/server";
import { userServices } from "@ryogo-travel-app/api/services/user.services";
import { PhoneRegex } from "@/lib/regex";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json(
        { error: "Phone not provided" },
        { status: 400 }
      );
    }

    if (!PhoneRegex.safeParse(phone).success) {
      return NextResponse.json({ error: "Invalid phone" }, { status: 400 });
    }

    const users = await userServices.findUsersByPhone(phone);

    return NextResponse.json(users, { status: 200 });
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
