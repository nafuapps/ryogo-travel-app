import { Metadata } from "next"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import DashboardHeader from "@/components/header/dashboardHeader"
import { MainWrapper } from "@/components/page/pageWrappers"
import { redirect, RedirectType } from "next/navigation"
import { notificationServices } from "@ryogo-travel-app/api/services/notification.services"
import NotificationFeedPageComponent from "./notificationFeed"

export const metadata: Metadata = {
  title: `Feed - ${pageTitle}`,
  description: pageDescription,
}

export default async function NotificationFeedPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const feed = await notificationServices.findFeedNotificationsByAgencyId(
    currentUser.agencyId,
  )

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/feed"} />
      <NotificationFeedPageComponent notifications={feed} />
    </MainWrapper>
  )
}
