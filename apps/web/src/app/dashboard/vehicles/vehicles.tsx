import OnTripVehiclesComponent from "@/components/flows/vehicles/home/onTripVehiclesComponent"
import AllVehiclesListComponent from "@/components/flows/vehicles/home/allVehiclesListComponent"
import VehiclesHistoryComponent from "@/components/flows/vehicles/home/vehiclesHistoryComponent"
import VehiclesScheduleComponent from "@/components/flows/vehicles/home/vehiclesScheduleComponent"
import { PageWrapper } from "@/components/page/pageWrappers"

/**
 *  Show in progress vehicles
 *  Show all vehicles list (except suspended)
 *  Vehicle schedule (7/14 days)
 *  TODO: Vehicle history
 *  TODO: Vehicle actions
 */

export default async function VehiclesPageComponent({
  agencyId,
}: {
  agencyId: string
}) {
  return (
    <PageWrapper id="VehiclesPage">
      <OnTripVehiclesComponent agencyId={agencyId} />
      <AllVehiclesListComponent agencyId={agencyId} />
      <VehiclesScheduleComponent agencyId={agencyId} />
      {/* <VehiclesHistoryComponent agencyId={agencyId} /> */}
      {/*<VehicleActionsComponent agencyId={agencyId}/> */}
    </PageWrapper>
  )
}
