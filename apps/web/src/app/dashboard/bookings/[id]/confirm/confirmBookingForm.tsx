"use client"

import { confirmBookingAction } from "@/app/actions/bookings/confirmBookingAction"
import BookingAlertDialog from "@/components/buttons/bookingAlertDialog"
import {
  RyogoTextarea,
  RyogoCheckbox,
  RyogoTimePicker,
} from "@/components/form/ryogoFormFields"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Spinner } from "@/components/ui/spinner"
import { zodResolver } from "@hookform/resolvers/zod"
import { FindLeadBookingByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useEffect, useTransition } from "react"
import { useForm, useWatch } from "react-hook-form"
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
      const confirmedBookingMessage = await confirmBookingAction(
        booking.id,
        booking.agencyId,
        booking.assignedUserId,
        values.startTime,
        values.pickupAddress,
        values.dropAddress,
        booking.customer.address ? false : true,
        booking.customer.id,
      )
      if (confirmedBookingMessage) {
        toast.success(t("ConfirmSuccess"))
        window.open(confirmedBookingMessage, "_blank", "noopener,noreferrer")
        router.replace(`/dashboard/bookings/${booking.id}`)
      } else {
        toast.error(t("ConfirmError"))
      }
    })
  }

  const setValue = form.setValue
  const pickupAddressCopySelection = useWatch({
    name: "sameAsCustomerAddress",
    control: form.control,
  })
  const pickupAddressSourceValue = booking.customer.address

  useEffect(() => {
    if (!pickupAddressSourceValue) return
    if (pickupAddressCopySelection) {
      // If the checkbox is checked, set the target input's value
      setValue("pickupAddress", pickupAddressSourceValue)
    } else {
      // Clear the target input if unchecked
      setValue("pickupAddress", "")
    }
  }, [pickupAddressCopySelection, pickupAddressSourceValue, setValue])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(confirm)}
        className="flex flex-col gap-2 lg:gap-3"
      >
        <RyogoTextarea
          name="pickupAddress"
          label={t("PickupAddress")}
          placeholder={t("PickupAddressPlaceholder")}
        />
        <RyogoCheckbox
          register={form.register("sameAsCustomerAddress")}
          name={"sameAsCustomerAddress"}
          label={t("SameAsCustomerAddress")}
        />
        <RyogoTextarea
          name="dropAddress"
          label={t("DropAddress")}
          placeholder={t("DropAddressPlaceholder")}
        />
        <RyogoTimePicker name="startTime" label={t("PickupTime")} />
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
