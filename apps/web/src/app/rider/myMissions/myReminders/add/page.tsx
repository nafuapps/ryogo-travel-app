import { Metadata } from "next"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { MainWrapper } from "@/components/page/pageWrappers"
import { redirect, RedirectType } from "next/navigation"
import AddReminderPageComponent from "@/components/missions/addReminder"
import RiderHeader from "@/components/header/riderHeader"

export const metadata: Metadata = {
  title: `Add Reminder - ${pageTitle}`,
  description: pageDescription,
}

export default async function AddMyReminderPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

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
