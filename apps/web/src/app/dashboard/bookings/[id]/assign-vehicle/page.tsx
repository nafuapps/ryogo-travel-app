//Bookings/id/assign-vehicle page (for a lead/confirmed booking)

import { BookingRegex } from "@/lib/regex"
import { getCurrentUser } from "@/lib/auth"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { BookingStatusEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"
import { cancelBookingAction } from "@/app/actions/cancelBookingAction"
import { mainClassName } from "@/components/page/pageCommons"
import DashboardHeader from "@/app/dashboard/components/extra/dashboardHeader"
import AssignVehiclePageComponent from "./assignVehicle"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"

export default async function AssignVehicleBookingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getCurrentUser()

  //Invalid booking id regex
  if (!BookingRegex.safeParse(id).success) {
    redirect("/dashboard/bookings", RedirectType.replace)
  }

  const booking = await bookingServices.findBookingDetailsById(id)

  //No booking found or agency mismatch
  if (!booking || booking.agency.id != user?.agencyId) {
    redirect("/dashboard/bookings", RedirectType.replace)
  }

  //If it is a lead booking and old, cancel it automatically
  if (
    booking.status == BookingStatusEnum.LEAD &&
    new Date(booking.endDate) < new Date()
  ) {
    if (await cancelBookingAction(booking.id)) {
      redirect(`/dashboard/bookings/${id}`, RedirectType.replace)
    } else {
      redirect(`/dashboard/bookings`, RedirectType.replace)
    }
  }

  //Only lead and confirmed bookings can be assigned vehicles
  if (
    booking.status != BookingStatusEnum.LEAD &&
    booking.status != BookingStatusEnum.CONFIRMED
  ) {
    redirect(`/dashboard/bookings/${id}`, RedirectType.replace)
  }

  //Only owner or assigned agent can assign vehicle
  if (
    user.userRole != UserRolesEnum.OWNER &&
    booking.assignedUser.id != user.userId
  ) {
    redirect(`/dashboard/bookings/${id}`, RedirectType.replace)
  }

  //Get vehicle data with their bookings and repairs
  const vehicles = await vehicleServices.findVehiclesByAgency(user.agencyId)

  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/bookings/[id]/assign-vehicle"} />
      <AssignVehiclePageComponent
        bookingId={id}
        vehicles={vehicles}
        booking={booking}
      />
    </div>
  )
}
