"use client"

import { RyogoSmall, RyogoTiny } from "@/components/typography"
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
import { findOrCreateRouteAction } from "@/app/actions/locations/findOrCreateRouteAction"
import {
  FormContentWrapper,
  FormWrapper,
  PageWrapper,
  SectionColWrapper,
  SectionRowWrapper,
  StickyActionWrapper,
  TileGridWrapper,
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
    newBookingFormData.type,
  )

  const stepTripDetailsSchema = z
    .object({
      //Trip
      sourceState: z
        .string()
        .min(2, t("Field1.Error1"))
        .nonoptional(t("Field1.Error1")),
      sourceCity: z
        .string(t("Field2.Error1"))
        .min(2, t("Field2.Error1"))
        .nonoptional(t("Field2.Error1")),
      destinationState: z
        .string()
        .min(2, t("Field3.Error1"))
        .nonoptional(t("Field3.Error1")),
      destinationCity: z
        .string(t("Field4.Error1"))
        .min(2, t("Field4.Error1"))
        .nonoptional(t("Field4.Error1")),
      startDate: z.date(t("Field5.Error1")).nonoptional(t("Field5.Error1")),
      endDate: z.date(t("Field6.Error1")),
      passengers: z.coerce
        .number<number>(t("Field7.Error1"))
        .min(MIN_VEHICLE_CAPCITY, t("Field7.Error2"))
        .max(MAX_VEHICLE_CAPCITY, t("Field7.Error3"))
        .multipleOf(1, t("Field7.Error4"))
        .nonnegative(t("Field7.Error5")),
      type: z.enum(BookingTypeEnum),
      needsAc: z.boolean(),
      remarks: z
        .string()
        .max(MAX_FIELD_DESC_LENGTH, t("Field10.Error1"))
        .optional(),
    })
    .superRefine((data, ctx) => {
      //For round and multi day trip, end date must be after start date
      if (
        (selectedTripType === BookingTypeEnum.Round &&
          differenceInDays(data.endDate, data.startDate) < 0) ||
        (selectedTripType === BookingTypeEnum.MultiDay &&
          differenceInDays(data.endDate, data.startDate) < 1)
      ) {
        ctx.addIssue({
          code: "custom",
          message: t("Field6.Error2"),
          path: ["endDate"],
        })
      }
      //Source and destination cannot be the same
      if (
        data.sourceState === data.destinationState &&
        data.sourceCity === data.destinationCity
      ) {
        ctx.addIssue({
          code: "custom",
          message: t("Field4.Error2"),
          path: ["destinationCity"],
        })
      }
    })

  type StepTripDetailsType = z.infer<typeof stepTripDetailsSchema>

  //Form init
  const form = useForm<StepTripDetailsType>({
    resolver: zodResolver(stepTripDetailsSchema),
    defaultValues: {
      sourceCity: newBookingFormData.source.city,
      sourceState: newBookingFormData.source.state,
      destinationCity: newBookingFormData.destination.city,
      destinationState: newBookingFormData.destination.state,
      type: newBookingFormData.type,
      startDate: newBookingFormData.startDate,
      endDate: newBookingFormData.endDate,
      passengers: newBookingFormData.passengers,
      needsAc: newBookingFormData.needsAc,
      remarks: newBookingFormData.remarks,
    },
  })

  //Form submit
  async function onSubmit(values: StepTripDetailsType) {
    //Check if the route has changed
    const routeInputsUnchanged =
      newBookingFormData.routeId !== undefined &&
      newBookingFormData.source.city === values.sourceCity &&
      newBookingFormData.source.state === values.sourceState &&
      newBookingFormData.destination.city === values.destinationCity &&
      newBookingFormData.destination.state === values.destinationState

    //If route has changed, fetch new route data from DB, otherwise save previous data
    const newRoute = routeInputsUnchanged
      ? {
          id: newBookingFormData.routeId,
          sourceId: newBookingFormData.sourceId,
          destinationId: newBookingFormData.destinationId,
          distance: newBookingFormData.citydistance,
        }
      : await findOrCreateRouteAction(
          values.sourceCity,
          values.sourceState,
          values.destinationCity,
          values.destinationState,
        )

    setNewBookingFormData({
      ...newBookingFormData,
      source: {
        state: values.sourceState,
        city: values.sourceCity,
      },
      destination: {
        state: values.destinationState,
        city: values.destinationCity,
      },
      type: selectedTripType,
      startDate: values.startDate,
      endDate:
        selectedTripType === BookingTypeEnum.OneWay
          ? values.startDate
          : values.endDate,
      passengers: values.passengers,
      needsAc: values.needsAc,
      routeId: newRoute?.id,
      sourceId: newRoute?.sourceId,
      destinationId: newRoute?.destinationId,
      citydistance: newRoute?.distance ?? NEW_BOOKING_DEFAULT_DISTANCE,
    })
    onNext()
  }

  const data: Record<string, string[]> = stateCityData

  const selectedSourceState = useWatch({
    name: "sourceState",
    control: form.control,
  })
  const sourceCityOptions = data[selectedSourceState] ?? [
    t("Field2.Placeholder"),
  ]

  const selectedDestinationState = useWatch({
    name: "destinationState",
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
        href={"/dashboard/support/help-bookings#creation"}
      />
      <FormWrapper<StepTripDetailsType>
        id="StepTripDetailsForm"
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormContentWrapper>
          <TileGridWrapper>
            <SectionColWrapper>
              <RyogoCombobox
                name="sourceState"
                title={t("Field1.Title")}
                array={Object.keys(stateCityData)}
                register={form.register("sourceState")}
                placeholder={t("Field1.Placeholder")}
                resetField={() => {
                  form.setValue("sourceCity", "")
                }}
              />
              <RyogoCombobox
                name="sourceCity"
                array={sourceCityOptions}
                register={form.register("sourceCity")}
                placeholder={t("Field2.Placeholder")}
              />
            </SectionColWrapper>
            {/* <Separator /> */}
            <SectionColWrapper>
              <RyogoCombobox
                name="destinationState"
                title={t("Field3.Title")}
                array={Object.keys(stateCityData)}
                register={form.register("destinationState")}
                placeholder={t("Field3.Placeholder")}
                resetField={() => {
                  form.setValue("destinationCity", "")
                }}
              />
              <RyogoCombobox
                name="destinationCity"
                array={destinationCityOptions}
                register={form.register("destinationCity")}
                placeholder={t("Field4.Placeholder")}
              />
            </SectionColWrapper>
          </TileGridWrapper>
        </FormContentWrapper>
        <FormContentWrapper>
          <RyogoSmall weight="font-bold">{t("Field8.Title")}</RyogoSmall>
          <div className="flex flex-col lg:flex-row w-full gap-2 lg:gap-3">
            <TripTypeSelectionCard
              type={BookingTypeEnum.OneWay}
              onClick={() => {
                setSelectedTripType(BookingTypeEnum.OneWay)
                form.setValue("endDate", form.getValues("startDate"))
              }}
              selected={selectedTripType === BookingTypeEnum.OneWay}
              title={BookingTypeEnum.OneWay}
              desc={t("Field8.OneWayDesc")}
            />
            <TripTypeSelectionCard
              type={BookingTypeEnum.Round}
              onClick={() => {
                setSelectedTripType(BookingTypeEnum.Round)
              }}
              selected={selectedTripType === BookingTypeEnum.Round}
              title={BookingTypeEnum.Round}
              desc={t("Field8.RoundTripDesc")}
            />

            <TripTypeSelectionCard
              type={BookingTypeEnum.MultiDay}
              onClick={() => setSelectedTripType(BookingTypeEnum.MultiDay)}
              selected={selectedTripType === BookingTypeEnum.MultiDay}
              title={BookingTypeEnum.MultiDay}
              desc={t("Field8.MultiDayDesc")}
            />
          </div>
        </FormContentWrapper>
        <FormContentWrapper>
          <TileGridWrapper>
            <RyogoDatePicker
              name="startDate"
              label={t("Field5.Title")}
              placeholder={t("Field5.Placeholder")}
            />
            <RyogoDatePicker
              name="endDate"
              label={t("Field6.Title")}
              placeholder={t("Field6.Placeholder")}
              disabled={selectedTripType === BookingTypeEnum.OneWay}
            />
          </TileGridWrapper>
        </FormContentWrapper>
        <FormContentWrapper>
          <RyogoInput
            name="passengers"
            label={t("Field7.Title")}
            placeholder={t("Field7.Placeholder")}
            type="tel"
          />
          <RyogoSwitch label={t("Field9.Title")} name="needsAc" />
          <RyogoTextarea
            name="remarks"
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
      className={`flex border rounded-lg flex-col p-3 lg:p-4 gap-2 lg:gap-3 w-full transition-all ${
        selected
          ? "bg-slate-700 dark:bg-slate-100"
          : "border hover:bg-slate-100 dark:hover:bg-slate-700"
      }`}
    >
      <SectionRowWrapper className="items-center justify-between">
        <RyogoSmall weight="font-bold" color={selected ? "white" : "slate"}>
          {title}
        </RyogoSmall>
        <GetTripTypeIcon
          type={type}
          size="sm"
          color={selected ? "white" : "slate"}
          thick
        />
      </SectionRowWrapper>
      <RyogoTiny color={selected ? "white" : "light"}>{desc}</RyogoTiny>
    </div>
  )
}
