"use client"

import { DashboardInput } from "@/components/form/dashboardFormFields"
import { pageClassName } from "@/components/page/pageCommons"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
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
    newEmail: z.email(t("Field1.Error1")).max(60, t("Field1.Error2")),
  })
  type ModifyAgencyType = z.infer<typeof modifyAgencySchema>

  const formData = useForm<ModifyAgencyType>({
    resolver: zodResolver(modifyAgencySchema),
  })

  //Submit actions
  async function onSubmit(data: ModifyAgencyType) {
    //Check if same emailhas been entered
    if (data.newEmail == agency.businessEmail) {
      formData.setError("newEmail", {
        type: "manual",
        message: t("Field1.Error3"),
      })
    } else if (
      //check if another agency has this email and phone
      allAgencies.some(
        (u) =>
          u.businessEmail == data.newEmail &&
          u.businessPhone == agency.businessPhone,
      )
    ) {
      formData.setError("newEmail", {
        type: "manual",
        message: t("Field1.Error4"),
      })
    } else {
      const modifiedAgency = await changeAgencyEmailAction(
        agency.id,
        data.newEmail,
      )
      if (modifiedAgency) {
        router.replace("/dashboard/account/agency")
        toast.success(t("Success"))
      } else {
        router.back()
        toast.error(t("Error"))
      }
    }
  }

  return (
    <div id="ChangeAgencyEmailPage" className={pageClassName}>
      <Form {...formData}>
        <form
          id="ChangeAgencyEmailForm"
          onSubmit={formData.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 lg:gap-4 p-4 lg:p-5 bg-white rounded-lg shadow w-full"
        >
          <DashboardInput
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
            disabled={formData.formState.isSubmitting}
          >
            {formData.formState.isSubmitting && <Spinner />}
            {formData.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")}
          </Button>
          <Button
            variant={"secondary"}
            size={"lg"}
            type="button"
            onClick={() => router.back()}
            disabled={formData.formState.isSubmitting}
          >
            {t("SecondaryCTA")}
          </Button>
        </form>
      </Form>
    </div>
  )
}
