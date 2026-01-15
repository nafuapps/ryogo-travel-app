import { pageClassName } from "@/components/page/pageCommons"
import { FindDriverCompletedBookingsByIdType } from "@ryogo-travel-app/api/services/driver.services"
import DriverDetailHeaderTabs from "../driverDetailHeaderTabs"

export default function DriverCompletedBookingsPageComponent({
  bookings,
  id,
}: {
  bookings: FindDriverCompletedBookingsByIdType
  id: string
}) {
  return (
    <div id="DriverCompletedBookingsPage" className={pageClassName}>
      <DriverDetailHeaderTabs selectedTab={"Completed"} id={id} />
      <div
        id="DriverCompletedBookingsList"
        className="flex flex-col gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5"
      ></div>
    </div>
  )
}
