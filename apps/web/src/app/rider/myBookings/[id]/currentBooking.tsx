import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getTranslations } from "next-intl/server"
import RiderMyBookingDetails from "@/components/flows/rider/riderMyBookingDetails"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookingTypeEnum, TripLogTypesEnum } from "@ryogo-travel-app/db/schema"
import StartTripSheet from "@/components/flows/rider/tripSheets/startTripSheet"
import EndTripSheet from "@/components/flows/rider/tripSheets/endTripSheet"
import MidTripSheet from "@/components/flows/rider/tripSheets/midTripSheet"
import { RyogoSmall } from "@/components/typography"
import RiderExpenseItem from "@/components/flows/rider/riderExpenseItem"
import RiderTripLogItem from "@/components/flows/rider/riderTripLogItem"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import {
  SectionWrapper,
  PageWrapper,
  StickyWrapper,
} from "@/components/page/pageWrappers"

export default async function RiderMyOngoingBookingPageComponent({
  booking,
}: {
  booking: NonNullable<FindBookingDetailsByIdType>
}) {
  const t = await getTranslations("Rider.MyBooking")

  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const nextStep = getNextStep(booking.type, booking.endDate, booking.tripLogs)

  return (
    <PageWrapper id="RiderCurrentBookingPage">
      <RiderMyBookingDetails booking={booking} canCallCustomer={true} />
      <SectionWrapper id="CurrentBookingTripLogs">
        <RyogoSmall weight="font-bold">{t("TripLogs")}</RyogoSmall>
        {booking.tripLogs.map((t) => {
          return <RiderTripLogItem key={t.id} tripLog={t} />
        })}
      </SectionWrapper>
      <SectionWrapper id="CurrentBookingExpenses">
        <RyogoSmall weight="font-bold">{t("Expenses")}</RyogoSmall>
        <Link href={`/rider/myBookings/${booking.id}/add-expense`}>
          <Button
            type="button"
            variant={"outline"}
            form="endTrip"
            className="w-full"
          >
            {t("AddExpense")}
          </Button>
        </Link>
        {booking.expenses.map((e) => {
          return (
            <RiderExpenseItem
              key={e.id}
              expense={e}
              bookingId={booking.id}
              canModifyExpense={currentUser.userId === e.addedByUserId}
            />
          )
        })}
      </SectionWrapper>
      <StickyWrapper>
        {nextStep === TripLogTypesEnum.START_TRIP ? (
          <StartTripSheet booking={booking} />
        ) : nextStep === TripLogTypesEnum.END_TRIP ? (
          <EndTripSheet booking={booking} />
        ) : (
          <MidTripSheet booking={booking} tripType={nextStep} />
        )}
      </StickyWrapper>
    </PageWrapper>
  )
}

function getNextStep(
  bookingType: BookingTypeEnum,
  endDate: Date,
  tripLogs: NonNullable<FindBookingDetailsByIdType>["tripLogs"],
) {
  //One way trip: START_TRIP->ARRIVED->PICKUP->DROP->END_TRIP
  if (bookingType === BookingTypeEnum.OneWay) {
    if (tripLogs.some((t) => t.type === TripLogTypesEnum.DROP)) {
      return TripLogTypesEnum.END_TRIP
    }
    if (tripLogs.some((t) => t.type === TripLogTypesEnum.PICKUP)) {
      return TripLogTypesEnum.DROP
    }
    if (tripLogs.some((t) => t.type === TripLogTypesEnum.ARRIVED)) {
      return TripLogTypesEnum.PICKUP
    }
    if (tripLogs.some((t) => t.type === TripLogTypesEnum.START_TRIP)) {
      return TripLogTypesEnum.ARRIVED
    }
    return TripLogTypesEnum.START_TRIP
  }
  //Round trip: START_TRIP->ARRIVED->PICKUP->DROP->ARRIVED->PICKUP->DROP->END_TRIP
  if (bookingType === BookingTypeEnum.Round) {
    if (tripLogs.filter((t) => t.type === TripLogTypesEnum.DROP).length > 1) {
      return TripLogTypesEnum.END_TRIP
    }
    if (tripLogs.filter((t) => t.type === TripLogTypesEnum.PICKUP).length > 1) {
      return TripLogTypesEnum.DROP
    }
    if (
      tripLogs.filter((t) => t.type === TripLogTypesEnum.ARRIVED).length > 1
    ) {
      return TripLogTypesEnum.PICKUP
    }
    if (tripLogs.filter((t) => t.type === TripLogTypesEnum.DROP).length === 1) {
      return TripLogTypesEnum.ARRIVED
    }
    if (
      tripLogs.filter((t) => t.type === TripLogTypesEnum.PICKUP).length === 1
    ) {
      return TripLogTypesEnum.DROP
    }
    if (
      tripLogs.filter((t) => t.type === TripLogTypesEnum.ARRIVED).length === 1
    ) {
      return TripLogTypesEnum.PICKUP
    }
    if (
      tripLogs.filter((t) => t.type === TripLogTypesEnum.START_TRIP).length ===
      1
    ) {
      return TripLogTypesEnum.ARRIVED
    }
    return TripLogTypesEnum.START_TRIP
  }
  //Multi day trip: START_TRIP->(ARRIVED->PICKUP->DROP)->END_TRIP
  if (
    tripLogs.filter((t) => t.type === TripLogTypesEnum.DROP).length ==
    tripLogs.filter((t) => t.type === TripLogTypesEnum.ARRIVED).length
  ) {
    if (
      endDate <= new Date() &&
      tripLogs.filter((t) => t.type === TripLogTypesEnum.DROP).length > 0
    ) {
      return TripLogTypesEnum.END_TRIP
    }
    if (tripLogs.some((t) => t.type === TripLogTypesEnum.START_TRIP)) {
      return TripLogTypesEnum.ARRIVED
    }
    return TripLogTypesEnum.START_TRIP
  }
  if (
    tripLogs.filter((t) => t.type === TripLogTypesEnum.DROP).length <
    tripLogs.filter((t) => t.type === TripLogTypesEnum.PICKUP).length
  ) {
    return TripLogTypesEnum.DROP
  }
  if (
    tripLogs.filter((t) => t.type === TripLogTypesEnum.PICKUP).length <
    tripLogs.filter((t) => t.type === TripLogTypesEnum.ARRIVED).length
  ) {
    return TripLogTypesEnum.PICKUP
  }
  return TripLogTypesEnum.START_TRIP
}
