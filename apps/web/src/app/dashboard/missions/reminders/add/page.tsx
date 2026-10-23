import DashboardHeader from "@/components/header/dashboardHeader"
import AddReminderPageComponent from "@/components/missions/addReminder"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: `Add Reminder - ${pageTitle}`,
  description: pageDescription,
}

export default async function AddReminderPage() {
  const currentUser = await readPermissions.getAuthenticatedUser()

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/missions/reminders/add"} />
      <AddReminderPageComponent
        userId={currentUser.userId}
        agencyId={currentUser.agencyId}
      />
    </MainWrapper>
  )
}
