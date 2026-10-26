"use client"

import { newUserSetPasswordAction } from "@/app/actions/users/newUserSetPasswordAction"
import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import { RyogoInput } from "@/components/form/ryogoFormFields"
import {
  FormContentWrapper,
  FormWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { MIN_PASSWORD_LENGTH } from "@/lib/uiConfig"
import { zodResolver } from "@hookform/resolvers/zod"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

export function ChangePasswordStepComponent({
  userId,
  agencyId,
  role,
}: {
  userId: string
  agencyId: string
  role: UserRolesEnum
}) {
  const t = useTranslations("Onboarding.ChangePasswordPage.Step1")
  const router = useRouter()

  const step1Schema = z
    .object({
      newPassword: z
        .string()
        .min(MIN_PASSWORD_LENGTH, t("Field1.Error1"))
        .refine((s) => !s.includes(" "), t("Field1.Error2")),
      confirmPassword: z
        .string()
        .min(MIN_PASSWORD_LENGTH, t("Field2.Error1"))
        .refine((s) => !s.includes(" "), t("Field2.Error2")),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("Field2.Error3"),
      path: ["confirmPassword"], // path of error
    })
  type Step1Type = z.infer<typeof step1Schema>
  const formData = useForm<Step1Type>({
    resolver: zodResolver(step1Schema),
  })

  //Submit actions
  const onSubmit = async (values: Step1Type) => {
    const result = await newUserSetPasswordAction({
      userId,
      agencyId,
      newPassword: values.newPassword,
    })
    if (result) {
      //If success, redirect
      toast.success(t("Success"))
      if (role === UserRolesEnum.DRIVER) {
        router.replace("/rider/home")
      } else {
        router.replace("/dashboard/home")
      }
    } else {
      //If failed, show error
      toast.error(t("APIError"))
    }
  }

  return (
    <FormWrapper<Step1Type>
      id="Step1Form"
      form={formData}
      onSubmit={formData.handleSubmit(onSubmit)}
    >
      <FormContentWrapper asCard={false}>
        <RyogoInput
          name={"newPassword"}
          type="password"
          label={t("Field1.Title")}
          placeholder={t("Field1.Placeholder")}
          description={t("Field1.Description")}
        />
        <RyogoInput
          name={"confirmPassword"}
          type="password"
          label={t("Field2.Title")}
          placeholder={t("Field2.Placeholder")}
          description={t("Field2.Description")}
        />
      </FormContentWrapper>
      <StickyActionWrapper bgTransparent>
        <RyogoDefaultButton
          size={"lg"}
          type="submit"
          disabled={formData.formState.isSubmitting}
          showSpinner={formData.formState.isSubmitting}
          label={
            formData.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")
          }
        />
      </StickyActionWrapper>
    </FormWrapper>
  )
}
