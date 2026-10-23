import ViewSupportTicketPageComponent from "@/components/flows/support/viewSupportTicketComponent"
import RiderHeader from "@/components/header/riderHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { SupportTicketIdRegex } from "@/lib/regex"
import { supportServices } from "@ryogo-travel-app/api/services/support.services"
import { Metadata } from "next"
import { redirect, RedirectType } from "next/navigation"

export const metadata: Metadata = {
  title: `View My Support Ticket - ${pageTitle}`,
  description: pageDescription,
}

export default async function ViewMySupportTicketPage({
  params,
}: {
  params: Promise<{ ticketId: string }>
}) {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const { ticketId } = await params
  //Invalid ticket id regex check
  if (!SupportTicketIdRegex.safeParse(ticketId).success) {
    redirect("/rider/mySupport", RedirectType.replace)
  }

  const ticket = await supportServices.findSupportTicketById(ticketId)

  //If no ticket found or user/agency mismatch
  if (
    !ticket ||
    currentUser.userId !== ticket.userId ||
    ticket.agencyId !== currentUser.agencyId
  ) {
    redirect("/rider/mySupport/tickets", RedirectType.replace)
  }

  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/mySupport/tickets/[id]"} />
      <ViewSupportTicketPageComponent ticket={ticket} isRider />
    </MainWrapper>
  )
}
