import DashboardHeader from "@/components/header/dashboardHeader"
import { MainWrapper } from "@/components/page/pageWrappers"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import SupportTicketsPageComponent from "./tickets"
import { getCurrentUser } from "@/lib/auth"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { redirect, RedirectType } from "next/navigation"
import { supportServices } from "@ryogo-travel-app/api/services/support.services"

export default async function SupportTicketsPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const agency = await agencyServices.findAgencyById(currentUser.agencyId)
  if (!agency) {
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
