import ViewSupportTicketPageComponent from "@/components/flows/support/viewSupportTicketComponent"
import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { SupportTicketIdRegex } from "@/lib/regex"
import { supportServices } from "@ryogo-travel-app/api/services/support.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { redirect, RedirectType } from "next/navigation"

export const metadata: Metadata = {
  title: `View Support Ticket - ${pageTitle}`,
  description: pageDescription,
}

export default async function ViewSupportTicketPage({
  params,
}: {
  params: Promise<{ ticketId: string }>
}) {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const { ticketId } = await params
  //Invalid ticket id regex check
  if (!SupportTicketIdRegex.safeParse(ticketId).success) {
    redirect("/dashboard/support", RedirectType.replace)
  }

  const ticket = await supportServices.findSupportTicketById(ticketId)

  //If no ticket found or user mismatch (except owner) or agency mismatch, redirect
  if (
    !ticket ||
    (currentUser.userId !== ticket.userId &&
      currentUser.userRole !== UserRolesEnum.OWNER) ||
    ticket.agencyId !== currentUser.agencyId
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
