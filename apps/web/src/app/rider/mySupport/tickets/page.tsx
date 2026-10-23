import RiderHeader from "@/components/header/riderHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { supportServices } from "@ryogo-travel-app/api/services/support.services"
import { Metadata } from "next"
import MySupportTicketsPageComponent from "./myTickets"

export const metadata: Metadata = {
  title: `View All Support Tickets - ${pageTitle}`,
  description: pageDescription,
}

export default async function MySupportTicketsPage() {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const tickets = await supportServices.findSupportTicketsByUserId(
    currentUser.userId,
  )

  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/mySupport/tickets"} />
      <MySupportTicketsPageComponent tickets={tickets} />
    </MainWrapper>
  )
}
