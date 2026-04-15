//Login  page
import { Metadata } from "next"
import LoginPageComponent from "./login"
import { CaptionGrey } from "@/components/typography"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getTranslations } from "next-intl/server"

export const metadata: Metadata = {
  title: "Login - RyoGo Travel Agency App",
  description:
    "RyoGo is an app for Indian travel agencies to automate their daily operations",
}

export default async function LoginPage() {
  const t = await getTranslations("Auth.LoginPage")
  return (
    <div
      id="LoginMainSection"
      className="flex flex-col gap-6 md:gap-8 w-full h-full items-center justify-between"
    >
      <LoginPageComponent />
      <div className="flex flex-col items-center gap-2 md:gap-3">
        <CaptionGrey>{t("SignupTitle")}</CaptionGrey>
        <Button variant="outline" size="lg">
          <Link href={"/auth/signup"}>
            <CaptionGrey>{t("SignupCTA")}</CaptionGrey>
          </Link>
        </Button>
      </div>
    </div>
  )
}
