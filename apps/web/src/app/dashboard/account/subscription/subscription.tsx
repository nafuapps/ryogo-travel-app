import { RyogoIcon } from "@/components/icons/ryogoIcon"
import {
  PageWrapper,
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { RyogoCaption, RyogoP } from "@/components/typography"
import { Separator } from "@/components/ui/separator"
import { SUBSCRIPTION_EXPIRY_REMINDER_DAYS } from "@/lib/uiConfig"
import {
  FindAgencyByIdType,
  FindAgencyDataType,
} from "@ryogo-travel-app/api/services/agency.services"
import { FindLastPaidOrderType } from "@ryogo-travel-app/api/services/order.services"
import { FindUserDetailsByIdType } from "@ryogo-travel-app/api/services/user.services"
import {
  SubscriptionPlanEnum,
  UserRolesEnum,
} from "@ryogo-travel-app/db/schema"
import { differenceInDays } from "date-fns"
import {
  Infinity as InfinityIcon,
  ChartSpline,
  Zap,
  Expand,
  Sparkle,
  Brush,
  Timeline,
} from "lucide-react"
import { getTranslations } from "next-intl/server"
import BuySubscriptionComponent from "@/components/flows/susbcription/buySubscription"
import AccountDetailHeaderTabs from "@/components/header/detailHeaderTabs/accountDetailHeaderTabs"
import TrySubscriptionComponent from "@/components/flows/susbcription/trySubscription"
import PlanExpiryDetails from "@/components/flows/susbcription/planExpiryDetails"
import PremiumNudge from "@/components/flows/susbcription/premiumNudge"
import PremiumAdvantageCard from "@/components/flows/susbcription/premiumAdvantageCard"
import PlanUsageCard from "@/components/flows/susbcription/planUsageCard"
import CurrentPlanDetails from "@/components/flows/susbcription/currentPlanDetails"

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

  const isOwner = userDetails.userRole === UserRolesEnum.OWNER

  const isBasic = agencyDetails.subscriptionPlan === SubscriptionPlanEnum.BASIC
  const daysToExpiry = differenceInDays(
    agencyDetails.subscriptionExpiresOn,
    new Date(),
  )
  const lastPaidPlan = lastPaidOrder?.orderType
  const needExpiryReminder = daysToExpiry <= SUBSCRIPTION_EXPIRY_REMINDER_DAYS

  return (
    <PageWrapper id="AccountSubscriptionPage">
      <AccountDetailHeaderTabs selectedTab="Subscription" />
      <SectionWrapper id="AccountSubscriptionInfo">
        <div
          id="CurrentPlan"
          className="flex flex-col md:flex-row gap-3 lg:gap-4 md:justify-between"
        >
          <CurrentPlanDetails
            isBasic={isBasic}
            isOwner={isOwner}
            subscriptionPlan={agencyDetails.subscriptionPlan}
            lastPaidPlan={lastPaidPlan}
          />
          {isBasic ? (
            isOwner && (
              <PremiumNudge
                userDetails={userDetails}
                agencyDetails={agencyDetails}
              />
            )
          ) : (
            <PlanExpiryDetails
              userDetails={userDetails}
              agencyDetails={agencyDetails}
              lastPaidOrderType={lastPaidPlan}
            />
          )}
        </div>
      </SectionWrapper>
      {(isBasic || daysToExpiry < 0) && (
        <PlanUsageCard
          agencyData={agencyData}
          confirmedBookingsLength={confirmedBookingsLength}
          isBasic={isBasic}
          daysToExpiry={daysToExpiry}
        />
      )}
      <Separator />
      {isOwner &&
        (isBasic || needExpiryReminder) &&
        (agencyDetails.hasTriedSubscription ? (
          <BuySubscriptionComponent userDetails={userDetails} />
        ) : (
          <TrySubscriptionComponent agencyId={agencyDetails.id} />
        ))}
      <div
        id="PremiumAdvantageInfo"
        className="w-full shrink-0 shadow rounded-lg overflow-hidden bg-white relative flex flex-col gap-4 md:gap-6 items-center px-6 md:px-8 py-12 md:py-16"
      >
        <div className="bg-linear-to-b from-sky-900 to-sky-700 rounded-full size-20 md:size-28 lg:size-32 absolute -left-10 -top-10 md:-left-14 md:-top-14 lg:-left-16 lg:-top-16"></div>
        <div className="bg-linear-to-b from-sky-900 to-sky-700 rounded-full size-20 md:size-28 lg:size-32 absolute -right-10 -top-10 md:-right-14 md:-top-14 lg:-right-16 lg:-top-16"></div>
        <div className="bg-linear-to-b from-sky-700 to-sky-500 rounded-full size-20 md:size-28 lg:size-32 absolute -left-10 -bottom-10 md:-left-14 md:-bottom-14 lg:-left-16 lg:-bottom-16"></div>
        <div className="bg-linear-to-b from-sky-700 to-sky-500 rounded-full size-20 md:size-28 lg:size-32 absolute -right-10 -bottom-10 md:-right-14 md:-bottom-14 lg:-right-16 lg:-bottom-16"></div>
        <SectionRowWrapper small center>
          <div className="w-6 lg:w-8 grow-0 h-px bg-sky-700" />
          <RyogoIcon color="brand" size="sm" icon={Sparkle} thick />
          <RyogoP
            color="brand"
            weight="font-bold"
            className="text-center text-nowrap"
          >
            {t("PremiumAdvantage")}
          </RyogoP>
          <RyogoIcon color="brand" size="sm" icon={Sparkle} thick />
          <div className="w-6 lg:w-8 grow-0 h-px bg-sky-700" />
        </SectionRowWrapper>
        <RyogoCaption color="slate" className="text-center">
          {t("PremiumSubtitle")}
        </RyogoCaption>
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
          <PremiumAdvantageCard
            icon={Brush}
            title={t("Customization.Title")}
            subtitle={t("Customization.Subtitle")}
          />
          <PremiumAdvantageCard
            icon={Timeline}
            title={t("WiderDataAccess.Title")}
            subtitle={t("WiderDataAccess.Subtitle")}
          />
        </div>
      </div>
    </PageWrapper>
  )
}
