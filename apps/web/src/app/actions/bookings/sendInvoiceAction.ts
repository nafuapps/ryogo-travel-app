"use server"

import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"

export async function sendInvoiceAction(id: string) {
  return await bookingServices.sendInvoice(id)
}
