import { redirect, RedirectType } from "next/navigation"
import {
  AuthMainWrapper,
  AuthSideWrapper,
} from "@/components/flows/auth/authWrappers"
import { UserIdRegex } from "@/lib/regex"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { RyogoCaption } from "@/components/typography"
import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"
import { SectionColWrapper } from "@/components/page/pageWrappers"

export default async function LoginLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params

  if (!UserIdRegex.safeParse(userId).success) {
    redirect("/auth/login", RedirectType.replace)
  }

  const user = await userServices.findUserDetailsById(userId)
  if (!user) {
    redirect("/auth/login", RedirectType.replace)
  }
  const t = await getTranslations("Auth.ForgotPassword")

  return (
    <>
      <AuthMainWrapper src={"/forgotPasswordBG.png"}>
        {children}
        <SectionColWrapper className="items-center">
          <RyogoCaption color="slate">{t("RememberTitle")}</RyogoCaption>
          <Link href={`/auth/login/password/${userId}`}>
            <RyogoOutlineButton label={t("RememberCTA")} />
          </Link>
        </SectionColWrapper>
      </AuthMainWrapper>
      <AuthSideWrapper
        src={"/forgotPasswordBG.png"}
        alt="Forgot Password Page Cover Image"
      />
    </>
  )
}
