"use client"

import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useTranslations } from "next-intl"
import { RyogoH3 } from "@/components/typography"
import { useRouter } from "next/navigation"
import { findLoginUsersAction } from "@/app/actions/users/findLoginUsersAction"
import { AuthPageWrapper } from "@/components/flows/auth/authWrappers"
import { RyogoOTPInput } from "@/components/form/ryogoFormFields"
import { toast } from "sonner"
import { useBotDetection } from "@/hooks/useBotDetection"
import { PHONE_LENGTH } from "@/lib/uiConfig"
import { FormWrapper } from "@/components/page/pageWrappers"

/*
1. Find user by phone number
2. No user found, cannot login (push for signup)
3. If multiple users found, go to select account page
*/

export default function LoginPageComponent() {
  const t = useTranslations("Auth.LoginPage.Step1")
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
    if (!users) {
      toast.error(t("ServerError")) // Show server error if API call fails
    } else {
      if (users.length > 0) {
        // If atleast 1 user found, go to accounts page
        router.push(`/auth/login/${data.phoneNumber}`)
      } else {
        // Else, Show no user found error
        form.setError("phoneNumber", {
          type: "manual",
          message: t("NotFoundError"),
        })
        setTimeout(() => {
          form.setValue("phoneNumber", "")
          form.clearErrors("phoneNumber")
        }, 3000) //Clear the field after 3s
      }
    }
  }

  return (
    <AuthPageWrapper>
      <FormWrapper<SchemaType> id="LoginForm" form={form}>
        <RyogoH3 color="light">{t("PageTitle")} </RyogoH3>
        <RyogoOTPInput
          name={"phoneNumber"}
          label={t("Input.Title")}
          length={10}
          onSubmit={form.handleSubmit(onSubmit)}
          disabled={form.formState.isSubmitting || isBot}
        />
      </FormWrapper>
    </AuthPageWrapper>
  )
}
