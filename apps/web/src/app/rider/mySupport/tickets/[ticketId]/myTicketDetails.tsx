import { PageWrapper } from "@/components/page/pageWrappers"
import { FindSupportTicketByIdType } from "@ryogo-travel-app/api/services/support.services"
import { getTranslations } from "next-intl/server"

export default async function ViewMySupportTicketPageComponent({
  ticket,
}: {
  ticket: FindSupportTicketByIdType
}) {
  const t = await getTranslations("Rider.ViewMySupportTicket")
  return (
    <PageWrapper id="ViewMySupportTicketPage">
      <></>
    </PageWrapper>
  )
}
