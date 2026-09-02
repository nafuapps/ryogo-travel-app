//Confirm Email page
"use client"

import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useTranslations } from "next-intl"
import { RyogoH3 } from "@/components/typography"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  AuthActionWrapper,
  AuthFormWrapper,
  AuthPageWrapper,
} from "@/components/flows/auth/authWrappers"
import { setNewPasswordAction } from "@/app/actions/users/setNewPasswordAction"
import { RyogoInput, RyogoOTPInput } from "@/components/form/ryogoFormFields"
import { Separator } from "@/components/ui/separator"
import { useBotDetection } from "@/hooks/useBotDetection"
import {
  RyogoDefaultButton,
  RyogoGhostButton,
} from "@/components/buttons/ryogoButtons"

export default function ResetWithCodePageComponent({
  userId,
  verificationCode,
}: {
  userId: string
  verificationCode: string
}) {
  const t = useTranslations("Auth.ForgotPassword.Step2")

  const router = useRouter()
  const { checkBotActivity, isBot } = useBotDetection()

  const formSchema = z
    .object({
      code: z.string().length(6, t("Field1.Error1")),
      password: z
        .string()
        .min(8, t("Field2.Error1"))
        .refine((s) => !s.includes(" "), t("Field2.Error2")),
      confirmPassword: z
        .string()
        .min(8, t("Field3.Error1"))
        .refine((s) => !s.includes(" "), t("Field3.Error2")),
    })
    .refine((data) => data.code === verificationCode, {
      message: t("Field1.Error2"),
      path: ["code"],
    }) //Code should match with DB
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

  //Submit actions
  const onSubmit = async (data: SchemaType) => {
    if (checkBotActivity()) {
      toast.error(t("BotError"))
      return
    }
    const updatedUser = await setNewPasswordAction(userId, data.password)
    if (updatedUser) {
      toast.success(t("Success"))
    } else {
      toast.error(t("Error"))
    }
  }

  return (
    <AuthPageWrapper>
      <AuthFormWrapper<SchemaType>
        id="ForgorPasswordForm"
        onSubmit={form.handleSubmit(onSubmit)}
        form={form}
      >
        <RyogoH3 color="light">{t("PageTitle")} </RyogoH3>
        <RyogoOTPInput
          name={"code"}
          label={t("Field1.Title")}
          description={t("Field1.Description")}
        />
        <Separator />
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
        <AuthActionWrapper>
          <RyogoDefaultButton
            label={form.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")}
            size="lg"
            type="submit"
            disabled={form.formState.isSubmitting || isBot}
          />
          <RyogoGhostButton
            label={t("DidnotReceiveCode")}
            size="lg"
            type="button"
            disabled={form.formState.isSubmitting}
            onClick={() => {
              router.push(`/auth/forgot-password/${userId}`)
            }}
          />
        </AuthActionWrapper>
      </AuthFormWrapper>
    </AuthPageWrapper>
  )
}
