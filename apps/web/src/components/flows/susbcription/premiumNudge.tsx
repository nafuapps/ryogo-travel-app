import TryPremiumAlertButton from "@/components/buttons/alert/tryPremiumAlertButton"
import { RyogoCaption } from "@/components/typography"
import { PREMIUM_TRIAL_DAYS } from "@ryogo-travel-app/api/apiConfig"
import { FindAgencyByIdType } from "@ryogo-travel-app/api/services/agency.services"
import { FindUserDetailsByIdType } from "@ryogo-travel-app/api/services/user.services"
import { OrderTypeEnum } from "@ryogo-travel-app/db/schema"
import { BadgeCheck } from "lucide-react"
import { getTranslations } from "next-intl/server"
import PaymentButton from "./paymentButton"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoBrandButton } from "@/components/buttons/ryogoButtons"

export default async function PremiumNudge({
  userDetails,
  agencyDetails,
}: {
  userDetails: NonNullable<FindUserDetailsByIdType>
  agencyDetails: NonNullable<FindAgencyByIdType>
}) {
  const t = await getTranslations("Dashboard.AccountSubscription.PremiumNudge")
  return (
    <div
      id="PremiumNudge"
      className={`flex flex-col bg-slate-100  dark:bg-slate-800 p-4 lg:p-5 gap-2 lg:gap-3 rounded-lg items-center justify-center text-center`}
    >
      {agencyDetails.hasTriedSubscription ? (
        <>
          <PaymentButton
            agencyId={agencyDetails.id}
            userId={userDetails.id}
            plan={OrderTypeEnum.MONTHLY}
            ownerName={userDetails.name}
            ownerEmail={userDetails.email}
            ownerPhone={userDetails.phone}
            icon={<RyogoIcon icon={BadgeCheck} size="sm" color="white" thick />}
            renewLabel={t("BuyPremiumCTA")}
          />
          <RyogoCaption
            color="light"
            weight="font-bold"
            className="md:max-w-3xs"
          >
            {t("BuyPremiumDesc")}
          </RyogoCaption>
        </>
      ) : (
        <>
          <TryPremiumAlertButton
            agencyId={agencyDetails.id}
            userId={userDetails.id}
            displayButton={<RyogoBrandButton label={t("TryPremiumCTA")} />}
          />
          <RyogoCaption
            color="light"
            weight="font-bold"
            className="md:max-w-3xs"
          >
            {t("TryPremiumDesc", { days: PREMIUM_TRIAL_DAYS })}
          </RyogoCaption>
        </>
      )}
    </div>
  )
}
