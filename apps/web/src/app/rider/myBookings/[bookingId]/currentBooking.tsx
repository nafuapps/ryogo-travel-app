import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getTranslations } from "next-intl/server"
import RiderMyBookingDetails from "@/components/flows/rider/riderMyBookingDetails"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookingTypeEnum, TripLogTypesEnum } from "@ryogo-travel-app/db/schema"
import StartTripSheet from "@/components/flows/rider/tripSheets/startTripSheet"
import EndTripSheet from "@/components/flows/rider/tripSheets/endTripSheet"
import MidTripSheet from "@/components/flows/rider/tripSheets/midTripSheet"
import { RyogoCaption, RyogoSmall } from "@/components/typography"
import RiderExpenseItem from "@/components/flows/rider/riderExpenseItem"
import RiderTripLogItem from "@/components/flows/rider/riderTripLogItem"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import {
  SectionWrapper,
  PageWrapper,
  StickyActionWrapper,
  SectionHeaderWrapper,
} from "@/components/page/pageWrappers"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { Plus } from "lucide-react"

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
        <SectionHeaderWrapper>
          <RyogoSmall weight="font-bold">{t("Expenses")}</RyogoSmall>
          <Link
            href={`/rider/myBookings/${booking.id}/add-expense`}
            className="ml-auto"
          >
            <Button variant={"outline"}>
              <RyogoIcon icon={Plus} size="sm" />
              <RyogoCaption color="slate">{t("AddExpense")}</RyogoCaption>
            </Button>
          </Link>
        </SectionHeaderWrapper>
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
      <StickyActionWrapper>
        {nextStep === TripLogTypesEnum.STARTED ? (
          <StartTripSheet booking={booking} />
        ) : nextStep === TripLogTypesEnum.ENDED ? (
          <EndTripSheet booking={booking} />
        ) : (
          <MidTripSheet booking={booking} tripType={nextStep} />
        )}
      </StickyActionWrapper>
    </PageWrapper>
  )
}

function getNextStep(
  bookingType: BookingTypeEnum,
  endDate: Date,
  tripLogs: NonNullable<FindBookingDetailsByIdType>["tripLogs"],
) {
  const now = new Date()
  const counts = tripLogs.reduce(
    (acc, log) => {
      acc[log.type] = (acc[log.type] ?? 0) + 1
      return acc
    },
    {
      [TripLogTypesEnum.STARTED]: 0,
      [TripLogTypesEnum.ARRIVED]: 0,
      [TripLogTypesEnum.PICKED_UP]: 0,
      [TripLogTypesEnum.DROPPED]: 0,
      [TripLogTypesEnum.ENDED]: 0,
    } as Record<TripLogTypesEnum, number>,
  )

  const startedCount = counts[TripLogTypesEnum.STARTED]
  const arrivedCount = counts[TripLogTypesEnum.ARRIVED]
  const pickedUpCount = counts[TripLogTypesEnum.PICKED_UP]
  const droppedCount = counts[TripLogTypesEnum.DROPPED]

  if (bookingType === BookingTypeEnum.OneWay) {
    if (droppedCount > 0) return TripLogTypesEnum.ENDED
    if (pickedUpCount > 0) return TripLogTypesEnum.DROPPED
    if (arrivedCount > 0) return TripLogTypesEnum.PICKED_UP
    if (startedCount > 0) return TripLogTypesEnum.ARRIVED
    return TripLogTypesEnum.STARTED
  }

  if (bookingType === BookingTypeEnum.Round) {
    if (droppedCount > 1) return TripLogTypesEnum.ENDED
    if (pickedUpCount > arrivedCount) return TripLogTypesEnum.DROPPED
    if (arrivedCount > pickedUpCount) return TripLogTypesEnum.PICKED_UP
    if (droppedCount === 1 || startedCount === 1)
      return TripLogTypesEnum.ARRIVED
    if (pickedUpCount === 1) return TripLogTypesEnum.DROPPED
    if (arrivedCount === 1) return TripLogTypesEnum.PICKED_UP
    return TripLogTypesEnum.STARTED
  }

  if (droppedCount === arrivedCount) {
    if (droppedCount > 0 && endDate <= now) return TripLogTypesEnum.ENDED
    return startedCount > 0
      ? TripLogTypesEnum.ARRIVED
      : TripLogTypesEnum.STARTED
  }

  if (droppedCount < pickedUpCount) return TripLogTypesEnum.DROPPED
  if (pickedUpCount < arrivedCount) return TripLogTypesEnum.PICKED_UP
  return TripLogTypesEnum.STARTED
}
