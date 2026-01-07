import {
  CaptionGrey,
  H4,
  H5,
  Small,
  SmallBold,
  SmallGrey,
} from "@/components/typography"
import { useTranslations } from "next-intl"
import {
  getFinalPrice,
  newBookingFormClassName,
  NewBookingFormDataType,
  newBookingHeaderClassName,
  newBookingHeaderLineClassName,
  newBookingLineItemClassName,
  newBookingLineSubtitleClassName,
  newBookingSectionClassName,
  NewBookingTotalSteps,
} from "./newBookingCommon"
import NewBookingStepsTracker from "./newBookingStepsTracker"
import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  CreateNewBookingAPIRequestType,
  CreateNewBookingAPIResponseType,
} from "@ryogo-travel-app/api/types/booking.types"
import { apiClient } from "@ryogo-travel-app/api/client/apiClient"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { BigIconTextTag } from "./newBookingTileTag"
import {
  LucideAirVent,
  LucideCar,
  LucideCirclePercent,
  LucideIdCard,
  LucideInfo,
} from "lucide-react"
import { Alert } from "@/components/ui/alert"
import NewBookingTripInfo from "./newBookingTripInfo"

type NewBookingFinalProps = {
  onPrev: () => void
  newBookingFormData: NewBookingFormDataType
  userId: string
  agencyId: string
}
export default function NewBookingFinal(props: NewBookingFinalProps) {
  const t = useTranslations("Dashboard.NewBooking.Form.Final")
  const router = useRouter()
  const form = useForm<NewBookingFormDataType>()

  //Calculate final price
  const finalAmount = getFinalPrice(props.newBookingFormData)

  //Final form submit to create a new booking
  const onSubmit = async () => {
    const newBookingData: CreateNewBookingAPIRequestType = {
      agencyId: props.agencyId,
      userId: props.userId,
      existingCustomerId: props.newBookingFormData.existingCustomer?.id,
      customerPhone: props.newBookingFormData.customerPhone!,
      newCustomerName: props.newBookingFormData.newCustomerName,
      newCustomerLocationState:
        props.newBookingFormData.newCustomerLocationState,
      newCustomerLocationCity: props.newBookingFormData.newCustomerLocationCity,
      tripSourceLocationState:
        props.newBookingFormData.tripSourceLocationState!,
      tripSourceLocationCity: props.newBookingFormData.tripSourceLocationCity!,
      tripDestinationLocationState:
        props.newBookingFormData.tripDestinationLocationState!,
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
      selectedRatePerKm: props.newBookingFormData.selectedRatePerKm!,
      selectedDistance: props.newBookingFormData.selectedDistance!,
      selectedAcChargePerDay:
        props.newBookingFormData.selectedAcChargePerDay ?? 0,
      selectedAllowancePerDay:
        props.newBookingFormData.selectedAllowancePerDay!,
      selectedCommissionRate: props.newBookingFormData.selectedCommissionRate!,
      finalAmount: finalAmount.totalAmount,
      totalDistance: finalAmount.totalDistance,
      totalVehicleRate: finalAmount.totalVehiclePrice,
      totalAcCharge: finalAmount.totalAcPrice,
      totalDriverAllowance: finalAmount.totalDriverAllowance,
      totalCommission: finalAmount.totalCommission,
    }
    const createdBooking = await apiClient<CreateNewBookingAPIResponseType>(
      "/api/new-booking",
      { method: "POST", body: JSON.stringify(newBookingData) }
    )
    if (createdBooking) {
      router.replace(`/dashboard/bookings/${createdBooking.id}/confirm`)
      toast.success(t("Success"))
    } else {
      router.replace(`/dashboard/bookings`)
      toast.error(t("Error"))
    }
  }

  return (
    <div id="FinalSection" className={newBookingSectionClassName}>
      <div id="CostHeader" className={newBookingHeaderClassName}>
        <div className={newBookingHeaderLineClassName}>
          <H4>{t("Title")}</H4>
          <CaptionGrey>{t("Subtitle")}</CaptionGrey>
        </div>
        <NewBookingStepsTracker total={NewBookingTotalSteps} current={4} />
        <SmallGrey>{t("Description")}</SmallGrey>
      </div>
      <Form {...form}>
        <form
          id="FinalForm"
          onSubmit={form.handleSubmit(onSubmit)}
          className={newBookingFormClassName}
        >
          <NewBookingTripInfo {...props.newBookingFormData} />
          <div id="finalRate" className={newBookingLineItemClassName}>
            <BigIconTextTag icon={LucideCar} text={t("VehicleCharge")} />
            <div className={newBookingLineSubtitleClassName}>
              <SmallBold>{"₹" + finalAmount.totalVehiclePrice}</SmallBold>
              <CaptionGrey>
                {t("VehicleSubtitle", {
                  charge: props.newBookingFormData.selectedRatePerKm!,
                  distance: finalAmount.totalDistance,
                })}
              </CaptionGrey>
            </div>
          </div>
          {props.newBookingFormData.tripNeedsAC && (
            <div id="finalAC" className={newBookingLineItemClassName}>
              <BigIconTextTag icon={LucideAirVent} text={t("ACCharge")} />
              <div className={newBookingLineSubtitleClassName}>
                <SmallBold>{"₹" + finalAmount.totalAcPrice}</SmallBold>
                <CaptionGrey>
                  {t("ACSubtitle", {
                    ac: props.newBookingFormData.selectedAcChargePerDay!,
                    days: finalAmount.days,
                  })}
                </CaptionGrey>
              </div>
            </div>
          )}
          <div id="finalAllowance" className={newBookingLineItemClassName}>
            <BigIconTextTag icon={LucideIdCard} text={t("DriverAllowance")} />
            <div className={newBookingLineSubtitleClassName}>
              <SmallBold>{"₹" + finalAmount.totalDriverAllowance}</SmallBold>
              <CaptionGrey>
                {t("DriverSubtitle", {
                  allowance: props.newBookingFormData.selectedAllowancePerDay!,
                  days: finalAmount.days,
                })}
              </CaptionGrey>
            </div>
          </div>
          <div id="finalCommission" className={newBookingLineItemClassName}>
            <BigIconTextTag icon={LucideCirclePercent} text={t("Commission")} />
            <div className={newBookingLineSubtitleClassName}>
              <SmallBold>{"₹" + finalAmount.totalCommission}</SmallBold>
              <CaptionGrey>
                {props.newBookingFormData.selectedCommissionRate + "%"}
              </CaptionGrey>
            </div>
          </div>
          <div className="w-full bg-slate-200 h-0.5" />
          <div id="finalPrice" className={newBookingLineItemClassName}>
            <H5>{t("TotalAmount")}</H5>
            <H4>{"₹" + finalAmount.totalAmount}</H4>
          </div>
          <div className="w-full bg-slate-200 h-0.5" />

          <Button
            variant={"default"}
            size={"lg"}
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && <Spinner />}
            {form.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")}
          </Button>
          <Button
            variant={"outline"}
            size={"lg"}
            type="button"
            onClick={props.onPrev}
            disabled={form.formState.isSubmitting}
          >
            {t("Back")}
          </Button>
          <Alert>
            <LucideInfo className="size-8 lg:size-10 text-amber-300" />
            <Small>{t("CreateInfo")}</Small>
          </Alert>
        </form>
      </Form>
    </div>
  )
}
