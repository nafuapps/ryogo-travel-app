"use client"

import { newBookingAction } from "@/app/actions/bookings/newBookingAction"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import BookingPriceItem from "@/components/flows/bookings/details/bookingPriceItem"
import BookingTripCard from "@/components/flows/bookings/details/bookingTripCard"
import FormStepHeader from "@/components/form/formStepHeader"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import {
  FormContentWrapper,
  FormWrapper,
  PageWrapper,
  SectionRowWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { RyogoCaption, RyogoH3, RyogoP } from "@/components/typography"
import { Alert } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { NewBookingTotalSteps } from "@/lib/uiConfig"
import { getEstimatedTotalPrice } from "@/lib/utils"
import { NewBookingRequestDataType } from "@ryogo-travel-app/api/types/booking.types"
import { Info } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export default function NewBookingFinal({
  onPrev,
  newBookingFormData,
}: {
  onPrev: () => void
  newBookingFormData: NewBookingRequestDataType
}) {
  const t = useTranslations("Dashboard.NewBookingWithCustomer.Form.Final")
  const router = useRouter()

  const form = useForm<NewBookingRequestDataType>()

  //Calculate estimated final price to show (actual price is calculated in server when booking is created)
  const finalAmount = getEstimatedTotalPrice(newBookingFormData)

  //Final form submit to create a new booking
  const onSubmit = async () => {
    const createdBooking = await newBookingAction({
      data: newBookingFormData,
    })
    if (createdBooking) {
      router.replace(`/dashboard/bookings/${createdBooking.id}?feedback=true`)
      toast.success(t("Success"))
    } else {
      router.replace(`/dashboard/bookings`)
      toast.error(t("Error"))
    }
  }

  return (
    <PageWrapper id="FinalStep">
      <FormStepHeader
        totalSteps={NewBookingTotalSteps}
        currentStepIndex={4}
        title={t("Title")}
        stepLabel={t("Subtitle", {
          current: 5,
          total: NewBookingTotalSteps,
        })}
        description={t("Description")}
        href={"/dashboard/support/help-bookings#creation"}
      />
      <FormWrapper<NewBookingRequestDataType>
        id="FinalForm"
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormContentWrapper>
          <BookingTripCard {...newBookingFormData} />
        </FormContentWrapper>
        <FormContentWrapper>
          <BookingPriceItem
            title={t("VehicleCharge")}
            value={"₹" + finalAmount.totalVehiclePrice}
            subtitle={t("VehicleSubtitle", {
              charge: newBookingFormData.selectedRatePerKm,
              distance: finalAmount.totalDistance,
            })}
          />
          {newBookingFormData.needsAc && (
            <BookingPriceItem
              title={t("ACCharge")}
              value={"₹" + finalAmount.totalAcPrice}
              subtitle={t("ACSubtitle", {
                ac: newBookingFormData.selectedAcChargePerDay,
                days: finalAmount.totalAllowanceDays,
              })}
            />
          )}
          <BookingPriceItem
            title={t("DriverAllowance")}
            value={"₹" + finalAmount.totalDriverAllowance}
            subtitle={t("DriverSubtitle", {
              allowance: newBookingFormData.selectedAllowancePerDay,
              days: finalAmount.totalAllowanceDays,
            })}
          />
          <BookingPriceItem
            title={t("Commission")}
            value={"₹" + finalAmount.totalCommission}
            subtitle={"(" + newBookingFormData.selectedCommissionRate + "%) "}
          />
          <Separator />
          <SectionRowWrapper className="items-center justify-between">
            <RyogoP color="light">{t("TotalAmount")}</RyogoP>
            <RyogoH3 weight="font-bold">
              {"₹" + finalAmount.totalAmount}
            </RyogoH3>
          </SectionRowWrapper>
        </FormContentWrapper>
        <Alert>
          <RyogoIcon icon={Info} size="sm" />
          <RyogoCaption color="light">{t("CreateInfo")}</RyogoCaption>
        </Alert>
        <StickyActionWrapper>
          <RyogoDefaultButton
            size={"lg"}
            type="submit"
            disabled={form.formState.isSubmitting}
            showSpinner={form.formState.isSubmitting}
            label={form.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")}
          />
          <RyogoOutlineButton
            size={"lg"}
            type="button"
            onClick={onPrev}
            disabled={form.formState.isSubmitting}
            label={t("Back")}
          />
        </StickyActionWrapper>
      </FormWrapper>
    </PageWrapper>
  )
}
