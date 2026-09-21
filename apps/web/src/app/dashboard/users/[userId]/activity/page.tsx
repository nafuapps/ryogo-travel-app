import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import DashboardHeader from "@/components/header/dashboardHeader"
import { redirect, RedirectType } from "next/navigation"
import UserActivityPageComponent from "./userActivity"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"

export const metadata: Metadata = {
  title: `User Activity - ${pageTitle}`,
  description: pageDescription,
}

export default async function UserActivityPage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params

  const user = await userServices.findUserDetailsById(userId)
  if (!user) {
    redirect("/dashboard/users", RedirectType.replace)
  }

  const activities =
    await notificationServices.findNotificationsByUserId(userId)
  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/users/[id]/activity"} />
      <UserActivityPageComponent activities={activities} id={userId} />
    </MainWrapper>
  )
}
