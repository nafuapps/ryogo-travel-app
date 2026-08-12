import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import ModifyDriverLeavePageComponent from "./modifyDriverLeave"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { DriverLeaveIdRegex } from "@/lib/regex"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"
import { getCurrentUser } from "@/lib/auth"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

export const metadata: Metadata = {
  title: `Modify Driver Leave - ${pageTitle}`,
  description: pageDescription,
}

export default async function ModifyDriverLeavePage({
  params,
}: {
  params: Promise<{ driverId: string; leaveId: string }>
}) {
  const { driverId, leaveId } = await params

  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  //Invalid leave id regex check
  if (!DriverLeaveIdRegex.safeParse(leaveId).success) {
    redirect(`/dashboard/drivers/${driverId}/leaves`, RedirectType.replace)
  }

  const leave = await driverServices.findDriverLeaveById(leaveId)

  //If no such leave found or driver mismatch or agency mismatch, redirect
  if (
    !leave ||
    leave.driverId !== driverId ||
    leave.agencyId !== currentUser.agencyId
  ) {
    redirect(`/dashboard/drivers/${driverId}/leaves`, RedirectType.replace)
  }

  //Only owner or addedByUser can modify leave
  if (
    currentUser.userRole !== UserRolesEnum.OWNER &&
    leave.addedByUserId !== currentUser.userId
  ) {
    redirect(`/dashboard/drivers/${driverId}/leaves`, RedirectType.replace)
  }

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/drivers/[id]/leaves/modify"} />
      <ModifyDriverLeavePageComponent leave={leave} />
    </MainWrapper>
  )
}
