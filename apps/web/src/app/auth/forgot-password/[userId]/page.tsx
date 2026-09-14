//Confirm Email page

import { redirect, RedirectType } from "next/navigation"
import { UserIdRegex } from "@/lib/regex"
import ForgotPasswordPageComponent from "./forgotPassword"
import { Metadata } from "next"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { pageTitle, pageDescription } from "@/components/page/pageCommons"
import { RyogoCaption } from "@/components/typography"
import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"
import { SectionColWrapper } from "@/components/page/pageWrappers"

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

  if (!UserIdRegex.safeParse(userId).success) {
    redirect("/auth/login", RedirectType.replace)
  }

  const user = await userServices.findUserDetailsById(userId)
  if (!user) {
    redirect("/auth/login", RedirectType.replace)
  }
  const t = await getTranslations("Auth.ForgotPassword")

  return (
    <SectionColWrapper className="w-full h-full justify-between">
      <ForgotPasswordPageComponent user={user} />
      <SectionColWrapper className="items-center">
        <RyogoCaption color="slate">{t("RememberTitle")}</RyogoCaption>
        <Link href={`/auth/login/password/${userId}`}>
          <RyogoOutlineButton label={t("RememberCTA")} />
        </Link>
      </SectionColWrapper>
    </SectionColWrapper>
  )
}
