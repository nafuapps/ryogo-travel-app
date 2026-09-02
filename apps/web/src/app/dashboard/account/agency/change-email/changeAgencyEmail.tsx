"use client"

import { RyogoInput } from "@/components/form/ryogoFormFields"
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
import { changeAgencyEmailAction } from "@/app/actions/agencies/changeAgencyEmailAction"
import { FormWrapper, PageWrapper } from "@/components/page/pageWrappers"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"

export default function ChangeAgencyEmailPageComponent({
  agency,
  allAgencies,
  userId,
}: {
  agency: NonNullable<FindAgencyByIdType>
  allAgencies: FindAgenciesByPhoneType
  userId: string
}) {
  const t = useTranslations("Dashboard.AccountAgency.ChangeEmail")
  const router = useRouter()

  const modifyAgencySchema = z.object({
    newEmail: z.email(t("Field1.Error1")).max(60, t("Field1.Error2")),
  })
  type ModifyAgencyType = z.infer<typeof modifyAgencySchema>

  const form = useForm<ModifyAgencyType>({
    resolver: zodResolver(modifyAgencySchema),
  })

  //Submit actions
  async function onSubmit(data: ModifyAgencyType) {
    //Check if same emailhas been entered
    if (data.newEmail === agency.businessEmail) {
      form.setError("newEmail", {
        type: "manual",
        message: t("Field1.Error3"),
      })
    } else if (
      //check if another agency has this email and phone
      allAgencies.some(
        (u) =>
          u.businessEmail === data.newEmail &&
          u.businessPhone === agency.businessPhone,
      )
    ) {
      form.setError("newEmail", {
        type: "manual",
        message: t("Field1.Error4"),
      })
    } else {
      const updatedAgency = await changeAgencyEmailAction(
        agency.id,
        userId,
        data.newEmail,
      )
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
        <RyogoInput
          name={"newEmail"}
          type="email"
          label={t("Field1.Title")}
          placeholder={t("Field1.Placeholder")}
          description={t("Field1.Description")}
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
