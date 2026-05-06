"use client"

import { RyogoInput } from "@/components/form/ryogoFormFields"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
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
import { useTransition } from "react"
import { FormWrapper, PageWrapper } from "@/components/page/pageWrappers"

export default function ChangeAgencyEmailPageComponent({
  agency,
  allAgencies,
}: {
  agency: NonNullable<FindAgencyByIdType>
  allAgencies: FindAgenciesByPhoneType
}) {
  const t = useTranslations("Dashboard.AccountAgency.ChangeEmail")
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const modifyAgencySchema = z.object({
    newEmail: z.email(t("Field1.Error1")).max(60, t("Field1.Error2")),
  })
  type ModifyAgencyType = z.infer<typeof modifyAgencySchema>

  const formData = useForm<ModifyAgencyType>({
    resolver: zodResolver(modifyAgencySchema),
  })

  //Submit actions
  async function onSubmit(data: ModifyAgencyType) {
    //Check if same emailhas been entered
    if (data.newEmail === agency.businessEmail) {
      formData.setError("newEmail", {
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
      formData.setError("newEmail", {
        type: "manual",
        message: t("Field1.Error4"),
      })
    } else {
      startTransition(async () => {
        if (await changeAgencyEmailAction(agency.id, data.newEmail)) {
          router.replace("/dashboard/account/agency")
          toast.success(t("Success"))
        } else {
          router.back()
          toast.error(t("Error"))
        }
      })
    }
  }

  return (
    <PageWrapper id="ChangeAgencyEmailPage">
      <FormWrapper<ModifyAgencyType>
        id="ChangeAgencyEmailForm"
        onSubmit={formData.handleSubmit(onSubmit)}
        form={formData}
      >
        <RyogoInput
          name={"newEmail"}
          type="email"
          label={t("Field1.Title")}
          placeholder={t("Field1.Placeholder")}
          description={t("Field1.Description")}
        />
        <Button
          variant={"default"}
          size={"lg"}
          type="submit"
          disabled={isPending}
        >
          {isPending && <Spinner />}
          {isPending ? t("Loading") : t("PrimaryCTA")}
        </Button>
        <Button
          variant={"secondary"}
          size={"lg"}
          type="button"
          onClick={() => router.back()}
          disabled={isPending}
        >
          {t("SecondaryCTA")}
        </Button>
      </FormWrapper>
    </PageWrapper>
  )
}
