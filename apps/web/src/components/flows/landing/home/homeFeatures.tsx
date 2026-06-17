import { RyogoH1, RyogoH4, RyogoP, RyogoSmall } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Image from "next/image"
import Link from "next/link"

export default async function HomeFeaturesSection() {
  const t = await getTranslations("Landing.Home.Features")
  return (
    <section
      id="features"
      className="py-24 md:py-32 px-4 md:px-6 lg:px-8 min-h-lvh bg-white"
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-6 md:gap-8">
        <RyogoH1 weight="font-bold" extraClassName="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="slate" extraClassName="text-center max-w-4xl">
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
            <ChevronRight className="text-white size-5 lg:size-6" />
          </Button>
        </Link>
      </div>
    </section>
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
