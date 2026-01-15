import { pageClassName } from "@/components/page/pageCommons"
import { FindVehicleAssignedBookingsByIdType } from "@ryogo-travel-app/api/services/vehicle.services"
import VehicleDetailHeaderTabs from "../vehicleDetailHeaderTabs"

export default function VehicleAssignedBookingsPageComponent({
  bookings,
  id,
}: {
  bookings: FindVehicleAssignedBookingsByIdType
  id: string
}) {
  return (
    <div id="VehicleAssignedBookingsPage" className={pageClassName}>
      <VehicleDetailHeaderTabs selectedTab={"Assigned"} id={id} />
      <div
        id="VehicleAssignedBookingsList"
        className="flex flex-col gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5"
      ></div>
    </div>
  )
}
