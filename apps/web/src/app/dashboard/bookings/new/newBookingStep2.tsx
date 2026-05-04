import {
  CaptionBold,
  CaptionGrey,
  H4,
  SmallBold,
  SmallGrey,
} from "@/components/typography"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import {
  getTripTypeClassName,
  newBookingActionBlockClassName,
  newBookingFormBlockClassName,
  newBookingFormClassName,
  NewBookingFormDataType,
  newBookingHeaderClassName,
  newBookingHeaderLineClassName,
  newBookingSectionClassName,
  NewBookingTotalSteps,
} from "./newBookingCommon"
import stateCityData from "@/lib/states_cities.json"
import StepsTracker from "@/components/form/stepsTracker"
import { Form } from "@/components/ui/form"
import {
  RyogoCombobox,
  RyogoDatePicker,
  RyogoInput,
  RyogoSwitch,
  RyogoTextarea,
} from "@/components/form/ryogoFormFields"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  LucideArrowRightFromLine,
  LucideArrowRightLeft,
  LucideWaypoints,
} from "lucide-react"
import { BookingTypeEnum } from "@ryogo-travel-app/db/schema"
import {
  getArrayValueDisplayPairs,
  getStringValueDisplayPairs,
} from "@/lib/utils"
import { getRouteAction } from "@/app/actions/routes/getRouteAction"

type NewBookingStep2Props = {
  onNext: () => void
  onPrev: () => void
  newBookingFormData: NewBookingFormDataType
  setNewBookingFormData: React.Dispatch<
    React.SetStateAction<NewBookingFormDataType>
  >
}
export default function NewBookingStep2(props: NewBookingStep2Props) {
  const t = useTranslations("Dashboard.NewBooking.Form.Step2")
  const [selectedTripType, setSelectedTripType] = useState<BookingTypeEnum>(
    props.newBookingFormData.tripType,
  )

  const step2Schema = z
    .object({
      //Trip
      tripSourceLocationState: z.string().min(1, t("Field1.Error1")),
      tripSourceLocationCity: z
        .string(t("Field2.Error1"))
        .min(1, t("Field2.Error1")),
      tripDestinationLocationState: z.string().min(1, t("Field3.Error1")),
      tripDestinationLocationCity: z
        .string(t("Field4.Error1"))
        .min(1, t("Field4.Error1")),
      tripType: z.enum(BookingTypeEnum),
      tripStartDate: z.date(t("Field5.Error1")).nonoptional(t("Field5.Error1")),
      tripEndDate: z.date(t("Field6.Error1")),
      tripPassengers: z.coerce
        .number<number>(t("Field7.Error1"))
        .min(0, t("Field7.Error2"))
        .max(100, t("Field7.Error3"))
        .multipleOf(1, t("Field7.Error4"))
        .nonnegative(t("Field7.Error5")),
      tripNeedsAC: z.boolean(),
      tripRemarks: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      //Start date cannot be after end date
      if (data.tripStartDate > data.tripEndDate) {
        ctx.addIssue({
          code: "custom",
          message: t("Field6.Error2"),
          path: ["tripEndDate"],
        })
      }
      //For Multi day trip, end date must be after start date
      if (
        selectedTripType === BookingTypeEnum.MultiDay &&
        data.tripEndDate <= data.tripStartDate
      ) {
        ctx.addIssue({
          code: "custom",
          message: t("Field6.Error3"),
          path: ["tripEndDate"],
        })
      }
      //Source and destination cannot be the same
      if (
        data.tripSourceLocationState === data.tripDestinationLocationState &&
        data.tripSourceLocationCity === data.tripDestinationLocationCity
      ) {
        ctx.addIssue({
          code: "custom",
          message: t("Field4.Error2"),
          path: ["tripDestinationLocationCity"],
        })
      }
    })

  type Step2Type = z.infer<typeof step2Schema>

  //Form init
  const form = useForm<Step2Type>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      tripSourceLocationState: props.newBookingFormData.tripSourceLocationState,
      tripSourceLocationCity: props.newBookingFormData.tripSourceLocationCity,
      tripDestinationLocationState:
        props.newBookingFormData.tripDestinationLocationState,
      tripDestinationLocationCity:
        props.newBookingFormData.tripDestinationLocationCity,
      tripType: props.newBookingFormData.tripType,
      tripStartDate: props.newBookingFormData.tripStartDate,
      tripEndDate: props.newBookingFormData.tripEndDate,
      tripPassengers: props.newBookingFormData.tripPassengers,
      tripNeedsAC: props.newBookingFormData.tripNeedsAC,
      tripRemarks: props.newBookingFormData.tripRemarks,
    },
  })

  //Form submit
  async function onSubmit(values: Step2Type) {
    let newRoute
    if (
      values.tripDestinationLocationCity !==
        props.newBookingFormData.tripDestinationLocationCity ||
      values.tripDestinationLocationState !==
        props.newBookingFormData.tripDestinationLocationState ||
      values.tripSourceLocationCity !==
        props.newBookingFormData.tripSourceLocationCity ||
      values.tripSourceLocationState !==
        props.newBookingFormData.tripSourceLocationState
    ) {
      //If route info has changed, fetch route data
      newRoute = await getRouteAction(
        values.tripSourceLocationCity,
        values.tripSourceLocationState,
        values.tripDestinationLocationCity,
        values.tripDestinationLocationState,
      )
    }
    if (newRoute) {
      props.setNewBookingFormData({
        ...props.newBookingFormData,
        tripSourceLocationState: values.tripSourceLocationState,
        tripSourceLocationCity: values.tripSourceLocationCity,
        tripDestinationLocationState: values.tripDestinationLocationState,
        tripDestinationLocationCity: values.tripDestinationLocationCity,
        tripType: selectedTripType,
        tripStartDate: values.tripStartDate,
        tripEndDate:
          selectedTripType === BookingTypeEnum.OneWay
            ? values.tripStartDate
            : values.tripEndDate,
        tripPassengers: values.tripPassengers,
        tripNeedsAC: values.tripNeedsAC,
        routeId: newRoute.id,
        sourceId: newRoute.sourceId,
        destinationId: newRoute.destinationId,
        selectedDistance: newRoute.distance,
      })
    } else {
      props.setNewBookingFormData({
        ...props.newBookingFormData,
        tripSourceLocationState: values.tripSourceLocationState,
        tripSourceLocationCity: values.tripSourceLocationCity,
        tripDestinationLocationState: values.tripDestinationLocationState,
        tripDestinationLocationCity: values.tripDestinationLocationCity,
        tripType: selectedTripType,
        tripStartDate: values.tripStartDate,
        tripEndDate:
          selectedTripType === BookingTypeEnum.OneWay
            ? values.tripStartDate
            : values.tripEndDate,
        tripPassengers: values.tripPassengers,
        tripNeedsAC: values.tripNeedsAC,
      })
    }
    props.onNext()
  }

  const data: Record<string, string[]> = stateCityData

  const selectedSourceState = form.watch("tripSourceLocationState")
  const sourceCityOptions = data[selectedSourceState] ?? [
    t("Field2.Placeholder"),
  ]

  const selectedDestinationState = form.watch("tripDestinationLocationState")
  const destinationCityOptions = data[selectedDestinationState] ?? [
    t("Field4.Placeholder"),
  ]
  return (
    <div id="TripSection" className={newBookingSectionClassName}>
      <div id="TripHeader" className={newBookingHeaderClassName}>
        <div className={newBookingHeaderLineClassName}>
          <H4>{t("Title")}</H4>
          <CaptionGrey>{t("Subtitle")}</CaptionGrey>
        </div>
        <StepsTracker total={NewBookingTotalSteps} current={1} />
        <SmallGrey>{t("Description")}</SmallGrey>
      </div>
      <Form {...form}>
        <form
          id="Step2Form"
          onSubmit={form.handleSubmit(onSubmit)}
          className={newBookingFormClassName}
        >
          <div id="routeSelection" className={newBookingFormBlockClassName}>
            <div
              id="tripSource"
              className="flex flex-col w-full gap-1 lg:gap-1.5"
            >
              <RyogoCombobox
                name="tripSourceLocationState"
                title={t("Field1.Title")}
                array={getArrayValueDisplayPairs(stateCityData)}
                register={form.register("tripSourceLocationState")}
                placeholder={t("Field1.Placeholder")}
                resetField={() => {
                  form.setValue("tripSourceLocationCity", "")
                }}
              />
              <RyogoCombobox
                name="tripSourceLocationCity"
                array={getStringValueDisplayPairs(sourceCityOptions)}
                register={form.register("tripSourceLocationCity")}
                placeholder={t("Field2.Placeholder")}
              />
            </div>
            <div
              id="tripDestination"
              className="flex flex-col w-full gap-1 lg:gap-1.5"
            >
              <RyogoCombobox
                name="tripDestinationLocationState"
                title={t("Field3.Title")}
                array={getArrayValueDisplayPairs(stateCityData)}
                register={form.register("tripDestinationLocationState")}
                placeholder={t("Field3.Placeholder")}
                resetField={() => {
                  form.setValue("tripDestinationLocationCity", "")
                }}
              />
              <RyogoCombobox
                name="tripDestinationLocationCity"
                array={getStringValueDisplayPairs(destinationCityOptions)}
                register={form.register("tripDestinationLocationCity")}
                placeholder={t("Field4.Placeholder")}
              />
            </div>
          </div>
          <div id="typeSelection" className={newBookingFormBlockClassName}>
            <SmallBold>{t("Field8.Title")}</SmallBold>
            <div className="flex flex-row gap-2 lg:gap-3">
              <div
                id={BookingTypeEnum.OneWay}
                onClick={() => {
                  setSelectedTripType(BookingTypeEnum.OneWay)
                  form.setValue("tripEndDate", form.getValues("tripStartDate"))
                }}
                className={getTripTypeClassName(
                  selectedTripType === BookingTypeEnum.OneWay,
                )}
              >
                <LucideArrowRightFromLine className="size-6 lg:size-7 stroke-1 text-slate-700" />
                <CaptionBold>{t("Field8.OneWay")}</CaptionBold>
                <CaptionGrey>{t("Field8.OneWayDesc")}</CaptionGrey>
              </div>
              <div
                id={BookingTypeEnum.Round}
                onClick={() => setSelectedTripType(BookingTypeEnum.Round)}
                className={getTripTypeClassName(
                  selectedTripType === BookingTypeEnum.Round,
                )}
              >
                <LucideArrowRightLeft className="size-6 lg:size-7 stroke-1 text-slate-700" />
                <CaptionBold>{t("Field8.RoundTrip")}</CaptionBold>
                <CaptionGrey>{t("Field8.RoundTripDesc")}</CaptionGrey>
              </div>
              <div
                id={BookingTypeEnum.MultiDay}
                onClick={() => setSelectedTripType(BookingTypeEnum.MultiDay)}
                className={getTripTypeClassName(
                  selectedTripType === BookingTypeEnum.MultiDay,
                )}
              >
                <LucideWaypoints className="size-6 lg:size-7 stroke-1 text-slate-700" />
                <CaptionBold>{t("Field8.MultiDay")}</CaptionBold>
                <CaptionGrey>{t("Field8.MultiDayDesc")}</CaptionGrey>
              </div>
            </div>
          </div>
          <div id="dateSelection" className={newBookingFormBlockClassName}>
            <RyogoDatePicker
              name="tripStartDate"
              label={t("Field5.Title")}
              description=""
              placeholder=""
            />
            <RyogoDatePicker
              name="tripEndDate"
              label={t("Field6.Title")}
              description=""
              placeholder=""
              disabled={selectedTripType === BookingTypeEnum.OneWay}
            />
          </div>
          <div
            id="passengerPreference"
            className={newBookingFormBlockClassName}
          >
            <RyogoInput
              name="tripPassengers"
              label={t("Field7.Title")}
              placeholder={t("Field7.Placeholder")}
              type="tel"
            />
            <RyogoSwitch label={t("Field9.Title")} name="tripNeedsAC" />
            <RyogoTextarea
              name="tripRemarks"
              label={t("Field10.Title")}
              placeholder={t("Field10.Placeholder")}
            />
          </div>
          <div id="NewBookingAction" className={newBookingActionBlockClassName}>
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
          </div>
        </form>
      </Form>
    </div>
  )
}
