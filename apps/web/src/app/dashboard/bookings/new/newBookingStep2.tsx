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
import { getRouteAction } from "@/app/actions/routes/getRouteAction"
import {
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import { NewBookingFormDataType } from "@ryogo-travel-app/api/types/booking.types"
import {
  NewStepHeaderWrapper,
  NewStepTitleWrapper,
  NewStepWrapper,
  NewFormWrapper,
  NewFormContentWrapper,
  NewFormActionWrapper,
} from "@/components/form/newFormWrappers"
import { RyogoIcon } from "@/components/icons/ryogoIcon"

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
          <RyogoCaption color="light">{t("Subtitle")}</RyogoCaption>
        </NewStepTitleWrapper>
        <StepsTracker steps={"booking"} current={1} />
        <RyogoSmall color="slate">{t("Description")}</RyogoSmall>
      </NewStepHeaderWrapper>
      <NewFormWrapper<Step2Type>
        id="Step2Form"
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
              title={t("Field8.OneWay")}
              desc={t("Field8.OneWayDesc")}
            />
            <TripTypeSelectionCard
              type={BookingTypeEnum.Round}
              onClick={() => {
                setSelectedTripType(BookingTypeEnum.Round)
              }}
              selected={selectedTripType === BookingTypeEnum.Round}
              icon={ArrowRightLeft}
              title={t("Field8.RoundTrip")}
              desc={t("Field8.RoundTripDesc")}
            />

            <TripTypeSelectionCard
              type={BookingTypeEnum.MultiDay}
              onClick={() => setSelectedTripType(BookingTypeEnum.MultiDay)}
              selected={selectedTripType === BookingTypeEnum.MultiDay}
              icon={Waypoints}
              title={t("Field8.MultiDay")}
              desc={t("Field8.MultiDayDesc")}
            />
          </SectionRowWrapper>
        </NewFormContentWrapper>
        <NewFormContentWrapper>
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
      className={`flex border rounded-lg flex-col p-2 lg:p-3 gap-1.5 lg:gap-2 w-full ${
        selected
          ? "bg-sky-100 border-sky-700"
          : "border-slate-100 hover:bg-slate-50"
      }`}
    >
      <RyogoIcon icon={icon} size="md" />
      <RyogoCaption color="dark" weight="font-bold">
        {title}
      </RyogoCaption>
      <RyogoCaption color="light">{desc}</RyogoCaption>
    </div>
  )
}
