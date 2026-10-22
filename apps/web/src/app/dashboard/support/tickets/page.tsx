import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { getCurrentUser } from "@/lib/auth"
import { supportServices } from "@ryogo-travel-app/api/services/support.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { redirect, RedirectType } from "next/navigation"
import SupportTicketsPageComponent from "./tickets"

export const metadata: Metadata = {
  title: `All Support Tickets - ${pageTitle}`,
  description: pageDescription,
}

export default async function SupportTicketsPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }
  const isOwner = currentUser.userRole === UserRolesEnum.OWNER

  let tickets
  if (isOwner) {
    tickets = await supportServices.findSupportTicketsByAgencyId(
      currentUser.agencyId,
    )
  } else {
    tickets = await supportServices.findSupportTicketsByUserId(
      currentUser.userId,
    )
  }

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/support/tickets"} />
      <SupportTicketsPageComponent
        isOwner={isOwner}
        tickets={tickets}
        userId={currentUser.userId}
      />
    </MainWrapper>
  )
}
