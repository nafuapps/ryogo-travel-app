import { getCurrentUser } from "@/lib/auth"
import { DriverRegex } from "@/lib/regex"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { DriverStatusEnum } from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"

export default async function DriverDetailsLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login", RedirectType.replace)
  }

  //Invalid driver id regex check
  if (!DriverRegex.safeParse(id).success) {
    redirect("/dashboard/drivers", RedirectType.replace)
  }

  //No driver found or agency mismatch or driver suspended
  const driver = await driverServices.findDriverDetailsById(id)
  if (
    !driver ||
    driver.agencyId !== user.agencyId ||
    driver?.status == DriverStatusEnum.SUSPENDED
  ) {
    redirect("/dashboard/drivers", RedirectType.replace)
  }

  return children
}
