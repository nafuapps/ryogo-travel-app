"use client"

import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { FindVehiclesByAgencyType } from "@ryogo-travel-app/api/services/vehicle.services"
import { useTranslations } from "next-intl"
import { useState, useTransition } from "react"
import AssignVehicleTile from "@/components/bookings/assign/assignVehicleTile"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useRouter } from "next/navigation"
import { assignVehicleAction } from "@/app/actions/bookings/assignVehicleAction"
import { toast } from "sonner"
import { SmallBold } from "@/components/typography"
import { ContentWrapper, PageWrapper } from "@/components/page/pageWrappers"

export default function AssignVehiclePageComponent({
  bookingId,
  vehicles,
  booking,
}: {
  bookingId: string
  vehicles: FindVehiclesByAgencyType
  booking: NonNullable<FindBookingDetailsByIdType>
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
        if (
          await assignVehicleAction(
            bookingId,
            selectedVehicleId,
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
    <PageWrapper id="AssignVehiclePage">
      <ContentWrapper id="AssignVehicleInfo">
        <SmallBold>{t("Title")}</SmallBold>
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
        <Button
          variant={"default"}
          size={"lg"}
          onClick={handleAssignVehicle}
          disabled={!canAssignVehicle}
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
      </ContentWrapper>
    </PageWrapper>
  )
}
