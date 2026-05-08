//Layout for auth pages

import { getCurrentUser } from "@/lib/auth"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"
import RyoGoLogo from "@/components/logo"
import {
  AuthImage,
  AuthMainWrapper,
  AuthSideWrapper,
} from "@/components/flows/auth/authWrappers"
import { LayoutWrapper } from "@/components/layout/layoutWrappers"

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  // Redirect to private route if the user is already authenticated
  if (user) {
    if (user.userRole === UserRolesEnum.DRIVER) {
      redirect("/rider", RedirectType.replace)
    }
    redirect("/dashboard", RedirectType.replace)
  }

  return (
    <LayoutWrapper id="ForgotPasswordLayout">
      <AuthMainWrapper>
        <RyoGoLogo />
        {children}
      </AuthMainWrapper>
      <AuthSideWrapper>
        <AuthImage
          src={"/forgotPasswordBG.png"}
          alt="Forgot Password Page Cover Image"
        />
      </AuthSideWrapper>
    </LayoutWrapper>
  )
}
