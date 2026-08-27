"use client"

import { RyogoCaption, RyogoH3, RyogoSmall } from "@/components/typography"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm, useWatch } from "react-hook-form"
import z from "zod"
import { RyogoCombobox, RyogoInput } from "@/components/form/ryogoFormFields"
import stateCityData from "@/lib/states_cities.json"
import { FindCustomersInAgencyType } from "@ryogo-travel-app/api/services/customer.services"
import {
  getArrayValueDisplayPairs,
  getStringValueDisplayPairs,
} from "@/lib/utils"
import {
  NewStepHeaderWrapper,
  NewStepWrapper,
  NewFormWrapper,
  NewFormContentWrapper,
  NewFormActionWrapper,
} from "@/components/form/newFormWrappers"
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
import { StickyActionWrapper } from "@/components/page/pageWrappers"

export default function NewBookingAddCustomerPageComponent(props: {
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
      .min(5, t("Field1.Error1"))
      .max(30, t("Field1.Error2")),
    newCustomerPhone: z
      .string()
      .trim()
      .length(10, t("Field2.Error1"))
      .regex(/^[0-9]+$/, t("Field2.Error2")),
    newCustomerState: z.string().min(1, t("Field3.Error1")),
    newCustomerCity: z.string().min(1, t("Field4.Error1")),
  })

  type AddCustomerType = z.infer<typeof addCustomerSchema>

  //Form init
  const form = useForm<AddCustomerType>({
    resolver: zodResolver(addCustomerSchema),
    defaultValues: {
      newCustomerPhone: "",
      newCustomerName: "",
      newCustomerState: props.agency.location.state,
      newCustomerCity: props.agency.location.city,
    },
  })

  //Form submit
  async function onSubmit(values: AddCustomerType) {
    //Check for existing customer
    const foundCustomer = props.customers.find(
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
      agencyId: props.agency.id,
      addedByUserId: props.userId,
    })
    if (newCustomer) {
      //Go to new booking with customer page
      router.replace(`/dashboard/bookings/new/${newCustomer.id}`)
      toast.success("Success")
    } else {
      toast.error("Error")
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
    <NewStepWrapper id="AddCustomerStep">
      <NewStepHeaderWrapper>
        <RyogoH3>{t("Title")}</RyogoH3>
        <RyogoSmall color="slate">{t("Description")}</RyogoSmall>
      </NewStepHeaderWrapper>
      <NewFormWrapper<AddCustomerType>
        id="AddCustomerForm"
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <NewFormContentWrapper>
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
        {existingCustomer && (
          <NewFormContentWrapper>
            <RyogoCaption
              className="text-center"
              color="light"
              weight="font-medium"
            >
              {t("Exists")}
            </RyogoCaption>
            <ExistingCutomerCard existingCustomer={existingCustomer} />
          </NewFormContentWrapper>
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
            onClick={() => props.setAddingCustomer(false)}
            disabled={form.formState.isSubmitting}
            label={t("BackCTA")}
            labelClassName="font-bold"
            labelColor="light"
            className="flex-row-reverse"
          >
            <RyogoIcon icon={ChevronLeft} size="sm" color="light" thick />
          </RyogoGhostButton>
        </StickyActionWrapper>
      </NewFormWrapper>
    </NewStepWrapper>
  )
}
