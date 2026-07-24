import { MainWrapper } from "@/components/page/pageWrappers"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { supportServices } from "@ryogo-travel-app/api/services/support.services"
import ViewSupportTicketPageComponent from "./ticketDetails"
import DashboardHeader from "@/components/header/dashboardHeader"

export default async function ViewSupportTicketPage({
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
    redirect("/dashboard/support/tickets", RedirectType.replace)
  }

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/support/tickets/[id]"} />
      <ViewSupportTicketPageComponent ticket={ticket} />
    </MainWrapper>
  )
}
