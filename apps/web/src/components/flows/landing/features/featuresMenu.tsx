import { getTranslations } from "next-intl/server"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"
import Link from "next/link"
import { UrlObject } from "url"
import { RyogoH1, RyogoP, RyogoSmall } from "@/components/typography"
import Image from "next/image"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { ChevronDown } from "lucide-react"

export default async function FeaturesMenuSection() {
  const t = await getTranslations("Landing.Features.Menu")
  return (
    <LandingSectionWrapper id="menu" shrink>
      <LandingContentWrapper justifyStart>
        <RyogoH1 weight="font-bold">{t("Title")}</RyogoH1>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <FeaturesMenuItem
            title={t("M1")}
            href="#management"
            src="/featureMenu1.png"
          />
          <FeaturesMenuItem
            title={t("M2")}
            href="#scheduling"
            src="/featureMenu2.png"
          />
          <FeaturesMenuItem
            title={t("M3")}
            href="#communication"
            src="/featureMenu3.png"
          />
          <FeaturesMenuItem
            title={t("M4")}
            href="#analytics"
            src="/featureMenu4.png"
          />
          <FeaturesMenuItem
            title={t("M5")}
            href="#alerts"
            src="/featureMenu5.png"
          />
          <FeaturesMenuItem
            title={t("M6")}
            href="#security"
            src="/featureMenu6.png"
          />
        </div>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}

async function FeaturesMenuItem({
  title,
  href,
  src,
}: {
  title: string
  href: string
  src: string
}) {
  const t = await getTranslations("Landing.Features.Menu")
  return (
    <Link
      className="group relative flex flex-col bg-white shadow rounded-lg overflow-hidden"
      href={href as any as UrlObject}
    >
      <RyogoP
        weight="font-bold"
        color="brand"
        className="mx-5 lg:mx-6 my-4 lg:my-5"
      >
        {title}
      </RyogoP>
      <div className="bg-white w-full max-w-2xl relative aspect-video overflow-hidden transition-transform duration-300 md:hover:scale-105">
        <Image
          className="object-cover"
          loading="eager"
          //TODO: Add product images
          //   src={src}
          src="/forgotPasswordBG.png"
          alt=""
          fill
          sizes="672px"
        />
      </div>
      <div className="absolute left-0 right-0 bottom-0 p-2.5 lg:p-3 flex items-center justify-center gap-1 lg:gap-1.5 bg-slate-50 rounded-b-lg transform translate-y-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300">
        <RyogoSmall color="brand">{t("LearnMore")}</RyogoSmall>
        <RyogoIcon icon={ChevronDown} color="brand" size="sm" thick />
      </div>
    </Link>
  )
}
