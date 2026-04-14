import { getCurrentUser } from "@/lib/auth"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import type { Metadata } from "next"
import { redirect, RedirectType } from "next/navigation"

export const metadata: Metadata = {
  title: "RyoGo - Modern Travel Planning & Booking",
  description:
    "Your all-in-one platform for seamless travel planning, booking, and management.",
}

export default async function RootLayout({
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

  return <main className="bg-white w-full min-h-dvh">{children}</main>
}
