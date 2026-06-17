import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoH1, RyogoP, RyogoSmall } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { TRIAL_DAYS } from "@ryogo-travel-app/api/apiConfig"
import { ChevronRight, Video } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

export default async function PricingCTASection() {
  const t = await getTranslations("Landing.Pricing.CTA")
  return (
    <section
      id="cta"
      className="py-24 md:py-32 px-4 md:px-6 lg:px-8 bg-linear-to-b from-sky-600 to-sky-900"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-8">
        <RyogoH1 color="white" weight="font-bold" extraClassName="text-center">
          {t("Title")}
        </RyogoH1>
        <div className="flex flex-col gap-4 justify-center items-center">
          <RyogoP
            color="white"
            extraClassName="max-w-4xl text-center opacity-80"
          >
            {t("Subtitle", { days: TRIAL_DAYS })}
          </RyogoP>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <Link href="/onboarding">
              <Button size="lg" variant="white" className="w-full md:w-auto ">
                <RyogoSmall color="brand">{t("PrimaryCTA")}</RyogoSmall>
                <RyogoIcon icon={ChevronRight} color="brand" size="sm" thick />
              </Button>
            </Link>
            {/* //TODO: Demo video */}
            <Link href="/features">
              <Button
                size="lg"
                variant="outline"
                className="w-full md:w-auto border-white hover:bg-white/20"
              >
                <RyogoSmall color="white">{t("SecondaryCTA")}</RyogoSmall>
                <RyogoIcon icon={Video} color="white" size="sm" thick />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
