//Confirm Email page
"use client"

import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useTranslations } from "next-intl"
import {
  FormControl,
  FormDescription,
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
import { toast } from "sonner"
import { useTransition } from "react"
import { forgotPasswordAction } from "@/app/actions/users/forgotPasswordAction"
import {
  AuthActionWrapper,
  AuthFormWrapper,
  AuthPageWrapper,
} from "@/components/auth/authWrappers"

//TODO: Change flow: Send code and verify code with new password setting on step 2

export default function ForgotPasswordPageComponent({
  userId,
  currentEmail,
}: {
  userId: string
  currentEmail: string
}) {
  const t = useTranslations("Auth.LoginPage.ForgotPassword")

  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const formSchema = z.object({
    email: z.email(t("Error1")),
  })

  type FormFields = z.infer<typeof formSchema>
  const methods = useForm<FormFields>({
    resolver: zodResolver(formSchema),
  })

  //Submit actions
  const onSubmit = async (data: FormFields) => {
    if (data.email.toLowerCase().trim() !== currentEmail.toLowerCase().trim()) {
      methods.setError("email", { type: "manual", message: t("APIError") })
    } else {
      startTransition(async () => {
        if (await forgotPasswordAction(userId)) {
          toast.success(t("Success"))
        } else {
          toast.error(t("Error"))
        }
        router.replace("/auth/login")
      })
    }
  }

  return (
    <AuthPageWrapper>
      <AuthFormWrapper<FormFields>
        id="ForgorPasswordForm"
        onSubmit={methods.handleSubmit(onSubmit)}
        form={methods}
      >
        <H4>{t("PageTitle")}</H4>
        <FormField
          control={methods.control}
          name={"email"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <SmallGrey>{t("Info")}</SmallGrey>
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={t("Input.Placeholder")}
                  {...field}
                />
              </FormControl>
              <FormDescription>{t("Input.Description")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <AuthActionWrapper>
          <Button variant={"default"} size={"lg"} disabled={isPending}>
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
            {t("Back")}
          </Button>
        </AuthActionWrapper>
      </AuthFormWrapper>
    </AuthPageWrapper>
  )
}
