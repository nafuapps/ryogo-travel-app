import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import z from "zod"
import { RyogoOTPInput } from "@/components/form/ryogoFormFields"
import { useTransition } from "react"
import { toast } from "sonner"
import { resendVerificationCodeAction } from "@/app/actions/users/resendCodeAction"
import { SUPPORT_EMAIL, VERIFY_CODE_TIMEOUT_MINUTES } from "@/lib/uiConfig"
import Link from "next/link"
import {
  RyogoDefaultButton,
  RyogoGhostButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import {
  FormContentWrapper,
  FormWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"

export function VerifyAccountStep1({
  onNext,
  resendDifference,
  code,
}: {
  onNext: () => void
  resendDifference: number
  code: string
}) {
  const t = useTranslations("Onboarding.VerifyAccountPage.Step1")
  const [isPending, startTransition] = useTransition()

  const step1Schema = z.object({
    userEnteredcode: z.string().length(6, t("Field1.Error1")),
  })
  type Step1Type = z.infer<typeof step1Schema>
  const formData = useForm<Step1Type>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      userEnteredcode: "",
    },
  })

  //Submit action
  const onSubmit = (data: Step1Type) => {
    if (data.userEnteredcode === code) {
      onNext()
    } else {
      setTimeout(() => {
        formData.setValue("userEnteredcode", "")
      }, 1000) //Clear the field after 1s
      formData.setError("userEnteredcode", {
        type: "manual",
        message: t("APIError"),
      })
    }
  }

  //Resend code action
  const resendCode = async () => {
    setTimeout(() => {
      formData.setValue("userEnteredcode", "")
    }, 1000) //Clear the field after 1s
    startTransition(async () => {
      if (await resendVerificationCodeAction()) {
        toast.success(t("ResendSuccess"))
      } else {
        toast.error(t("ResendError"))
      }
    })
  }
  return (
    <FormWrapper<Step1Type>
      id="Step1Form"
      form={formData}
      onSubmit={formData.handleSubmit(onSubmit)}
    >
      <FormContentWrapper asCard={false}>
        <RyogoOTPInput
          name={"userEnteredcode"}
          label={t("Field1.Title")}
          description={t("Field1.Description")}
        />
      </FormContentWrapper>
      <StickyActionWrapper bgTransparent>
        <RyogoDefaultButton
          size={"lg"}
          type="submit"
          disabled={isPending}
          label={t("PrimaryCTA")}
        />
        <RyogoOutlineButton
          size={"lg"}
          type="button"
          onClick={resendCode}
          disabled={isPending || resendDifference < VERIFY_CODE_TIMEOUT_MINUTES}
          label={
            isPending
              ? t("Sending")
              : resendDifference >= VERIFY_CODE_TIMEOUT_MINUTES
                ? t("SecondaryCTA")
                : t("Timeout", {
                    difference: VERIFY_CODE_TIMEOUT_MINUTES - resendDifference,
                  })
          }
        />
        <Link href={`mailto:${SUPPORT_EMAIL}`} className="w-full">
          <RyogoGhostButton label={t("Help")} />
        </Link>
      </StickyActionWrapper>
    </FormWrapper>
  )
}
