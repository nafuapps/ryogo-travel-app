import { pageClassName } from "@/components/page/pageCommons"
import OnTripVehiclesComponent from "./(all)/onTripVehiclesComponent"
import AllVehiclesListComponent from "./(all)/allVehiclesListComponent"
import VehiclesHistoryComponent from "./(all)/vehiclesHistoryComponent"
import VehiclesScheduleComponent from "./(all)/vehiclesScheduleComponent"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"

/**
 *  Show in progress vehicles
 *  Show all vehicles list (except suspended)
 *  Vehicle schedule (7/14 days)
 *  TODO: Vehicle history
 *  TODO: Vehicle actions
 */

export default async function VehiclesPageComponent() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/dashboard", RedirectType.replace)
  }
  const agencyId = user.agencyId

  return (
    <div id="BookingsPage" className={pageClassName}>
      <OnTripVehiclesComponent agencyId={agencyId} />
      <AllVehiclesListComponent agencyId={agencyId} />
      <VehiclesScheduleComponent agencyId={agencyId} />
      <VehiclesHistoryComponent agencyId={agencyId} />
      {/*<VehicleActionsComponent agencyId={agencyId}/> */}
    </div>
  )
}
