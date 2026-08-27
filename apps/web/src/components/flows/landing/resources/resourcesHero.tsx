import { RyogoSmall, RyogoH1, RyogoP } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"
import { RyogoVideo } from "@/components/video/ryogoVideo"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import {
  RyogoWhiteButton,
  RyogoOutlineButton,
  RyogoGhostButton,
} from "@/components/buttons/ryogoButtons"

export default async function ResourcesHeroSection() {
  const t = await getTranslations("Landing.Resources.Hero")
  return (
    <LandingSectionWrapper id="hero" hero>
      <LandingContentWrapper
        justifyStart
        className="h-full lg:flex-row px-5 sm:px-8 md:px-10 lg:px-16 py-24 md:py-32 rounded-lg bg-linear-to-b from-slate-950 dark:from-white to-slate-700 dark:to-slate-300"
      >
        <div className="flex flex-col gap-6 lg:gap-8 justify-center w-full">
          <RyogoH1
            weight="font-bold"
            color="white"
            className="text-center lg:text-left"
          >
            {t("Title")}
          </RyogoH1>
          <RyogoP color="light" className="max-w-4xl text-center lg:text-left">
            {t("Subtitle")}
          </RyogoP>
          <div className="flex gap-4 flex-col sm:flex-row items-center justify-center lg:justify-start">
            <Link href="#faq">
              <RyogoWhiteButton
                size="lg"
                label={t("PrimaryCTA")}
                className="w-full md:w-auto"
              />
            </Link>
            <Link href="#support">
              <RyogoOutlineButton
                size="lg"
                labelColor="white"
                label={t("SecondaryCTA")}
                className="w-full md:w-auto gap-1 mg:gap-1.5"
              >
                <RyogoIcon icon={ChevronDown} color="white" size="sm" thick />
              </RyogoOutlineButton>
            </Link>
          </div>
        </div>
        <div className="flex flex-col max-w-xl mt-8 lg:mt-0 gap-4 lg:gap-5 items-center justify-center w-full">
          <RyogoVideo
            //TODO: Add video source
            src="https://www.youtube.com/embed/1MobY_vR7-g"
            title="Ryogo Demo video"
            className="w-full aspect-video"
          />
          <Link href="#videos">
            <RyogoGhostButton
              size="lg"
              label={t("ScrollCTA")}
              labelColor="light"
              className="gap-1 lg:gap-1.5 hover:bg-slate-700/80 dark:hover:bg-slate-300/80"
            >
              <RyogoIcon icon={ChevronDown} color="light" size="sm" thick />
            </RyogoGhostButton>
          </Link>
        </div>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
