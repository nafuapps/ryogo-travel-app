import AddSupportTicketPageComponent from "@/components/flows/support/addTicketPage"
import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: `Add Support Ticket - ${pageTitle}`,
  description: pageDescription,
}

export default async function AddSupportTicketPage() {
  const currentUser = await readPermissions.getAuthenticatedUser()

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/support/tickets/add"} />
      <AddSupportTicketPageComponent
        userId={currentUser.userId}
        agencyId={currentUser.agencyId}
      />
    </MainWrapper>
  )
}
