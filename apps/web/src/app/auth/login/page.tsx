//Login  page
import { Metadata } from "next"
import LoginPageComponent from "./login"
import { RyogoCaption } from "@/components/typography"
import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { pageTitle, pageDescription } from "@/components/page/pageCommons"
import {
  AuthFooterWrapper,
  AuthSectionWrapper,
} from "@/components/flows/auth/authWrappers"
import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"

export const metadata: Metadata = {
  title: `Login - ${pageTitle}`,
  description: pageDescription,
}

export default async function LoginPage() {
  const t = await getTranslations("Auth.LoginPage")
  return (
    <AuthSectionWrapper>
      <LoginPageComponent />
      <AuthFooterWrapper>
        <RyogoCaption color="slate">{t("SignupTitle")}</RyogoCaption>
        <Link href={"/auth/signup"}>
          <RyogoOutlineButton label={t("SignupCTA")} />
        </Link>
      </AuthFooterWrapper>
    </AuthSectionWrapper>
  )
}
