import { FindSupportTicketByIdType } from "@ryogo-travel-app/api/services/support.services"
import { useTranslations } from "next-intl"

export default async function ViewMySupportTicketPageComponent({
  ticket,
}: {
  ticket: FindSupportTicketByIdType
}) {
  const t = useTranslations("Rider.ViewMySupportTicket")
  return <div></div>
}
