"use client"

import { findLoginUsersAction } from "@/app/actions/users/findLoginUsersAction"
import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"
import { RyogoOTPInput } from "@/components/form/ryogoFormFields"
import {
  AuthPageWrapper,
  FormWrapper,
  SectionColWrapper,
} from "@/components/page/pageWrappers"
import { RyogoCaption, RyogoH3, RyogoSmall } from "@/components/typography"
import { Separator } from "@/components/ui/separator"
import { useBotDetection } from "@/hooks/useBotDetection"
import { PHONE_LENGTH } from "@/lib/uiConfig"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

/*
1. Find user by phone number
2. No user found, cannot login (push for signup)
3. If multiple users found, go to select account page
*/

export default function LoginPageComponent() {
  const t = useTranslations("Auth.LoginPage.Step1")
  const router = useRouter()
  const { checkBotActivity, isBot } = useBotDetection()
  const [formSuccess, setFormSuccess] = useState<boolean | null>(null)

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
  const onSubmit = async (values: SchemaType) => {
    if (checkBotActivity()) {
      toast.error(t("BotError"))
      form.setValue("phoneNumber", "")
      return
    }

    const users = await findLoginUsersAction(values.phoneNumber)
    if (!users) {
      toast.error(t("ServerError")) // Show server error if API call fails
    } else {
      if (users.length > 0) {
        setFormSuccess(true)
        // If atleast 1 user found, go to accounts page
        router.push(`/auth/login/${values.phoneNumber}`)
      } else {
        setFormSuccess(false)
        // Else, Show no user found error
        form.setError("phoneNumber", {
          type: "manual",
          message: t("NotFoundError"),
        })
        setTimeout(() => {
          setFormSuccess(null)
          form.setValue("phoneNumber", "")
          form.clearErrors("phoneNumber")
        }, 2000) //Clear the field after 2s
      }
    }
  }

  return (
    <AuthPageWrapper
      className={`${formSuccess === true && "animate-zoom-out"}`}
    >
      <SectionColWrapper>
        <RyogoH3 color="slate" weight="font-bold">
          {t("PageTitle")}
        </RyogoH3>
        <RyogoSmall color="light">{t("Subtitle")} </RyogoSmall>
      </SectionColWrapper>
      <FormWrapper<SchemaType>
        id="LoginForm"
        form={form}
        className={`${formSuccess === false && "animate-shake"}`}
      >
        <RyogoOTPInput
          name={"phoneNumber"}
          label={t("Input.Title")}
          length={10}
          onSubmit={form.handleSubmit(onSubmit)}
          disabled={form.formState.isSubmitting || isBot}
        />
        {form.formState.isSubmitting && (
          <RyogoCaption color="light">{t("Input.Loading")}</RyogoCaption>
        )}
      </FormWrapper>
      <Separator />
      <SectionColWrapper>
        <RyogoCaption color="light">{t("SignupTitle")}</RyogoCaption>
        <Link href={"/auth/signup"}>
          <RyogoOutlineButton label={t("SignupCTA")} labelColor="slate" />
        </Link>
      </SectionColWrapper>
    </AuthPageWrapper>
  )
}
