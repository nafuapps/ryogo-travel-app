import { getCurrentUser } from "@/lib/auth"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import type { Metadata } from "next"
import { redirect, RedirectType } from "next/navigation"

export const metadata: Metadata = {
  title: "RyoGo Travel Agency App",
  description: "RyoGo is a travel agency app",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  // Redirect to private route if the user is already authenticated
  if (user?.userId) {
    if (user.userRole == UserRolesEnum.DRIVER) {
      redirect("/rider", RedirectType.replace)
    }
    redirect("/dashboard", RedirectType.replace)
  }

  return children
}
