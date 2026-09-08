"use client"

import { confirmBookingAction } from "@/app/actions/bookings/confirmBookingAction"
import RyogoAlertDialog from "@/components/buttons/alert/ryogoAlertDialog"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import {
  NewFormActionWrapper,
  NewFormContentWrapper,
  NewFormWrapper,
} from "@/components/form/newFormWrappers"
import {
  RyogoTextarea,
  RyogoCheckbox,
  RyogoTimePicker,
} from "@/components/form/ryogoFormFields"
import { PageWrapper } from "@/components/page/pageWrappers"
import { RyogoH3, RyogoCaption } from "@/components/typography"
import { MAX_FIELD_DESC_LENGTH, MIN_FIELD_DESC_LENGTH } from "@/lib/uiConfig"
import { zodResolver } from "@hookform/resolvers/zod"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

export default function ConfirmBookingPageComponent({
  booking,
  children,
}: {
  booking: NonNullable<FindBookingDetailsByIdType>
  children: React.ReactNode
}) {
  const t = useTranslations("Dashboard.ConfirmBooking")
  const router = useRouter()

  const confirmBookingSchema = z.object({
    pickupAddress: z
      .string()
      .min(MIN_FIELD_DESC_LENGTH, t("AddressError1"))
      .max(MAX_FIELD_DESC_LENGTH, t("AddressError2")),
    sameAsCustomerAddress: z.boolean(),
    dropAddress: z
      .string()
      .min(MIN_FIELD_DESC_LENGTH, t("AddressError1"))
      .max(MAX_FIELD_DESC_LENGTH, t("AddressError2"))
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
  async function submit(values: ConfirmBookingType) {
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
    <PageWrapper id="ConfirmBookingPage">
      <NewFormWrapper<ConfirmBookingType>
        id="confirmBookingForm"
        onSubmit={form.handleSubmit(submit)}
        form={form}
      >
        <RyogoH3>{t("Title")}</RyogoH3>
        <RyogoCaption color="light">{t("Subtitle")}</RyogoCaption>
        <NewFormContentWrapper>{children}</NewFormContentWrapper>
        <NewFormContentWrapper>
          <RyogoTimePicker name="startTime" label={t("PickupTime")} />
          <RyogoTextarea
            name="pickupAddress"
            label={t("PickupAddress")}
            placeholder={t("PickupAddressPlaceholder")}
          />
          {pickupAddressSourceValue && (
            <RyogoCheckbox
              name={"sameAsCustomerAddress"}
              label={t("SameAsCustomerAddress")}
            />
          )}
          <RyogoTextarea
            name="dropAddress"
            label={t("DropAddress")}
            placeholder={t("DropAddressPlaceholder")}
          />
        </NewFormContentWrapper>
        <NewFormActionWrapper>
          <RyogoAlertDialog
            title={t("Confirm.Title")}
            desc={t("Confirm.Desc")}
            noCTA={t("Confirm.NoCTA")}
            labelChild={
              <RyogoDefaultButton
                label={t("Confirm.Label")}
                className="w-full"
                disabled={!form.formState.isValid}
              />
            }
          >
            <RyogoDefaultButton
              label={
                form.formState.isSubmitting ? t("Loading") : t("Confirm.YesCTA")
              }
              onClick={() => form.handleSubmit(submit)()}
              type="submit"
              disabled={form.formState.isSubmitting}
              showSpinner={form.formState.isSubmitting}
            />
          </RyogoAlertDialog>
          <RyogoOutlineButton
            size={"lg"}
            label={t("Back")}
            type="button"
            onClick={() => router.back()}
            disabled={form.formState.isSubmitting}
          />
        </NewFormActionWrapper>
      </NewFormWrapper>
    </PageWrapper>
  )
}
