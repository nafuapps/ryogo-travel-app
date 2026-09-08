"use client"

import { modifyCustomerAction } from "@/app/actions/customers/modifyCustomerAction"
import {
  RyogoCombobox,
  RyogoInput,
  RyogoTextarea,
} from "@/components/form/ryogoFormFields"
import { zodResolver } from "@hookform/resolvers/zod"
import { FindCustomerDetailsByIdType } from "@ryogo-travel-app/api/services/customer.services"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import stateCityData from "@/lib/states_cities.json"
import {
  getArrayValueDisplayPairs,
  getStringValueDisplayPairs,
} from "@/lib/utils"
import { FormWrapper, PageWrapper } from "@/components/page/pageWrappers"
import { ModifyCustomerRequestType } from "@ryogo-travel-app/api/types/customer.types"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import {
  MAX_EMAIL_LENGTH,
  MAX_FIELD_DESC_LENGTH,
  MAX_NAME_LENGTH,
  MIN_FIELD_DESC_LENGTH,
  MIN_NAME_LENGTH,
} from "@/lib/uiConfig"

export default function ModifyCustomerPageComponent({
  customer,
}: {
  customer: NonNullable<FindCustomerDetailsByIdType>
}) {
  const t = useTranslations("Dashboard.ModifyCustomer")
  const router = useRouter()

  const modifyCustomerSchema = z.object({
    name: z
      .string()
      .min(MIN_NAME_LENGTH, t("Field1.Error1"))
      .max(MAX_NAME_LENGTH, t("Field1.Error2")),
    email: z
      .email(t("Field2.Error1"))
      .max(MAX_EMAIL_LENGTH, t("Field2.Error2"))
      .optional(),
    address: z
      .string()
      .min(MIN_FIELD_DESC_LENGTH, t("Field3.Error1"))
      .max(MAX_FIELD_DESC_LENGTH, t("Field3.Error2"))
      .optional(),
    remarks: z
      .string()
      .max(MAX_FIELD_DESC_LENGTH, t("Field4.Error1"))
      .optional(),
    state: z.string().nonoptional(t("Field5.Error1")),
    city: z.string().nonoptional(t("Field6.Error1")),
  })
  type ModifyCustomerType = z.infer<typeof modifyCustomerSchema>

  const form = useForm<ModifyCustomerType>({
    resolver: zodResolver(modifyCustomerSchema),
    defaultValues: {
      name: customer.name,
      email: customer.email ?? undefined,
      address: customer.address ?? undefined,
      remarks: customer.remarks ?? undefined,
      state: customer.location.state,
      city: customer.location.city,
    },
  })

  //Submit actions
  async function onSubmit(data: ModifyCustomerType) {
    const modifyCustomerData: ModifyCustomerRequestType = {
      customerId: customer.id,
      agencyId: customer.agencyId,
      name: data.name,
      email: data.email,
      address: data.address,
      remarks: data.remarks,
      state: data.state,
      city: data.city,
    }
    const updatedCustomer = await modifyCustomerAction(modifyCustomerData)
    if (updatedCustomer) {
      router.replace(`/dashboard/customers/${customer.id}`)
      toast.success(t("Success"))
    } else {
      router.back()
      toast.error(t("Error"))
    }
  }

  const data: Record<string, string[]> = stateCityData
  const selectedState = useWatch({
    name: "state",
    control: form.control,
  })
  const cityOptions = data[selectedState] ?? [t("Field6.Title")]

  return (
    <PageWrapper id="ModifyCustomerPage">
      <FormWrapper<ModifyCustomerType>
        form={form}
        id="ModifyCustomerForm"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <RyogoInput
          name={"name"}
          type="text"
          label={t("Field1.Title")}
          placeholder={t("Field1.Placeholder")}
          description={t("Field1.Description")}
        />
        <RyogoInput
          name={"email"}
          type="email"
          label={t("Field2.Title")}
          placeholder={t("Field2.Placeholder")}
          description={t("Field2.Description")}
        />
        <RyogoTextarea
          name={"address"}
          label={t("Field3.Title")}
          placeholder={t("Field3.Placeholder")}
        />
        <RyogoTextarea
          name="remarks"
          label={t("Field4.Title")}
          placeholder={t("Field4.Placeholder")}
        />
        <RyogoCombobox
          name={"state"}
          register={form.register("state")}
          title={t("Field5.Title")}
          array={getArrayValueDisplayPairs(data)}
          placeholder={t("Field5.Title")}
          resetField={() => {
            form.setValue("city", "")
          }}
        />
        <RyogoCombobox
          name={"city"}
          register={form.register("city")}
          title={t("Field6.Title")}
          array={getStringValueDisplayPairs(cityOptions)}
          placeholder={t("Field6.Title")}
        />
        <RyogoDefaultButton
          size={"lg"}
          label={form.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")}
          type="submit"
          disabled={form.formState.isSubmitting}
          showSpinner={form.formState.isSubmitting}
        />
        <RyogoOutlineButton
          size={"lg"}
          label={t("SecondaryCTA")}
          type="button"
          onClick={() => router.back()}
          disabled={form.formState.isSubmitting}
        />
      </FormWrapper>
    </PageWrapper>
  )
}
