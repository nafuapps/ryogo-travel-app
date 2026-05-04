import {
  mainClassName,
  pageDescription,
  pageTitle,
} from "@/components/page/pageCommons"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import DashboardHeader from "../../../components/dashboardHeader"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"
import UserActivityPageComponent from "./userActivity"
import DriverActivityPageComponent from "./driverActivity"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: `User Activity - ${pageTitle}`,
  description: pageDescription,
}

export default async function UserActivityPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const user = await userServices.findUserDetailsById(id)
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
      <div className={mainClassName}>
        <DashboardHeader pathName={"/dashboard/users/[id]/activity"} />
        <DriverActivityPageComponent activities={activities} id={id} />
      </div>
    )
  }
  const activities = await userServices.findUserActivityById(id)
  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/users/[id]/activity"} />
      <UserActivityPageComponent activities={activities} id={id} />
    </div>
  )
}
