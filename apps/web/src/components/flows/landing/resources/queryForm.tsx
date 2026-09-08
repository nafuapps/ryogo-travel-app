"use client"

import { sendSupportQueryAction } from "@/app/actions/support/sendSupportQueryAction"
import { RyogoBrandButton } from "@/components/buttons/ryogoButtons"
import { RyogoInput, RyogoTextarea } from "@/components/form/ryogoFormFields"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoCaption, RyogoH4 } from "@/components/typography"
import { Form } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { useBotDetection } from "@/hooks/useBotDetection"
import {
  MAX_EMAIL_LENGTH,
  MAX_FIELD_DESC_LENGTH,
  MAX_NAME_LENGTH,
  MIN_FIELD_DESC_LENGTH,
  MIN_NAME_LENGTH,
  PHONE_LENGTH,
} from "@/lib/uiConfig"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

export default function QueryForm() {
  const t = useTranslations("Landing.Resources.Support.QueryForm")
  const [messageSent, setMessageSent] = useState(false)
  const honeypotRef = useRef<HTMLInputElement>(null)
  const { checkBotActivity, isBot } = useBotDetection()

  const schema = z.object({
    name: z
      .string()
      .min(MIN_NAME_LENGTH, t("Field1.Error1"))
      .max(MAX_NAME_LENGTH, t("Field1.Error2")),
    phone: z.string().length(PHONE_LENGTH, t("Field2.Error1")),
    email: z
      .email(t("Field3.Error1"))
      .max(MAX_EMAIL_LENGTH, t("Field3.Error2")),
    agencyName: z
      .string()
      .min(MIN_NAME_LENGTH, t("Field4.Error1"))
      .max(MAX_NAME_LENGTH, t("Field4.Error2"))
      .optional(),
    message: z
      .string()
      .min(MIN_FIELD_DESC_LENGTH, t("Field5.Error1"))
      .max(MAX_FIELD_DESC_LENGTH, t("Field5.Error2")),
  })

  type FormData = z.infer<typeof schema>

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      message: "",
    },
  })

  async function onSubmit(data: FormData) {
    //Check if the honeypot field is filled (indicating bot activity)
    if (honeypotRef.current && honeypotRef.current.value !== "") {
      toast.error(t("BotError"))
      return
    }
    //Check if the form was submitted too quickly
    if (checkBotActivity()) {
      toast.error(t("BotError"))
      return
    }
    const query = await sendSupportQueryAction(data)
    if (query) {
      setMessageSent(true)
      toast.success(t("Success"))
    } else {
      toast.error(t("Error"))
    }
  }

  return (
    <Form {...form}>
      <form
        id={"queryForm"}
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col border rounded-lg p-6 md:p-8 gap-4 md:gap-5 w-full shadow-md bg-white dark:bg-sky-950/70"
      >
        <RyogoH4 color="brand" weight="font-bold">
          {t("Title")}
        </RyogoH4>
        <RyogoCaption color="light">{t("Description")}</RyogoCaption>
        <RyogoInput
          name={"name"}
          type="text"
          label={t("Field1.Title")}
          placeholder={t("Field1.Placeholder")}
        />
        <RyogoInput
          name={"phone"}
          type="tel"
          label={t("Field2.Title")}
          placeholder={t("Field2.Placeholder")}
        />
        <RyogoInput
          name={"email"}
          type="email"
          label={t("Field3.Title")}
          placeholder={t("Field3.Placeholder")}
        />
        <RyogoInput
          name={"agencyName"}
          type="text"
          label={t("Field4.Title")}
          placeholder={t("Field4.Placeholder")}
        />
        <RyogoTextarea
          name={"message"}
          label={t("Field5.Title")}
          placeholder={t("Field5.Placeholder")}
        />
        <div style={{ display: "none" }} aria-hidden="true">
          <input
            ref={honeypotRef}
            type="text"
            name="username_verification"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <RyogoBrandButton
          size={"lg"}
          type="submit"
          disabled={messageSent || form.formState.isSubmitting || isBot}
          showSpinner={form.formState.isSubmitting}
          label={
            messageSent
              ? t("SentCTA")
              : form.formState.isSubmitting
                ? t("Loading")
                : t("SubmitCTA")
          }
        >
          {messageSent && (
            <RyogoIcon icon={CheckCircle} size="sm" color="green" thick />
          )}
        </RyogoBrandButton>
        <Separator />
        <RyogoCaption color="light" className="text-center">
          {t("Disclaimer")}
        </RyogoCaption>
      </form>
    </Form>
  )
}
