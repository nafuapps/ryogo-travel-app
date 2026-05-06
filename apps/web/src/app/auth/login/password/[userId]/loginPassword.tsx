"use client"
//Login password page

import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { CaptionGrey, H4Grey } from "@/components/typography"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { loginAction } from "@/app/actions/users/loginAction"
import { useTransition } from "react"
import {
  AuthActionWrapper,
  AuthFormWrapper,
  AuthPageWrapper,
} from "@/components/auth/authWrappers"
import { RyogoInput } from "@/components/form/ryogoFormFields"
import { FindUserDetailsByIdType } from "@ryogo-travel-app/api/services/user.services"
import { UserCard } from "@/components/auth/userCard"

// TODO: Add a feature to show the user had recently reset password

export default function LoginPasswordPageComponent({
  user,
}: {
  user: NonNullable<FindUserDetailsByIdType>
}) {
  const t = useTranslations("Auth.LoginPage.Step3")
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const formSchema = z.object({
    password: z.string().min(8, t("Error1")),
  })

  type SchemaType = z.infer<typeof formSchema>
  const methods = useForm<SchemaType>({
    resolver: zodResolver(formSchema),
  })

  //Submit actions
  const onSubmit = async (data: SchemaType) => {
    startTransition(async () => {
      const loginResponse = await loginAction(user.id, data.password)
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
    <AuthPageWrapper>
      <AuthFormWrapper<SchemaType>
        id="LoginPasswordForm"
        onSubmit={methods.handleSubmit(onSubmit)}
        form={methods}
      >
        <H4Grey>{t("PageTitle")}</H4Grey>
        <UserCard user={user} />
        <RyogoInput
          name={"password"}
          type="password"
          label={t("Input.Title")}
          placeholder={t("Input.Placeholder")}
          description={t("Input.Description")}
        />
        <AuthActionWrapper>
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
            <Link href={`/auth/forgot-password/${user.id}`}>
              <CaptionGrey>{t("ForgotCTA")}</CaptionGrey>
            </Link>
          </Button>
        </AuthActionWrapper>
      </AuthFormWrapper>
    </AuthPageWrapper>
  )
}
