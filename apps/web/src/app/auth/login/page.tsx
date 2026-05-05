//Login  page
import { Metadata } from "next"
import LoginPageComponent from "./login"
import { CaptionGrey } from "@/components/typography"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { pageTitle, pageDescription } from "@/components/page/pageCommons"
import {
  AuthFooterWrapper,
  AuthSectionWrapper,
} from "@/components/auth/authWrappers"

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
        <CaptionGrey>{t("SignupTitle")}</CaptionGrey>
        <Button variant="outline" size="lg">
          <Link href={"/auth/signup"}>
            <CaptionGrey>{t("SignupCTA")}</CaptionGrey>
          </Link>
        </Button>
      </AuthFooterWrapper>
    </AuthSectionWrapper>
  )
}
