import { CaptionGrey, H4, Small, SmallGrey } from "@/components/typography"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import {
  newBookingFormClassName,
  NewBookingFormDataType,
  newBookingHeaderClassName,
  newBookingHeaderLineClassName,
  newBookingSectionClassName,
  NewBookingTotalSteps,
} from "./newBookingCommon"
import NewBookingStepsTracker from "./newBookingStepsTracker"
import {
  DashboardInput,
  DashboardSelect,
} from "@/components/form/dashboardFormFields"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import stateCityData from "@/lib/states_cities.json"
import { LucideInfo } from "lucide-react"
import { PhoneRegex } from "@/lib/regex"
import { Alert } from "@/components/ui/alert"
import ExistingCutomerCard from "./newBookingExistingCustomer"
import { FindCustomersInAgencyType } from "@ryogo-travel-app/api/services/customer.services"

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
    props.newBookingFormData.newCustomerName
  )

  const step1Schema = z.object({
    //Customer
    customerPhone: PhoneRegex,
    newCustomerName: z
      .string()
      .refine((s) => {
        return existingCustomer || s.length > 5
      }, t("Field2.Error1"))
      .optional(),
    newCustomerState: z
      .string()
      .refine((s) => {
        return existingCustomer || s != ""
      }, t("Field3.Error1"))
      .optional(),
    newCustomerCity: z
      .string()
      .refine((s) => {
        return existingCustomer || s != ""
      }, t("Field4.Error1"))
      .optional(),
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
    const foundCustomer = props.customers.find(
      (c) => c.phone == form.getValues("customerPhone")
    )
    setExistingCustomer(foundCustomer)
    if (!foundCustomer) {
      setCustomerNotFound(t("CustomerNotFound"))
    } else {
      setCustomerNotFound(undefined)
    }
  }

  const data: Record<string, string[]> = stateCityData
  const selectedState = form.watch("newCustomerState")
  const cityOptions = selectedState ? data[selectedState] : []
  const setValue = form.setValue

  const isFirstRender = useRef(true)

  useEffect(() => {
    // Skip on the initial render of the component
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    setValue("newCustomerCity", "") // Reset the city dropdown's value when the state dropdown changes
  }, [selectedState, setValue])

  return (
    <div id="CustomerSection" className={newBookingSectionClassName}>
      <div id="CustomerHeader" className={newBookingHeaderClassName}>
        <div className={newBookingHeaderLineClassName}>
          <H4>{t("Title")}</H4>
          <CaptionGrey>{t("Subtitle")}</CaptionGrey>
        </div>
        <NewBookingStepsTracker total={NewBookingTotalSteps} current={0} />
        <SmallGrey>{t("Description")}</SmallGrey>
      </div>
      <Form {...form}>
        <form
          id="Step1Form"
          onSubmit={form.handleSubmit(onSubmit)}
          className={newBookingFormClassName}
        >
          <div id="FindCustomer" className="flex flex-col gap-3 lg:gap-4">
            <DashboardInput
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
          </div>
          {customerNotFound && (
            <div id="NewCustomer" className="flex flex-col gap-3 lg:gap-4">
              <Alert>
                <LucideInfo className="size-8 lg:size-10 text-amber-300" />
                <Small>{t("CustomerNotFound")}</Small>
              </Alert>
              <DashboardInput
                name={"newCustomerName"}
                type="text"
                label={t("Field2.Title")}
                placeholder={t("Field2.Placeholder")}
              />
              <DashboardSelect
                name={"newCustomerState"}
                register={form.register("newCustomerState")}
                title={t("Field3.Title")}
                array={Object.keys(data)}
                placeholder={t("Field3.Title")}
              />
              <DashboardSelect
                name={"newCustomerCity"}
                register={form.register("newCustomerCity")}
                title={t("Field4.Title")}
                array={cityOptions}
                placeholder={t("Field4.Title")}
              />
            </div>
          )}
          {(existingCustomer || customerNotFound) && (
            <Button
              variant={"default"}
              size={"lg"}
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting && <Spinner />}
              {form.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")}
            </Button>
          )}
        </form>
      </Form>
    </div>
  )
}
