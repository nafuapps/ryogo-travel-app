import { pageClassName } from "@/components/page/pageCommons"
import { FindVehicleCompletedBookingsByIdType } from "@ryogo-travel-app/api/services/vehicle.services"
import VehicleDetailHeaderTabs from "../vehicleDetailHeaderTabs"

export default function VehicleCompletedBookingsPageComponent({
  bookings,
  id,
}: {
  bookings: FindVehicleCompletedBookingsByIdType
  id: string
}) {
  return (
    <div id="VehicleCompletedBookingsPage" className={pageClassName}>
      <VehicleDetailHeaderTabs selectedTab={"Completed"} id={id} />
      <div
        id="VehicleCompletedBookingsList"
        className="flex flex-col gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5"
      ></div>
    </div>
  )
}
