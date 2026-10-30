"use client"

import { findLoginUsersAction } from "@/app/actions/users/findLoginUsersAction"
import { RyogoGhostButton } from "@/components/buttons/ryogoButtons"
import { RyogoOTPInput } from "@/components/form/ryogoFormFields"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import {
  AuthContentWrapper,
  FormWrapper,
  SectionColWrapper,
} from "@/components/page/pageWrappers"
import { RyogoCaption, RyogoH3, RyogoSmall } from "@/components/typography"
import { Separator } from "@/components/ui/separator"
import { useBotDetection } from "@/hooks/useBotDetection"
import { PHONE_LENGTH } from "@/lib/uiConfig"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

export default function SignupPageComponent() {
  const t = useTranslations("Auth.SignupPage.Step1")
  const router = useRouter()
  const { checkBotActivity, isBot } = useBotDetection()

  const formSchema = z.object({
    phoneNumber: z
      .string()
      .length(PHONE_LENGTH, t("Error1"))
      .regex(/^[0-9]+$/, t("Error2")),
  })

  type SchemaType = z.infer<typeof formSchema>
  const form = useForm<SchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
    },
  })

  //Submit actions
  const onSubmit = async (values: SchemaType) => {
    if (checkBotActivity()) {
      toast.error(t("BotError"))
      form.setValue("phoneNumber", "")
      return
    }
    const users = await findLoginUsersAction(values.phoneNumber)
    if (users.length > 0) {
      // If atleast 1 user found, go to existing accounts page
      router.push(`/auth/signup/${values.phoneNumber}`)
    } else {
      // else, go to onboarding page
      router.push(`/onboarding?phone=${values.phoneNumber}`)
    }
  }

  return (
    <FormWrapper<SchemaType>
      id="SignupForm"
      form={form}
      className={`${form.formState.isSubmitted ? "animate-zoom-out" : "animate-zoom-in"}`}
    >
      <AuthContentWrapper>
        <SectionColWrapper>
          <RyogoH3 color="slate" weight="font-bold">
            {t("PageTitle")}
          </RyogoH3>
          <RyogoSmall color="light">{t("PageSubtitle")} </RyogoSmall>
        </SectionColWrapper>
        <RyogoOTPInput
          name={"phoneNumber"}
          label={t("Input.Title")}
          length={10}
          onSubmit={form.handleSubmit(onSubmit)}
          disabled={form.formState.isSubmitting || isBot}
        />
        {form.formState.isSubmitting && (
          <RyogoCaption color="light">{t("Input.Loading")}</RyogoCaption>
        )}
        <SectionColWrapper>
          <PropItem label={t("Prop1")} />
          <PropItem label={t("Prop2")} />
          <PropItem label={t("Prop3")} />
        </SectionColWrapper>
        <Separator />
        <SectionColWrapper>
          <Link href={"/auth/login"}>
            <RyogoGhostButton
              label={t("LoginTitle")}
              labelColor="light"
              className="w-full"
            />
          </Link>
        </SectionColWrapper>
      </AuthContentWrapper>
    </FormWrapper>
  )
}

function PropItem({ label }: { label: string }) {
  return (
    <div className="flex gap-0.5 md:gap-1 items-center">
      <RyogoIcon icon={Check} size="sm" color="brand" thick />
      <RyogoCaption color="light">{label}</RyogoCaption>
    </div>
  )
}
