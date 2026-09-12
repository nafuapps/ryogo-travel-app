"use client"

import { RyogoCaption, RyogoH3, RyogoSmall } from "@/components/typography"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm, useWatch } from "react-hook-form"
import z from "zod"
import { RyogoCombobox, RyogoInput } from "@/components/form/ryogoFormFields"
import stateCityData from "@/lib/states_cities.json"
import { FindCustomersInAgencyType } from "@ryogo-travel-app/api/services/customer.services"
import { FindAgencyByIdType } from "@ryogo-travel-app/api/services/agency.services"
import { newCustomerAction } from "@/app/actions/customers/newCustomerAction"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState } from "react"
import ExistingCutomerCard from "@/components/flows/bookings/new/existingCustomerCard"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { ChevronLeft } from "lucide-react"
import {
  RyogoDefaultButton,
  RyogoGhostButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import {
  FormContentWrapper,
  FormWrapper,
  PageWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { MAX_NAME_LENGTH, MIN_NAME_LENGTH, PHONE_LENGTH } from "@/lib/uiConfig"

export default function NewBookingAddCustomerPageComponent({
  agency,
  customers,
  userId,
  setAddingCustomer,
}: {
  agency: NonNullable<FindAgencyByIdType>
  customers: FindCustomersInAgencyType
  userId: string
  setAddingCustomer: (b: boolean) => void
}) {
  const t = useTranslations("Dashboard.NewBooking.AddCustomer")
  const [existingCustomer, setExistingCustomer] = useState<
    FindCustomersInAgencyType[number] | undefined
  >()

  const router = useRouter()

  const addCustomerSchema = z.object({
    newCustomerName: z
      .string()
      .min(MIN_NAME_LENGTH, t("Field1.Error1"))
      .max(MAX_NAME_LENGTH, t("Field1.Error2")),
    newCustomerPhone: z
      .string()
      .trim()
      .length(PHONE_LENGTH, t("Field2.Error1"))
      .regex(/^[0-9]+$/, t("Field2.Error2")),
    newCustomerState: z.string().nonoptional(t("Field3.Error1")),
    newCustomerCity: z.string().nonoptional(t("Field4.Error1")),
  })

  type AddCustomerType = z.infer<typeof addCustomerSchema>

  //Form init
  const form = useForm<AddCustomerType>({
    resolver: zodResolver(addCustomerSchema),
    defaultValues: {
      newCustomerPhone: "",
      newCustomerName: "",
      newCustomerState: agency.location.state,
      newCustomerCity: agency.location.city,
    },
  })

  //Form submit
  async function onSubmit(values: AddCustomerType) {
    //Check for existing customer
    const foundCustomer = customers.find(
      (customer) => customer.phone === values.newCustomerPhone,
    )

    if (foundCustomer) {
      //Show existing customer
      setExistingCustomer(foundCustomer)
      return
    }

    //Create a new customer
    const newCustomer = await newCustomerAction({
      phone: values.newCustomerPhone,
      name: values.newCustomerName,
      state: values.newCustomerState,
      city: values.newCustomerCity,
      agencyId: agency.id,
      addedByUserId: userId,
    })
    if (newCustomer) {
      //Go to new booking with customer page
      router.replace(`/dashboard/bookings/new/${newCustomer.id}`)
      toast.success(t("Success"))
    } else {
      toast.error(t("Error"))
    }
  }

  function reset() {
    form.reset()
    setExistingCustomer(undefined)
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
    <PageWrapper id="AddCustomerStep">
      <FormWrapper<AddCustomerType>
        id="AddCustomerForm"
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <RyogoH3>{t("Title")}</RyogoH3>
        <RyogoSmall color="slate">{t("Description")}</RyogoSmall>
        <FormContentWrapper>
          <RyogoInput
            name={"newCustomerName"}
            type="text"
            label={t("Field1.Title")}
            placeholder={t("Field1.Placeholder")}
          />
          <RyogoInput
            name="newCustomerPhone"
            label={t("Field2.Title")}
            placeholder={t("Field2.Placeholder")}
            type="tel"
          />
          <RyogoCombobox
            name={"newCustomerState"}
            register={form.register("newCustomerState")}
            title={t("Field3.Title")}
            array={Object.keys(data)}
            placeholder={t("Field3.Title")}
            resetField={() => {
              form.setValue("newCustomerCity", "")
            }}
          />
          <RyogoCombobox
            name={"newCustomerCity"}
            register={form.register("newCustomerCity")}
            title={t("Field4.Title")}
            array={cityOptions}
            placeholder={t("Field4.Title")}
          />
        </FormContentWrapper>
        {existingCustomer && (
          <FormContentWrapper>
            <RyogoCaption
              className="text-center"
              color="light"
              weight="font-medium"
            >
              {t("Exists")}
            </RyogoCaption>
            <ExistingCutomerCard existingCustomer={existingCustomer} />
          </FormContentWrapper>
        )}
        <StickyActionWrapper>
          <RyogoDefaultButton
            size={"lg"}
            type="submit"
            disabled={
              form.formState.isSubmitting || existingCustomer !== undefined
            }
            showSpinner={form.formState.isSubmitting}
            label={form.formState.isSubmitting ? t("Loading") : t("AddCTA")}
          />
          <RyogoOutlineButton
            size={"lg"}
            type="button"
            onClick={reset}
            disabled={form.formState.isSubmitting || !form.formState.isDirty}
            label={t("ClearCTA")}
          />
          <RyogoGhostButton
            type="button"
            onClick={() => setAddingCustomer(false)}
            disabled={form.formState.isSubmitting}
            label={t("BackCTA")}
            labelClassName="font-bold"
            labelColor="light"
            className="flex-row-reverse"
          >
            <RyogoIcon icon={ChevronLeft} size="sm" color="light" thick />
          </RyogoGhostButton>
        </StickyActionWrapper>
      </FormWrapper>
    </PageWrapper>
  )
}
