"use client"

import { RyogoSmall, RyogoCaption } from "@/components/typography"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import z from "zod"
import stateCityData from "@/lib/states_cities.json"
import {
  RyogoCombobox,
  RyogoDatePicker,
  RyogoInput,
  RyogoSwitch,
  RyogoTextarea,
} from "@/components/form/ryogoFormFields"
import { BookingTypeEnum } from "@ryogo-travel-app/db/schema"
import {
  getArrayValueDisplayPairs,
  getStringValueDisplayPairs,
} from "@/lib/utils"
import { findOrCreateRouteAction } from "@/app/actions/locations/findOrCreateRouteAction"
import {
  FormContentWrapper,
  FormWrapper,
  PageWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { NewBookingRequestDataType } from "@ryogo-travel-app/api/types/booking.types"
import { useRouter } from "next/navigation"
import {
  MAX_FIELD_DESC_LENGTH,
  MAX_VEHICLE_CAPCITY,
  MIN_VEHICLE_CAPCITY,
  NEW_BOOKING_DEFAULT_DISTANCE,
  NewBookingTotalSteps,
} from "@/lib/uiConfig"
import { Separator } from "@/components/ui/separator"
import { differenceInDays } from "date-fns"
import GetTripTypeIcon from "@/components/icons/tripTypeIcon"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import FormStepHeader from "@/components/form/formStepHeader"

export default function NewBookingStepTripDetails({
  onNext,
  newBookingFormData,
  setNewBookingFormData,
}: {
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
    newBookingFormData.tripType,
  )

  const stepTripDetailsSchema = z
    .object({
      //Trip
      tripSourceLocationState: z.string().nonoptional(t("Field1.Error1")),
      tripSourceLocationCity: z
        .string(t("Field2.Error1"))
        .nonoptional(t("Field2.Error1")),
      tripDestinationLocationState: z.string().nonoptional(t("Field3.Error1")),
      tripDestinationLocationCity: z
        .string(t("Field4.Error1"))
        .nonoptional(t("Field4.Error1")),
      tripStartDate: z.date(t("Field5.Error1")).nonoptional(t("Field5.Error1")),
      tripEndDate: z.date(t("Field6.Error1")),
      tripPassengers: z.coerce
        .number<number>(t("Field7.Error1"))
        .min(MIN_VEHICLE_CAPCITY, t("Field7.Error2"))
        .max(MAX_VEHICLE_CAPCITY, t("Field7.Error3"))
        .multipleOf(1, t("Field7.Error4"))
        .nonnegative(t("Field7.Error5")),
      tripType: z.enum(BookingTypeEnum),
      tripNeedsAC: z.boolean(),
      tripRemarks: z
        .string()
        .max(MAX_FIELD_DESC_LENGTH, t("Field10.Error1"))
        .optional(),
    })
    .superRefine((data, ctx) => {
      //For round and multi day trip, end date must be after start date
      if (
        (selectedTripType === BookingTypeEnum.Round &&
          differenceInDays(data.tripEndDate, data.tripStartDate) < 0) ||
        (selectedTripType === BookingTypeEnum.MultiDay &&
          differenceInDays(data.tripEndDate, data.tripStartDate) < 1)
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
      tripSourceLocationState: newBookingFormData.tripSourceLocationState,
      tripSourceLocationCity: newBookingFormData.tripSourceLocationCity,
      tripDestinationLocationState:
        newBookingFormData.tripDestinationLocationState,
      tripDestinationLocationCity:
        newBookingFormData.tripDestinationLocationCity,
      tripType: newBookingFormData.tripType,
      tripStartDate: newBookingFormData.tripStartDate,
      tripEndDate: newBookingFormData.tripEndDate,
      tripPassengers: newBookingFormData.tripPassengers,
      tripNeedsAC: newBookingFormData.tripNeedsAC,
      tripRemarks: newBookingFormData.tripRemarks,
    },
  })

  //Form submit
  async function onSubmit(values: StepTripDetailsType) {
    //Check if the route has changed
    const routeInputsUnchanged =
      newBookingFormData.routeId !== undefined &&
      newBookingFormData.tripSourceLocationCity ===
        values.tripSourceLocationCity &&
      newBookingFormData.tripSourceLocationState ===
        values.tripSourceLocationState &&
      newBookingFormData.tripDestinationLocationCity ===
        values.tripDestinationLocationCity &&
      newBookingFormData.tripDestinationLocationState ===
        values.tripDestinationLocationState

    //If route has changed, fetch new route data from DB, otherwise save previous data
    const newRoute = routeInputsUnchanged
      ? {
          id: newBookingFormData.routeId,
          sourceId: newBookingFormData.sourceId,
          destinationId: newBookingFormData.destinationId,
          distance: newBookingFormData.selectedDistance,
        }
      : await findOrCreateRouteAction(
          values.tripSourceLocationCity,
          values.tripSourceLocationState,
          values.tripDestinationLocationCity,
          values.tripDestinationLocationState,
        )

    setNewBookingFormData({
      ...newBookingFormData,
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
    onNext()
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
    <PageWrapper id="TripStep">
      <FormStepHeader
        totalSteps={NewBookingTotalSteps}
        currentStepIndex={0}
        title={t("Title")}
        stepLabel={t("Subtitle", {
          current: 1,
          total: NewBookingTotalSteps,
        })}
        description={t("Description")}
      />
      <FormWrapper<StepTripDetailsType>
        id="StepTripDetailsForm"
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormContentWrapper>
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
          <Separator />
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
        </FormContentWrapper>
        <FormContentWrapper>
          <RyogoSmall weight="font-bold">{t("Field8.Title")}</RyogoSmall>
          <div className="flex flex-col lg:flex-row w-full gap-2 lg:gap-3">
            <TripTypeSelectionCard
              type={BookingTypeEnum.OneWay}
              onClick={() => {
                setSelectedTripType(BookingTypeEnum.OneWay)
                form.setValue("tripEndDate", form.getValues("tripStartDate"))
              }}
              selected={selectedTripType === BookingTypeEnum.OneWay}
              title={BookingTypeEnum.OneWay.toUpperCase()}
              desc={t("Field8.OneWayDesc")}
            />
            <TripTypeSelectionCard
              type={BookingTypeEnum.Round}
              onClick={() => {
                setSelectedTripType(BookingTypeEnum.Round)
              }}
              selected={selectedTripType === BookingTypeEnum.Round}
              title={BookingTypeEnum.Round.toUpperCase()}
              desc={t("Field8.RoundTripDesc")}
            />

            <TripTypeSelectionCard
              type={BookingTypeEnum.MultiDay}
              onClick={() => setSelectedTripType(BookingTypeEnum.MultiDay)}
              selected={selectedTripType === BookingTypeEnum.MultiDay}
              title={BookingTypeEnum.MultiDay.toUpperCase()}
              desc={t("Field8.MultiDayDesc")}
            />
          </div>
        </FormContentWrapper>
        <FormContentWrapper>
          <RyogoDatePicker
            name="tripStartDate"
            label={t("Field5.Title")}
            placeholder={t("Field5.Placeholder")}
          />
          <RyogoDatePicker
            name="tripEndDate"
            label={t("Field6.Title")}
            placeholder={t("Field6.Placeholder")}
            disabled={selectedTripType === BookingTypeEnum.OneWay}
          />
        </FormContentWrapper>
        <FormContentWrapper>
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
        </FormContentWrapper>
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
            onClick={() => router.back()}
            disabled={form.formState.isSubmitting}
            label={t("Back")}
          />
        </StickyActionWrapper>
      </FormWrapper>
    </PageWrapper>
  )
}

function TripTypeSelectionCard({
  type,
  onClick,
  selected,
  title,
  desc,
}: {
  type: BookingTypeEnum
  onClick: () => void
  selected: boolean
  title: string
  desc: string
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
      <GetTripTypeIcon
        tripType={type}
        size="sm"
        color={selected ? "white" : "slate"}
      />
      <RyogoCaption color={selected ? "white" : "slate"}>{desc}</RyogoCaption>
    </div>
  )
}
