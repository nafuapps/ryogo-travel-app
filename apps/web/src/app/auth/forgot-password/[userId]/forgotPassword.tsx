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
import { forgotPasswordAction } from "@/app/actions/users/forgotPasswordAction"
import {
  AuthActionWrapper,
  AuthFormWrapper,
  AuthPageWrapper,
} from "@/components/auth/authWrappers"
import { differenceInMinutes } from "date-fns"
import { RyogoInput } from "@/components/form/ryogoFormFields"
import { UserCard } from "@/components/auth/userCard"
import { FindUserDetailsByIdType } from "@ryogo-travel-app/api/services/user.services"

const CODE_RESEND_MINUTES = 5

export default function ForgotPasswordPageComponent({
  user,
}: {
  user: NonNullable<FindUserDetailsByIdType>
}) {
  const t = useTranslations("Auth.ForgotPassword.Step1")

  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const forgotPasswordLink = `/auth/forgot-password/${user.id}/reset`

  const codeSentRecently = user.codeSentAt
    ? differenceInMinutes(new Date(), user.codeSentAt) < CODE_RESEND_MINUTES
    : false

  const formSchema = z.object({
    email: z.email(t("Error1")),
  })

  type SchemaType = z.infer<typeof formSchema>
  const methods = useForm<SchemaType>({
    resolver: zodResolver(formSchema),
  })

  //Submit actions
  const onSubmit = async (data: SchemaType) => {
    if (data.email.toLowerCase().trim() !== user.email.toLowerCase().trim()) {
      methods.setError("email", { type: "manual", message: t("APIError") })
    } else {
      startTransition(async () => {
        if (await forgotPasswordAction(user.id, forgotPasswordLink)) {
          toast.success(t("Success"))
          router.replace(`/auth/forgot-password/${user.id}/reset`)
        } else {
          toast.error(t("Error"))
        }
      })
    }
  }

  return (
    <AuthPageWrapper>
      <AuthFormWrapper<SchemaType>
        id="ForgorPasswordForm"
        onSubmit={methods.handleSubmit(onSubmit)}
        form={methods}
      >
        <H4Grey>{t("PageTitle")}</H4Grey>
        <UserCard user={user} />
        <RyogoInput
          name={"email"}
          type="email"
          label={t("Input.Title")}
          placeholder={t("Input.Placeholder")}
          description={t("Input.Description")}
        />
        <AuthActionWrapper>
          {/* Disable CTA if code was sent recently */}
          <Button
            variant={"default"}
            size={"lg"}
            disabled={isPending || codeSentRecently}
          >
            {isPending && <Spinner />}
            {isPending
              ? t("Loading")
              : codeSentRecently
                ? t("CodeSentRecently", { count: CODE_RESEND_MINUTES })
                : t("PrimaryCTA")}
          </Button>
          <Button
            variant={"secondary"}
            type="button"
            onClick={() => {
              router.back()
            }}
          >
            {t("Back")}
          </Button>
        </AuthActionWrapper>
      </AuthFormWrapper>
    </AuthPageWrapper>
  )
}
