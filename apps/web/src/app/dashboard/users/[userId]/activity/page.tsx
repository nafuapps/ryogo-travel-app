import DashboardHeader from "@/components/header/dashboardHeader"
import UserDetailHeaderTabs from "@/components/header/detailHeaderTabs/userDetailHeaderTabs"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import {
  APP_TRIAL_MODE,
  BASIC_SEARCH_LIMIT_DAYS,
  PREMIUM_SEARCH_DAYS,
} from "@ryogo-travel-app/api/apiConfig"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { Metadata } from "next"
import { redirect, RedirectType } from "next/navigation"
import UserActivityPageComponent from "./userActivity"

export const metadata: Metadata = {
  title: `User Activity - ${pageTitle}`,
  description: pageDescription,
}

export default async function UserActivityPage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const currentUser = await readPermissions.getAuthenticatedUser()
  const isSubscribed = currentUser.isSubscribed

  const { userId } = await params
  const user = await userServices.findUserDetailsById(userId)
  if (!user) {
    redirect("/dashboard/users", RedirectType.replace)
  }

  const activities = await notificationServices.findNotificationsByUserId(
    userId,
    isSubscribed || APP_TRIAL_MODE
      ? PREMIUM_SEARCH_DAYS
      : BASIC_SEARCH_LIMIT_DAYS,
  )

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/users/[id]/activity"} />
      <UserDetailHeaderTabs selectedTab={"Activity"} id={userId} />
      <UserActivityPageComponent activities={activities} />
    </MainWrapper>
  )
}
