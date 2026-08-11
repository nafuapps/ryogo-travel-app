import { RyogoCaption, RyogoSmall } from "@/components/typography"
import { SUBSCRIPTION_EXPIRY_REMINDER_DAYS } from "@/lib/uiConfig"
import { FindAgencyByIdType } from "@ryogo-travel-app/api/services/agency.services"
import { FindUserDetailsByIdType } from "@ryogo-travel-app/api/services/user.services"
import { UserRolesEnum, OrderTypeEnum } from "@ryogo-travel-app/db/schema"
import { differenceInDays } from "date-fns"
import { CalendarSync } from "lucide-react"
import { getTranslations } from "next-intl/server"
import PaymentButton from "./paymentButton"
import moment from "moment"
import { RyogoIcon } from "@/components/icons/ryogoIcon"

export default async function PlanExpiryDetails({
  userDetails,
  agencyDetails,
  lastPaidOrderType,
}: {
  userDetails: NonNullable<FindUserDetailsByIdType>
  agencyDetails: NonNullable<FindAgencyByIdType>
  lastPaidOrderType?: OrderTypeEnum
}) {
  const t = await getTranslations("Dashboard.AccountSubscription.PlanExpiry")

  const isOwner = userDetails.userRole === UserRolesEnum.OWNER

  const daysToExpiry = differenceInDays(
    agencyDetails.subscriptionExpiresOn,
    new Date(),
  )
  const needExpiryReminder = daysToExpiry <= SUBSCRIPTION_EXPIRY_REMINDER_DAYS

  return (
    <div
      id="PlanExpiry"
      className={`flex flex-col ${daysToExpiry < 0 ? "bg-red-200 dark:bg-red-800" : needExpiryReminder ? "bg-yellow-200 dark:bg-yellow-800" : "bg-slate-200 dark:bg-slate-800"}  p-4 lg:p-5 gap-2 lg:gap-3 rounded-lg items-center justify-center text-center`}
    >
      {needExpiryReminder ? (
        <>
          <RyogoSmall
            color={daysToExpiry < 0 ? "red" : "yellow"}
            weight="font-bold"
          >
            {daysToExpiry < 0
              ? t("SubscriptionExpired", {
                  date: moment(agencyDetails.subscriptionExpiresOn).format(
                    "DD MMM YYYY",
                  ),
                })
              : t("SubscriptionExpiresIn", { days: daysToExpiry })}
          </RyogoSmall>
          {isOwner && (
            <PaymentButton
              agencyId={agencyDetails.id}
              userId={userDetails.id}
              plan={lastPaidOrderType ?? OrderTypeEnum.MONTHLY}
              ownerName={userDetails.name}
              ownerEmail={userDetails.email}
              ownerPhone={userDetails.phone}
              icon={
                <RyogoIcon icon={CalendarSync} size="sm" color="white" thick />
              }
              renewLabel={t("RenewCTA")}
            />
          )}
        </>
      ) : (
        <>
          <RyogoCaption color={"light"}>{t("ValidTill")}</RyogoCaption>
          <RyogoSmall weight="font-bold">
            {moment(agencyDetails.subscriptionExpiresOn).format("DD MMM YYYY")}
          </RyogoSmall>
        </>
      )}
    </div>
  )
}
