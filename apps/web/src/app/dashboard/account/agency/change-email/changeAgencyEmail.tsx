"use client"

import { changeAgencyEmailAction } from "@/app/actions/agencies/changeAgencyEmailAction"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import { HelpIconButton } from "@/components/flows/support/helpButtons"
import { RyogoInput } from "@/components/form/ryogoFormFields"
import {
  FormContentWrapper,
  FormWrapper,
  PageWrapper,
  SectionRowWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { RyogoH3 } from "@/components/typography"
import { MAX_EMAIL_LENGTH } from "@/lib/uiConfig"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  FindAgenciesByPhoneType,
  FindAgencyByIdType,
} from "@ryogo-travel-app/api/services/agency.services"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

export default function ChangeAgencyEmailPageComponent({
  agency,
  allAgencies,
}: {
  agency: NonNullable<FindAgencyByIdType>
  allAgencies: FindAgenciesByPhoneType
}) {
  const t = useTranslations("Dashboard.AccountAgency.ChangeEmail")
  const router = useRouter()

  const modifyAgencySchema = z.object({
    newEmail: z
      .email(t("Field1.Error1"))
      .max(MAX_EMAIL_LENGTH, t("Field1.Error2")),
  })
  type ModifyAgencyType = z.infer<typeof modifyAgencySchema>

  const form = useForm<ModifyAgencyType>({
    resolver: zodResolver(modifyAgencySchema),
    defaultValues: {
      newEmail: agency.businessEmail,
    },
  })

  //Submit actions
  async function onSubmit(values: ModifyAgencyType) {
    //Check if same emailhas been entered
    if (values.newEmail === agency.businessEmail) {
      form.setError("newEmail", {
        type: "manual",
        message: t("Field1.Error3"),
      })
    } else if (
      //check if another agency has this email and phone
      allAgencies.some(
        (u) =>
          u.businessEmail === values.newEmail &&
          u.businessPhone === agency.businessPhone,
      )
    ) {
      form.setError("newEmail", {
        type: "manual",
        message: t("Field1.Error4"),
      })
    } else {
      const updatedAgency = await changeAgencyEmailAction({
        agencyId: agency.id,
        businessEmail: values.newEmail,
      })
      if (updatedAgency) {
        router.replace("/dashboard/account/agency")
        toast.success(t("Success"))
      } else {
        router.back()
        toast.error(t("Error"))
      }
    }
  }

  return (
    <PageWrapper id="ChangeAgencyEmailPage">
      <FormWrapper<ModifyAgencyType>
        id="ChangeAgencyEmailForm"
        onSubmit={form.handleSubmit(onSubmit)}
        form={form}
      >
        <SectionRowWrapper className="items-center justify-between">
          <RyogoH3>{t("Title")}</RyogoH3>
          <HelpIconButton href="/dashboard/support/help-account#agency" />
        </SectionRowWrapper>
        <FormContentWrapper>
          <RyogoInput
            name={"newEmail"}
            type="email"
            label={t("Field1.Title")}
            placeholder={t("Field1.Placeholder")}
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
