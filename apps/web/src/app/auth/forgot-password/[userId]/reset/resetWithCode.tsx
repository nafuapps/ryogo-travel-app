//Confirm Email page
"use client"

import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useTranslations } from "next-intl"
import { RyogoCaption, RyogoH3 } from "@/components/typography"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { AuthPageWrapper } from "@/components/flows/auth/authWrappers"
import { setNewPasswordAction } from "@/app/actions/users/setNewPasswordAction"
import { RyogoInput, RyogoOTPInput } from "@/components/form/ryogoFormFields"
import { useBotDetection } from "@/hooks/useBotDetection"
import {
  RyogoDefaultButton,
  RyogoGhostButton,
} from "@/components/buttons/ryogoButtons"
import { MIN_PASSWORD_LENGTH } from "@/lib/uiConfig"
import { FindUserDetailsByIdType } from "@ryogo-travel-app/api/services/user.services"
import AuthAccountCard from "@/components/flows/auth/authAccountCard"
import {
  FormContentWrapper,
  FormWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import { useState, useTransition } from "react"
import { checkVerificationCodeAction } from "@/app/actions/users/checkVerificationCodeAction"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { CheckCircle } from "lucide-react"

export default function ResetWithCodePageComponent({
  user,
}: {
  user: NonNullable<FindUserDetailsByIdType>
}) {
  const t = useTranslations("Auth.ForgotPassword.Step2")

  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const { checkBotActivity, isBot } = useBotDetection()
  const [codeSuccess, setCodeSuccess] = useState<boolean | null>(null)

  const formSchema = z
    .object({
      code: z.string().length(6, t("Field1.Error1")),
      password: z
        .string()
        .min(MIN_PASSWORD_LENGTH, t("Field2.Error1"))
        .refine((s) => !s.includes(" "), t("Field2.Error2")),
      confirmPassword: z
        .string()
        .min(MIN_PASSWORD_LENGTH, t("Field3.Error1"))
        .refine((s) => !s.includes(" "), t("Field3.Error2")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("Field3.Error3"),
      path: ["confirmPassword"],
    }) //Both passwords should match

  type SchemaType = z.infer<typeof formSchema>
  const form = useForm<SchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      password: "",
      confirmPassword: "",
    },
  })

  //Run code verification when code is input
  const verifyCode = async (code: string) => {
    if (checkBotActivity()) {
      toast.error(t("BotError"))
      return
    }
    startTransition(async () => {
      const result = await checkVerificationCodeAction(code, user.id)
      if (result === true) {
        setCodeSuccess(true)
      } else {
        form.setError("code", {
          type: "manual",
          message: t("Field1.Error2"),
        })
        setTimeout(() => {
          form.setValue("code", "")
          form.clearErrors("code")
        }, 3000) //Clear the field and errors after 3s
        setCodeSuccess(false)
      }
    })
  }

  //Submit actions
  const onSubmit = async (data: SchemaType) => {
    if (checkBotActivity()) {
      toast.error(t("BotError"))
      return
    }
    const updatedUser = await setNewPasswordAction(user.id, data.password)
    if (updatedUser) {
      toast.success(t("Success"))
    } else {
      toast.error(t("Error"))
    }
  }

  return (
    <AuthPageWrapper>
      <FormWrapper<SchemaType>
        id="ForgorPasswordForm"
        onSubmit={form.handleSubmit(onSubmit)}
        form={form}
      >
        <RyogoH3 color="light">{t("PageTitle")} </RyogoH3>
        <AuthAccountCard user={user} />
        {codeSuccess !== true ? (
          <FormContentWrapper asCard={false}>
            <RyogoOTPInput
              name={"code"}
              label={t("Field1.Title")}
              description={t("Field1.Description")}
            />
            <RyogoDefaultButton
              label={isPending ? t("Loading") : t("VerifyCTA")}
              size="lg"
              type="button"
              onClick={() => verifyCode(form.getValues("code"))}
              disabled={isPending || isBot}
            />
            <RyogoGhostButton
              label={t("DidnotReceiveCode")}
              labelColor="light"
              size="lg"
              type="button"
              disabled={isPending}
              onClick={() => {
                router.push(`/auth/forgot-password/${user.id}`)
              }}
            />
          </FormContentWrapper>
        ) : (
          <FormContentWrapper asCard={false}>
            <SectionRowWrapper className="border border-green-500 flex items-center p-2 lg:p-3 rounded-md">
              <RyogoIcon icon={CheckCircle} size="xs" color="green" thick />
              <RyogoCaption color="green">{t("CodeVerified")}</RyogoCaption>
            </SectionRowWrapper>
            <RyogoInput
              name={"password"}
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
            <RyogoDefaultButton
              label={
                form.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")
              }
              size="lg"
              type="submit"
              disabled={form.formState.isSubmitting || isBot}
            />
          </FormContentWrapper>
        )}
      </FormWrapper>
    </AuthPageWrapper>
  )
}
