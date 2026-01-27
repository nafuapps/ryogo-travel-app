"use client"

import { DashboardInput } from "@/components/form/dashboardFormFields"
import { pageClassName } from "@/components/page/pageCommons"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
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
import { changeAgencyPhoneAction } from "./changeAgencyPhoneAction"

export default function ChangeAgencyPhonePageComponent({
  agency,
  allAgencies,
}: {
  agency: NonNullable<FindAgencyByIdType>
  allAgencies: FindAgenciesByEmailType
}) {
  const t = useTranslations("Dashboard.AccountAgency.ChangePhone")
  const router = useRouter()

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
    if (data.newPhone == agency.businessPhone) {
      formData.setError("newPhone", {
        type: "manual",
        message: t("Field1.Error2"),
      })
    } else if (
      //check if another agency has this phone and email
      allAgencies.some(
        (u) =>
          u.businessPhone == data.newPhone &&
          u.businessEmail == agency.businessEmail,
      )
    ) {
      formData.setError("newPhone", {
        type: "manual",
        message: t("Field1.Error3"),
      })
    } else {
      const modifiedAgency = await changeAgencyPhoneAction(
        agency.id,
        data.newPhone,
      )
      if (modifiedAgency) {
        router.replace(`/dashboard/account/agency`)
        toast.success(t("Success"))
      } else {
        router.back()
        toast.error(t("Error"))
      }
    }
  }

  return (
    <div id="ChangeAgencyPhonePage" className={pageClassName}>
      <Form {...formData}>
        <form
          id="ChangeAgencyPhoneForm"
          onSubmit={formData.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 lg:gap-4 p-4 lg:p-5 bg-white rounded-lg shadow w-full"
        >
          <DashboardInput
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
