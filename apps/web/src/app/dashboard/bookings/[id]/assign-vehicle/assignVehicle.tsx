"use client"

import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { FindVehiclesByAgencyType } from "@ryogo-travel-app/api/services/vehicle.services"
import { useTranslations } from "next-intl"
import { useState, useTransition } from "react"
import AssignVehicleTile from "@/components/flows/bookings/assign/assignVehicleTile"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useRouter } from "next/navigation"
import { assignVehicleAction } from "@/app/actions/bookings/assignVehicleAction"
import { toast } from "sonner"
import { RyogoCaption, RyogoSmall } from "@/components/typography"
import {
  SectionWrapper,
  PageWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import Link from "next/link"

export default function AssignVehiclePageComponent({
  bookingId,
  vehicles,
  booking,
  limited,
  isSubscribed,
}: {
  bookingId: string
  vehicles: FindVehiclesByAgencyType
  booking: NonNullable<FindBookingDetailsByIdType>
  limited: boolean
  isSubscribed: boolean
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
      {limited && (
        <SectionWrapper id="SubscribeAction">
          <SectionRowWrapper center>
            <RyogoCaption color="yellow">
              {isSubscribed ? t("ExpiredWarning") : t("TrialWarning")}
            </RyogoCaption>
            <Link href="/dashboard/account/subscription">
              <Button variant={isSubscribed ? "brand" : "outline"}>
                {isSubscribed ? t("RenewCTA") : t("BuyCTA")}
              </Button>
            </Link>
          </SectionRowWrapper>
        </SectionWrapper>
      )}
      <SectionWrapper id="AssignVehicleInfo">
        <RyogoSmall weight="font-bold">{t("Title")}</RyogoSmall>
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
      </SectionWrapper>
    </PageWrapper>
  )
}
