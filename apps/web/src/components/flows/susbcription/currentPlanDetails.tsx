import { RyogoEnclosedIcon, RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoCaption, RyogoH2 } from "@/components/typography"
import {
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import {
  OrderTypeEnum,
  SubscriptionPlanEnum,
} from "@ryogo-travel-app/db/schema"
import { Disc, BadgeCheck, ChevronRight } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { RyogoPill } from "@/components/pills/ryogoPills"
import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"

export default async function CurrentPlanDetails({
  subscriptionPlan,
  isOwner,
  isBasic,
  lastPaidPlan,
}: {
  subscriptionPlan: SubscriptionPlanEnum
  isOwner: boolean
  isBasic: boolean
  lastPaidPlan?: OrderTypeEnum
}) {
  const t = await getTranslations("Dashboard.AccountSubscription.CurrentPlan")
  return (
    <SectionColWrapper className="items-center w-full">
      <RyogoCaption color="light">{t("Header")}</RyogoCaption>
      <SectionRowWrapper className="items-center justify-start">
        <RyogoH2 color={isBasic ? "slate" : "brand"} weight="font-bold">
          {subscriptionPlan}
        </RyogoH2>
        <RyogoEnclosedIcon
          icon={isBasic ? Disc : BadgeCheck}
          size="sm"
          color="black"
        />
      </SectionRowWrapper>
      <RyogoPill
        label={
          isBasic
            ? t("FreeForever")
            : lastPaidPlan
              ? lastPaidPlan.toUpperCase()
              : t("Trial")
        }
        bgColor={isBasic ? "light" : "black"}
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
