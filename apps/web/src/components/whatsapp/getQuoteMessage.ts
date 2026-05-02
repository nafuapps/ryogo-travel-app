import { getTranslations } from "next-intl/server"

export default async function getQuoteMessage(
  customerPhone: string,
  customerName: string,
  bookingId: string,
  source: string,
  destination: string,
  amount: string,
  startDate: string,
  agencyPhone: string,
  quoteUrl: string,
) {
  const t = await getTranslations("Dashboard.Whatsapp")
  const message = t("Quote", {
    customerName: customerName,
    bookingId: bookingId,
    source: source,
    destination: destination,
    startDate: startDate,
    amount: amount,
    agencyPhone: agencyPhone,
    quoteLink: quoteUrl,
  })
  return `https://wa.me/91${customerPhone}/?text=${encodeURIComponent(message)}`
}
