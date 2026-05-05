import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import VehiclesScheduleChartComponent from "./vehiclesScheduleChartComponent"

export default async function VehiclesScheduleComponent({
  agencyId,
}: {
  agencyId: string
}) {
  const vehicleSchedule14Days =
    await vehicleServices.findVehiclesScheduleNextDays(agencyId, 14)

  return (
    <VehiclesScheduleChartComponent
      vehicleSchedule14Days={vehicleSchedule14Days}
    />
  )
}
