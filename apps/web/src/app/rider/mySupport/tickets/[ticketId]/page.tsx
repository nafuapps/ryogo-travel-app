import { MainWrapper } from "@/components/page/pageWrappers"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import RiderHeader from "@/components/header/riderHeader"
import { supportServices } from "@ryogo-travel-app/api/services/support.services"
import ViewSupportTicketPageComponent from "@/components/flows/support/viewSupportTicketComponent"

export default async function ViewMySupportTicketPage({
  params,
}: {
  params: Promise<{ ticketId: string }>
}) {
  const { ticketId } = await params
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const ticket = await supportServices.findSupportTicketById(ticketId)

  if (!ticket || currentUser.userId !== ticket.userId) {
    redirect("/rider/mySupport/tickets", RedirectType.replace)
  }

  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/mySupport/tickets/[id]"} />
      <ViewSupportTicketPageComponent ticket={ticket} isRider />
    </MainWrapper>
  )
}
