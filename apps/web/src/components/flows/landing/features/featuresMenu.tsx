import { getTranslations } from "next-intl/server"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"
import Link from "next/link"
import {
  RyogoCaption,
  RyogoH1,
  RyogoP,
  RyogoSmall,
} from "@/components/typography"
import Image from "next/image"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { ChevronDown } from "lucide-react"
import {
  SectionColWrapper,
  TileGridWrapper,
} from "@/components/page/pageWrappers"

export default async function FeaturesMenuSection() {
  const t = await getTranslations("Landing.Features.Menu")
  return (
    <LandingSectionWrapper id="menu" shrink>
      <LandingContentWrapper justifyStart>
        <RyogoH1 weight="font-bold">{t("Title")}</RyogoH1>
        <TileGridWrapper doubleMd>
          <FeaturesMenuItem
            title={t("M1")}
            subtitle={t("M1Subtitle")}
            href="#management"
            imageSrc="/featureMenu1.png"
          />
          <FeaturesMenuItem
            title={t("M2")}
            subtitle={t("M2Subtitle")}
            href="#scheduling"
            imageSrc="/featureMenu2.png"
          />
          <FeaturesMenuItem
            title={t("M3")}
            subtitle={t("M3Subtitle")}
            href="#communication"
            imageSrc="/featureMenu3.png"
          />
          <FeaturesMenuItem
            title={t("M4")}
            subtitle={t("M4Subtitle")}
            href="#analytics"
            imageSrc="/featureMenu4.png"
          />
          <FeaturesMenuItem
            title={t("M5")}
            subtitle={t("M5Subtitle")}
            href="#alerts"
            imageSrc="/featureMenu5.png"
          />
          <FeaturesMenuItem
            title={t("M6")}
            subtitle={t("M6Subtitle")}
            href="#security"
            imageSrc="/featureMenu6.png"
          />
        </TileGridWrapper>
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
    <Link
      className="group relative flex flex-col w-full bg-slate-100 dark:bg-slate-700 shadow rounded-lg overflow-hidden"
      href={href}
    >
      <SectionColWrapper small className="mx-5 md:mx-6 my-4 md:my-5">
        <RyogoP weight="font-bold" color="brand">
          {title}
        </RyogoP>
        <RyogoCaption color="light">{subtitle}</RyogoCaption>
      </SectionColWrapper>
      <div className="w-full max-w-3xl relative aspect-video overflow-hidden transition-transform duration-300 md:hover:scale-105">
        <Image
          className="object-cover"
          loading="eager"
          //TODO: Add product images
          //   src={imageSrc}
          src="/forgotPasswordBG.png"
          alt=""
          fill
          sizes="768px"
        />
      </div>
      <div className="absolute left-0 right-0 bottom-0 p-2.5 lg:p-3 flex items-center justify-center gap-1 lg:gap-1.5 bg-slate-100 dark:bg-slate-700 rounded-b-lg transform translate-y-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300">
        <RyogoSmall color="brand">{t("LearnMore")}</RyogoSmall>
        <RyogoIcon icon={ChevronDown} color="brand" size="sm" thick />
      </div>
    </Link>
  )
}
