import { getCurrentUser } from "@/lib/auth"
import { UserRegex } from "@/lib/regex"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { UserStatusEnum } from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"

export default async function UserDetailsLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  //Invalid user id regex check
  if (!UserRegex.safeParse(id).success) {
    redirect("/dashboard/users", RedirectType.replace)
  }

  //No user found or agency mismatch or user suspended
  const user = await userServices.findUserDetailsById(id)
  if (
    !user ||
    user.agencyId !== user.agencyId ||
    user.status === UserStatusEnum.SUSPENDED
  ) {
    redirect("/dashboard/users", RedirectType.replace)
  }

  return children
}
