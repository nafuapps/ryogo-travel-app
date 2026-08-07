import { MainWrapper } from "@/components/page/pageWrappers"
import MySupportTicketsPageComponent from "./myTickets"
import { getCurrentUser } from "@/lib/auth"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { redirect, RedirectType } from "next/navigation"
import RiderHeader from "@/components/header/riderHeader"
import { supportServices } from "@ryogo-travel-app/api/services/support.services"
import { pageTitle, pageDescription } from "@/components/page/pageCommons"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: `View All Support Tickets - ${pageTitle}`,
  description: pageDescription,
}

export default async function MySupportTicketsPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const agency = await agencyServices.findAgencyById(currentUser.agencyId)
  if (!agency) {
    redirect("/auth/login", RedirectType.replace)
  }

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
