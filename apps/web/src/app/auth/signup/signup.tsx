//Signup page
"use client"

import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { RyogoH3 } from "@/components/typography"
import { useRouter } from "next/navigation"
import {
  AuthActionWrapper,
  AuthFormWrapper,
  AuthPageWrapper,
} from "@/components/flows/auth/authWrappers"
import { RyogoInput } from "@/components/form/ryogoFormFields"
import { useTransition } from "react"
import { Spinner } from "@/components/ui/spinner"
import { findLoginUsersAction } from "@/app/actions/users/findLoginUsersAction"

export default function SignupPageComponent() {
  const t = useTranslations("Auth.SignupPage.Step1")
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
        <RyogoH3 color="slate">{t("PageTitle")} </RyogoH3>
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
