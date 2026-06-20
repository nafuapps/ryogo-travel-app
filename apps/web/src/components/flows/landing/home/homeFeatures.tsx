import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoH1, RyogoH4, RyogoP, RyogoSmall } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Image from "next/image"
import Link from "next/link"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"

export default async function HomeFeaturesSection() {
  const t = await getTranslations("Landing.Home.Features")
  return (
    <LandingSectionWrapper id="features" className="bg-white">
      <LandingContentWrapper>
        <RyogoH1 weight="font-bold" className="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="slate" className="text-center max-w-4xl">
          {t("Subtitle")}
        </RyogoP>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <FeatureCard
            title={t("F1.Title")}
            description={t("F1.Description")}
            imageSrc="/images/homeF1.png"
          />
          <FeatureCard
            title={t("F2.Title")}
            description={t("F2.Description")}
            imageSrc="/images/homeF2.png"
          />
          <FeatureCard
            title={t("F3.Title")}
            description={t("F3.Description")}
            imageSrc="/images/homeF3.png"
          />
          <FeatureCard
            title={t("F4.Title")}
            description={t("F4.Description")}
            imageSrc="/images/homeF4.png"
          />
        </div>
        <Link href="/features">
          <Button size="lg" className="w-full md:w-auto">
            <RyogoSmall color="white" weight="font-medium">
              {t("MoreCTA")}
            </RyogoSmall>
            <RyogoIcon icon={ChevronRight} size="sm" color="white" thick />
          </Button>
        </Link>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}

function FeatureCard({
  title,
  description,
  imageSrc,
}: {
  title: string
  description: string
  imageSrc: string
}) {
  return (
    <div className="flex flex-col gap-4 lg:gap-5 w-full rounded-lg bg-sky-50 p-6 lg:p-8">
      <div className="w-full aspect-video rounded overflow-hidden relative">
        <Image
          className="object-cover w-full"
          loading="eager"
          // src={imageSrc}
          src={"/logoPWA.png"}
          alt=""
          fill
          sizes="768px"
        />
      </div>
      <RyogoH4 weight="font-bold">{title}</RyogoH4>
      <RyogoSmall color="slate">{description}</RyogoSmall>
    </div>
  )
}
