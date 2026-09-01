import Footer from "@/components/flows/landing/footer"
import Navbar from "@/components/flows/landing/nav"
import { getCurrentUser } from "@/lib/auth"
import {
  DARK_MODE_COOKIE_NAME,
  LOCALE_COOKIE_NAME,
} from "@ryogo-travel-app/api/apiConfig"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { cookies } from "next/headers"
import { redirect, RedirectType } from "next/navigation"

export default async function LandingLayout({
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
      id="LandingLayout"
      className="flex flex-col bg-white dark:bg-slate-950"
    >
      <div className="flex flex-col h-full">
        <Navbar isDarkMode={isDarkMode} locale={locale} />
        {children}
        <Footer />
      </div>
    </main>
  )
}
