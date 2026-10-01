import { redirect, RedirectType } from "next/navigation"
import {
  AuthMainWrapper,
  AuthSideWrapper,
} from "@/components/flows/auth/authWrappers"
import { UserIdRegex } from "@/lib/regex"
import { userServices } from "@ryogo-travel-app/api/services/user.services"

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

  return (
    <>
      <AuthMainWrapper src={"/forgotPasswordBG.png"}>
        {children}
      </AuthMainWrapper>
      <AuthSideWrapper
        src={"/forgotPasswordBG.png"}
        alt="Forgot Password Page Cover Image"
      />
    </>
  )
}
