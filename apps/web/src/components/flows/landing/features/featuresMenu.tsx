import { getTranslations } from "next-intl/server"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"
import Link from "next/link"
import {
  RyogoCaption,
  RyogoH1,
  RyogoH4,
  RyogoP,
  RyogoSmall,
} from "@/components/typography"
import Image from "next/image"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { ChevronDown } from "lucide-react"
import { SectionColWrapper } from "@/components/page/pageWrappers"
import { ScrollZoomIn } from "@/components/flows/landing/scrollZoomIn"
import { FeatureGrid } from "./featureWrappers"

//TODO: Add product images
export default async function FeaturesMenuSection() {
  const t = await getTranslations("Landing.Features.Menu")
  return (
    <LandingSectionWrapper id="menu" shrink>
      <LandingContentWrapper justifyStart>
        <RyogoH1 weight="font-bold">{t("Title")}</RyogoH1>
        <RyogoP color="light" className="max-w-4xl text-center">
          {t("Subtitle")}
        </RyogoP>
        <FeatureGrid>
          <FeaturesMenuItem
            title={t("M1")}
            subtitle={t("M1Subtitle")}
            href="#management"
            imageSrc="/logoPWA.png"

            // imageSrc="/featureMenu1.png"
          />
          <FeaturesMenuItem
            title={t("M2")}
            subtitle={t("M2Subtitle")}
            href="#scheduling"
            imageSrc="/logoPWA.png"

            // imageSrc="/featureMenu2.png"
          />
          <FeaturesMenuItem
            title={t("M3")}
            subtitle={t("M3Subtitle")}
            href="#communication"
            imageSrc="/logoPWA.png"

            // imageSrc="/featureMenu3.png"
          />
          <FeaturesMenuItem
            title={t("M4")}
            subtitle={t("M4Subtitle")}
            href="#analytics"
            imageSrc="/logoPWA.png"

            // imageSrc="/featureMenu4.png"
          />
          <FeaturesMenuItem
            title={t("M5")}
            subtitle={t("M5Subtitle")}
            href="#alerts"
            imageSrc="/logoPWA.png"

            // imageSrc="/featureMenu5.png"
          />
          <FeaturesMenuItem
            title={t("M6")}
            subtitle={t("M6Subtitle")}
            href="#security"
            imageSrc="/logoPWA.png"

            // imageSrc="/featureMenu6.png"
          />
        </FeatureGrid>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}

async function FeaturesMenuItem({
  title,
  subtitle,
  href,
  imageSrc,
}: {
  title: string
  subtitle: string
  href: React.ComponentProps<typeof Link>["href"]
  imageSrc: string
}) {
  const t = await getTranslations("Landing.Features.Menu")
  return (
    <ScrollZoomIn>
      <Link
        className="group flex flex-col w-full overflow-hidden max-w-2xl mx-auto h-full md:hover:bg-slate-50 md:dark:hover:bg-slate-700 rounded-lg py-2 md:p-5 transition-colors duration-300"
        href={href}
      >
        <SectionColWrapper small className="mb-3 md:mb-4">
          <RyogoH4 weight="font-bold" color="brand">
            {title}
          </RyogoH4>
          <RyogoCaption color="light">{subtitle}</RyogoCaption>
        </SectionColWrapper>
        <div className="relative mt-auto w-full max-w-2xl aspect-video rounded-lg overflow-hidden transition-transform duration-300 md:group-hover:scale-105">
          <Image
            className="object-cover"
            loading="eager"
            src={imageSrc}
            alt={title}
            fill
            sizes="672px"
          />
          <div className="absolute left-0 right-0 bottom-0 rounded-b-lg md:rounded-b-none opacity-90 p-2.5 md:p-3 flex items-center justify-center gap-1 md:gap-1.5 bg-slate-50 dark:bg-slate-700 transform translate-y-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300">
            <RyogoSmall color="brand" weight="font-medium">
              {t("LearnMore")}
            </RyogoSmall>
            <RyogoIcon icon={ChevronDown} color="brand" size="sm" thick />
          </div>
        </div>
      </Link>
    </ScrollZoomIn>
  )
}
