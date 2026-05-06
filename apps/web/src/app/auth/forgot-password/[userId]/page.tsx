//Confirm Email page

import { redirect, RedirectType } from "next/navigation"
import { UserRegex } from "@/lib/regex"
import ForgotPasswordPageComponent from "./forgotPassword"
import { Metadata } from "next"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { pageTitle, pageDescription } from "@/components/page/pageCommons"
import {
  AuthFooterWrapper,
  AuthSectionWrapper,
} from "@/components/auth/authWrappers"
import { CaptionGrey } from "@/components/typography"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getTranslations } from "next-intl/server"

export const metadata: Metadata = {
  title: `Forgot Password - ${pageTitle}`,
  description: pageDescription,
}

export default async function ConfirmEmailPage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const userId = (await params).userId

  if (!UserRegex.safeParse(userId).success) {
    redirect("/auth/login", RedirectType.replace)
  }

  const user = await userServices.findUserDetailsById(userId)
  if (!user) {
    redirect("/auth/login", RedirectType.replace)
  }
  const t = await getTranslations("Auth.ForgotPassword")

  return (
    <AuthSectionWrapper>
      <ForgotPasswordPageComponent user={user} />
      <AuthFooterWrapper>
        <CaptionGrey>{t("RememberTitle")}</CaptionGrey>
        <Button variant="outline" size="lg">
          <Link href={`/auth/login/password/${userId}`}>
            <CaptionGrey>{t("RememberCTA")}</CaptionGrey>
          </Link>
        </Button>
      </AuthFooterWrapper>
    </AuthSectionWrapper>
  )
}
