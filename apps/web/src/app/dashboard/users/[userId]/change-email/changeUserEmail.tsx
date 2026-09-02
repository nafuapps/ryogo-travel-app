"use client"

import { RyogoInput } from "@/components/form/ryogoFormFields"
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
import { FormWrapper, PageWrapper } from "@/components/page/pageWrappers"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"

export default function ChangeUserEmailPageComponent({
  user,
  allUsers,
}: {
  user: NonNullable<FindUserDetailsByIdType>
  allUsers: FindUserAccountsByPhoneRoleType
}) {
  const t = useTranslations("Dashboard.UserDetails.ChangeEmail")
  const router = useRouter()

  const modifyUserSchema = z.object({
    newEmail: z.email(t("Field1.Error1")).max(60, t("Field1.Error2")),
  })
  type ModifyUserType = z.infer<typeof modifyUserSchema>

  const form = useForm<ModifyUserType>({
    resolver: zodResolver(modifyUserSchema),
  })

  async function onSubmit(data: ModifyUserType) {
    //Check if same email has been entered
    if (data.newEmail === user.email) {
      form.setError("newEmail", {
        type: "manual",
        message: t("Field1.Error3"),
      })
    } else if (
      //check if another user has this email
      allUsers.some((u) => u.email === data.newEmail)
    ) {
      form.setError("newEmail", {
        type: "manual",
        message: t("Field1.Error4"),
      })
    } else {
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
    }
  }

  return (
    <PageWrapper id="ChangeUserEmailPage">
      <FormWrapper<ModifyUserType>
        id="ChangeUserEmailForm"
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
