import { pageClassName } from "@/components/page/pageCommons"
import { FindDriverAssignedBookingsByIdType } from "@ryogo-travel-app/api/services/driver.services"
import DriverDetailHeaderTabs from "../driverDetailHeaderTabs"

export default function DriverAssignedBookingsPageComponent({
  bookings,
  id,
}: {
  bookings: FindDriverAssignedBookingsByIdType
  id: string
}) {
  return (
    <div id="DriverAssignedBookingsPage" className={pageClassName}>
      <DriverDetailHeaderTabs selectedTab={"Assigned"} id={id} />
      <div
        id="DriverAssignedBookingsList"
        className="flex flex-col gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5"
      ></div>
    </div>
  )
}
