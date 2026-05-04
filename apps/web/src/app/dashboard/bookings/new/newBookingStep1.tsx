"use client"

import { CaptionGrey, H4, Small, SmallGrey } from "@/components/typography"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import z from "zod"
import {
  NewBookingFormDataType,
  NewBookingTotalSteps,
} from "./newBookingCommon"
import StepsTracker from "@/components/form/stepsTracker"
import { RyogoCombobox, RyogoInput } from "@/components/form/ryogoFormFields"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import stateCityData from "@/lib/states_cities.json"
import { Info } from "lucide-react"
import { PhoneRegex } from "@/lib/regex"
import { Alert } from "@/components/ui/alert"
import ExistingCutomerCard from "./newBookingExistingCustomer"
import { FindCustomersInAgencyType } from "@ryogo-travel-app/api/services/customer.services"
import {
  getArrayValueDisplayPairs,
  getStringValueDisplayPairs,
} from "@/lib/utils"
import {
  NewFormActionWrapper,
  NewFormContentWrapper,
  NewFormWrapper,
  NewStepHeaderWrapper,
  NewStepTitleWrapper,
  NewStepWrapper,
} from "@/components/page/pageWrappers"

type NewBookingStep1Props = {
  onNext: () => void
  newBookingFormData: NewBookingFormDataType
  setNewBookingFormData: React.Dispatch<
    React.SetStateAction<NewBookingFormDataType>
  >
  agencyId: string
  customers: FindCustomersInAgencyType
}
export default function NewBookingStep1(props: NewBookingStep1Props) {
  const t = useTranslations("Dashboard.NewBooking.Form.Step1")
  const [existingCustomer, setExistingCustomer] = useState<
    FindCustomersInAgencyType[number] | undefined
  >(props.newBookingFormData.existingCustomer)
  const [customerNotFound, setCustomerNotFound] = useState<string | undefined>(
    props.newBookingFormData.newCustomerName,
  )

  const step1Schema = z.object({
    //Customer
    customerPhone: PhoneRegex,
    newCustomerName: z
      .string()
      .optional()
      .refine((s) => {
        return existingCustomer || (s && s.length >= 5)
      }, t("Field2.Error1")),
    newCustomerState: z
      .string()
      .optional()
      .refine((s) => {
        return existingCustomer || (s && s?.length > 0)
      }, t("Field3.Error1")),
    newCustomerCity: z
      .string()
      .optional()
      .refine((s) => {
        return existingCustomer || (s && s?.length > 0)
      }, t("Field4.Error1")),
  })

  type Step1Type = z.infer<typeof step1Schema>

  //Form init
  const form = useForm<Step1Type>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      customerPhone: props.newBookingFormData.customerPhone,
      newCustomerName: props.newBookingFormData.newCustomerName,
      newCustomerState: props.newBookingFormData.newCustomerLocationState,
      newCustomerCity: props.newBookingFormData.newCustomerLocationCity,
    },
  })

  //Form submit
  function onSubmit(values: Step1Type) {
    props.setNewBookingFormData({
      ...props.newBookingFormData,
      customerPhone: values.customerPhone,
      existingCustomer: existingCustomer,
      newCustomerName: values.newCustomerName,
      newCustomerLocationState: values.newCustomerState,
      newCustomerLocationCity: values.newCustomerCity,
    })
    props.onNext()
  }

  //Find customer
  const findCustomer = async () => {
    if (!PhoneRegex.safeParse(form.getValues("customerPhone")).success) {
      form.setError("customerPhone", {
        type: "manual",
        message: t("Field1.Error1"),
      })
      return
    }
    form.clearErrors("customerPhone")
    const foundCustomer = props.customers.find(
      (c) => c.phone === form.getValues("customerPhone"),
    )
    setExistingCustomer(foundCustomer)
    if (!foundCustomer) {
      setCustomerNotFound(t("CustomerNotFound"))
    } else {
      setCustomerNotFound(undefined)
    }
  }

  const data: Record<string, string[]> = stateCityData
  const selectedState = useWatch({
    name: "newCustomerState",
    control: form.control,
  })
  const cityOptions = selectedState
    ? (data[selectedState] ?? [t("Field4.Title")])
    : []

  return (
    <NewStepWrapper id="CustomerStep">
      <NewStepHeaderWrapper>
        <NewStepTitleWrapper>
          <H4>{t("Title")}</H4>
          <CaptionGrey>{t("Subtitle")}</CaptionGrey>
        </NewStepTitleWrapper>
        <StepsTracker total={NewBookingTotalSteps} current={0} />
        <SmallGrey>{t("Description")}</SmallGrey>
      </NewStepHeaderWrapper>
      <NewFormWrapper<Step1Type>
        id="Step1Form"
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <NewFormContentWrapper>
          <RyogoInput
            name="customerPhone"
            label={t("Field1.Title")}
            placeholder={t("Field1.Placeholder")}
            type="tel"
          />
          <Button
            variant={"outline"}
            size={"lg"}
            type="button"
            onClick={findCustomer}
            className="flex flex-row justify-center items-center gap-4 w-full"
          >
            {t("FindCTA")}
          </Button>
          {existingCustomer && (
            <ExistingCutomerCard existingCustomer={existingCustomer} />
          )}
        </NewFormContentWrapper>
        {customerNotFound && (
          <NewFormContentWrapper>
            <Alert>
              <Info className="size-4 lg:size-5 text-amber-300" />
              <Small>{t("CustomerNotFound")}</Small>
            </Alert>
            <RyogoInput
              name={"newCustomerName"}
              type="text"
              label={t("Field2.Title")}
              placeholder={t("Field2.Placeholder")}
            />
            <RyogoCombobox
              name={"newCustomerState"}
              register={form.register("newCustomerState")}
              title={t("Field3.Title")}
              array={getArrayValueDisplayPairs(data)}
              placeholder={t("Field3.Title")}
              resetField={() => {
                form.setValue("newCustomerCity", "")
              }}
            />
            <RyogoCombobox
              name={"newCustomerCity"}
              register={form.register("newCustomerCity")}
              title={t("Field4.Title")}
              array={getStringValueDisplayPairs(cityOptions)}
              placeholder={t("Field4.Title")}
            />
          </NewFormContentWrapper>
        )}
        {(existingCustomer || customerNotFound) && (
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
          </NewFormActionWrapper>
        )}
      </NewFormWrapper>
    </NewStepWrapper>
  )
}
