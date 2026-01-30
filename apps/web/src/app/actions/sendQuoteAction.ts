"use server";

import { bookingServices } from "@ryogo-travel-app/api/services/booking.services";

export async function sendQuoteAction(id: string) {
  return await bookingServices.sendQuote(id);
}
