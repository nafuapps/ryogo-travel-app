"use client"

import { RyogoH3, RyogoCaption } from "@/components/typography"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { NewBookingRequestDataType } from "@ryogo-travel-app/api/types/booking.types"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Info } from "lucide-react"
import { Alert } from "@/components/ui/alert"
import { newBookingAction } from "@/app/actions/bookings/newBookingAction"
import {
  SectionRowWrapper,
  PageWrapper,
  StickyActionWrapper,
  FormContentWrapper,
  FormWrapper,
} from "@/components/page/pageWrappers"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { getEstimatedTotalPrice } from "@/lib/utils"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import FormStepHeader from "@/components/form/formStepHeader"
import { NewBookingTotalSteps } from "@/lib/uiConfig"
import BookingTripCard from "@/components/flows/bookings/details/bookingTripCard"
import BookingPriceItem from "@/components/flows/bookings/details/bookingPriceItem"
import { Separator } from "@/components/ui/separator"

export default function NewBookingFinal({
  onPrev,
  newBookingFormData,
  userId,
  agencyId,
  customerId,
}: {
  onPrev: () => void
  newBookingFormData: NewBookingRequestDataType
  userId: string
  agencyId: string
  customerId: string
}) {
  const t = useTranslations("Dashboard.NewBookingWithCustomer.Form.Final")
  const router = useRouter()

  const form = useForm<NewBookingRequestDataType>()

  //Calculate estimated final price to show (actual price is calculated in server when booking is created)
  const finalAmount = getEstimatedTotalPrice(newBookingFormData)

  //Final form submit to create a new booking
  const onSubmit = async () => {
    const newBookingData: NewBookingRequestDataType = {
      source: newBookingFormData.source,
      destination: newBookingFormData.destination,
      routeId: newBookingFormData.routeId,
      sourceId: newBookingFormData.sourceId,
      destinationId: newBookingFormData.destinationId,
      type: newBookingFormData.type,
      startDate: newBookingFormData.startDate,
      endDate: newBookingFormData.endDate,
      passengers: newBookingFormData.passengers,
      needsAc: newBookingFormData.needsAc,
      assignedDriverId: newBookingFormData.assignedDriverId,
      assignedVehicleId: newBookingFormData.assignedVehicleId,
      selectedRatePerKm: newBookingFormData.selectedRatePerKm,
      citydistance: newBookingFormData.citydistance,
      selectedAcChargePerDay: newBookingFormData.selectedAcChargePerDay,
      selectedAllowancePerDay: newBookingFormData.selectedAllowancePerDay,
      selectedCommissionRate: newBookingFormData.selectedCommissionRate,
    }
    const createdBooking = await newBookingAction({
      agencyId: agencyId,
      userId: userId,
      customerId: customerId,
      data: newBookingData,
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
            <RyogoH3 color="light">{t("TotalAmount")}</RyogoH3>
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
