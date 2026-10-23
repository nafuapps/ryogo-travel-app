import RiderHeader from "@/components/header/riderHeader"
import AddReminderPageComponent from "@/components/missions/addReminder"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: `Add Reminder - ${pageTitle}`,
  description: pageDescription,
}

export default async function AddMyReminderPage() {
  const currentUser = await readPermissions.getAuthenticatedUser()

  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/myMissions/myReminders/add"} />
      <AddReminderPageComponent
        userId={currentUser.userId}
        agencyId={currentUser.agencyId}
        isRider
      />
    </MainWrapper>
  )
}
