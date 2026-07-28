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
import { useState, useTransition } from "react"
import { forgotPasswordAction } from "@/app/actions/users/forgotPasswordAction"
import {
  AuthActionWrapper,
  AuthFormWrapper,
  AuthPageWrapper,
} from "@/components/flows/auth/authWrappers"
import { differenceInMinutes } from "date-fns"
import { RyogoInput } from "@/components/form/ryogoFormFields"
import UserCard from "@/components/flows/auth/userCard"
import { FindUserDetailsByIdType } from "@ryogo-travel-app/api/services/user.services"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { X, Info } from "lucide-react"
import { useBotDetection } from "@/hooks/useBotDetection"
import { VERIFY_CODE_TIMEOUT_MINUTES } from "@/lib/uiConfig"

export default function ForgotPasswordPageComponent({
  user,
}: {
  user: NonNullable<FindUserDetailsByIdType>
}) {
  const t = useTranslations("Auth.ForgotPassword.Step1")

  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const { checkBotActivity, isBot } = useBotDetection()
  const [giveHelp, setGiveHelp] = useState(false)

  const maskedEmail = maskEmail(user.email)

  const forgotPasswordLink = `/auth/forgot-password/${user.id}/reset`

  const codeSentRecently = user.codeSentAt
    ? differenceInMinutes(new Date(), user.codeSentAt) <
      VERIFY_CODE_TIMEOUT_MINUTES
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
    if (checkBotActivity()) {
      toast.error(t("BotError"))
      return
    }
    if (data.email.toLowerCase().trim() !== user.email.toLowerCase().trim()) {
      methods.setError("email", { type: "manual", message: t("APIError") })
      setGiveHelp(true)
    } else {
      startTransition(async () => {
        if (await forgotPasswordAction(user.id, forgotPasswordLink)) {
          toast.success(t("Success"))
          router.push(`/auth/forgot-password/${user.id}/reset`)
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
        <RyogoH3 color="light">{t("PageTitle")} </RyogoH3>
        <UserCard user={user} />
        <RyogoInput
          name={"email"}
          type="email"
          label={t("Input.Title")}
          placeholder={t("Input.Placeholder")}
          description={t("Input.Description")}
        />
        {giveHelp && maskedEmail && (
          <div className="bg-yellow-50 p-2 rounded-lg flex gap-2 lg:gap-3 item-center">
            <RyogoIcon color="yellow" icon={Info} size={"md"} />
            <RyogoCaption>
              {t("GiveHelp", { maskedEmail: maskedEmail })}
            </RyogoCaption>
            <RyogoIcon
              color="slate"
              icon={X}
              size={"md"}
              onClick={() => setGiveHelp(false)}
            />
          </div>
        )}
        <AuthActionWrapper>
          {/* Disable CTA if code was sent recently */}
          <Button
            variant={"default"}
            size={"lg"}
            disabled={isPending || codeSentRecently || isBot}
          >
            {isPending && <Spinner />}
            {isPending
              ? t("Loading")
              : codeSentRecently
                ? t("CodeSentRecently", { count: VERIFY_CODE_TIMEOUT_MINUTES })
                : t("PrimaryCTA")}
          </Button>
          <Button
            variant={"outline"}
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

const maskEmail = (email: string) => {
  if (!email) return

  const [localPart, domain] = email.split("@")
  if (!localPart || localPart.length < 3 || !domain) return

  const firstChar = localPart[0]
  const lastChar = localPart[localPart.length - 1]

  // Keep the first and last letters, mask the middle with asterisks
  const maskedLocal = firstChar + "*".repeat(localPart.length - 2) + lastChar

  return `${maskedLocal}@${domain}`
}
