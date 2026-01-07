import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import DriversScheduleChartComponent from "./driversScheduleChartComponent"

export default async function DriversScheduleComponent({
  agencyId,
}: {
  agencyId: string
}) {
  const driverSchedule14Days = await driverServices.findDriversScheduleNextDays(
    agencyId,
    14
  )

  return (
    <DriversScheduleChartComponent
      driverSchedule14Days={driverSchedule14Days}
    />
  )
}
