import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"
import { UserIdRegex } from "@/lib/regex"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { redirect, RedirectType } from "next/navigation"

export default async function LoginLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params

  if (!UserIdRegex.safeParse(userId).success) {
    redirect("/auth/login", RedirectType.replace)
  }

  const user = await userServices.findUserDetailsById(userId)
  if (!user) {
    redirect("/auth/login", RedirectType.replace)
  }

  return (
    <LandingSectionWrapper id="hero" hero>
      <LandingContentWrapper
        justifyStart
        className="h-full px-4 sm:px-8 md:px-10 py-20 md:py-24 rounded-lg bg-linear-to-b from-sky-700 dark:from-sky-300 via-emerald-500 dark:via-emerald-500 to-sky-300 dark:to-sky-700"
      >
        {children}
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
