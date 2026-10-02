import {
  FindAllDriverLeavesByDriverIdType,
  FindDriverAssignedBookingsByIdType,
  FindDriverByUserIdType,
} from "@ryogo-travel-app/api/services/driver.services"
import { getTranslations } from "next-intl/server"
import {
  BookingStatusEnum,
  DriverLeaveStatusEnum,
  DriverStatusEnum,
} from "@ryogo-travel-app/db/schema"
import {
  PageWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import {
  OngoingBookingCard,
  UpcomingBookingCard,
} from "@/components/flows/bookings/cards/bookingCards"
import DriverLeaveComponent from "@/components/flows/drivers/leaves/driverLeaveComponent"
import { FindNotificationsByUserIdType } from "@ryogo-travel-app/api/services/notification.services"
import NotificationCard from "@/components/notifications/notificationCard"

//TODO: Revamp home page for rider with a floating ongoing booking nudge

export default async function RiderHomePageComponent({
  assignedBookings,
  driverLeaves,
  driverActivities,
  driver,
}: {
  assignedBookings: FindDriverAssignedBookingsByIdType
  driverLeaves: FindAllDriverLeavesByDriverIdType
  driverActivities: FindNotificationsByUserIdType
  driver: NonNullable<FindDriverByUserIdType>
}) {
  const t = await getTranslations("Rider.Home")

  const ongoingLeave = driverLeaves.find(
    (leave) => leave.status === DriverLeaveStatusEnum.ONGOING,
  )

  //Get in progress booking (if any)
  const currentBooking = assignedBookings.find(
    (booking) => booking.status === BookingStatusEnum.IN_PROGRESS,
  )

  //Get upcoming bookings which can be started
  const upcomingBookings = assignedBookings
    .filter(
      (booking) =>
        booking.status === BookingStatusEnum.CONFIRMED &&
        booking.startDate <= new Date() &&
        booking.assignedVehicle !== null,
    )
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())

  return (
    <PageWrapper id="RiderHomePage">
      {upcomingBookings.length > 0 &&
        upcomingBookings.map((b) => {
          return (
            <UpcomingBookingCard
              key={b.id}
              booking={b}
              rider
              canStart={
                !currentBooking &&
                driver.status === DriverStatusEnum.AVAILABLE &&
                b.startDate <= new Date() &&
                b.assignedVehicle !== null
              }
              startLabel={t("Start")}
            />
          )
        })}
      {ongoingLeave && driver.status === DriverStatusEnum.LEAVE && (
        <DriverLeaveComponent leave={ongoingLeave} driver={driver} isRider />
      )}
      {driverActivities.length > 0 &&
        driverActivities.map((notification) => {
          return (
            <NotificationCard
              key={notification.id}
              notification={notification}
              hideLink
            />
          )
        })}
      <StickyActionWrapper>
        {currentBooking && (
          <OngoingBookingCard
            booking={currentBooking}
            rider
            startLabel={t("Continue")}
            asCTA
          />
        )}
      </StickyActionWrapper>
    </PageWrapper>
  )
}
