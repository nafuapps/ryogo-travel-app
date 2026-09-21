import { getCurrentUser } from "@/lib/auth"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"
import {
  AuthImage,
  AuthMainWrapper,
  AuthSideWrapper,
} from "@/components/flows/auth/authWrappers"
import { LayoutWrapper } from "@/components/layout/layoutWrappers"
import { UserIdRegex } from "@/lib/regex"
import { userServices } from "@ryogo-travel-app/api/services/user.services"

export default async function LoginLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ userId: string }>
}) {
  const currentUser = await getCurrentUser()

  // Redirect to private route if the user is already authenticated
  if (currentUser) {
    if (currentUser.userRole === UserRolesEnum.DRIVER) {
      redirect("/rider/home", RedirectType.replace)
    }
    redirect("/dashboard/home", RedirectType.replace)
  }

  const { userId } = await params

  if (!UserIdRegex.safeParse(userId).success) {
    redirect("/auth/login", RedirectType.replace)
  }

  const user = await userServices.findUserDetailsById(userId)
  if (!user) {
    redirect("/auth/login", RedirectType.replace)
  }

  return (
    <LayoutWrapper id="ForgotPasswordLayout">
      <AuthMainWrapper src={"/forgotPasswordBG.png"}>
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
