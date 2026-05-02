import { getTranslations } from "next-intl/server"

export default async function getCancellationMessage(
  customerPhone: string,
  customerName: string,
  bookingId: string,
  source: string,
  destination: string,
  startDate: string,
  agencyPhone: string,
) {
  const t = await getTranslations("Dashboard.Whatsapp")
  const message = t("Cancellation", {
    customerName: customerName,
    bookingId: bookingId,
    source: source,
    destination: destination,
    startDate: startDate,
    agencyPhone: agencyPhone,
  })
  return `https://wa.me/91${customerPhone}/?text=${encodeURIComponent(message)}`
}
