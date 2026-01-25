//Login  page
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
import { useRouter } from "next/navigation"
import { apiClient } from "@ryogo-travel-app/api/client/apiClient"
import { LoginAPIResponseType } from "@ryogo-travel-app/api/types/user.types"
import { Spinner } from "@/components/ui/spinner"

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

  const methods = useForm<FormFields>({
    resolver: zodResolver(formSchema),
  })

  //Submit actions
  const onSubmit = async (data: FormFields) => {
    const users = await apiClient<LoginAPIResponseType>(
      `/api/auth/login?phone=${data.phoneNumber}`,
      {
        method: "GET",
      },
    )
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
  }

  return (
    <div id="LoginPage" className="gap-4 w-full h-full">
      <Form {...methods}>
        <form
          id="LoginForm"
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex flex-col justify-between w-full h-full"
        >
          <H2>{t("PageTitle")}</H2>
          <FormField
            control={methods.control}
            name={"phoneNumber"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <H5>{t("Input.Title")}</H5>
                </FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder={t("Input.Placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormDescription>{t("Input.Description")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div id="LoginActions" className="flex flex-col gap-4 w-full">
            <Button
              variant={"default"}
              size={"lg"}
              disabled={methods.formState.isSubmitting}
            >
              {methods.formState.isSubmitting && <Spinner />}
              {methods.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
