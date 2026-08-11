import { MainWrapper } from "@/components/page/pageWrappers"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { supportServices } from "@ryogo-travel-app/api/services/support.services"
import DashboardHeader from "@/components/header/dashboardHeader"
import ViewSupportTicketPageComponent from "@/components/flows/support/viewSupportTicketComponent"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { pageTitle, pageDescription } from "@/components/page/pageCommons"
import { Metadata } from "next"
import { SupportTicketIdRegex } from "@/lib/regex"

export const metadata: Metadata = {
  title: `View Support Ticket - ${pageTitle}`,
  description: pageDescription,
}

export default async function ViewSupportTicketPage({
  params,
}: {
  params: Promise<{ ticketId: string }>
}) {
  const { ticketId } = await params

  //Invalid ticket id regex check
  if (!SupportTicketIdRegex.safeParse(ticketId).success) {
    redirect("/dashboard/support", RedirectType.replace)
  }

  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const ticket = await supportServices.findSupportTicketById(ticketId)

  if (
    !ticket ||
    (currentUser.userId !== ticket.userId &&
      currentUser.userRole !== UserRolesEnum.OWNER)
  ) {
    redirect("/dashboard/support/tickets", RedirectType.replace)
  }

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/support/tickets/[id]"} />
      <ViewSupportTicketPageComponent ticket={ticket} />
    </MainWrapper>
  )
}
