import { NextResponse } from "next/server";
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services";

export async function GET() {
  try {
    const allAgencies = await agencyServices.getActiveAgencies();
    return NextResponse.json(allAgencies);
  } catch (error) {
    return NextResponse.json({
      status: 500,
      statusText: "Failed to fetch all agencies",
      errorText: error,
    });
  }
}
