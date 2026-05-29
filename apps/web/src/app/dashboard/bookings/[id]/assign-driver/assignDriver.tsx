"use client"

import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { FindDriversByAgencyType } from "@ryogo-travel-app/api/services/driver.services"
import { useTranslations } from "next-intl"
import { useState, useTransition } from "react"
import AssignDriverTile from "@/components/flows/bookings/assign/assignDriverTile"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useRouter } from "next/navigation"
import { assignDriverAction } from "@/app/actions/bookings/assignDriverAction"
import { toast } from "sonner"
import { RyogoSmall } from "@/components/typography"
import {
  SectionWrapper,
  PageWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import SubscriptionReminderButton from "@/components/flows/susbcription/subscriptionReminderButton"

export default function AssignDriverPageComponent({
  bookingId,
  drivers,
  booking,
  limited,
  isSubscribed,
}: {
  bookingId: string
  drivers: FindDriversByAgencyType
  booking: NonNullable<FindBookingDetailsByIdType>
  limited: boolean
  isSubscribed: boolean
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
          ctaText={isSubscribed ? t("RenewCTA") : t("BuyCTA")}
          isSubscribed={isSubscribed}
        />
      )}
      <SectionWrapper id="AssignDriverInfo">
        <RyogoSmall weight="font-bold">{t("Title")}</RyogoSmall>
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
      </SectionWrapper>
      <StickyActionWrapper>
        <Button
          variant={"default"}
          size={"lg"}
          onClick={handleAssignDriver}
          disabled={!canAssignDriver}
        >
          {isPending && <Spinner />}
          {isPending ? t("Loading") : t("PrimaryCTA")}
        </Button>
        <Button
          variant={"outline"}
          size={"lg"}
          type="button"
          onClick={() => router.back()}
          disabled={isPending}
        >
          {t("CancelCTA")}
        </Button>
      </StickyActionWrapper>
    </PageWrapper>
  )
}
