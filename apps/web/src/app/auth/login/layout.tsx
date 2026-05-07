//Layout for auth pages

import { getCurrentUser } from "@/lib/auth"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"
import RyoGoLogo from "@/components/logo"
import {
  AuthImage,
  AuthMainWrapper,
  AuthSideWrapper,
} from "@/components/auth/authWrappers"
import { LayoutWrapper } from "@/components/bookings/layout/layoutWrappers"

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
    <LayoutWrapper id="LoginLayout">
      <AuthSideWrapper>
        <AuthImage src={"/loginBG.png"} alt="Login Page Cover Image" />
      </AuthSideWrapper>
      <AuthMainWrapper>
        <RyoGoLogo />
        {children}
      </AuthMainWrapper>
    </LayoutWrapper>
  )
}
