import PaymentButton from "@/components/flows/susbcription/paymentButton"
import { RyogoEnclosedIcon, RyogoIcon } from "@/components/icons/ryogoIcon"
import {
  PageWrapper,
  SectionColWrapper,
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import {
  RyogoCaption,
  RyogoH2,
  RyogoP,
  RyogoSmall,
} from "@/components/typography"
import { Separator } from "@/components/ui/separator"
import {
  BASIC_PLAN_AGENT_LIMIT,
  BASIC_PLAN_DRIVER_LIMIT,
  BASIC_PLAN_MONTHLY_CONFIRMED_BOOKINGS_LIMIT,
  BASIC_PLAN_VEHICLE_LIMIT,
  BOOKINGS_ROLLOVER_DAYS,
  SUBSCRIPTION_REMINDER_DAYS,
} from "@/lib/uiConfig"
import {
  FindAgencyByIdType,
  FindAgencyDataType,
} from "@ryogo-travel-app/api/services/agency.services"
import { FindLastPaidOrderType } from "@ryogo-travel-app/api/services/order.services"
import { FindUserDetailsByIdType } from "@ryogo-travel-app/api/services/user.services"
import {
  OrderTypeEnum,
  SubscriptionPlanEnum,
} from "@ryogo-travel-app/db/schema"
import { differenceInDays } from "date-fns"
import {
  LucideIcon,
  Infinity as InfinityIcon,
  ChartSpline,
  Zap,
  Expand,
  Disc,
  Sparkle,
  CalendarSync,
  BadgeIndianRupee,
  ChevronRight,
} from "lucide-react"
import moment from "moment"
import { getTranslations } from "next-intl/server"
import SubscriptionPaymentOptionsComponent from "./subscriptionPaymentOptions"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function SubscriptionPageComponent({
  userDetails,
  agencyDetails,
  agencyData,
  confirmedBookingsLength,
  lastPaidOrder,
}: {
  userDetails: NonNullable<FindUserDetailsByIdType>
  agencyDetails: NonNullable<FindAgencyByIdType>
  agencyData: FindAgencyDataType
  confirmedBookingsLength: number
  lastPaidOrder: FindLastPaidOrderType
}) {
  const t = await getTranslations("Dashboard.AccountSubscription")

  const vehicleLength = agencyData.vehicles.length
  const driverLength = agencyData.drivers.length
  const agentLength = agencyData.agents.length

  const isBasic = agencyDetails.subscriptionPlan === SubscriptionPlanEnum.BASIC
  const daysToExpiry = differenceInDays(
    agencyDetails.subscriptionExpiresOn,
    new Date(),
  )
  const lastPaidPlan = lastPaidOrder?.orderType

  return (
    <PageWrapper id="AccountSubscriptionPage">
      <Link href="/dashboard/account/subscription/orders" className="self-end">
        <Button variant={"outline"} size="sm">
          <RyogoCaption color="slate">{t("ViewOrders")}</RyogoCaption>
          <RyogoIcon icon={ChevronRight} size="sm" />
        </Button>
      </Link>
      <SectionWrapper id="AccountSubscriptionInfo">
        <div className="flex flex-col md:flex-row gap-3 lg:gap-4 md:justify-between">
          <SectionColWrapper>
            <RyogoCaption color="light">{t("CurrentPlan")}</RyogoCaption>
            <SectionRowWrapper justifyStart center>
              <RyogoH2 weight="font-bold">
                {agencyDetails.subscriptionPlan.toUpperCase()}
              </RyogoH2>
              <RyogoEnclosedIcon
                icon={isBasic ? Disc : BadgeIndianRupee}
                size="sm"
                color="black"
                bgColor="slate"
              />
            </SectionRowWrapper>
            {lastPaidPlan && (
              <RyogoCaption color="slate">
                {lastPaidPlan.toUpperCase()}
              </RyogoCaption>
            )}
          </SectionColWrapper>
          {!isBasic && (
            <div
              className={`flex flex-col ${daysToExpiry < 0 ? "bg-red-100" : daysToExpiry < SUBSCRIPTION_REMINDER_DAYS ? "bg-yellow-100" : "bg-slate-200"}  p-4 lg:p-5 gap-2 lg:gap-3 rounded-lg items-center justify-center text-center`}
            >
              {daysToExpiry < SUBSCRIPTION_REMINDER_DAYS ? (
                <>
                  <RyogoCaption
                    color={daysToExpiry < 0 ? "red" : "yellow"}
                    weight="font-bold"
                  >
                    {daysToExpiry < 0
                      ? t("SubscriptionExpired", {
                          date: moment(
                            agencyDetails.subscriptionExpiresOn,
                          ).format("DD MMM YYYY"),
                        })
                      : t("SubscriptionExpiresIn", { days: daysToExpiry })}
                  </RyogoCaption>
                  <PaymentButton
                    agencyId={agencyDetails.id}
                    userId={userDetails.id}
                    plan={lastPaidPlan ?? OrderTypeEnum.MONTHLY}
                    ownerName={userDetails.name}
                    ownerEmail={userDetails.email}
                    ownerPhone={userDetails.phone}
                    icon={
                      <RyogoIcon
                        icon={CalendarSync}
                        size="sm"
                        color="white"
                        thick
                      />
                    }
                    renewLabel={t("RenewCTA")}
                  />
                </>
              ) : (
                <>
                  <RyogoCaption color={"light"}>{t("ValidTill")}</RyogoCaption>
                  <RyogoSmall weight="font-bold">
                    {moment(agencyDetails.subscriptionExpiresOn).format(
                      "DD MMM YYYY",
                    )}
                  </RyogoSmall>
                </>
              )}
            </div>
          )}
        </div>
      </SectionWrapper>
      {(isBasic || daysToExpiry < 0) && (
        <SectionWrapper id="UsageSection">
          <RyogoCaption color={"light"}>{t("LimitUsage")}</RyogoCaption>
          {(isBasic || daysToExpiry + BOOKINGS_ROLLOVER_DAYS < 0) && (
            <UsageElement
              label={t("BookingsUsage", { month: BOOKINGS_ROLLOVER_DAYS })}
              usageNumber={
                confirmedBookingsLength.toString() +
                " / " +
                BASIC_PLAN_MONTHLY_CONFIRMED_BOOKINGS_LIMIT
              }
              ratio={
                (confirmedBookingsLength * 100) /
                BASIC_PLAN_MONTHLY_CONFIRMED_BOOKINGS_LIMIT
              }
            />
          )}
          <UsageElement
            label={t("DriversUsage")}
            usageNumber={
              driverLength.toString() + " / " + BASIC_PLAN_DRIVER_LIMIT
            }
            ratio={(driverLength * 100) / BASIC_PLAN_DRIVER_LIMIT}
          />
          <UsageElement
            label={t("VehiclesUsage")}
            usageNumber={
              vehicleLength.toString() + " / " + BASIC_PLAN_VEHICLE_LIMIT
            }
            ratio={(vehicleLength * 100) / BASIC_PLAN_VEHICLE_LIMIT}
          />
          <UsageElement
            label={t("AgentsUsage")}
            usageNumber={
              agentLength.toString() + " / " + BASIC_PLAN_AGENT_LIMIT
            }
            ratio={(agentLength * 100) / BASIC_PLAN_AGENT_LIMIT}
          />
        </SectionWrapper>
      )}
      <Separator />

      {(isBasic || daysToExpiry < SUBSCRIPTION_REMINDER_DAYS) && (
        <SubscriptionPaymentOptionsComponent
          userDetails={userDetails}
          agencyDetails={agencyDetails}
        />
      )}

      <SectionWrapper id="PremiumAdvantageInfo" center>
        <div className="flex items-center justify-center text-nowrap text-center py-1 lg:py-1.5">
          <SectionRowWrapper small center>
            <div className="w-6 lg:w-8 grow-0 h-px bg-sky-700" />
            <RyogoIcon color="brand" size="sm" icon={Sparkle} thick />
            <RyogoP color="brand" weight="font-bold">
              {t("PremiumAdvantage")}
            </RyogoP>
            <RyogoIcon color="brand" size="sm" icon={Sparkle} thick />
            <div className="w-6 lg:w-8 grow-0 h-px bg-sky-700" />
          </SectionRowWrapper>
        </div>
        <div className="flex items-center justify-center text-center py-1 lg:py-1.5 lg:w-3/4">
          <RyogoCaption color="slate">{t("PremiumSubtitle")}</RyogoCaption>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4 w-full">
          <PremiumAdvantageCard
            icon={InfinityIcon}
            title={t("UnlimitedBookings.Title")}
            subtitle={t("UnlimitedBookings.Subtitle")}
          />
          <PremiumAdvantageCard
            icon={Expand}
            title={t("FullAccess.Title")}
            subtitle={t("FullAccess.Subtitle")}
          />
          <PremiumAdvantageCard
            icon={ChartSpline}
            title={t("AdvancedAnalytics.Title")}
            subtitle={t("AdvancedAnalytics.Subtitle")}
          />
          <PremiumAdvantageCard
            icon={Zap}
            title={t("LiveSupport.Title")}
            subtitle={t("LiveSupport.Subtitle")}
          />
        </div>
      </SectionWrapper>
    </PageWrapper>
  )
}

function PremiumAdvantageCard({
  icon,
  title,
  subtitle,
}: {
  icon: LucideIcon
  title: string
  subtitle: string
}) {
  return (
    <div className="flex flex-row gap-2 lg:gap-3 bg-slate-50 p-3 lg:p-4 rounded-lg w-full">
      <RyogoEnclosedIcon
        icon={icon}
        color="black"
        bgColor="white"
        size="sm"
        circular
      />
      <div className="flex flex-col gap-1 lg:gap-1.5">
        <RyogoCaption weight="font-bold">{title}</RyogoCaption>
        <RyogoCaption color="slate">{subtitle}</RyogoCaption>
      </div>
    </div>
  )
}

function UsageElement({
  label,
  usageNumber,
  ratio,
}: {
  label: string
  usageNumber: string
  ratio: number
}) {
  let bgColor = `bg-gradient-to-r`
  if (ratio >= 100) {
    bgColor += " from-red-800 to-red-500"
  } else if (ratio >= 80) {
    bgColor += " from-yellow-800 to-yellow-500"
  } else {
    bgColor += " from-sky-800 to-sky-500"
  }
  return (
    <div className="flex flex-col gap-1 lg:gap-1.5">
      <SectionRowWrapper small>
        <RyogoCaption weight="font-bold">{label}</RyogoCaption>
        <RyogoCaption weight="font-bold">{usageNumber}</RyogoCaption>
      </SectionRowWrapper>
      <div className="rounded-full overflow-hidden h-2 lg:h-2.5 bg-slate-200">
        <div
          className={`h-full rounded-full ${bgColor}`}
          style={{ width: (ratio > 100 ? 100 : ratio) + "%" }}
        />
      </div>
    </div>
  )
}
