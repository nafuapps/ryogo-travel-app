"use client"

import {
  RyogoCombobox,
  RyogoInput,
  RyogoTextarea,
} from "@/components/form/ryogoFormFields"
import { zodResolver } from "@hookform/resolvers/zod"
import { FindAgencyByIdType } from "@ryogo-travel-app/api/services/agency.services"
import { useTranslations } from "next-intl"
import { useForm, useWatch } from "react-hook-form"
import z from "zod"
import stateCityData from "@/lib/states_cities.json"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { modifyAgencyAction } from "@/app/actions/agencies/modifyAgencyAction"
import { ModifyAgencyRequestType } from "@ryogo-travel-app/api/types/agency.types"
import {
  FormContentWrapper,
  FormWrapper,
  PageWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import {
  MIN_NAME_LENGTH,
  MAX_NAME_LENGTH,
  MIN_COMMISSION_RATE,
  MAX_COMMISSION_RATE,
  MIN_FIELD_DESC_LENGTH,
  MAX_FIELD_DESC_LENGTH,
} from "@/lib/uiConfig"

export default function ModifyAgencyPageForm({
  agency,
  userId,
}: {
  agency: NonNullable<FindAgencyByIdType>
  userId: string
}) {
  const t = useTranslations("Dashboard.ModifyAgency")
  const router = useRouter()
  const schema = z.object({
    agencyName: z
      .string()
      .min(MIN_NAME_LENGTH, t("Field1.Error1"))
      .max(MAX_NAME_LENGTH, t("Field1.Error2")),
    agencyAddress: z
      .string()
      .min(MIN_FIELD_DESC_LENGTH, t("Field2.Error1"))
      .max(MAX_FIELD_DESC_LENGTH, t("Field2.Error2")),
    commissionRate: z.coerce
      .number<number>(t("Field3.Error1"))
      .min(MIN_COMMISSION_RATE, t("Field3.Error2"))
      .max(MAX_COMMISSION_RATE, t("Field3.Error3"))
      .positive(t("Field3.Error4"))
      .multipleOf(1, t("Field3.Error5"))
      .optional(),
    agencyState: z.string().nonoptional(t("Field4.Error1")),
    agencyCity: z.string().nonoptional(t("Field5.Error1")),
  })

  type SchemaType = z.infer<typeof schema>
  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      agencyName: agency.businessName,
      agencyAddress: agency.businessAddress,
      commissionRate: agency.defaultCommissionRate,
      agencyState: agency.location.state,
      agencyCity: agency.location.city,
    },
  })

  //Submit actions
  async function onSubmit(data: SchemaType) {
    const modifyAgencyData: ModifyAgencyRequestType = {
      agencyId: agency.id,
      businessName: data.agencyName,
      businessAddress: data.agencyAddress,
      defaultCommissionRate: data.commissionRate,
      agencyState: data.agencyState,
      agencyCity: data.agencyCity,
    }
    const updatedAgency = await modifyAgencyAction(userId, modifyAgencyData)
    if (updatedAgency) {
      router.replace(`/dashboard/account/agency`)
      toast.success(t("Success"))
    } else {
      router.back()
      toast.error(t("Error"))
    }
  }

  const data: Record<string, string[]> = stateCityData
  const selectedState = useWatch({
    name: "agencyState",
    control: form.control,
  })
  const cityOptions = data[selectedState] ?? [t("Field5.Title")]

  return (
    <PageWrapper id="ModifyAgencyPage">
      <FormWrapper<SchemaType>
        id="ModifyAgencyForm"
        onSubmit={form.handleSubmit(onSubmit)}
        form={form}
      >
        <FormContentWrapper>
          <RyogoInput
            name={"agencyName"}
            type="text"
            label={t("Field1.Title")}
            placeholder={t("Field1.Placeholder")}
            description={t("Field1.Description")}
          />
          <RyogoTextarea
            name={"agencyAddress"}
            label={t("Field2.Title")}
            placeholder={t("Field2.Placeholder")}
          />
          <RyogoInput
            name={"commissionRate"}
            type="tel"
            label={t("Field3.Title")}
            placeholder={t("Field3.Placeholder")}
            description={t("Field3.Description")}
          />
          <RyogoCombobox
            name={"agencyState"}
            register={form.register("agencyState")}
            title={t("Field4.Title")}
            array={Object.keys(data)}
            placeholder={t("Field4.Title")}
            resetField={() => {
              form.setValue("agencyCity", "")
            }}
          />
          <RyogoCombobox
            name={"agencyCity"}
            register={form.register("agencyCity")}
            title={t("Field5.Title")}
            array={cityOptions}
            placeholder={t("Field5.Title")}
          />
        </FormContentWrapper>
        <StickyActionWrapper>
          <RyogoDefaultButton
            size={"lg"}
            label={form.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")}
            type="submit"
            disabled={form.formState.isSubmitting || !form.formState.isDirty}
            showSpinner={form.formState.isSubmitting}
          />
          <RyogoOutlineButton
            size={"lg"}
            label={t("SecondaryCTA")}
            type="button"
            onClick={() => router.back()}
            disabled={form.formState.isSubmitting}
          />
        </StickyActionWrapper>
      </FormWrapper>
    </PageWrapper>
  )
}
