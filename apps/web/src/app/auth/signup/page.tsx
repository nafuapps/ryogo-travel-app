import { Metadata } from "next"
import SignupPageComponent from "./signup"
import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { RyogoCaption } from "@/components/typography"
import { pageTitle, pageDescription } from "@/components/page/pageCommons"
import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"
import { SectionColWrapper } from "@/components/page/pageWrappers"

export const metadata: Metadata = {
  title: `Signup - ${pageTitle}`,
  description: pageDescription,
}

export default async function SignupPage() {
  const t = await getTranslations("Auth.SignupPage")

  return (
    <SectionColWrapper className="w-full h-full justify-between">
      <SignupPageComponent />
      <SectionColWrapper className="items-center">
        <RyogoCaption color="slate">{t("LoginTitle")}</RyogoCaption>
        <Link href={"/auth/login"}>
          <RyogoOutlineButton label={t("LoginCTA")} />
        </Link>
      </SectionColWrapper>
    </SectionColWrapper>
  )
}
