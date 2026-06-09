import { getCurrentUser } from "@/lib/auth"
import { UserRolesEnum, UserStatusEnum } from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"

export default async function OnboardingInprogressLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentUser()

  //Redirect to login page
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  //Not owner, needs redirection
  if (currentUser.userRole !== UserRolesEnum.OWNER) {
    if (currentUser.status === UserStatusEnum.NEW) {
      //If new, go to change password
      redirect("/onboarding/change-password", RedirectType.replace)
    }
    //Not new users
    if (currentUser.userRole === UserRolesEnum.DRIVER) {
      //If driver, go to rider page
      redirect("/rider", RedirectType.replace)
    }
    //Else, go to dashboard
    redirect("/dashboard", RedirectType.replace)
  }

  //Not verified owner
  if (!currentUser.isVerified) {
    redirect("/onboarding/verify-account", RedirectType.replace)
  }

  //Only verified owner can continue with onboarding steps
  return children
}
