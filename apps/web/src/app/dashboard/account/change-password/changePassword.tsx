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
import { changePasswordAction } from "@/app/actions/users/changePasswordAction"
import { useTransition } from "react"

export default function ChangePasswordAccountComponent({
  userId,
  agencyId,
}: {
  userId: string
  agencyId: string
}) {
  const t = useTranslations("Dashboard.Account.ChangePassword")
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const schema = z
    .object({
      oldPassword: z
        .string()
        .min(8, t("Field1.Error1"))
        .refine((s) => !s.includes(" "), t("Field1.Error2")),
      newPassword: z
        .string()
        .min(8, t("Field2.Error1"))
        .refine((s) => !s.includes(" "), t("Field2.Error2")),
      confirmPassword: z
        .string()
        .min(8, t("Field3.Error1"))
        .refine((s) => !s.includes(" "), t("Field3.Error2")),
    })
    .refine((data) => data.newPassword !== data.oldPassword, {
      message: t("Field2.Error3"),
      path: ["newPassword"], // path of error
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("Field3.Error3"),
      path: ["confirmPassword"], // path of error
    })

  type SchemaType = z.infer<typeof schema>
  const formData = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  //Submit actions
  const onSubmit = async (data: SchemaType) => {
    startTransition(async () => {
      const result = await changePasswordAction(
        userId,
        agencyId,
        data.oldPassword,
        data.newPassword,
      )
      if (result) {
        //If success, redirect
        toast.success(t("Success"))

        router.replace("/dashboard/account")
      } else {
        //If failed, show error
        formData.setError("oldPassword", {
          type: "manual",
          message: t("APIError"),
        })
        // formData.reset();
      }
    })
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
            name={"oldPassword"}
            type="password"
            label={t("Field1.Title")}
            placeholder={t("Field1.Placeholder")}
            description={t("Field1.Description")}
          />
          <DashboardInput
            name={"newPassword"}
            type="password"
            label={t("Field2.Title")}
            placeholder={t("Field2.Placeholder")}
            description={t("Field2.Description")}
          />
          <DashboardInput
            name={"confirmPassword"}
            type="password"
            label={t("Field3.Title")}
            placeholder={t("Field3.Placeholder")}
            description={t("Field3.Description")}
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
        </form>
      </Form>
    </div>
  )
}
