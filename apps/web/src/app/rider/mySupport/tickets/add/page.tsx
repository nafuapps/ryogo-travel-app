import AddSupportTicketPageComponent from "@/components/flows/support/addTicketPage"
import RiderHeader from "@/components/header/riderHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: `Add Support Ticket - ${pageTitle}`,
  description: pageDescription,
}

export default async function AddMySupportTicketPage() {
  const currentUser = await readPermissions.getAuthenticatedUser()

  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/mySupport/tickets/add"} />
      <AddSupportTicketPageComponent
        userId={currentUser.userId}
        agencyId={currentUser.agencyId}
        isRider
      />
    </MainWrapper>
  )
}
