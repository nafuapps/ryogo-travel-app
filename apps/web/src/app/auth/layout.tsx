import Footer from "@/components/flows/landing/footer"
import { LandingSectionWrapper } from "@/components/flows/landing/landingWrappers"
import Navbar from "@/components/flows/landing/nav"
import { LayoutWrapper } from "@/components/layout/layoutWrappers"
import { readPermissions } from "@/lib/permissions"
import {
  DARK_MODE_COOKIE_NAME,
  LOCALE_COOKIE_NAME,
} from "@ryogo-travel-app/api/apiConfig"
import { cookies } from "next/headers"

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await readPermissions.redirectIfAuthenticated()

  const cookieStore = await cookies()
  const isDarkMode = cookieStore.get(DARK_MODE_COOKIE_NAME)?.value === "true"
  const locale = cookieStore.get(LOCALE_COOKIE_NAME)?.value

  return (
    <LayoutWrapper id="AuthLayout">
      <Navbar isDarkMode={isDarkMode} locale={locale} />
      <LandingSectionWrapper id="hero" hero>
        {children}
      </LandingSectionWrapper>
      <Footer />
    </LayoutWrapper>
  )
}
