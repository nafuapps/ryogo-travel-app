import { Button } from "@/components/ui/button"
import { RyogoH1, RyogoH3, RyogoP, RyogoSmall } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { MONTHLY_SUBSCRIPTION_FINAL_PRICE } from "@ryogo-travel-app/api/apiConfig"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { Check } from "lucide-react"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"

export default async function PricingPlansSection() {
  const t = await getTranslations("Landing.Pricing.Plans")
  return (
    <LandingSectionWrapper id="pricing" className="bg-sky-50 min-h-lvh">
      <LandingContentWrapper>
        <RyogoH1 weight="font-bold" className="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="slate" className="text-center max-w-4xl">
          {t("Subtitle")}
        </RyogoP>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
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
            <Link href="/auth/signup" className="w-full">
              <Button size="lg" className="w-full">
                <RyogoSmall color="white" weight="font-medium">
                  {t("Basic.CTA")}
                </RyogoSmall>
              </Button>
            </Link>
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
            ]}
          >
            <Link href="/onboarding" className="w-full">
              <Button size="lg" variant="brand" className="w-full">
                <RyogoSmall color="white" weight="font-medium">
                  {t("Premium.CTA")}
                </RyogoSmall>
              </Button>
            </Link>
          </PricingPlanCard>
        </div>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}

function PricingPlanCard({
  title,
  description,
  price,
  features,
  children,
}: {
  title: string
  description: string
  price: string
  features: string[]
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 lg:gap-5 p-5 lg:p-6 bg-white shadow rounded-lg">
      <RyogoP weight="font-bold" color="slate">
        {title}
      </RyogoP>
      <RyogoSmall color="light">{description}</RyogoSmall>
      <RyogoH3 weight="font-bold">{price}</RyogoH3>
      {children}
      <div className="flex flex-col gap-2 lg:gap-3 mb-2">
        {features.map((feature, index) => (
          <li key={index} className="flex gap-3">
            <RyogoIcon icon={Check} size="sm" color="brand" thick />
            <RyogoSmall>{feature}</RyogoSmall>
          </li>
        ))}
      </div>
    </div>
  )
}
