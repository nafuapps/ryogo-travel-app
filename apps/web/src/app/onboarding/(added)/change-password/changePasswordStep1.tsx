"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Spinner } from "@/components/ui/spinner"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import z from "zod"
import { RyogoInput, RyogoOTPInput } from "@/components/form/ryogoFormFields"
import {
  OnboardingStepForm,
  OnboardingStepContent,
  OnboardingStepActions,
  OnboardingStepPrimaryAction,
} from "@/components/flows/onboarding/onboardingSteps"
import { Form } from "@/components/ui/form"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { useTransition } from "react"
import { verifyUserSetPasswordAction } from "@/app/actions/users/verifyUserSetPasswordAction"

export function ChangePasswordStep1(props: {
  userId: string
  agencyId: string
  role: UserRolesEnum
}) {
  const t = useTranslations("Onboarding.ChangePasswordPage.Step1")
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const step1Schema = z
    .object({
      sentCode: z.string().length(6, t("Field1.Error1")),
      newPassword: z
        .string()
        .min(8, t("Field2.Error1"))
        .refine((s) => !s.includes(" "), t("Field2.Error2")),
      confirmPassword: z
        .string()
        .min(8, t("Field3.Error1"))
        .refine((s) => !s.includes(" "), t("Field3.Error2")),
    })
    .refine((data) => data.newPassword !== data.sentCode, {
      message: t("Field2.Error3"),
      path: ["newPassword"], // path of error
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("Field3.Error3"),
      path: ["confirmPassword"], // path of error
    })
  type Step1Type = z.infer<typeof step1Schema>
  const formData = useForm<Step1Type>({
    resolver: zodResolver(step1Schema),
  })

  //Submit actions
  const onSubmit = async (data: Step1Type) => {
    startTransition(async () => {
      const result = await verifyUserSetPasswordAction(
        props.userId,
        props.agencyId,
        data.sentCode,
        data.newPassword,
      )
      if (result) {
        //If success, redirect
        toast.success(t("Success"))
        if (props.role === UserRolesEnum.DRIVER) {
          router.replace("/rider")
        } else {
          router.replace("/dashboard")
        }
      } else {
        //If failed, show error
        formData.setError("sentCode", {
          type: "manual",
          message: t("APIError"),
        })
      }
    })
  }

  return (
    <Form {...formData}>
      <OnboardingStepForm
        formId="Step1Form"
        submit={formData.handleSubmit(onSubmit)}
      >
        <OnboardingStepContent contentId="Step4Content">
          <RyogoOTPInput
            name={"sentCode"}
            type="password"
            label={t("Field1.Title")}
            placeholder={t("Field1.Placeholder")}
            description={t("Field1.Description")}
          />
          <RyogoInput
            name={"newPassword"}
            type="password"
            label={t("Field2.Title")}
            placeholder={t("Field2.Placeholder")}
            description={t("Field2.Description")}
          />
          <RyogoInput
            name={"confirmPassword"}
            type="password"
            label={t("Field3.Title")}
            placeholder={t("Field3.Placeholder")}
            description={t("Field3.Description")}
          />
        </OnboardingStepContent>
        <OnboardingStepActions actionsId="Step1Actions">
          <OnboardingStepPrimaryAction disabled={isPending}>
            {isPending && <Spinner />}
            {isPending ? t("Loading") : t("PrimaryCTA")}
          </OnboardingStepPrimaryAction>
        </OnboardingStepActions>
      </OnboardingStepForm>
    </Form>
  )
}
