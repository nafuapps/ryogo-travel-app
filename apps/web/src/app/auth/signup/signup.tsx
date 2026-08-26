"use client"

import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useTranslations } from "next-intl"
import { RyogoH3 } from "@/components/typography"
import { useRouter } from "next/navigation"
import {
  AuthActionWrapper,
  AuthFormWrapper,
  AuthPageWrapper,
} from "@/components/flows/auth/authWrappers"
import { RyogoInput } from "@/components/form/ryogoFormFields"
import { useTransition } from "react"
import { findLoginUsersAction } from "@/app/actions/users/findLoginUsersAction"
import { toast } from "sonner"
import { useBotDetection } from "@/hooks/useBotDetection"
import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"

export default function SignupPageComponent() {
  const t = useTranslations("Auth.SignupPage.Step1")
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const { checkBotActivity, isBot } = useBotDetection()

  const formSchema = z.object({
    phoneNumber: z
      .string()
      .length(10, t("Error1"))
      .regex(/^[0-9]+$/, t("Error2")),
  })

  type SchemaType = z.infer<typeof formSchema>
  const methods = useForm<SchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
    },
  })

  //Submit actions
  const onSubmit = async (data: SchemaType) => {
    if (checkBotActivity()) {
      toast.error(t("BotError"))
      return
    }
    startTransition(async () => {
      const users = await findLoginUsersAction(data.phoneNumber)
      if (users.length > 0) {
        // If atleast 1 user found, go to existing accounts page
        router.push(`/auth/signup/${data.phoneNumber}`)
      } else {
        // else, go to onboarding page
        router.push(`/onboarding?phone=${data.phoneNumber}`)
      }
    })
  }

  return (
    <AuthPageWrapper>
      <AuthFormWrapper<SchemaType>
        id="SignupForm"
        form={methods}
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <RyogoH3 color="light">{t("PageTitle")} </RyogoH3>
        <RyogoInput
          name={"phoneNumber"}
          type="tel"
          label={t("Input.Title")}
          placeholder={t("Input.Placeholder")}
        />
        <AuthActionWrapper>
          <RyogoDefaultButton
            label={isPending ? t("Loading") : t("PrimaryCTA")}
            size={"lg"}
            type="submit"
            disabled={isPending || isBot}
            showSpinner={isPending}
          />
        </AuthActionWrapper>
      </AuthFormWrapper>
    </AuthPageWrapper>
  )
}
