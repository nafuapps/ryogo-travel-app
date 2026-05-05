"use client"

import {
  CaptionGrey,
  H4,
  H5,
  SmallBold,
  SmallGrey,
} from "@/components/typography"
import { useTranslations } from "next-intl"
import {
  NewBookingFormDataType,
  NewBookingTotalSteps,
} from "./newBookingCommon"
import StepsTracker from "@/components/form/stepsTracker"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { CreateNewBookingRequestType } from "@ryogo-travel-app/api/types/booking.types"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { IconTextTag } from "@/components/tags/IconTextTag"
import { Info, AirVent, Car, CirclePercent, IdCard } from "lucide-react"
import { Alert } from "@/components/ui/alert"
import NewBookingTripInfo from "./newBookingTripInfo"
import { newBookingAction } from "@/app/actions/bookings/newBookingAction"
import { useTransition } from "react"
import { getEstimatedTotalPrice } from "@/lib/utils"
import {
  NewFormActionWrapper,
  NewFormContentWrapper,
  NewFormWrapper,
  NewStepHeaderWrapper,
  NewStepTitleWrapper,
  NewStepWrapper,
} from "@/components/page/pageWrappers"

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
          <H4>{t("Title")}</H4>
          <CaptionGrey>{t("Subtitle")}</CaptionGrey>
        </NewStepTitleWrapper>
        <StepsTracker total={NewBookingTotalSteps} current={4} />
        <SmallGrey>{t("Description")}</SmallGrey>
      </NewStepHeaderWrapper>
      <NewFormWrapper<NewBookingFormDataType>
        id="FinalForm"
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <NewBookingTripInfo {...props.newBookingFormData} />
        <NewFormContentWrapper>
          <NewFormLineItemWrapper>
            <IconTextTag icon={Car} text={t("VehicleCharge")} />
            <NewFormLineItemSubtitleWrapper>
              <SmallBold>{"₹" + finalAmount.totalVehiclePrice}</SmallBold>
              <CaptionGrey>
                {t("VehicleSubtitle", {
                  charge: props.newBookingFormData.selectedRatePerKm!,
                  distance: finalAmount.totalDistance,
                })}
              </CaptionGrey>
            </NewFormLineItemSubtitleWrapper>
          </NewFormLineItemWrapper>
          {props.newBookingFormData.tripNeedsAC && (
            <NewFormLineItemWrapper>
              <IconTextTag icon={AirVent} text={t("ACCharge")} />
              <NewFormLineItemSubtitleWrapper>
                <SmallBold>{"₹" + finalAmount.totalAcPrice}</SmallBold>
                <CaptionGrey>
                  {t("ACSubtitle", {
                    ac: props.newBookingFormData.selectedAcChargePerDay!,
                    days: finalAmount.totalAllowanceDays,
                  })}
                </CaptionGrey>
              </NewFormLineItemSubtitleWrapper>
            </NewFormLineItemWrapper>
          )}
          <NewFormLineItemWrapper>
            <IconTextTag icon={IdCard} text={t("DriverAllowance")} />
            <NewFormLineItemSubtitleWrapper>
              <SmallBold>{"₹" + finalAmount.totalDriverAllowance}</SmallBold>
              <CaptionGrey>
                {t("DriverSubtitle", {
                  allowance: props.newBookingFormData.selectedAllowancePerDay!,
                  days: finalAmount.totalAllowanceDays,
                })}
              </CaptionGrey>
            </NewFormLineItemSubtitleWrapper>
          </NewFormLineItemWrapper>
          <NewFormLineItemWrapper>
            <IconTextTag icon={CirclePercent} text={t("Commission")} />
            <NewFormLineItemSubtitleWrapper>
              <SmallBold>{"₹" + finalAmount.totalCommission}</SmallBold>
              <CaptionGrey>
                {props.newBookingFormData.selectedCommissionRate + "%"}
              </CaptionGrey>
            </NewFormLineItemSubtitleWrapper>
          </NewFormLineItemWrapper>
        </NewFormContentWrapper>
        <NewFormLineItemWrapper>
          <H5>{t("TotalAmount")}</H5>
          <H4>{"₹" + finalAmount.totalAmount}</H4>
        </NewFormLineItemWrapper>
        <Alert>
          <Info className="size-5 lg:size-6 text-slate-500" />
          <CaptionGrey>{t("CreateInfo")}</CaptionGrey>
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
    <div className="flex flex-row justify-between items-start gap-2 lg:gap-3">
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
