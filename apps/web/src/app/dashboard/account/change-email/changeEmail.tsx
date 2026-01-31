"use client"

import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Spinner } from "@/components/ui/spinner"
import { useForm } from "react-hook-form"
import { Form } from "@/components/ui/form"
import { DashboardInput } from "@/components/form/dashboardFormFields"
import { pageClassName } from "@/components/page/pageCommons"
import { Button } from "@/components/ui/button"

import { FindUserAccountsByPhoneRoleType } from "@ryogo-travel-app/api/services/user.services"
import { changeEmailAction } from "@/app/actions/users/changeEmailAction"

export default function ChangeEmailAccountComponent({
  usersWithPhoneRole,
  userId,
}: {
  usersWithPhoneRole: FindUserAccountsByPhoneRoleType
  userId: string
}) {
  const t = useTranslations("Dashboard.Account.ChangeEmail")
  const router = useRouter()

  const schema = z.object({
    password: z
      .string()
      .min(8, t("Field1.Error1"))
      .refine((s) => !s.includes(" "), t("Field1.Error2")),
    newEmail: z.email(t("Field2.Error1")).max(60, t("Field2.Error2")),
  })

  type SchemaType = z.infer<typeof schema>
  const formData = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      newEmail: "",
    },
  })

  //Submit actions
  const onSubmit = async (data: SchemaType) => {
    if (
      usersWithPhoneRole.some(
        (u) =>
          u.id == userId &&
          u.email.toLowerCase() == data.newEmail.toLowerCase(),
      )
    ) {
      formData.setError("newEmail", {
        type: "manual",
        message: t("Field2.Error3"),
      })
    } else if (
      usersWithPhoneRole.some(
        (u) => u.email.toLowerCase() == data.newEmail.toLowerCase(),
      )
    ) {
      formData.setError("newEmail", {
        type: "manual",
        message: t("Field2.Error4"),
      })
    } else {
      const result = await changeEmailAction(
        userId,
        data.password,
        data.newEmail,
      )
      if (result) {
        //If success, redirect
        toast.success(t("Success"))
        router.replace("/dashboard/account")
      } else {
        //If failed, show error
        formData.setError("password", {
          type: "manual",
          message: t("APIError"),
        })
        // formData.reset();
      }
    }
  }
  return (
    <div id="ChangePassword" className={pageClassName}>
      <Form {...formData}>
        <form
          id="ChangePasswordForm"
          onSubmit={formData.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 lg:gap-4 p-4 lg:p-5 bg-white rounded-lg shadow w-full"
        >
          <DashboardInput
            name={"password"}
            type="password"
            label={t("Field1.Title")}
            placeholder={t("Field1.Placeholder")}
            description={t("Field1.Description")}
          />
          <DashboardInput
            name={"newEmail"}
            type="email"
            label={t("Field2.Title")}
            placeholder={t("Field2.Placeholder")}
            description={t("Field2.Description")}
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
