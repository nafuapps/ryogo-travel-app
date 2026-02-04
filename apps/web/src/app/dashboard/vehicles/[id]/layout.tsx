import { getCurrentUser } from "@/lib/auth"
import { VehicleRegex } from "@/lib/regex"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { VehicleStatusEnum } from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"

export default async function VehicleDetailsLayout({
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

  //Invalid vehicle id regex check
  if (!VehicleRegex.safeParse(id).success) {
    redirect("/dashboard/vehicles", RedirectType.replace)
  }

  //No vehicle found or agency mismatch or vehicle suspended
  const vehicle = await vehicleServices.findVehicleDetailsById(id)
  if (
    !vehicle ||
    vehicle.agencyId !== user.agencyId ||
    vehicle.status === VehicleStatusEnum.SUSPENDED
  ) {
    redirect("/dashboard/vehicles", RedirectType.replace)
  }

  return children
}
