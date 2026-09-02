"use client"

import { RyogoInput } from "@/components/form/ryogoFormFields"
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
import { FormWrapper, PageWrapper } from "@/components/page/pageWrappers"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"

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
    newPhone: z.string().length(10, t("Field1.Error1")),
  })
  type ModifyAgencyType = z.infer<typeof modifyAgencySchema>

  const form = useForm<ModifyAgencyType>({
    resolver: zodResolver(modifyAgencySchema),
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
      const updatedAgency = await changeAgencyPhoneAction(
        agency.id,
        userId,
        data.newPhone,
      )
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
        <RyogoInput
          name={"newPhone"}
          type="tel"
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
          onClick={() => router.back()}
          disabled={form.formState.isSubmitting}
        />
      </FormWrapper>
    </PageWrapper>
  )
}
