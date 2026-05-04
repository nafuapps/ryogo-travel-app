//Signup page
"use client"

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
import { H4, SmallGrey } from "@/components/typography"
import { useRouter } from "next/navigation"

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
    <div
      id="SignupPage"
      className="flex flex-col justify-center w-full rounded-lg shadow bg-white p-6 md:p-8"
    >
      <Form {...methods}>
        <form
          id="SignupForm"
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex flex-col justify-between gap-4 md:gap-6"
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
          <div id="SignupActions" className="flex flex-col gap-4 w-full">
            <Button variant={"default"} size={"lg"}>
              {t("PrimaryCTA")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
