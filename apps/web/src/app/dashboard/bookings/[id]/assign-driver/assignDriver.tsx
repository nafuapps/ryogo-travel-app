"use client"

import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { FindDriversByAgencyType } from "@ryogo-travel-app/api/services/driver.services"
import { useTranslations } from "next-intl"
import { useState, useTransition } from "react"
import AssignDriverTile from "@/components/bookings/assign/assignDriverTile"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useRouter } from "next/navigation"
import { assignDriverAction } from "@/app/actions/bookings/assignDriverAction"
import { toast } from "sonner"
import { SmallBold } from "@/components/typography"
import { PageWrapper } from "@/components/page/pageWrappers"

export default function AssignDriverPageComponent({
  bookingId,
  drivers,
  booking,
}: {
  bookingId: string
  drivers: FindDriversByAgencyType
  booking: NonNullable<FindBookingDetailsByIdType>
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
      <div
        id="AssignDriverInfo"
        className="flex flex-col gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5"
      >
        <SmallBold>{t("Title")}</SmallBold>
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
      </div>
    </PageWrapper>
  )
}
