//MyBookings/[id]/Add-expense page

import { mainClassName } from "@/components/page/pageCommons"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { redirect, RedirectType } from "next/navigation"
import RiderAddExpensePageComponent from "./riderAddExpense"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"
import RiderHeader from "@/app/rider/components/riderHeader"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"

export default async function RiderAddExpensePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id

  const bookingDetails = await bookingServices.findBookingDetailsById(id)
  if (!bookingDetails || bookingDetails.assignedDriverId === null) {
    redirect("/rider/myBookings", RedirectType.replace)
  }

  const driver = await driverServices.findDriverDetailsById(
    bookingDetails.assignedDriverId,
  )
  if (!driver) {
    redirect("/rider/myBookings", RedirectType.replace)
  }

  //Driver can add expense for in progress booking only
  if (bookingDetails.status !== BookingStatusEnum.IN_PROGRESS) {
    redirect("/rider/myBookings", RedirectType.replace)
  }
  return (
    <div className={mainClassName}>
      <RiderHeader pathName={"/rider/myBookings/[id]/add-expense"} />
      <RiderAddExpensePageComponent
        bookingId={bookingDetails.id}
        agencyId={bookingDetails.agencyId}
        userId={driver.userId}
        assignedUserId={bookingDetails.assignedUserId}
      />
    </div>
  )
}
