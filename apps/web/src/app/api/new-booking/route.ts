import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { CreateNewBookingAPIRequestType } from "@ryogo-travel-app/api/types/booking.types";
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services";

export async function POST(req: NextRequest) {
  try {
    //Check user auth
    const user = await getCurrentUser();
    if (!user || !["owner", "agent"].includes(user.userRole)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: CreateNewBookingAPIRequestType = await req.json();
    const booking = await bookingServices.addNewBooking(body);

    return NextResponse.json(booking, { status: 201 });
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
