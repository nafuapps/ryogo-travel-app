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
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { redirect, RedirectType } from "next/navigation"
import UserCompletedPageComponent from "./userCompletedBookings"

export const metadata: Metadata = {
  title: `User Completed Bookings - ${pageTitle}`,
  description: pageDescription,
}

export default async function UserCompletedBookingsPage({
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

  let bookings
  if (user.userRole === UserRolesEnum.DRIVER) {
    bookings = await driverServices.findDriverCompletedBookingsById(
      userId,
      isSubscribed || APP_TRIAL_MODE
        ? PREMIUM_SEARCH_DAYS
        : BASIC_SEARCH_LIMIT_DAYS,
    )
  } else {
    bookings = await userServices.findUserCompletedBookingsById(
      userId,
      isSubscribed || APP_TRIAL_MODE
        ? PREMIUM_SEARCH_DAYS
        : BASIC_SEARCH_LIMIT_DAYS,
    )
  }

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/users/[id]/completed"} />
      <UserDetailHeaderTabs selectedTab={"Completed"} id={userId} />
      <UserCompletedPageComponent bookings={bookings} />
    </MainWrapper>
  )
}
