import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LandingSectionWrapper id="hero" hero>
      <LandingContentWrapper
        justifyStart
        className="h-full px-4 sm:px-8 md:px-10 py-20 md:py-24 rounded-lg bg-linear-to-b from-sky-700 dark:from-sky-300 via-violet-500 dark:via-violet-500 to-sky-300 dark:to-sky-700"
      >
        {children}
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
