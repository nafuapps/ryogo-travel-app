"use client"

import {
  RyogoH3,
  RyogoH4,
  RyogoSmall,
  RyogoCaption,
} from "@/components/typography"
import { useTranslations } from "next-intl"
import StepsTracker, {
  NewBookingTotalSteps,
} from "@/components/form/stepsTracker"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  CreateNewBookingRequestType,
  NewBookingFormDataType,
} from "@ryogo-travel-app/api/types/booking.types"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { IconTextTag } from "@/components/tags/IconTextTag"
import { Info, AirVent, Car, CirclePercent, IdCard } from "lucide-react"
import { Alert } from "@/components/ui/alert"
import NewBookingTripCard from "@/components/bookings/newBookingTripCard"
import { newBookingAction } from "@/app/actions/bookings/newBookingAction"
import { useTransition } from "react"
import { getEstimatedTotalPrice } from "@/lib/utils"
import {
  NewStepHeaderWrapper,
  NewStepTitleWrapper,
  NewStepWrapper,
} from "@/components/page/pageWrappers"
import {
  NewFormWrapper,
  NewFormContentWrapper,
  NewFormActionWrapper,
} from "@/components/form/newFormWrappers"
import { RyogoIcon } from "@/components/icons/RyogoIcon"

type NewBookingFinalProps = {
  onPrev: () => void
  newBookingFormData: NewBookingFormDataType
  userId: string
  agencyId: string
}
export default function NewBookingFinal(props: NewBookingFinalProps) {
  const t = useTranslations("Dashboard.NewBooking.Form.Final")
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<NewBookingFormDataType>()

  //Calculate estimated final price to show (actual price is calculated in server when booking is created)
  const finalAmount = getEstimatedTotalPrice(props.newBookingFormData)

  //Final form submit to create a new booking
  const onSubmit = async () => {
    startTransition(async () => {
      const newBookingData: CreateNewBookingRequestType = {
        agencyId: props.agencyId,
        userId: props.userId,
        existingCustomerId: props.newBookingFormData.existingCustomer
          ? props.newBookingFormData.existingCustomer.id
          : undefined,
        customerPhone: props.newBookingFormData.customerPhone,
        newCustomerName: props.newBookingFormData.newCustomerName,
        newCustomerLocationState:
          props.newBookingFormData.newCustomerLocationState,
        newCustomerLocationCity:
          props.newBookingFormData.newCustomerLocationCity,
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
        selectedRatePerKm: props.newBookingFormData.selectedRatePerKm ?? 18,
        selectedDistance: props.newBookingFormData.selectedDistance ?? 1,
        selectedAcChargePerDay:
          props.newBookingFormData.selectedAcChargePerDay ?? 0,
        selectedAllowancePerDay:
          props.newBookingFormData.selectedAllowancePerDay ?? 0,
        selectedCommissionRate:
          props.newBookingFormData.selectedCommissionRate ?? 0,
      }
      const createdBooking = await newBookingAction(newBookingData)
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
          <RyogoCaption color="light">{t("Subtitle")}</RyogoCaption>
        </NewStepTitleWrapper>
        <StepsTracker total={NewBookingTotalSteps} current={4} />
        <RyogoSmall color="slate">{t("Description")}</RyogoSmall>
      </NewStepHeaderWrapper>
      <NewFormWrapper<NewBookingFormDataType>
        id="FinalForm"
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <NewBookingTripCard {...props.newBookingFormData} />
        <NewFormContentWrapper>
          <NewFormLineItemWrapper>
            <IconTextTag icon={Car} text={t("VehicleCharge")} />
            <NewFormLineItemSubtitleWrapper>
              <RyogoSmall weight="font-bold">
                {"₹" + finalAmount.totalVehiclePrice}
              </RyogoSmall>
              <RyogoCaption color="light">
                {t("VehicleSubtitle", {
                  charge: props.newBookingFormData.selectedRatePerKm!,
                  distance: finalAmount.totalDistance,
                })}
              </RyogoCaption>
            </NewFormLineItemSubtitleWrapper>
          </NewFormLineItemWrapper>
          {props.newBookingFormData.tripNeedsAC && (
            <NewFormLineItemWrapper>
              <IconTextTag icon={AirVent} text={t("ACCharge")} />
              <NewFormLineItemSubtitleWrapper>
                <RyogoSmall weight="font-bold">
                  {"₹" + finalAmount.totalAcPrice}
                </RyogoSmall>
                <RyogoCaption color="light">
                  {t("ACSubtitle", {
                    ac: props.newBookingFormData.selectedAcChargePerDay!,
                    days: finalAmount.totalAllowanceDays,
                  })}
                </RyogoCaption>
              </NewFormLineItemSubtitleWrapper>
            </NewFormLineItemWrapper>
          )}
          <NewFormLineItemWrapper>
            <IconTextTag icon={IdCard} text={t("DriverAllowance")} />
            <NewFormLineItemSubtitleWrapper>
              <RyogoSmall weight="font-bold">
                {"₹" + finalAmount.totalDriverAllowance}
              </RyogoSmall>
              <RyogoCaption color="light">
                {t("DriverSubtitle", {
                  allowance: props.newBookingFormData.selectedAllowancePerDay!,
                  days: finalAmount.totalAllowanceDays,
                })}
              </RyogoCaption>
            </NewFormLineItemSubtitleWrapper>
          </NewFormLineItemWrapper>
          <NewFormLineItemWrapper>
            <IconTextTag icon={CirclePercent} text={t("Commission")} />
            <NewFormLineItemSubtitleWrapper>
              <RyogoSmall weight="font-bold">
                {"₹" + finalAmount.totalCommission}
              </RyogoSmall>
              <RyogoCaption color="light">
                {props.newBookingFormData.selectedCommissionRate + "%"}
              </RyogoCaption>
            </NewFormLineItemSubtitleWrapper>
          </NewFormLineItemWrapper>
        </NewFormContentWrapper>
        <NewFormLineItemWrapper>
          <RyogoH4>{t("TotalAmount")}</RyogoH4>
          <RyogoH3>{"₹" + finalAmount.totalAmount}</RyogoH3>
        </NewFormLineItemWrapper>
        <Alert>
          <RyogoIcon icon={Info} size="sm" />
          <RyogoCaption color="light">{t("CreateInfo")}</RyogoCaption>
        </Alert>
        <NewFormActionWrapper>
          <Button
            variant={"default"}
            size={"lg"}
            type="submit"
            disabled={isPending}
          >
            {isPending && <Spinner />}
            {isPending ? t("Loading") : t("PrimaryCTA")}
          </Button>
          <Button
            variant={"outline"}
            size={"lg"}
            type="button"
            onClick={props.onPrev}
            disabled={isPending}
          >
            {t("Back")}
          </Button>
        </NewFormActionWrapper>
      </NewFormWrapper>
    </NewStepWrapper>
  )
}

function NewFormLineItemWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row justify-between gap-2 lg:gap-3">
      {children}
    </div>
  )
}

function NewFormLineItemSubtitleWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-end gap-0.5 lg:gap-1">{children}</div>
  )
}
