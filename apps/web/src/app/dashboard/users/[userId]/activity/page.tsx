import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import DashboardHeader from "@/components/header/dashboardHeader"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"
import UserActivityPageComponent from "./userActivity"
import DriverActivityPageComponent from "./driverActivity"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"

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

  if (user.userRole === UserRolesEnum.DRIVER) {
    const driver = await driverServices.findDriverByUserId(user.id)
    if (!driver) {
      redirect("/dashboard/users", RedirectType.replace)
    }
    const activities = await driverServices.findDriverActivityByUserId(
      user.id,
      driver.id,
    )
    return (
      <MainWrapper>
        <DashboardHeader pathName={"/dashboard/users/[id]/activity"} />
        <DriverActivityPageComponent activities={activities} id={userId} />
      </MainWrapper>
    )
  }
  const activities = await userServices.findUserActivityById(userId)
  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/users/[id]/activity"} />
      <UserActivityPageComponent activities={activities} id={userId} />
    </MainWrapper>
  )
}
