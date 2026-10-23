import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import {
  APP_TRIAL_MODE,
  BASIC_SEARCH_LIMIT_DAYS,
  PREMIUM_SEARCH_DAYS,
} from "@ryogo-travel-app/api/apiConfig"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import { Metadata } from "next"
import NotificationFeedPageComponent from "./notificationFeed"

export const metadata: Metadata = {
  title: `Feed - ${pageTitle}`,
  description: pageDescription,
}

export default async function FeedPage() {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const feed = await notificationServices.findFeedNotificationsByAgencyId(
    currentUser.agencyId,
    currentUser.isSubscribed || APP_TRIAL_MODE
      ? PREMIUM_SEARCH_DAYS
      : BASIC_SEARCH_LIMIT_DAYS,
  )

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/feed"} />
      <NotificationFeedPageComponent notifications={feed} />
    </MainWrapper>
  )
}
