//Signup page

import { Metadata } from "next"
import SignupPageComponent from "./signup"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { CaptionGrey } from "@/components/typography"

export const metadata: Metadata = {
  title: "Signup Page | RyoGo",
  description: "Signup page for RyoGo Travel App",
}
export default async function SignupPage() {
  const t = await getTranslations("Auth.SignupPage")

  return (
    <div className="flex flex-col gap-6 md:gap-8 w-full h-full items-center justify-between">
      <SignupPageComponent />
      <div className="flex flex-col items-center gap-2 md:gap-3">
        <CaptionGrey>{t("LoginTitle")}</CaptionGrey>
        <Button variant="outline" size="lg">
          <Link href={"/auth/login"}>
            <CaptionGrey>{t("LoginCTA")}</CaptionGrey>
          </Link>
        </Button>
      </div>
    </div>
  )
}
