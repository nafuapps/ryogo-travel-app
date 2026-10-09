"use client"

import { RyogoOTPInput } from "@/components/form/ryogoFormFields"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  FindAgenciesByEmailType,
  FindAgencyByIdType,
} from "@ryogo-travel-app/api/services/agency.services"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import { changeAgencyPhoneAction } from "@/app/actions/agencies/changeAgencyPhoneAction"
import {
  FormContentWrapper,
  FormWrapper,
  PageWrapper,
  SectionRowWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import { PHONE_LENGTH } from "@/lib/uiConfig"
import { HelpIconButton } from "@/components/flows/support/helpButtons"
import { RyogoH3 } from "@/components/typography"

export default function ChangeAgencyPhonePageComponent({
  agency,
  allAgencies,
  userId,
}: {
  agency: NonNullable<FindAgencyByIdType>
  allAgencies: FindAgenciesByEmailType
  userId: string
}) {
  const t = useTranslations("Dashboard.AccountAgency.ChangePhone")
  const router = useRouter()

  const modifyAgencySchema = z.object({
    newPhone: z.string().length(PHONE_LENGTH, t("Field1.Error1")),
  })
  type ModifyAgencyType = z.infer<typeof modifyAgencySchema>

  const form = useForm<ModifyAgencyType>({
    resolver: zodResolver(modifyAgencySchema),
    defaultValues: {
      newPhone: agency.businessPhone,
    },
  })

  //Submit actions
  async function onSubmit(data: ModifyAgencyType) {
    //Check if same phone has been entered
    if (data.newPhone === agency.businessPhone) {
      form.setError("newPhone", {
        type: "manual",
        message: t("Field1.Error2"),
      })
    } else if (
      //check if another agency has this phone and email
      allAgencies.some(
        (u) =>
          u.businessPhone === data.newPhone &&
          u.businessEmail === agency.businessEmail,
      )
    ) {
      form.setError("newPhone", {
        type: "manual",
        message: t("Field1.Error3"),
      })
    } else {
      const updatedAgency = await changeAgencyPhoneAction({
        userId,
        agencyId: agency.id,
        businessPhone: data.newPhone,
      })
      if (updatedAgency) {
        router.replace(`/dashboard/account/agency`)
        toast.success(t("Success"))
      } else {
        router.back()
        toast.error(t("Error"))
      }
    }
  }

  return (
    <PageWrapper id="ChangeAgencyPhonePage">
      <FormWrapper<ModifyAgencyType>
        id="ChangeAgencyPhoneForm"
        onSubmit={form.handleSubmit(onSubmit)}
        form={form}
      >
        <SectionRowWrapper className="items-center justify-between">
          <RyogoH3>{t("Title")}</RyogoH3>
          <HelpIconButton href="/dashboard/support/help-account#agency" />
        </SectionRowWrapper>
        <FormContentWrapper>
          <RyogoOTPInput
            length={10}
            name={"newPhone"}
            label={t("Field1.Title")}
            description={t("Field1.Description")}
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
            type="button"
            label={t("SecondaryCTA")}
            onClick={() => router.back()}
            disabled={form.formState.isSubmitting}
          />
        </StickyActionWrapper>
      </FormWrapper>
    </PageWrapper>
  )
}
