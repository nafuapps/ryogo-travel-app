"use client"

import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useTranslations } from "next-intl"
import { RyogoCaption, RyogoH3 } from "@/components/typography"
import { useRouter } from "next/navigation"
import { RyogoOTPInput } from "@/components/form/ryogoFormFields"
import { findLoginUsersAction } from "@/app/actions/users/findLoginUsersAction"
import { toast } from "sonner"
import { useBotDetection } from "@/hooks/useBotDetection"
import { PHONE_LENGTH } from "@/lib/uiConfig"
import {
  FormWrapper,
  SectionColWrapper,
  AuthPageWrapper,
} from "@/components/page/pageWrappers"
import { Separator } from "@/components/ui/separator"
import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"
import Link from "next/link"

export default function SignupPageComponent() {
  const t = useTranslations("Auth.SignupPage.Step1")
  const router = useRouter()
  const { checkBotActivity, isBot } = useBotDetection()

  const formSchema = z.object({
    phoneNumber: z
      .string()
      .length(PHONE_LENGTH, t("Error1"))
      .regex(/^[0-9]+$/, t("Error2")),
  })

  type SchemaType = z.infer<typeof formSchema>
  const form = useForm<SchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
    },
  })

  //Submit actions
  const onSubmit = async (data: SchemaType) => {
    if (checkBotActivity()) {
      toast.error(t("BotError"))
      form.setValue("phoneNumber", "")
      return
    }
    const users = await findLoginUsersAction(data.phoneNumber)
    if (users.length > 0) {
      // If atleast 1 user found, go to existing accounts page
      router.push(`/auth/signup/${data.phoneNumber}`)
    } else {
      // else, go to onboarding page
      router.push(`/onboarding?phone=${data.phoneNumber}`)
    }
  }

  return (
    <AuthPageWrapper
      className={`${form.formState.isSubmitted && "animate-zoom-out"}`}
    >
      <RyogoH3 color="light">{t("PageTitle")} </RyogoH3>
      <FormWrapper<SchemaType> id="SignupForm" form={form}>
        <RyogoOTPInput
          name={"phoneNumber"}
          label={t("Input.Title")}
          description={
            form.formState.isSubmitting
              ? t("Input.Loading")
              : t("Input.Description")
          }
          length={10}
          onSubmit={form.handleSubmit(onSubmit)}
          disabled={form.formState.isSubmitting || isBot}
        />
      </FormWrapper>
      <Separator />
      <SectionColWrapper>
        <RyogoCaption color="light">{t("LoginTitle")}</RyogoCaption>
        <Link href={"/auth/login"}>
          <RyogoOutlineButton label={t("LoginCTA")} />
        </Link>
      </SectionColWrapper>
    </AuthPageWrapper>
  )
}
