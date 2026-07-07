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
} from "@/components/flows/auth/authWrappers"

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
        <Link href={"/auth/login"}>
          <Button variant="outline" size="lg">
            <RyogoCaption color="light">{t("LoginCTA")}</RyogoCaption>
          </Button>
        </Link>
      </AuthFooterWrapper>
    </AuthSectionWrapper>
  )
}
