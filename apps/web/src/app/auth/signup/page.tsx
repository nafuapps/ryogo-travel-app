//Signup page

import { Metadata } from "next"
import SignupPageComponent from "./signup"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { CaptionGrey } from "@/components/typography"
import { pageTitle, pageDescription } from "@/components/page/pageCommons"
import {
  AuthFooterWrapper,
  AuthSectionWrapper,
} from "@/components/auth/authWrappers"

export const metadata: Metadata = {
  title: `Signup - ${pageTitle}`,
  description: pageDescription,
}

export default async function SignupPage() {
  const t = await getTranslations("Auth.SignupPage")

  return (
    <AuthSectionWrapper>
      <SignupPageComponent />
      <AuthFooterWrapper>
        <CaptionGrey>{t("LoginTitle")}</CaptionGrey>
        <Button variant="outline" size="lg">
          <Link href={"/auth/login"}>
            <CaptionGrey>{t("LoginCTA")}</CaptionGrey>
          </Link>
        </Button>
      </AuthFooterWrapper>
    </AuthSectionWrapper>
  )
}
