//Login  page
"use client"

import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { H4Grey } from "@/components/typography"
import { useRouter } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"
import { useTransition } from "react"
import { findLoginUsersAction } from "@/app/actions/users/findLoginUsersAction"
import {
  AuthActionWrapper,
  AuthFormWrapper,
  AuthPageWrapper,
} from "@/components/auth/authWrappers"
import { RyogoInput } from "@/components/form/ryogoFormFields"

/*
1. Find user by phone number
2. No user found, cannot login (push for signup)
3. If multiple users found, go to select account page
*/

export default function LoginPageComponent() {
  const t = useTranslations("Auth.LoginPage.Step1")
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

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
    startTransition(async () => {
      const users = await findLoginUsersAction(data.phoneNumber)
      if (users.length > 0) {
        // If atleast 1 user found, go to accounts page
        router.push(`/auth/login/${data.phoneNumber}`)
      } else {
        // else, Show error
        methods.setError("phoneNumber", {
          type: "manual",
          message: t("APIError"),
        })
      }
    })
  }

  return (
    <AuthPageWrapper>
      <AuthFormWrapper<SchemaType>
        id="LoginForm"
        form={methods}
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <H4Grey>{t("PageTitle")}</H4Grey>
        <RyogoInput
          name={"phoneNumber"}
          type="tel"
          label={t("Input.Title")}
          placeholder={t("Input.Placeholder")}
        />
        <AuthActionWrapper>
          <Button variant={"default"} size={"lg"} disabled={isPending}>
            {isPending && <Spinner />}
            {isPending ? t("Loading") : t("PrimaryCTA")}
          </Button>
        </AuthActionWrapper>
      </AuthFormWrapper>
    </AuthPageWrapper>
  )
}
