"use client"

import { FindBookingStatusByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { FindVehiclesByAgencyType } from "@ryogo-travel-app/api/services/vehicle.services"
import { useTranslations } from "next-intl"
import { useState, useTransition } from "react"
import AssignVehicleTile from "@/components/flows/bookings/assign/assignVehicleTile"
import { useRouter } from "next/navigation"
import { assignVehicleAction } from "@/app/actions/bookings/assignVehicleAction"
import { toast } from "sonner"
import { RyogoP } from "@/components/typography"
import {
  PageWrapper,
  StickyActionWrapper,
  GridWrapper,
} from "@/components/page/pageWrappers"
import SubscriptionReminderButton from "@/components/flows/susbcription/subscriptionReminderButton"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"

export default function AssignVehiclePageComponent({
  bookingId,
  vehicles,
  booking,
  limited,
  isSubscribed,
  hasTriedSubscription,
}: {
  bookingId: string
  vehicles: FindVehiclesByAgencyType
  booking: NonNullable<FindBookingStatusByIdType>
  limited: boolean
  isSubscribed: boolean
  hasTriedSubscription: boolean
}) {
  const t = useTranslations("Dashboard.AssignVehicle")
  const router = useRouter()

  const [isPending, startTransition] = useTransition()

  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(
    booking.assignedVehicleId,
  )

  const canAssignVehicle =
    selectedVehicleId && selectedVehicleId !== booking.assignedVehicleId

  const handleAssignVehicle = async () => {
    if (selectedVehicleId) {
      startTransition(async () => {
        const updatedVehicle = await assignVehicleAction(
          bookingId,
          selectedVehicleId,
          booking.agencyId,
          booking.assignedUserId,
        )
        if (updatedVehicle) {
          toast.success(t("Success"))
          router.replace(`/dashboard/bookings/${bookingId}`)
        } else {
          toast.error(t("Error"))
        }
      })
    } else {
      toast.warning(t("SelectWarning"))
    }
  }

  return (
    <PageWrapper id="AssignVehiclePage">
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
        {t("Title", { length: vehicles.length })}
      </RyogoP>
      <GridWrapper id="AssignVehicleInfo">
        {vehicles.map((vehicle, index) => (
          <AssignVehicleTile
            key={index}
            vehicleData={vehicle}
            bookingStartDate={booking.startDate}
            bookingEndDate={booking.endDate}
            bookingPassengers={booking.passengers}
            bookingId={booking.id}
            bookingNeedsAC={booking.needsAc}
            isCurrentlyAssigned={booking.assignedVehicleId === vehicle.id}
            selected={selectedVehicleId === vehicle.id}
            onClick={() =>
              setSelectedVehicleId(
                selectedVehicleId === vehicle.id ? null : vehicle.id,
              )
            }
          />
        ))}
      </GridWrapper>
      <StickyActionWrapper>
        <RyogoDefaultButton
          size={"lg"}
          label={isPending ? t("Loading") : t("PrimaryCTA")}
          onClick={handleAssignVehicle}
          disabled={!canAssignVehicle}
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
