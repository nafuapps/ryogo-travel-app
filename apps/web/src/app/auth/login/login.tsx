//Login  page
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
import { Spinner } from "@/components/ui/spinner"
import { useTransition } from "react"
import { findLoginUsersAction } from "@/app/actions/users/findLoginUsersAction"
import {
  AuthActionWrapper,
  AuthFormWrapper,
  AuthPageWrapper,
} from "@/components/auth/authWrappers"

/*
1. Find user by phone number
2. No user found, cannot login (push for signup)
3. If multiple users found, go to select account page
*/

export default function LoginPageComponent() {
  const t = useTranslations("Auth.LoginPage.Step1")
  const formSchema = z.object({
    phoneNumber: z
      .string()
      .length(10, t("Error1"))
      .regex(/^[0-9]+$/, t("Error2")),
  })

  type FormFields = z.infer<typeof formSchema>

  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const methods = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
    },
  })

  //Submit actions
  const onSubmit = async (data: FormFields) => {
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
      <AuthFormWrapper<FormFields>
        id="LoginForm"
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
          <Button variant={"default"} size={"lg"} disabled={isPending}>
            {isPending && <Spinner />}
            {isPending ? t("Loading") : t("PrimaryCTA")}
          </Button>
        </AuthActionWrapper>
      </AuthFormWrapper>
    </AuthPageWrapper>
  )
}
