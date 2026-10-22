import RiderHeader from "@/components/header/riderHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { getCurrentUser } from "@/lib/auth"
import { supportServices } from "@ryogo-travel-app/api/services/support.services"
import { Metadata } from "next"
import { redirect, RedirectType } from "next/navigation"
import MySupportTicketsPageComponent from "./myTickets"

export const metadata: Metadata = {
  title: `View All Support Tickets - ${pageTitle}`,
  description: pageDescription,
}

export default async function MySupportTicketsPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
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
