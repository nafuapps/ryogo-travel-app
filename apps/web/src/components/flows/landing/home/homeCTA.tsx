import { RyogoIcon } from "@/components/icons/ryogoIcon"
import {
  RyogoCaption,
  RyogoH1,
  RyogoP,
  RyogoSmall,
} from "@/components/typography"
import { Button } from "@/components/ui/button"
import { SUPPORT_HELPLINE_NUMBER } from "@/lib/uiConfig"
import { TRIAL_DAYS } from "@ryogo-travel-app/api/apiConfig"
import { Check } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

export default async function HomeCTASection() {
  const t = await getTranslations("Landing.Home.CTA")
  return (
    <section
      id="cta"
      className="py-24 md:py-32 px-4 md:px-6 lg:px-8 bg-linear-to-b from-sky-600 to-sky-900"
    >
      <div className="max-w-6xl flex flex-col items-center justify-center mx-auto gap-6 md:gap-8">
        <RyogoH1 color="white" weight="font-bold" extraClassName="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="white" extraClassName="max-w-4xl text-center opacity-80">
          {t("Subtitle", { days: TRIAL_DAYS })}
        </RyogoP>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link href="/onboarding">
            <Button size="lg" variant="white" className="w-full md:w-auto ">
              <RyogoSmall color="brand">{t("PrimaryCTA")}</RyogoSmall>
            </Button>
          </Link>
          <Link href={`tel:${SUPPORT_HELPLINE_NUMBER}`}>
            <Button
              size="lg"
              variant="outline"
              className="w-full md:w-auto border-white hover:bg-white/20"
            >
              <RyogoSmall color="white">{t("SecondaryCTA")}</RyogoSmall>
            </Button>
          </Link>
        </div>
        <div className="flex flex-col md:flex-row gap-3 lg:gap-4 items-center">
          <PropItem label={t("Prop1")} />
          <PropDot />
          <PropItem label={t("Prop2")} />
          <PropDot />
          <PropItem label={t("Prop3")} />
        </div>
      </div>
    </section>
  )
}

function PropItem({ label }: { label: string }) {
  return (
    <div className="flex gap-0.5 md:gap-1 items-center">
      <RyogoIcon icon={Check} size="sm" color="white" thick />
      <RyogoCaption color="white">{label}</RyogoCaption>
    </div>
  )
}

function PropDot() {
  return (
    <div className="hidden md:flex bg-sky-200 size-1 lg:size-1.5 rounded-full" />
  )
}
