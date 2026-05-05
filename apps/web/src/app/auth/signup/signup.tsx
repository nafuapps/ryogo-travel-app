//Signup page
"use client"

import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useTranslations } from "next-intl"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { H4, SmallGrey } from "@/components/typography"
import { useRouter } from "next/navigation"
import {
  AuthActionWrapper,
  AuthFormWrapper,
  AuthPageWrapper,
} from "@/components/auth/authWrappers"

export default function SignupPageComponent() {
  const t = useTranslations("Auth.SignupPage.Step1")
  const formSchema = z.object({
    phoneNumber: z
      .string()
      .length(10, t("Error1"))
      .regex(/^[0-9]+$/, t("Error2")),
  })

  type FormFields = z.infer<typeof formSchema>

  const router = useRouter()

  const methods = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
    },
  })

  //Submit actions
  const onSubmit = async (data: FormFields) => {
    router.push(`/auth/signup/${data.phoneNumber}`)
  }

  return (
    <AuthPageWrapper>
      <AuthFormWrapper<FormFields>
        id="SignupForm"
        form={methods}
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <H4>{t("PageTitle")}</H4>
        <FormField
          control={methods.control}
          name={"phoneNumber"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <SmallGrey>{t("Input.Title")}</SmallGrey>
              </FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder={t("Input.Placeholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
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
