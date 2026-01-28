//MyVehicle home page

import { mainClassName } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { redirect, RedirectType } from "next/navigation"
import RiderHeader from "../components/riderHeader"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import RiderMyVehiclePageComponent from "./myVehicle"

export default async function MyVehiclePage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const driver = await driverServices.findDriverByUserId(currentUser.userId)
  if (!driver) {
    redirect("/auth/login", RedirectType.replace)
  }

  const assignedVehicle = await vehicleServices.findAssignedVehicleByDriverId(
    driver.id,
  )

  return (
    <div className={mainClassName}>
      <RiderHeader pathName={"/rider/myVehicle"} />
      <RiderMyVehiclePageComponent vehicle={assignedVehicle} />
    </div>
  )
}
