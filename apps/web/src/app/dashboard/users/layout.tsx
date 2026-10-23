import { readPermissions } from "@/lib/permissions"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await readPermissions.getAuthenticatedUser()

  //Only owner can access users pages
  if (currentUser.userRole !== UserRolesEnum.OWNER) {
    redirect("/dashboard/home", RedirectType.replace)
  }

  return children
}
