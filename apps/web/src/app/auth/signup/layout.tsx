//Layout for auth pages

import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import {
  AuthImage,
  AuthMainWrapper,
  AuthSideWrapper,
} from "@/components/flows/auth/authWrappers"
import { LayoutWrapper } from "@/components/layout/layoutWrappers"

export default async function SignupLayout({
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
    <LayoutWrapper id="SignupLayout">
      <AuthMainWrapper>{children}</AuthMainWrapper>
      <AuthSideWrapper>
        <AuthImage src={"/signupBG.png"} alt="Signup Page Cover Image" />
      </AuthSideWrapper>
    </LayoutWrapper>
  )
}
