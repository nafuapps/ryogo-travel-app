import { FindSupportTicketsByUserIdType } from "@ryogo-travel-app/api/services/support.services"
import { getTranslations } from "next-intl/server"

export default async function MySupportTicketsPageComponent({
  tickets,
}: {
  tickets: FindSupportTicketsByUserIdType
}) {
  const t = await getTranslations("Rider.MySupportTickets")
  return <div></div>
}
