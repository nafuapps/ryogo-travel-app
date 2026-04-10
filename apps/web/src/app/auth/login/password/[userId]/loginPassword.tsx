"use client"
//Login password page

import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useTranslations } from "next-intl"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CaptionGrey, H4, SmallGrey } from "@/components/typography"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { loginAction } from "@/app/actions/users/loginAction"
import { useTransition } from "react"

// TODO: Add a feature to show the user had recently reset password

export default function LoginPasswordPageComponent({
  userId,
}: {
  userId: string
}) {
  const t = useTranslations("Auth.LoginPage.Step3")
  const formSchema = z.object({
    password: z.string().min(8, t("Error1")),
  })

  type FormFields = z.infer<typeof formSchema>

  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // For managing form data and validation
  const methods = useForm<FormFields>({
    resolver: zodResolver(formSchema),
  })

  //Submit actions
  const onSubmit = async (data: FormFields) => {
    startTransition(async () => {
      const loginResponse = await loginAction(userId, data.password)
      if (loginResponse.error === "passwordNotMatching") {
        // Show password match error
        methods.setError("password", {
          type: "manual",
          message: t("APIError1"),
        })
      } else if (loginResponse.error) {
        // Show user not found error
        methods.setError("password", {
          type: "manual",
          message: t("APIError2"),
        })
      } else {
        //Login user
        if (loginResponse.userRole === UserRolesEnum.DRIVER) {
          //Redirect to Rider page
          router.replace("/rider")
        } else {
          //Redirect to Dashboard
          router.replace("/dashboard")
        }
      }
    })
  }

  return (
    <div
      id="LoginPasswordPage"
      className="flex flex-col justify-center w-full rounded-lg shadow bg-white p-6 md:p-8"
    >
      <Form {...methods}>
        <form
          id="LoginPasswordForm"
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex flex-col justify-between gap-4 md:gap-6 h-full"
        >
          <H4>{t("PageTitle")}</H4>
          <FormField
            control={methods.control}
            name={"password"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <SmallGrey>{t("Input.Title")}</SmallGrey>
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t("Input.Placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div id="LoginPasswordActions" className="flex flex-col gap-4 w-full">
            <Button
              variant={"default"}
              type="submit"
              size={"lg"}
              disabled={isPending}
            >
              {isPending && <Spinner />}
              {isPending ? t("Loading") : t("PrimaryCTA")}
            </Button>
            <Button
              variant={"secondary"}
              type="button"
              onClick={() => {
                router.back()
              }}
            >
              <CaptionGrey>{t("Back")}</CaptionGrey>
            </Button>
            <Button variant={"link"} type="button" size="sm">
              <Link href={`/auth/login/forgot-password/${userId}`}>
                <CaptionGrey>{t("ForgotCTA")}</CaptionGrey>
              </Link>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
