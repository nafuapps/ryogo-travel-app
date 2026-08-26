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
import { useTransition } from "react"
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

type NewBookingFinalProps = {
  onPrev: () => void
  newBookingFormData: NewBookingRequestDataType
  userId: string
  agencyId: string
  customerId: string
}
export default function NewBookingFinal(props: NewBookingFinalProps) {
  const t = useTranslations("Dashboard.NewBookingWithCustomer.Form.Final")
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<NewBookingRequestDataType>()

  //Calculate estimated final price to show (actual price is calculated in server when booking is created)
  const finalAmount = getEstimatedTotalPrice(props.newBookingFormData)

  //Final form submit to create a new booking
  const onSubmit = async () => {
    startTransition(async () => {
      const newBookingData: NewBookingRequestDataType = {
        tripSourceLocationState:
          props.newBookingFormData.tripSourceLocationState,
        tripSourceLocationCity: props.newBookingFormData.tripSourceLocationCity,
        tripDestinationLocationState:
          props.newBookingFormData.tripDestinationLocationState,
        tripDestinationLocationCity:
          props.newBookingFormData.tripDestinationLocationCity!,
        routeId: props.newBookingFormData.routeId,
        sourceId: props.newBookingFormData.sourceId,
        destinationId: props.newBookingFormData.destinationId,
        tripType: props.newBookingFormData.tripType,
        tripStartDate: props.newBookingFormData.tripStartDate,
        tripEndDate: props.newBookingFormData.tripEndDate,
        tripPassengers: props.newBookingFormData.tripPassengers,
        tripNeedsAC: props.newBookingFormData.tripNeedsAC,
        assignedDriverId: props.newBookingFormData.assignedDriverId,
        assignedVehicleId: props.newBookingFormData.assignedVehicleId,
        selectedRatePerKm: props.newBookingFormData.selectedRatePerKm,
        selectedDistance: props.newBookingFormData.selectedDistance,
        selectedAcChargePerDay: props.newBookingFormData.selectedAcChargePerDay,
        selectedAllowancePerDay:
          props.newBookingFormData.selectedAllowancePerDay,
        selectedCommissionRate: props.newBookingFormData.selectedCommissionRate,
      }
      const createdBooking = await newBookingAction({
        agencyId: props.agencyId,
        userId: props.userId,
        customerId: props.customerId,
        data: newBookingData,
      })
      if (createdBooking) {
        router.replace(`/dashboard/bookings/${createdBooking.id}/confirm`)
        toast.success(t("Success"))
      } else {
        router.replace(`/dashboard/bookings`)
        toast.error(t("Error"))
      }
    })
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
        <NewBookingTripCard {...props.newBookingFormData} />
        <NewFormContentWrapper>
          <SectionRowWrapper>
            <IconTextTag icon={Car} text={t("VehicleCharge")} />
            <SectionColWrapper end small>
              <RyogoSmall weight="font-bold">
                {"₹" + finalAmount.totalVehiclePrice}
              </RyogoSmall>
              <RyogoCaption color="light">
                {t("VehicleSubtitle", {
                  charge: props.newBookingFormData.selectedRatePerKm,
                  distance: finalAmount.totalDistance,
                })}
              </RyogoCaption>
            </SectionColWrapper>
          </SectionRowWrapper>
          {props.newBookingFormData.tripNeedsAC && (
            <SectionRowWrapper>
              <IconTextTag icon={AirVent} text={t("ACCharge")} />
              <SectionColWrapper end small>
                <RyogoSmall weight="font-bold">
                  {"₹" + finalAmount.totalAcPrice}
                </RyogoSmall>
                <RyogoCaption color="light">
                  {t("ACSubtitle", {
                    ac: props.newBookingFormData.selectedAcChargePerDay,
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
                  allowance: props.newBookingFormData.selectedAllowancePerDay,
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
                {props.newBookingFormData.selectedCommissionRate + "%"}
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
            disabled={isPending}
            showSpinner={isPending}
            label={isPending ? t("Loading") : t("PrimaryCTA")}
          />
          <RyogoOutlineButton
            size={"lg"}
            type="button"
            onClick={props.onPrev}
            disabled={isPending}
            label={t("Back")}
          />
        </NewFormActionWrapper>
      </NewFormWrapper>
    </NewStepWrapper>
  )
}
