import { getTranslations } from "next-intl/server"

export default async function getConfirmationMessage(
  customerPhone: string,
  customerName: string,
  bookingId: string,
  source: string,
  destination: string,
  startDate: string,
  startTime: string,
  agencyPhone: string,
  confirmationLink: string,
  driverName?: string,
  vehicleNumber?: string,
) {
  const t = await getTranslations("Dashboard.Whatsapp")

  if (!driverName || !vehicleNumber) {
    const message = t("ConfirmationWithoutDriverVehicle", {
      customerName: customerName,
      bookingId: bookingId,
      source: source,
      destination: destination,
      startDate: startDate,
      startTime: startTime,
      agencyPhone: agencyPhone,
      confirmationLink: confirmationLink,
    })
    return `https://wa.me/91${customerPhone}/?text=${encodeURIComponent(message)}`
  }

  const message = t("Confirmation", {
    customerName: customerName,
    bookingId: bookingId,
    source: source,
    destination: destination,
    startDate: startDate,
    startTime: startTime,
    driverName: driverName,
    vehicleNumber: vehicleNumber,
    agencyPhone: agencyPhone,
    confirmationLink: confirmationLink,
  })
  return `https://wa.me/91${customerPhone}/?text=${encodeURIComponent(message)}`
}
