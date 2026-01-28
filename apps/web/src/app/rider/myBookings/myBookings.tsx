import {
  FindDriverAssignedBookingsByIdType,
  FindDriverCompletedBookingsByIdType,
} from "@ryogo-travel-app/api/services/driver.services"

export default function RiderMyBookingsPageComponent({
  assignedBookings,
  completedBookings,
}: {
  assignedBookings: FindDriverAssignedBookingsByIdType
  completedBookings: FindDriverCompletedBookingsByIdType
}) {
  return <div></div>
}
