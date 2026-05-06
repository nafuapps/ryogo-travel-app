//Confirm Email page
"use client"

import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { H4Grey } from "@/components/typography"
import { useRouter } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { useTransition } from "react"
import {
  AuthActionWrapper,
  AuthFormWrapper,
  AuthPageWrapper,
} from "@/components/auth/authWrappers"
import { setNewPasswordAction } from "@/app/actions/users/setNewPasswordAction"
import { RyogoInput } from "@/components/form/ryogoFormFields"

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
        <H4Grey>{t("PageTitle")}</H4Grey>
        <RyogoInput
          name={"code"}
          type="tel"
          label={t("Field1.Title")}
          placeholder={t("Field1.Placeholder")}
          description={t("Field1.Description")}
        />
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
          <Button variant={"default"} size={"lg"} disabled={isPending}>
            {isPending && <Spinner />}
            {isPending ? t("Loading") : t("PrimaryCTA")}
          </Button>
          <Button
            variant={"secondary"}
            type="button"
            onClick={() => {
              router.replace(`/auth/forgot-password/${userId}`)
            }}
          >
            {t("DidnotReceiveCode")}
          </Button>
        </AuthActionWrapper>
      </AuthFormWrapper>
    </AuthPageWrapper>
  )
}
