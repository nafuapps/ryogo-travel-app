//Confirm Email page
"use client"

import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { RyogoCaption, RyogoH3 } from "@/components/typography"
import { useRouter } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { useTransition } from "react"
import {
  AuthActionWrapper,
  AuthFormWrapper,
  AuthPageWrapper,
} from "@/components/flows/auth/authWrappers"
import { setNewPasswordAction } from "@/app/actions/users/setNewPasswordAction"
import { RyogoInput, RyogoOTPInput } from "@/components/form/ryogoFormFields"
import { Separator } from "@/components/ui/separator"
import { useBotDetection } from "@/hooks/useBotDetection"

export default function ResetWithCodePageComponent({
  userId,
  verificationCode,
}: {
  userId: string
  verificationCode: string
}) {
  const t = useTranslations("Auth.ForgotPassword.Step2")

  const router = useRouter()
  const [isPending, startTransition] = useTransition()
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
  const methods = useForm<SchemaType>({
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
    startTransition(async () => {
      if (await setNewPasswordAction(userId, data.password)) {
        toast.success(t("Success"))
      } else {
        toast.error(t("Error"))
      }
    })
  }

  return (
    <AuthPageWrapper>
      <AuthFormWrapper<SchemaType>
        id="ForgorPasswordForm"
        onSubmit={methods.handleSubmit(onSubmit)}
        form={methods}
      >
        <RyogoH3 color="light">{t("PageTitle")} </RyogoH3>
        <RyogoOTPInput
          name={"code"}
          type="tel"
          label={t("Field1.Title")}
          placeholder={t("Field1.Placeholder")}
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
          <Button variant={"default"} size={"lg"} disabled={isPending || isBot}>
            {isPending && <Spinner />}
            <RyogoCaption color="white">
              {isPending ? t("Loading") : t("PrimaryCTA")}
            </RyogoCaption>
          </Button>
          <Button
            variant={"ghost"}
            type="button"
            size="lg"
            onClick={() => {
              router.push(`/auth/forgot-password/${userId}`)
            }}
          >
            <RyogoCaption color="light">{t("DidnotReceiveCode")}</RyogoCaption>
          </Button>
        </AuthActionWrapper>
      </AuthFormWrapper>
    </AuthPageWrapper>
  )
}
