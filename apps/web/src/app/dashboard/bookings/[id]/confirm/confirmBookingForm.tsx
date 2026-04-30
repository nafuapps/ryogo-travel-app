"use client"

import { confirmBookingAction } from "@/app/actions/bookings/confirmBookingAction"
import BookingAlertDialog from "@/app/dashboard/components/buttons/bookingAlertDialog"
import {
  DashboardTextarea,
  DashboardCheckbox,
  DashboardTimePicker,
} from "@/components/form/dashboardFormFields"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Spinner } from "@/components/ui/spinner"
import { zodResolver } from "@hookform/resolvers/zod"
import { FindLeadBookingByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useEffect, useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

export default function ConfirmBookingForm({
  booking,
  canConfirm,
}: {
  booking: NonNullable<FindLeadBookingByIdType>
  canConfirm: boolean
}) {
  const router = useRouter()
  const t = useTranslations("Dashboard.ConfirmBooking")

  const [isConfirmPending, startConfirmTransition] = useTransition()

  const confirmBookingSchema = z.object({
    pickupAddress: z
      .string()
      .min(10, t("AddressError1"))
      .max(300, t("AddressError2")),
    sameAsCustomerAddress: z.boolean(),
    dropAddress: z
      .string()
      .min(10, t("AddressError1"))
      .max(300, t("AddressError2"))
      .optional(),
    startTime: z.iso.time(t("PickupTimeError")).nonempty(t("PickupTimeError")),
  })
  type ConfirmBookingType = z.infer<typeof confirmBookingSchema>

  const form = useForm<ConfirmBookingType>({
    resolver: zodResolver(confirmBookingSchema),
    defaultValues: {
      pickupAddress: "",
      sameAsCustomerAddress: false,
    },
  })

  //Confirm booking
  async function confirm(values: ConfirmBookingType) {
    startConfirmTransition(async () => {
      const confirmedBooking = await confirmBookingAction(
        booking.id,
        booking.agencyId,
        booking.assignedUserId,
        values.startTime,
        values.pickupAddress,
        values.dropAddress,
        booking.customer.address ? false : true,
        booking.customer.id,
      )
      if (confirmedBooking) {
        toast.success(t("ConfirmSuccess"))
        router.replace(`/dashboard/bookings/${booking.id}`)
      } else {
        toast.error(t("ConfirmError"))
      }
    })
  }

  const setValue = form.setValue
  // Watch the checkbox and the source input field
  // eslint-disable-next-line react-hooks/incompatible-library
  const pickupAddressCopySelection = form.watch("sameAsCustomerAddress")
  const pickupAddressSourceValue = booking.customer.address

  useEffect(() => {
    if (!pickupAddressSourceValue) return
    if (pickupAddressCopySelection) {
      // If the checkbox is checked, set the target input's value
      setValue("pickupAddress", pickupAddressSourceValue)
    } else {
      // Optionally, clear the target input if unchecked
      setValue("pickupAddress", "")
    }
  }, [pickupAddressCopySelection, pickupAddressSourceValue, setValue])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(confirm)}
        className="flex flex-col gap-2 lg:gap-3"
      >
        <DashboardTextarea
          name="pickupAddress"
          label={t("PickupAddress")}
          placeholder={t("PickupAddressPlaceholder")}
        />
        <DashboardCheckbox
          register={form.register("sameAsCustomerAddress")}
          name={"sameAsCustomerAddress"}
          label={t("SameAsCustomerAddress")}
        />
        <DashboardTextarea
          name="dropAddress"
          label={t("DropAddress")}
          placeholder={t("DropAddressPlaceholder")}
        />
        <DashboardTimePicker name="startTime" label={t("PickupTime")} />
        {canConfirm && (
          <>
            <BookingAlertDialog
              title={t("Confirm.Title")}
              desc={t("Confirm.Desc")}
              noCTA={t("Confirm.NoCTA")}
              labelChild={
                <Button variant={"default"} className="w-full">
                  {t("Confirm.Label")}
                </Button>
              }
            >
              <Button
                onClick={() => form.handleSubmit(confirm)()}
                variant={"default"}
                disabled={isConfirmPending}
              >
                {isConfirmPending && <Spinner />}
                {isConfirmPending ? t("Loading") : t("Confirm.YesCTA")}
              </Button>
            </BookingAlertDialog>
          </>
        )}
      </form>
    </Form>
  )
}
