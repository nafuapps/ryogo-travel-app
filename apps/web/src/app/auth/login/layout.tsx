import {
  LandingSectionWrapper,
  LandingContentWrapper,
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
        className="h-full px-5 sm:px-8 md:px-10 py-20 md:py-24 rounded-lg bg-linear-to-b from-sky-700 dark:from-blue-200 to-blue-200 dark:to-sky-700"
      >
        {children}
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
