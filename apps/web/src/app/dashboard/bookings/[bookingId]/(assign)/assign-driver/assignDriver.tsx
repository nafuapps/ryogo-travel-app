"use client"

import { FindBookingStatusByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { FindDriversByAgencyType } from "@ryogo-travel-app/api/services/driver.services"
import { useTranslations } from "next-intl"
import { useState, useTransition } from "react"
import AssignDriverTile from "@/components/flows/bookings/assign/assignDriverTile"
import { useRouter } from "next/navigation"
import { assignDriverAction } from "@/app/actions/bookings/assignDriverAction"
import { toast } from "sonner"
import { RyogoP } from "@/components/typography"
import {
  GridWrapper,
  PageWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import SubscriptionReminderButton from "@/components/flows/susbcription/subscriptionReminderButton"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"

export default function AssignDriverPageComponent({
  bookingId,
  drivers,
  booking,
  limited,
  isSubscribed,
  hasTriedSubscription,
}: {
  bookingId: string
  drivers: FindDriversByAgencyType
  booking: NonNullable<FindBookingStatusByIdType>
  limited: boolean
  isSubscribed: boolean
  hasTriedSubscription: boolean
}) {
  const t = useTranslations("Dashboard.AssignDriver")
  const router = useRouter()

  const [isPending, startTransition] = useTransition()

  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(
    booking.assignedDriverId,
  )

  const canAssignDriver =
    selectedDriverId && selectedDriverId !== booking.assignedDriverId

  const handleAssignDriver = async () => {
    if (selectedDriverId) {
      startTransition(async () => {
        if (
          await assignDriverAction(
            bookingId,
            selectedDriverId,
            booking.agencyId,
            booking.assignedUserId,
          )
        ) {
          toast.success(t("Success"))
          router.replace(`/dashboard/bookings/${bookingId}`)
        } else {
          toast.error(t("Error"))
        }
      })
    }
  }

  return (
    <PageWrapper id="AssignDriverPage">
      {limited && (
        <SubscriptionReminderButton
          warningText={isSubscribed ? t("ExpiredWarning") : t("TrialWarning")}
          ctaText={
            isSubscribed
              ? t("RenewCTA")
              : hasTriedSubscription
                ? t("BuyCTA")
                : t("TryCTA")
          }
        />
      )}
      <RyogoP weight="font-bold">
        {t("Title", { length: drivers.length })}
      </RyogoP>
      <GridWrapper id="AssignDriverInfo">
        {drivers.map((driver, index) => (
          <AssignDriverTile
            key={index}
            driverData={driver}
            bookingStartDate={booking.startDate}
            bookingEndDate={booking.endDate}
            bookingPassengers={booking.passengers}
            bookingId={booking.id}
            isCurrentlyAssigned={booking.assignedDriverId === driver.id}
            selected={selectedDriverId === driver.id}
            onClick={() =>
              setSelectedDriverId(
                selectedDriverId === driver.id ? null : driver.id,
              )
            }
          />
        ))}
      </GridWrapper>
      <StickyActionWrapper>
        <RyogoDefaultButton
          size={"lg"}
          label={isPending ? t("Loading") : t("PrimaryCTA")}
          onClick={handleAssignDriver}
          disabled={!canAssignDriver}
          showSpinner={isPending}
        />
        <RyogoOutlineButton
          size={"lg"}
          label={t("CancelCTA")}
          onClick={() => router.back()}
          disabled={isPending}
        />
      </StickyActionWrapper>
    </PageWrapper>
  )
}
