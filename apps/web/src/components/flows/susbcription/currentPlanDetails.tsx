import { RyogoEnclosedIcon, RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoCaption, RyogoH2, RyogoSmall } from "@/components/typography"
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
import { Button } from "@/components/ui/button"
import Link from "next/link"

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
    <SectionColWrapper>
      <RyogoCaption color="light">{t("Header")}</RyogoCaption>
      <SectionRowWrapper justifyStart center>
        <RyogoH2 weight="font-bold">{subscriptionPlan.toUpperCase()}</RyogoH2>
        <RyogoEnclosedIcon
          icon={isBasic ? Disc : BadgeCheck}
          size="sm"
          color="black"
          bgColor="slate"
        />
      </SectionRowWrapper>
      <RyogoSmall weight="font-bold" color="light">
        {isBasic
          ? t("FreeForever")
          : lastPaidPlan
            ? lastPaidPlan.toUpperCase()
            : t("Trial")}
      </RyogoSmall>
      {isOwner && (
        <Link href="/dashboard/account/subscription/orders">
          <Button variant={"outline"} size="sm" className="w-full">
            <RyogoCaption color="slate">{t("ViewOrders")}</RyogoCaption>
            <RyogoIcon icon={ChevronRight} size="sm" />
          </Button>
        </Link>
      )}
    </SectionColWrapper>
  )
}
