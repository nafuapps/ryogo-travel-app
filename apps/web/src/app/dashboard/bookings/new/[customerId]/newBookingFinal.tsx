"use client"

import {
  RyogoH3,
  RyogoH4,
  RyogoSmall,
  RyogoCaption,
} from "@/components/typography"
import { useTranslations } from "next-intl"
import StepsTracker from "@/components/form/stepsTracker"
import { useForm } from "react-hook-form"
import { NewBookingRequestDataType } from "@ryogo-travel-app/api/types/booking.types"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { IconTextTag } from "@/components/tags/IconTextTag"
import { Info, AirVent, Car, CirclePercent, IdCard } from "lucide-react"
import { Alert } from "@/components/ui/alert"
import NewBookingTripCard from "@/components/flows/bookings/new/newBookingTripCard"
import { newBookingAction } from "@/app/actions/bookings/newBookingAction"
import {
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import {
  NewStepHeaderWrapper,
  NewStepTitleWrapper,
  NewStepWrapper,
  NewFormWrapper,
  NewFormContentWrapper,
  NewFormActionWrapper,
} from "@/components/form/newFormWrappers"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { getEstimatedTotalPrice } from "@/lib/utils"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"

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
      tripSourceLocationState: newBookingFormData.tripSourceLocationState,
      tripSourceLocationCity: newBookingFormData.tripSourceLocationCity,
      tripDestinationLocationState:
        newBookingFormData.tripDestinationLocationState,
      tripDestinationLocationCity:
        newBookingFormData.tripDestinationLocationCity!,
      routeId: newBookingFormData.routeId,
      sourceId: newBookingFormData.sourceId,
      destinationId: newBookingFormData.destinationId,
      tripType: newBookingFormData.tripType,
      tripStartDate: newBookingFormData.tripStartDate,
      tripEndDate: newBookingFormData.tripEndDate,
      tripPassengers: newBookingFormData.tripPassengers,
      tripNeedsAC: newBookingFormData.tripNeedsAC,
      assignedDriverId: newBookingFormData.assignedDriverId,
      assignedVehicleId: newBookingFormData.assignedVehicleId,
      selectedRatePerKm: newBookingFormData.selectedRatePerKm,
      selectedDistance: newBookingFormData.selectedDistance,
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
      router.replace(`/dashboard/bookings/${createdBooking.id}/confirm`)
      toast.success(t("Success"))
    } else {
      router.replace(`/dashboard/bookings`)
      toast.error(t("Error"))
    }
  }

  return (
    <NewStepWrapper id="FinalStep">
      <NewStepHeaderWrapper>
        <NewStepTitleWrapper>
          <RyogoH3>{t("Title")}</RyogoH3>
          <RyogoCaption color="light">
            {t("Subtitle", { current: 5, total: 5 })}
          </RyogoCaption>
        </NewStepTitleWrapper>
        <StepsTracker steps={"booking"} current={4} />
        <RyogoSmall color="slate">{t("Description")}</RyogoSmall>
      </NewStepHeaderWrapper>
      <NewFormWrapper<NewBookingRequestDataType>
        id="FinalForm"
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <NewBookingTripCard {...newBookingFormData} />
        <NewFormContentWrapper>
          <SectionRowWrapper>
            <IconTextTag icon={Car} text={t("VehicleCharge")} />
            <SectionColWrapper end small>
              <RyogoSmall weight="font-bold">
                {"₹" + finalAmount.totalVehiclePrice}
              </RyogoSmall>
              <RyogoCaption color="light">
                {t("VehicleSubtitle", {
                  charge: newBookingFormData.selectedRatePerKm,
                  distance: finalAmount.totalDistance,
                })}
              </RyogoCaption>
            </SectionColWrapper>
          </SectionRowWrapper>
          {newBookingFormData.tripNeedsAC && (
            <SectionRowWrapper>
              <IconTextTag icon={AirVent} text={t("ACCharge")} />
              <SectionColWrapper end small>
                <RyogoSmall weight="font-bold">
                  {"₹" + finalAmount.totalAcPrice}
                </RyogoSmall>
                <RyogoCaption color="light">
                  {t("ACSubtitle", {
                    ac: newBookingFormData.selectedAcChargePerDay,
                    days: finalAmount.totalAllowanceDays,
                  })}
                </RyogoCaption>
              </SectionColWrapper>
            </SectionRowWrapper>
          )}
          <SectionRowWrapper>
            <IconTextTag icon={IdCard} text={t("DriverAllowance")} />
            <SectionColWrapper end small>
              <RyogoSmall weight="font-bold">
                {"₹" + finalAmount.totalDriverAllowance}
              </RyogoSmall>
              <RyogoCaption color="light">
                {t("DriverSubtitle", {
                  allowance: newBookingFormData.selectedAllowancePerDay,
                  days: finalAmount.totalAllowanceDays,
                })}
              </RyogoCaption>
            </SectionColWrapper>
          </SectionRowWrapper>
          <SectionRowWrapper>
            <IconTextTag icon={CirclePercent} text={t("Commission")} />
            <SectionColWrapper end small>
              <RyogoSmall weight="font-bold">
                {"₹" + finalAmount.totalCommission}
              </RyogoSmall>
              <RyogoCaption color="light">
                {newBookingFormData.selectedCommissionRate + "%"}
              </RyogoCaption>
            </SectionColWrapper>
          </SectionRowWrapper>
        </NewFormContentWrapper>
        <SectionRowWrapper>
          <RyogoH4>{t("TotalAmount")}</RyogoH4>
          <RyogoH3>{"₹" + finalAmount.totalAmount}</RyogoH3>
        </SectionRowWrapper>
        <Alert>
          <RyogoIcon icon={Info} size="sm" />
          <RyogoCaption color="light">{t("CreateInfo")}</RyogoCaption>
        </Alert>
        <NewFormActionWrapper>
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
        </NewFormActionWrapper>
      </NewFormWrapper>
    </NewStepWrapper>
  )
}
