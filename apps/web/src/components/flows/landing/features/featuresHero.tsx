import { RyogoH1, RyogoP } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"
import Link from "next/link"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { ChevronDown } from "lucide-react"
import Image from "next/image"
import {
  RyogoBrandButton,
  RyogoWhiteButton,
} from "@/components/buttons/ryogoButtons"

export default async function FeaturesHeroSection() {
  const t = await getTranslations("Landing.Features.Hero")
  return (
    <LandingSectionWrapper id="hero" hero>
      <LandingContentWrapper
        justifyStart
        className="h-full px-5 sm:px-8 md:px-10 lg:px-16 pt-24 md:pt-32 rounded-lg bg-linear-to-b from-slate-300 dark:from-slate-600 to-slate-50 dark:to-slate-900"
      >
        <RyogoH1 weight="font-bold" color="brand" className="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="slate" className="max-w-4xl text-center">
          {t("Subtitle")}
        </RyogoP>
        <div className="flex flex-col md:flex-row gap-4 justify-center lg:mb-4">
          <Link href="#menu">
            <RyogoBrandButton
              size="lg"
              label={t("PrimaryCTA")}
              className="w-full md:w-auto"
            >
              <RyogoIcon icon={ChevronDown} color="white" size="sm" thick />
            </RyogoBrandButton>
          </Link>
          <Link href="/auth/signup">
            <RyogoWhiteButton
              size="lg"
              label={t("SecondaryCTA")}
              className="w-full gap-1 lg:gap-2 md:w-auto"
            />
          </Link>
        </div>
        <div className="bg-white dark:bg-slate-900 mt-auto max-w-md sm:max-w-3xl relative w-full aspect-square sm:aspect-video rounded-t-2xl overflow-hidden">
          <Image
            className="object-cover"
            loading="eager"
            src="/forgotPasswordBG.png"
            alt=""
            fill
            sizes="(max-width: 640px) 448px,768px"
          />
        </div>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
