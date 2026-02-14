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
import { H2, H5, PGrey } from "@/components/typography"
import { useRouter } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { resetUserPasswordAction } from "@/app/actions/users/resetUserPasswordAction"
import { useTransition } from "react"

export default function ConfirmEmailPageComponent({
  userId,
  agencyId,
  currentEmail,
}: {
  userId: string
  agencyId: string
  currentEmail: string
}) {
  const t = useTranslations("Auth.ForgotPasswordPage.Step2")

  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const formSchema = z.object({
    email: z.email(t("Error1")),
  })

  type FormFields = z.infer<typeof formSchema>
  // For managing form data and validation
  const methods = useForm<FormFields>({
    resolver: zodResolver(formSchema),
  })

  //Submit actions
  const onSubmit = async (data: FormFields) => {
    if (data.email !== currentEmail) {
      methods.setError("email", { type: "manual", message: t("APIError") })
    }
    startTransition(async () => {
      if (await resetUserPasswordAction(userId, agencyId)) {
        toast.success(t("Success"))
      } else {
        toast.error(t("Error"))
      }
      router.replace("/auth/login")
    })
  }

  return (
    <div id="ConfirmEmailPage" className="gap-4 w-full h-full">
      <Form {...methods}>
        <form
          id="ConfirmEmailForm"
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex flex-col justify-between  h-full"
        >
          <H2>{t("PageTitle")}</H2>
          <FormField
            control={methods.control}
            name={"email"}
            render={({ field }) => (
              <FormItem>
                <PGrey>{t("Info")}</PGrey>
                <FormLabel>
                  <H5>{t("Input.Title")}</H5>
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
          <div id="ConfirmEmailActions" className="flex flex-col gap-4 w-full">
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
      </Form>
    </div>
  )
}
