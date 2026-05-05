//Layout for auth pages

import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import Image from "next/image"
import RyoGoLogo from "@/components/logo"
import {
  AuthMainWrapper,
  AuthSideWrapper,
} from "@/components/auth/authWrappers"
import { LayoutWrapper } from "@/components/bookings/layout/layoutWrappers"

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
      <AuthMainWrapper>
        <RyoGoLogo />
        {children}
      </AuthMainWrapper>
      <AuthSideWrapper>
        <Image
          loading="eager"
          src={"/signupBG.png"}
          alt="Signup Page Cover Image"
          className="object-cover"
          fill
          sizes="50vw"
        />
      </AuthSideWrapper>
    </LayoutWrapper>
  )
}
