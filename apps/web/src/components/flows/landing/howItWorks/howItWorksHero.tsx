import { RyogoH1, RyogoP, RyogoSmall } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { ChevronDown } from "lucide-react"
import Image from "next/image"

export default async function HowItWorksHeroSection() {
  const t = await getTranslations("Landing.HowItWorks.Hero")
  return (
    <LandingSectionWrapper id="hero" hero>
      <LandingContentWrapper
        justifyStart
        className="h-full px-5 md:px-10 lg:px-16 pt-24 md:pt-32 rounded-lg bg-linear-to-b from-sky-900 to-sky-50"
      >
        <RyogoH1 weight="font-bold" color="white" className="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="white" className="max-w-4xl text-center">
          {t("Subtitle")}
        </RyogoP>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
          <Link href="#onboarding">
            <Button size="lg" variant="white" className="w-full md:w-auto">
              <RyogoSmall color="brand" weight="font-medium">
                {t("PrimaryCTA")}
              </RyogoSmall>
              <RyogoIcon icon={ChevronDown} color="brand" size="sm" thick />
            </Button>
          </Link>
          <Link href="/resources#support">
            <Button
              size="lg"
              variant="outline"
              className="w-full gap-1 lg:gap-2 md:w-auto"
            >
              <RyogoSmall color="white" weight="font-medium">
                {t("SecondaryCTA")}
              </RyogoSmall>
            </Button>
          </Link>
        </div>
        <div className="bg-white mt-auto max-w-4xl relative w-full aspect-video rounded-t-2xl overflow-hidden">
          <Image
            className="object-cover"
            loading="eager"
            src="/forgotPasswordBG.png"
            alt=""
            fill
            sizes="896px"
          />
        </div>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
