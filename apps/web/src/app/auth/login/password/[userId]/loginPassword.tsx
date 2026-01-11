//Login password page
"use client"

import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useTranslations } from "next-intl"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { H2, H5 } from "@/components/typography"
import Link from "next/link"
import { redirect, RedirectType, useRouter } from "next/navigation"
import { apiClient } from "@ryogo-travel-app/api/client/apiClient"
import { LoginPasswordAPIResponseType } from "@ryogo-travel-app/api/types/user.types"
import { Spinner } from "@/components/ui/spinner"

// TODO: Add a feature to show the user had recently reset password

type LoginPageComponentProps = {
  userId: string
}
export default function LoginPasswordPageComponent(
  props: LoginPageComponentProps
) {
  const userId = props.userId

  const t = useTranslations("Auth.LoginPage.Step3")
  const formSchema = z.object({
    password: z.string().min(8, t("Error1")),
  })

  type FormFields = z.infer<typeof formSchema>

  const router = useRouter()

  // For managing form data and validation
  const methods = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  })

  //Submit actions
  const onSubmit = async (data: FormFields) => {
    const loginResponse = await apiClient<LoginPasswordAPIResponseType>(
      "/api/auth/login/password",
      {
        method: "POST",
        body: JSON.stringify({ userId: userId, password: data.password }),
      }
    )
    if (loginResponse == null) {
      // Show password match error
      methods.setError("password", { type: "manual", message: t("APIError1") })
    } else if (loginResponse.id == undefined) {
      // Show user not found error
      methods.setError("password", { type: "manual", message: t("APIError2") })
    } else {
      //Login user
      if (loginResponse.userRole === "driver") {
        //Redirect to Rider page
        router.replace("/rider")
      } else {
        //Redirect to Dashboard
        router.replace("/dashboard")
      }
    }
  }

  return (
    <div id="LoginPasswordPage" className="gap-4 w-full h-full">
      <Form {...methods}>
        <form
          id="LoginPasswordForm"
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex flex-col justify-between  h-full"
        >
          <H2>{t("PageTitle")}</H2>
          <FormField
            control={methods.control}
            name={"password"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <H5>{t("Input.Title")}</H5>
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t("Input.Placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormDescription>{t("Input.Description")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div id="LoginPasswordActions" className="flex flex-col gap-4 w-full">
            <Button
              variant={"default"}
              size={"lg"}
              disabled={methods.formState.isSubmitting}
            >
              {methods.formState.isSubmitting && <Spinner />}
              {methods.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")}
            </Button>
            <Button
              variant={"secondary"}
              type="button"
              onClick={() => {
                router.back()
              }}
            >
              {t("Back")}
            </Button>
            <Button variant={"link"}>
              <Link href={`/auth/forgot-password/confirm-email/${userId}`}>
                {t("ForgotCTA")}
              </Link>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
