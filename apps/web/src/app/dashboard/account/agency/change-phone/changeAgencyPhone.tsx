"use client"

import { RyogoInput } from "@/components/form/ryogoFormFields"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
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
import { useTransition } from "react"
import { FormWrapper, PageWrapper } from "@/components/page/pageWrappers"
import { RyogoCaption } from "@/components/typography"

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
  const [isPending, startTransition] = useTransition()

  const modifyAgencySchema = z.object({
    newPhone: z.string().length(10, t("Field1.Error1")),
  })
  type ModifyAgencyType = z.infer<typeof modifyAgencySchema>

  const formData = useForm<ModifyAgencyType>({
    resolver: zodResolver(modifyAgencySchema),
  })

  //Submit actions
  async function onSubmit(data: ModifyAgencyType) {
    //Check if same phone has been entered
    if (data.newPhone === agency.businessPhone) {
      formData.setError("newPhone", {
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
      formData.setError("newPhone", {
        type: "manual",
        message: t("Field1.Error3"),
      })
    } else {
      startTransition(async () => {
        if (await changeAgencyPhoneAction(agency.id, userId, data.newPhone)) {
          router.replace(`/dashboard/account/agency`)
          toast.success(t("Success"))
        } else {
          router.back()
          toast.error(t("Error"))
        }
      })
    }
  }

  return (
    <PageWrapper id="ChangeAgencyPhonePage">
      <FormWrapper<ModifyAgencyType>
        id="ChangeAgencyPhoneForm"
        onSubmit={formData.handleSubmit(onSubmit)}
        form={formData}
      >
        <RyogoInput
          name={"newPhone"}
          type="tel"
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
          <RyogoCaption color="white">
            {isPending ? t("Loading") : t("PrimaryCTA")}
          </RyogoCaption>
        </Button>
        <Button
          variant={"outline"}
          size={"lg"}
          type="button"
          onClick={() => router.back()}
          disabled={isPending}
        >
          <RyogoCaption color="light">{t("SecondaryCTA")}</RyogoCaption>
        </Button>
      </FormWrapper>
    </PageWrapper>
  )
}
