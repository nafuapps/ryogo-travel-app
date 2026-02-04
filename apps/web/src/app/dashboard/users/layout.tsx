import { getCurrentUser } from "@/lib/auth"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  //Only owner can access users pages
  if (currentUser.userRole !== UserRolesEnum.OWNER) {
    redirect("/dashboard", RedirectType.replace)
  }

  return children
}
