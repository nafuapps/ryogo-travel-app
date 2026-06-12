import OnTripVehiclesComponent from "@/components/flows/vehicles/home/onTripVehiclesComponent"
import AllVehiclesListComponent from "@/components/flows/vehicles/home/allVehiclesListComponent"
import VehiclesScheduleComponent from "@/components/flows/vehicles/home/vehiclesScheduleComponent"
import { PageWrapper } from "@/components/page/pageWrappers"

/**
 *  Show in progress vehicles
 *  Show all vehicles list (except suspended)
 *  Vehicle schedule (7/14 days)
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
    </PageWrapper>
  )
}
