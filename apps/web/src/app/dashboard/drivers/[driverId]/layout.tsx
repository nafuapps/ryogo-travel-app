import { getCurrentUser } from "@/lib/auth"
import { DriverIdRegex } from "@/lib/regex"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { DriverStatusEnum } from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"

export default async function DriverDetailsLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ driverId: string }>
}) {
  const { driverId } = await params

  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  //Invalid driver id regex check
  if (!DriverIdRegex.safeParse(driverId).success) {
    redirect("/dashboard/drivers", RedirectType.replace)
  }

  //No driver found or agency mismatch or driver suspended
  const driver = await driverServices.findDriverDetailsById(driverId)
  if (
    !driver ||
    driver.agencyId !== currentUser.agencyId ||
    driver.status === DriverStatusEnum.SUSPENDED
  ) {
    redirect("/dashboard/drivers", RedirectType.replace)
  }

  return children
}
