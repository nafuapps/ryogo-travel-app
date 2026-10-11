import {
  RyogoCaption,
  RyogoH1,
  RyogoH4,
  RyogoP,
  RyogoSmall,
} from "@/components/typography"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import {
  MONTHLY_SUBSCRIPTION_FINAL_PRICE,
  PREMIUM_TRIAL_DAYS,
} from "@ryogo-travel-app/api/apiConfig"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { Check, ChevronDown } from "lucide-react"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"
import {
  RyogoDefaultButton,
  RyogoBrandButton,
  RyogoGhostButton,
} from "@/components/buttons/ryogoButtons"
import { ScrollZoomIn } from "@/components/flows/landing/scrollZoomIn"
import { SectionColWrapper } from "@/components/page/pageWrappers"
import { ClickZoomOut } from "@/components/flows/landing/clickZoomOut"

export default async function PricingPlansSection() {
  const t = await getTranslations("Landing.Pricing.Plans")
  return (
    <LandingSectionWrapper id="pricing" hero>
      <LandingContentWrapper
        justifyStart
        className="h-full px-5 md:px-10 lg:px-16 pt-24 pb-12 md:pt-32 md:pb-18 rounded-lg bg-linear-to-b from-blue-200 dark:from-blue-900 to-cyan-50 dark:to-cyan-950"
      >
        <RyogoH1 weight="font-bold" color="brand" className="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="slate" className="text-center max-w-4xl">
          {t("Subtitle")}
        </RyogoP>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 w-full">
          <PricingPlanCard
            title={t("Basic.Title")}
            description={t("Basic.Description")}
            price={t("Basic.Price")}
            features={[
              t("Basic.F1"),
              t("Basic.F2"),
              t("Basic.F3"),
              t("Basic.F4"),
              t("Basic.F5"),
              t("Basic.F6"),
            ]}
          >
            <ClickZoomOut>
              <Link href="/auth/signup" className="w-full">
                <RyogoDefaultButton
                  size="lg"
                  className="w-full"
                  label={t("Basic.CTA")}
                />
              </Link>
            </ClickZoomOut>
          </PricingPlanCard>
          <PricingPlanCard
            title={t("Premium.Title")}
            description={t("Premium.Description")}
            price={t("Premium.Price", {
              price: MONTHLY_SUBSCRIPTION_FINAL_PRICE,
            })}
            features={[
              t("Premium.F1"),
              t("Premium.F2"),
              t("Premium.F3"),
              t("Premium.F4"),
              t("Premium.F5"),
              t("Premium.F6"),
              t("Premium.F7"),
            ]}
            everything={t("Premium.Everything")}
          >
            <ClickZoomOut>
              <Link href="/onboarding" className="w-full">
                <RyogoBrandButton
                  size="lg"
                  labelColor="white"
                  className="w-full"
                  label={t("Premium.CTA", { days: PREMIUM_TRIAL_DAYS })}
                />
              </Link>
            </ClickZoomOut>
          </PricingPlanCard>
        </div>
        <Link href="#comparision">
          <RyogoGhostButton
            size="lg"
            className="gap-1 lg:gap-1.5 hover:bg-sky-100/80 dark:hover:bg-sky-900/80"
            label={t("CompareCTA")}
            labelColor="brand"
          >
            <RyogoIcon icon={ChevronDown} color="brand" size="sm" thick />
          </RyogoGhostButton>
        </Link>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}

function PricingPlanCard({
  title,
  description,
  price,
  features,
  everything,
  children,
}: {
  title: string
  description: string
  price: string
  features: string[]
  everything?: string
  children: React.ReactNode
}) {
  return (
    <ScrollZoomIn className="flex flex-col gap-4 lg:gap-5 p-6 lg:p-8 bg-white dark:bg-slate-800 shadow-lg rounded-lg">
      <RyogoP weight="font-bold" color={everything ? "brand" : "slate"}>
        {title}
      </RyogoP>
      <RyogoSmall color="light">{description}</RyogoSmall>
      <RyogoH4 weight="font-medium">{price}</RyogoH4>
      {children}
      <SectionColWrapper className="mb-2">
        {everything && <RyogoCaption>{everything}</RyogoCaption>}
        {features.map((feature) => (
          <li key={feature} className="flex gap-2 md:gap-3 items-center">
            <RyogoIcon
              icon={Check}
              size="xs"
              color={everything ? "brand" : "slate"}
              thick
            />
            <RyogoCaption>{feature}</RyogoCaption>
          </li>
        ))}
      </SectionColWrapper>
    </ScrollZoomIn>
  )
}
