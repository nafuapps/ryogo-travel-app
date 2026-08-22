"use client"

import { RyogoH3, RyogoSmall, RyogoCaption } from "@/components/typography"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import z from "zod"
import stateCityData from "@/lib/states_cities.json"
import StepsTracker from "@/components/form/stepsTracker"
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
  ArrowRightFromLine,
  ArrowRightLeft,
  Waypoints,
  LucideIcon,
} from "lucide-react"
import { BookingTypeEnum } from "@ryogo-travel-app/db/schema"
import {
  getArrayValueDisplayPairs,
  getStringValueDisplayPairs,
} from "@/lib/utils"
import { findOrCreateRouteAction } from "@/app/actions/locations/findOrCreateRouteAction"
import {
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import { NewBookingRequestDataType } from "@ryogo-travel-app/api/types/booking.types"
import {
  NewStepHeaderWrapper,
  NewStepTitleWrapper,
  NewStepWrapper,
  NewFormWrapper,
  NewFormContentWrapper,
  NewFormActionWrapper,
} from "@/components/form/newFormWrappers"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { useRouter } from "next/navigation"
import { NEW_BOOKING_DEFAULT_DISTANCE } from "@/lib/uiConfig"
import { Separator } from "@/components/ui/separator"

export default function NewBookingStepTripDetails(props: {
  onNext: () => void
  newBookingFormData: NewBookingRequestDataType
  setNewBookingFormData: React.Dispatch<
    React.SetStateAction<NewBookingRequestDataType>
  >
}) {
  const t = useTranslations(
    "Dashboard.NewBookingWithCustomer.Form.StepTripDetails",
  )

  const router = useRouter()

  const [selectedTripType, setSelectedTripType] = useState<BookingTypeEnum>(
    props.newBookingFormData.tripType,
  )

  const stepTripDetailsSchema = z
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
      //For non one way trip, end date must be after start date
      if (
        selectedTripType !== BookingTypeEnum.OneWay &&
        data.tripEndDate < data.tripStartDate
      ) {
        ctx.addIssue({
          code: "custom",
          message: t("Field6.Error2"),
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

  type StepTripDetailsType = z.infer<typeof stepTripDetailsSchema>

  //Form init
  const form = useForm<StepTripDetailsType>({
    resolver: zodResolver(stepTripDetailsSchema),
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
  async function onSubmit(values: StepTripDetailsType) {
    //Check if the route has changed
    const routeInputsUnchanged =
      props.newBookingFormData.routeId !== undefined &&
      props.newBookingFormData.tripSourceLocationCity ===
        values.tripSourceLocationCity &&
      props.newBookingFormData.tripSourceLocationState ===
        values.tripSourceLocationState &&
      props.newBookingFormData.tripDestinationLocationCity ===
        values.tripDestinationLocationCity &&
      props.newBookingFormData.tripDestinationLocationState ===
        values.tripDestinationLocationState

    //If route has changed, fetch new route data from DB, otherwise save previous data
    const newRoute = routeInputsUnchanged
      ? {
          id: props.newBookingFormData.routeId,
          sourceId: props.newBookingFormData.sourceId,
          destinationId: props.newBookingFormData.destinationId,
          distance: props.newBookingFormData.selectedDistance,
        }
      : await findOrCreateRouteAction(
          values.tripSourceLocationCity,
          values.tripSourceLocationState,
          values.tripDestinationLocationCity,
          values.tripDestinationLocationState,
        )

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
      routeId: newRoute?.id,
      sourceId: newRoute?.sourceId,
      destinationId: newRoute?.destinationId,
      selectedDistance: newRoute?.distance ?? NEW_BOOKING_DEFAULT_DISTANCE,
    })
    props.onNext()
  }

  const data: Record<string, string[]> = stateCityData

  const selectedSourceState = useWatch({
    name: "tripSourceLocationState",
    control: form.control,
  })
  const sourceCityOptions = data[selectedSourceState] ?? [
    t("Field2.Placeholder"),
  ]

  const selectedDestinationState = useWatch({
    name: "tripDestinationLocationState",
    control: form.control,
  })
  const destinationCityOptions = data[selectedDestinationState] ?? [
    t("Field4.Placeholder"),
  ]
  return (
    <NewStepWrapper id="TripStep">
      <NewStepHeaderWrapper>
        <NewStepTitleWrapper>
          <RyogoH3>{t("Title")}</RyogoH3>
          <RyogoCaption color="light">
            {t("Subtitle", { current: 1, total: 5 })}
          </RyogoCaption>
        </NewStepTitleWrapper>
        <StepsTracker steps={"booking"} current={0} />
        <RyogoSmall color="slate">{t("Description")}</RyogoSmall>
      </NewStepHeaderWrapper>
      <NewFormWrapper<StepTripDetailsType>
        id="StepTripDetailsForm"
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <NewFormContentWrapper>
          <SectionColWrapper small>
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
          </SectionColWrapper>
          <Separator />
          <SectionColWrapper small>
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
          </SectionColWrapper>
        </NewFormContentWrapper>
        <NewFormContentWrapper>
          <RyogoSmall weight="font-bold">{t("Field8.Title")}</RyogoSmall>
          <SectionRowWrapper>
            <TripTypeSelectionCard
              type={BookingTypeEnum.OneWay}
              onClick={() => {
                setSelectedTripType(BookingTypeEnum.OneWay)
                form.setValue("tripEndDate", form.getValues("tripStartDate"))
              }}
              selected={selectedTripType === BookingTypeEnum.OneWay}
              icon={ArrowRightFromLine}
              title={BookingTypeEnum.OneWay.toUpperCase()}
              desc={t("Field8.OneWayDesc")}
            />
            <TripTypeSelectionCard
              type={BookingTypeEnum.Round}
              onClick={() => {
                setSelectedTripType(BookingTypeEnum.Round)
              }}
              selected={selectedTripType === BookingTypeEnum.Round}
              icon={ArrowRightLeft}
              title={BookingTypeEnum.Round.toUpperCase()}
              desc={t("Field8.RoundTripDesc")}
            />

            <TripTypeSelectionCard
              type={BookingTypeEnum.MultiDay}
              onClick={() => setSelectedTripType(BookingTypeEnum.MultiDay)}
              selected={selectedTripType === BookingTypeEnum.MultiDay}
              icon={Waypoints}
              title={BookingTypeEnum.MultiDay.toUpperCase()}
              desc={t("Field8.MultiDayDesc")}
            />
          </SectionRowWrapper>
        </NewFormContentWrapper>
        <NewFormContentWrapper>
          <RyogoDatePicker
            name="tripStartDate"
            label={t("Field5.Title")}
            placeholder=""
          />
          <RyogoDatePicker
            name="tripEndDate"
            label={t("Field6.Title")}
            placeholder=""
            disabled={selectedTripType === BookingTypeEnum.OneWay}
          />
        </NewFormContentWrapper>
        <NewFormContentWrapper>
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
        </NewFormContentWrapper>
        <NewFormActionWrapper>
          <Button
            variant={"default"}
            size={"lg"}
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && <Spinner />}
            <RyogoCaption color="white">
              {form.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")}
            </RyogoCaption>
          </Button>
          <Button
            variant={"outline"}
            size={"lg"}
            type="button"
            onClick={() => router.back()}
            disabled={form.formState.isSubmitting}
          >
            <RyogoCaption color="light">{t("Back")}</RyogoCaption>
          </Button>
        </NewFormActionWrapper>
      </NewFormWrapper>
    </NewStepWrapper>
  )
}

function TripTypeSelectionCard({
  type,
  onClick,
  selected,
  title,
  desc,
  icon,
}: {
  type: BookingTypeEnum
  onClick: () => void
  selected: boolean
  title: string
  desc: string
  icon: LucideIcon
}) {
  return (
    <div
      id={type}
      onClick={onClick}
      className={`flex border rounded-lg flex-col p-2 lg:p-3 gap-2 lg:gap-3 w-full transition-all ${
        selected
          ? "bg-slate-950 dark:bg-white"
          : "border hover:bg-slate-50 dark:hover:bg-slate-800 "
      }`}
    >
      <RyogoSmall weight="font-bold" color={selected ? "white" : "slate"}>
        {title}
      </RyogoSmall>
      <RyogoIcon icon={icon} size="sm" color={selected ? "white" : "slate"} />
      <RyogoCaption color={selected ? "white" : "slate"}>{desc}</RyogoCaption>
    </div>
  )
}
