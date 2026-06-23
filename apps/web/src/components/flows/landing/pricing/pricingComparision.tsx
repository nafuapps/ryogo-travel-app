import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoH2, RyogoH4, RyogoP, RyogoSmall } from "@/components/typography"
import { Button } from "@/components/ui/button"
import {
  BASIC_PLAN_AGENT_LIMIT,
  BASIC_PLAN_DRIVER_LIMIT,
  BASIC_PLAN_VEHICLE_LIMIT,
  BASIC_PLAN_WEEKLY_CONFIRMED_BOOKINGS_LIMIT,
  BASIC_PLAN_WEEKLY_CONFIRMED_BOOKINGS_ROLLOVER_WINDOW_DAYS,
} from "@/lib/uiConfig"
import { ChevronRight, CircleCheckBig, X } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"

export default async function PricingComparisionSection() {
  const t = await getTranslations("Landing.Pricing.Comparision")
  return (
    <LandingSectionWrapper id="comparision" className="bg-white">
      <LandingContentWrapper>
        <ComparisionRow
          title={<RyogoH2 weight="font-bold">{t("Header")}</RyogoH2>}
          basicItem={<RyogoP weight="font-bold">{t("Basic")}</RyogoP>}
          premiumItem={<RyogoP weight="font-bold">{t("Premium")}</RyogoP>}
        />
        <ComparisionGroup title={t("Entities")}>
          <ComparisionRow
            title={<RyogoSmall>{t("OnboardVehicles")}</RyogoSmall>}
            basicItem={<RyogoSmall>{BASIC_PLAN_VEHICLE_LIMIT}</RyogoSmall>}
            premiumItem={<RyogoSmall>{t("Unlimited")}</RyogoSmall>}
          />
          <ComparisionRow
            title={<RyogoSmall>{t("OnboardDrivers")}</RyogoSmall>}
            basicItem={<RyogoSmall>{BASIC_PLAN_DRIVER_LIMIT}</RyogoSmall>}
            premiumItem={<RyogoSmall>{t("Unlimited")}</RyogoSmall>}
          />
          <ComparisionRow
            title={<RyogoSmall>{t("OnboardAgents")}</RyogoSmall>}
            basicItem={<RyogoSmall>{BASIC_PLAN_AGENT_LIMIT}</RyogoSmall>}
            premiumItem={<RyogoSmall>{t("Unlimited")}</RyogoSmall>}
          />
        </ComparisionGroup>
        <ComparisionGroup title={t("Bookings")}>
          <ComparisionRow
            title={
              <RyogoSmall>
                {t("ConfrimedBookings", {
                  days: BASIC_PLAN_WEEKLY_CONFIRMED_BOOKINGS_ROLLOVER_WINDOW_DAYS,
                })}
              </RyogoSmall>
            }
            basicItem={
              <RyogoSmall>
                {BASIC_PLAN_WEEKLY_CONFIRMED_BOOKINGS_LIMIT}
              </RyogoSmall>
            }
            premiumItem={<RyogoSmall>{t("Unlimited")}</RyogoSmall>}
          />
          <ComparisionRow
            title={<RyogoSmall>{t("AssignmentSuggestions")}</RyogoSmall>}
            basicItem={<BlackCheckIcon />}
            premiumItem={<BrandCheckIcon />}
          />
          <ComparisionRow
            title={<RyogoSmall>{t("SendMessages")}</RyogoSmall>}
            basicItem={<BlackCheckIcon />}
            premiumItem={<BrandCheckIcon />}
          />
        </ComparisionGroup>
        <ComparisionGroup title={t("DriverApp")}>
          <ComparisionRow
            title={<RyogoSmall>{t("DriverAppAccess")}</RyogoSmall>}
            basicItem={<BlackCheckIcon />}
            premiumItem={<BrandCheckIcon />}
          />
          <ComparisionRow
            title={<RyogoSmall>{t("DriverExpenses")}</RyogoSmall>}
            basicItem={<BlackCheckIcon />}
            premiumItem={<BrandCheckIcon />}
          />
        </ComparisionGroup>
        <ComparisionGroup title={t("Analytics")}>
          <ComparisionRow
            title={<RyogoSmall>{t("BasicAnalytics")}</RyogoSmall>}
            basicItem={<BlackCheckIcon />}
            premiumItem={<BrandCheckIcon />}
          />
          <ComparisionRow
            title={<RyogoSmall>{t("AdvancedAnalytics")}</RyogoSmall>}
            basicItem={<BlackCrossIcon />}
            premiumItem={<BrandCheckIcon />}
          />
          <ComparisionRow
            title={<RyogoSmall>{t("AIRecommendations")}</RyogoSmall>}
            basicItem={<BlackCrossIcon />}
            premiumItem={<BrandCheckIcon />}
          />
        </ComparisionGroup>
        <ComparisionGroup title={t("AgencyControl")}>
          <ComparisionRow
            title={<RyogoSmall>{t("GetAlerts")}</RyogoSmall>}
            basicItem={<BlackCheckIcon />}
            premiumItem={<BrandCheckIcon />}
          />
          <ComparisionRow
            title={<RyogoSmall>{t("Feed")}</RyogoSmall>}
            basicItem={<BlackCheckIcon />}
            premiumItem={<BrandCheckIcon />}
          />
          <ComparisionRow
            title={<RyogoSmall>{t("CustomerReminders")}</RyogoSmall>}
            basicItem={<BlackCrossIcon />}
            premiumItem={<BrandCheckIcon />}
          />
          <ComparisionRow
            title={<RyogoSmall>{t("NewFeatures")}</RyogoSmall>}
            basicItem={<BlackCrossIcon />}
            premiumItem={<BrandCheckIcon />}
          />
          <ComparisionRow
            title={<RyogoSmall>{t("MultipleOwners")}</RyogoSmall>}
            basicItem={<BlackCrossIcon />}
            premiumItem={<BrandCheckIcon />}
          />
        </ComparisionGroup>
        <ComparisionGroup title={t("SafetyPrivacy")}>
          <ComparisionRow
            title={<RyogoSmall>{t("DataSecurity")}</RyogoSmall>}
            basicItem={<BlackCheckIcon />}
            premiumItem={<BrandCheckIcon />}
          />
          <ComparisionRow
            title={<RyogoSmall>{t("DataPrivacy")}</RyogoSmall>}
            basicItem={<BlackCheckIcon />}
            premiumItem={<BrandCheckIcon />}
          />
        </ComparisionGroup>
        <ComparisionGroup title={t("Support")}>
          <ComparisionRow
            title={<RyogoSmall>{t("EmailSupport")}</RyogoSmall>}
            basicItem={<BlackCheckIcon />}
            premiumItem={<BrandCheckIcon />}
          />
          <ComparisionRow
            title={<RyogoSmall>{t("PrioritySupport")}</RyogoSmall>}
            basicItem={<BlackCrossIcon />}
            premiumItem={<BrandCheckIcon />}
          />
          <ComparisionRow
            title={<RyogoSmall>{t("SupportTicket")}</RyogoSmall>}
            basicItem={<BlackCrossIcon />}
            premiumItem={<BrandCheckIcon />}
          />
        </ComparisionGroup>
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

const BlackCheckIcon = () => {
  return <RyogoIcon icon={CircleCheckBig} size="sm" color="black" thick />
}

const BlackCrossIcon = () => {
  return <RyogoIcon icon={X} size="sm" color="light" thick />
}

const BrandCheckIcon = () => {
  return <RyogoIcon icon={CircleCheckBig} size="sm" color="brand" thick />
}

function ComparisionGroup({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="w-full flex flex-col divide-y border-b">
      <div className="w-full px-1 lg:px-2 py-3 lg:py-4 flex items-center">
        <RyogoH4 weight="font-bold">{title}</RyogoH4>
      </div>
      {children}
    </div>
  )
}

function ComparisionRow({
  title,
  basicItem,
  premiumItem,
}: {
  title: React.ReactNode
  basicItem: React.ReactNode
  premiumItem: React.ReactNode
}) {
  return (
    <div className="w-full grid grid-cols-4 md:grid-cols-5 gap-2">
      <div className="col-span-2 md:col-span-3 px-1 lg:px-2 py-3 lg:py-4 bg-white flex items-center">
        {title}
      </div>
      <div className="col-span-1 px-1 lg:px-2 py-3 lg:py-4 bg-slate-50 flex items-center justify-center">
        {basicItem}
      </div>
      <div className="col-span-1 px-1 lg:px-2 py-3 lg:py-4 bg-sky-50 flex items-center justify-center">
        {premiumItem}
      </div>
    </div>
  )
}
