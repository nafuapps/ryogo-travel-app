import { MainWrapper } from "@/components/page/pageWrappers"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import RiderHeader from "@/components/header/riderHeader"
import { pageTitle, pageDescription } from "@/components/page/pageCommons"
import { Metadata } from "next"
import AddSupportTicketPageComponent from "@/components/flows/support/addTicketPage"

export const metadata: Metadata = {
  title: `Add Support Ticket - ${pageTitle}`,
  description: pageDescription,
}

export default async function AddMySupportTicketPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

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
