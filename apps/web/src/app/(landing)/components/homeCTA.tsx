import {
  CaptionLight,
  H2Light,
  SmallBrand,
  SmallLight,
} from "@/components/typography"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

export default async function HomeCTASection() {
  const t = await getTranslations("Landing.Home.CTA")
  return (
    <section className="py-16 md:py-20 lg:py-24 px-4 md:px-6 lg:px-8 bg-linear-to-b from-sky-600 to-sky-900">
      <div className="max-w-4xl flex flex-col items-center justify-center mx-auto gap-4 md:gap-5 lg:gap-6 text-center">
        <H2Light>{t("Title")}</H2Light>
        <SmallLight>{t("Subtitle")}</SmallLight>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link href="/onboarding">
            <Button size="lg" variant="white" className="w-full md:w-auto ">
              <SmallBrand>{t("PrimaryCTA")}</SmallBrand>
            </Button>
          </Link>
          <Link href="/features">
            <Button
              size="lg"
              variant="outline"
              className="w-full md:w-auto border-white hover:bg-white/20"
            >
              <SmallLight>{t("SecondaryCTA")}</SmallLight>
            </Button>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-3 lg:gap-4 items-center">
          <div className="flex gap-0.5 md:gap-1 items-center">
            <Check className="text-sky-200 size-3 md:size-4" />
            <CaptionLight>{t("Prop1")}</CaptionLight>
          </div>
          <div className="hidden md:flex bg-sky-200 size-1.5 lg:size-2 rounded-full" />
          <div className="flex gap-0.5 md:gap-1 items-center">
            <Check className="text-sky-200 size-3 md:size-4" />
            <CaptionLight>{t("Prop2")}</CaptionLight>
          </div>
          <div className="hidden md:flex bg-sky-200 size-1.5 lg:size-2 rounded-full" />
          <div className="flex gap-0.5 md:gap-1 items-center">
            <Check className="text-sky-200 size-3 md:size-4" />
            <CaptionLight>{t("Prop3")}</CaptionLight>
          </div>
        </div>
      </div>
    </section>
  )
}
