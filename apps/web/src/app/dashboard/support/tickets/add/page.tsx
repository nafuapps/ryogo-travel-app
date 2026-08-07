import { MainWrapper } from "@/components/page/pageWrappers"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import AddSupportTicketPageComponent from "./addTicket"
import DashboardHeader from "@/components/header/dashboardHeader"
import { pageTitle, pageDescription } from "@/components/page/pageCommons"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: `Add Support Ticket - ${pageTitle}`,
  description: pageDescription,
}

export default async function AddSupportTicketPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

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
