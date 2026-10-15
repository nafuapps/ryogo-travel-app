import { getCurrentUser } from "@/lib/auth"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"
import Navbar from "@/components/flows/landing/nav"
import {
  DARK_MODE_COOKIE_NAME,
  LOCALE_COOKIE_NAME,
} from "@ryogo-travel-app/api/apiConfig"
import { cookies } from "next/headers"
import Footer from "@/components/flows/landing/footer"

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentUser()

  // Redirect to private route if the user is already authenticated
  if (currentUser) {
    if (currentUser.userRole === UserRolesEnum.DRIVER) {
      redirect("/rider/home", RedirectType.replace)
    }
    redirect("/dashboard/home", RedirectType.replace)
  }

  const cookieStore = await cookies()
  const isDarkMode = cookieStore.get(DARK_MODE_COOKIE_NAME)?.value === "true"
  const locale = cookieStore.get(LOCALE_COOKIE_NAME)?.value

  return (
    <main
      id="AuthLayout"
      className="flex flex-col bg-white dark:bg-slate-800 h-full"
    >
      <Navbar isDarkMode={isDarkMode} locale={locale} />
      {children}
      <Footer />
    </main>
  )
}
