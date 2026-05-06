//Signup page
"use client"

import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { H4Grey } from "@/components/typography"
import { useRouter } from "next/navigation"
import {
  AuthActionWrapper,
  AuthFormWrapper,
  AuthPageWrapper,
} from "@/components/auth/authWrappers"
import { RyogoInput } from "@/components/form/ryogoFormFields"

export default function SignupPageComponent() {
  const t = useTranslations("Auth.SignupPage.Step1")
  const router = useRouter()

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
    router.push(`/auth/signup/${data.phoneNumber}`)
  }

  return (
    <AuthPageWrapper>
      <AuthFormWrapper<SchemaType>
        id="SignupForm"
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
          <Button variant={"default"} size={"lg"}>
            {t("PrimaryCTA")}
          </Button>
        </AuthActionWrapper>
      </AuthFormWrapper>
    </AuthPageWrapper>
  )
}
