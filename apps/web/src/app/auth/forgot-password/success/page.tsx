//Confirm Email page

import { Button } from "@/components/ui/button"
import { H2, H5 } from "@/components/typography"
import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Password Reset Success Page | RyoGo",
  description: "Password Reset Success page for RyoGo Travel App",
}

export default async function ForgotPasswordSuccessPage() {
  const t = await getTranslations("Auth.ForgotPasswordPage.Step3")

  return (
    <div
      id="PasswordSuccessPage"
      className="gap-4 w-full h-full flex flex-col justify-between "
    >
      <H2>{t("PageTitle")}</H2>
      <H5>{t("Info")}</H5>
      <div id="PasswordSuccessActions" className="flex flex-col gap-4 w-full">
        <Button variant={"default"} size={"lg"}>
          <Link href="/auth/login">{t("PrimaryCTA")}</Link>
        </Button>
      </div>
    </div>
  )
}
