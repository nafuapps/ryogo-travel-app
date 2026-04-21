//Confirm Email page
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
import { H4, SmallGrey } from "@/components/typography"
import { useRouter } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { useTransition } from "react"
import { forgotPasswordAction } from "@/app/actions/users/forgotPasswordAction"
import { ScrollArea } from "@/components/ui/scroll-area"

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
    <div
      id="ForgotPasswordPage"
      className="flex flex-col justify-center w-full rounded-lg shadow bg-white p-6 md:p-8"
    >
      <Form {...methods}>
        <ScrollArea>
          <form
            id="ForgorPasswordForm"
            onSubmit={methods.handleSubmit(onSubmit)}
            className="flex flex-col justify-between gap-4 md:gap-6 h-full"
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
            <div
              id="ConfirmEmailActions"
              className="flex flex-col gap-4 w-full"
            >
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
            </div>
          </form>
        </ScrollArea>
      </Form>
    </div>
  )
}
