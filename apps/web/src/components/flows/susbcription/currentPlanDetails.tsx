import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import {
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import { RyogoPill } from "@/components/pills/ryogoPills"
import { RyogoCaption, RyogoH2 } from "@/components/typography"
import {
  OrderTypeEnum,
  SubscriptionPlanEnum,
} from "@ryogo-travel-app/db/schema"
import { ChevronRight } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

export default async function CurrentPlanDetails({
  subscriptionPlan,
  isOwner,
  isSubscribed,
  lastPaidPlan,
}: {
  subscriptionPlan: SubscriptionPlanEnum
  isOwner: boolean
  isSubscribed: boolean
  lastPaidPlan?: OrderTypeEnum
}) {
  const t = await getTranslations("Dashboard.AccountSubscription.CurrentPlan")
  return (
    <SectionColWrapper className="items-center w-full">
      <RyogoCaption color="light">{t("Header")}</RyogoCaption>
      <SectionRowWrapper className="items-center justify-start">
        <RyogoH2 color={isSubscribed ? "brand" : "slate"} weight="font-bold">
          {subscriptionPlan}
        </RyogoH2>
      </SectionRowWrapper>
      <RyogoPill
        label={!isSubscribed ? t("FreeForever") : (lastPaidPlan ?? t("Trial"))}
        bgColor={isSubscribed ? "black" : "light"}
      />
      {isOwner && lastPaidPlan && (
        <Link href="/dashboard/account/subscription/orders">
          <RyogoOutlineButton
            label={t("ViewOrders")}
            labelColor="light"
            className="w-full"
          >
            <RyogoIcon icon={ChevronRight} size="sm" color="light" />
          </RyogoOutlineButton>
        </Link>
      )}
    </SectionColWrapper>
  )
}
