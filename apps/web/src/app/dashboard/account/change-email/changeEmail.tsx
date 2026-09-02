"use client"

import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { RyogoInput } from "@/components/form/ryogoFormFields"
import { FindUserAccountsByPhoneRoleType } from "@ryogo-travel-app/api/services/user.services"
import { changeMyEmailAction } from "@/app/actions/users/changeMyEmailAction"
import { FormWrapper, PageWrapper } from "@/components/page/pageWrappers"
import { Separator } from "@/components/ui/separator"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"

export default function ChangeEmailAccountComponent({
  usersWithPhoneRole,
  userId,
  agencyId,
}: {
  usersWithPhoneRole: FindUserAccountsByPhoneRoleType
  userId: string
  agencyId: string
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
  const form = useForm<SchemaType>({
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
          u.id === userId &&
          u.email.toLowerCase() === data.newEmail.toLowerCase(),
      )
    ) {
      form.setError("newEmail", {
        type: "manual",
        message: t("Field2.Error3"),
      })
    } else if (
      usersWithPhoneRole.some(
        (u) => u.email.toLowerCase() === data.newEmail.toLowerCase(),
      )
    ) {
      form.setError("newEmail", {
        type: "manual",
        message: t("Field2.Error4"),
      })
    } else {
      const result = await changeMyEmailAction(
        userId,
        data.password,
        data.newEmail,
        agencyId,
      )
      if (result) {
        //If success, redirect
        toast.success(t("Success"))
        router.replace("/dashboard/account")
      } else {
        //If failed, show error
        form.setError("password", {
          type: "manual",
          message: t("APIError"),
        })
        // formData.reset();
      }
    }
  }
  return (
    <PageWrapper id="ChangePassword">
      <FormWrapper<SchemaType>
        id="ChangePasswordForm"
        onSubmit={form.handleSubmit(onSubmit)}
        form={form}
      >
        <RyogoInput
          name={"password"}
          type="password"
          label={t("Field1.Title")}
          placeholder={t("Field1.Placeholder")}
          description={t("Field1.Description")}
        />
        <RyogoInput
          name={"newEmail"}
          type="email"
          label={t("Field2.Title")}
          placeholder={t("Field2.Placeholder")}
          description={t("Field2.Description")}
        />
        <Separator />
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
