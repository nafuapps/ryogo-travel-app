import { getTranslations } from "next-intl/server"

export default async function getInvoiceMessage(
  customerPhone: string,
  customerName: string,
  bookingId: string,
  source: string,
  destination: string,
  startDate: string,
  agencyPhone: string,
  invoiceLink: string,
) {
  const t = await getTranslations("Dashboard.Whatsapp")
  const message = t("Invoice", {
    customerName: customerName,
    bookingId: bookingId,
    source: source,
    destination: destination,
    startDate: startDate,
    agencyPhone: agencyPhone,
    invoiceLink: invoiceLink,
  })
  return `https://wa.me/91${customerPhone}/?text=${encodeURIComponent(message)}`
}
