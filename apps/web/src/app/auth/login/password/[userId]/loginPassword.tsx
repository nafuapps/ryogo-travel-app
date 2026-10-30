"use client"

import { loginAction } from "@/app/actions/users/loginAction"
import {
  RyogoDefaultButton,
  RyogoGhostButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import AuthAccountCard from "@/components/flows/auth/authAccountCard"
import { RyogoInput } from "@/components/form/ryogoFormFields"
import {
  AuthContentWrapper,
  FormWrapper,
  SectionColWrapper,
} from "@/components/page/pageWrappers"
import { RyogoH3, RyogoSmall } from "@/components/typography"
import { Separator } from "@/components/ui/separator"
import { useBotDetection } from "@/hooks/useBotDetection"
import { MIN_PASSWORD_LENGTH } from "@/lib/uiConfig"
import { zodResolver } from "@hookform/resolvers/zod"
import { FindUserDetailsByIdType } from "@ryogo-travel-app/api/services/user.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

export default function LoginPasswordPageComponent({
  user,
}: {
  user: NonNullable<FindUserDetailsByIdType>
}) {
  const t = useTranslations("Auth.LoginPage.Step3")
  const router = useRouter()
  const { checkBotActivity, isBot } = useBotDetection()
  const [formSuccess, setFormSuccess] = useState<boolean | null>(null)

  const formSchema = z.object({
    password: z.string().min(MIN_PASSWORD_LENGTH, t("Error1")),
  })

  type SchemaType = z.infer<typeof formSchema>
  const form = useForm<SchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  })

  //Submit actions
  const onSubmit = async (values: SchemaType) => {
    if (checkBotActivity()) {
      toast.error(t("BotError"))
      return
    }
    const loginResponse = await loginAction({
      userId: user.id,
      password: values.password,
    })
    if (loginResponse.error || !loginResponse.data) {
      setFormSuccess(false)
      setTimeout(() => {
        setFormSuccess(null)
        form.setValue("password", "")
        form.clearErrors("password")
      }, 2000) //Clear the field after 2s
      if (loginResponse.error === "invalidPassword") {
        // Show password mismatch error
        form.setError("password", {
          type: "manual",
          message: t("APIError1"),
        })
      } else if (loginResponse.error === "userNotFound") {
        // Show user not found error
        form.setError("password", {
          type: "manual",
          message: t("APIError2"),
        })
      } else if (loginResponse.error === "userSuspended") {
        // Show user suspended error
        form.setError("password", {
          type: "manual",
          message: t("APIError3"),
        })
      } else if (loginResponse.error === "basicPlanOwnerLimit") {
        // Show basic plan owner limit error
        form.setError("password", {
          type: "manual",
          message: t("APIError4"),
        })
      } else if (!loginResponse.data) {
        // Unknown error
        toast.error(t("APIError5"))
      }
    } else {
      setFormSuccess(true)
      //SUCCESS: Login user
      if (loginResponse.data.userRole === UserRolesEnum.DRIVER) {
        //Redirect to Rider page
        router.replace("/rider/home")
      } else {
        //Redirect to Dashboard
        router.replace("/dashboard/home")
      }
    }
  }

  return (
    <FormWrapper<SchemaType>
      id="LoginPasswordForm"
      onSubmit={form.handleSubmit(onSubmit)}
      form={form}
      className={`${formSuccess === false ? "animate-shake" : formSuccess === true ? "animate-zoom-out" : "animate-zoom-in"}`}
    >
      <AuthContentWrapper>
        <SectionColWrapper>
          <RyogoH3 color="slate" weight="font-bold">
            {t("PageTitle")}
          </RyogoH3>
          <RyogoSmall color="light">{t("Subtitle")} </RyogoSmall>
        </SectionColWrapper>
        <AuthAccountCard user={user} />
        <RyogoInput
          name={"password"}
          type="password"
          label={t("Input.Title")}
          placeholder={t("Input.Placeholder")}
        />
        <RyogoDefaultButton
          label={form.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")}
          size={"lg"}
          type="submit"
          disabled={form.formState.isSubmitting || isBot}
          showSpinner={form.formState.isSubmitting}
        />
        <RyogoOutlineButton
          label={t("Back")}
          type="button"
          onClick={() => {
            router.back()
          }}
        />
        <Separator />
        <Link href={`/auth/forgot-password/${user.id}`}>
          <RyogoGhostButton
            label={t("ForgotCTA")}
            type="button"
            className="w-full"
            labelColor="light"
          />
        </Link>
      </AuthContentWrapper>
    </FormWrapper>
  )
}
