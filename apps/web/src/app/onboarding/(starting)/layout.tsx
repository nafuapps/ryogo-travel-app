import { getCurrentUser } from "@/lib/auth"
import { UserRolesEnum, UserStatusEnum } from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"

export default async function OnboardingStartingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentUser()

  //Redirect to private route
  if (currentUser) {
    if (currentUser.userRole !== UserRolesEnum.OWNER) {
      if (currentUser.status === UserStatusEnum.NEW) {
        redirect("/onboarding/change-password", RedirectType.replace)
      }
      if (currentUser.userRole === UserRolesEnum.DRIVER) {
        redirect("/rider", RedirectType.replace)
      }
      redirect("/dashboard", RedirectType.replace)
    }
    if (!currentUser.isVerified) {
      redirect("/onboarding/verify-account", RedirectType.replace)
    }
    if (currentUser.status !== UserStatusEnum.NEW) {
      redirect("/dashboard", RedirectType.replace)
    }
    redirect("/onboarding/add-vehicle", RedirectType.replace)
  }

  return children
}
