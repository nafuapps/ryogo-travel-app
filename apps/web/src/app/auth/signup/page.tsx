//Signup page

import { Metadata } from "next"
import SignupPageComponent from "./signup"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { RyogoCaption } from "@/components/typography"
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
        <RyogoCaption color="light">{t("LoginTitle")}</RyogoCaption>
        <Button variant="outline" size="lg">
          <Link href={"/auth/login"}>
            <RyogoCaption color="light">{t("LoginCTA")}</RyogoCaption>
          </Link>
        </Button>
      </AuthFooterWrapper>
    </AuthSectionWrapper>
  )
}
