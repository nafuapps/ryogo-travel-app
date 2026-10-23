import Footer from "@/components/flows/landing/footer"
import Navbar from "@/components/flows/landing/nav"
import { readPermissions } from "@/lib/permissions"
import {
  DARK_MODE_COOKIE_NAME,
  LOCALE_COOKIE_NAME,
} from "@ryogo-travel-app/api/apiConfig"
import { cookies } from "next/headers"

export default async function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await readPermissions.redirectIfAuthenticated()

  const cookieStore = await cookies()
  const isDarkMode = cookieStore.get(DARK_MODE_COOKIE_NAME)?.value === "true"
  const locale = cookieStore.get(LOCALE_COOKIE_NAME)?.value

  return (
    <main
      id="LandingLayout"
      className="flex flex-col bg-white dark:bg-slate-800 h-full"
    >
      <Navbar isDarkMode={isDarkMode} locale={locale} />
      {children}
      <Footer />
    </main>
  )
}
