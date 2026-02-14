"use client"

import { DashboardInput } from "@/components/form/dashboardFormFields"
import { pageClassName } from "@/components/page/pageCommons"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Spinner } from "@/components/ui/spinner"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  FindUserAccountsByPhoneRoleType,
  FindUserDetailsByIdType,
} from "@ryogo-travel-app/api/services/user.services"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import { changeUserEmailAction } from "@/app/actions/users/changeUserEmailAction"
import { useTransition } from "react"

export default function ChangeUserEmailPageComponent({
  user,
  allUsers,
}: {
  user: NonNullable<FindUserDetailsByIdType>
  allUsers: FindUserAccountsByPhoneRoleType
}) {
  const t = useTranslations("Dashboard.UserDetails.ChangeEmail")
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const modifyUserSchema = z.object({
    newEmail: z.email(t("Field1.Error1")).max(60, t("Field1.Error2")),
  })
  type ModifyUserType = z.infer<typeof modifyUserSchema>

  const formData = useForm<ModifyUserType>({
    resolver: zodResolver(modifyUserSchema),
  })

  //Submit actions
  async function onSubmit(data: ModifyUserType) {
    //Check if same email has been entered
    if (data.newEmail === user.email) {
      formData.setError("newEmail", {
        type: "manual",
        message: t("Field1.Error3"),
      })
    } else if (
      //check if another user has this email
      allUsers.some((u) => u.email === data.newEmail)
    ) {
      formData.setError("newEmail", {
        type: "manual",
        message: t("Field1.Error4"),
      })
    } else {
      startTransition(async () => {
        const modifiedUser = await changeUserEmailAction(
          user.id,
          user.agencyId,
          data.newEmail,
        )
        if (modifiedUser) {
          router.replace(`/dashboard/users/${user.id}`)
          toast.success(t("Success"))
        } else {
          router.back()
          toast.error(t("Error"))
        }
      })
    }
  }

  return (
    <div id="ChangeUserEmailPage" className={pageClassName}>
      <Form {...formData}>
        <form
          id="ChangeUserEmailForm"
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
