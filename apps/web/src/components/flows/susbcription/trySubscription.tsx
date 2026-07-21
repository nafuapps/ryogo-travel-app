import TryPremiumAlertButton from "@/components/buttons/alert/tryPremiumAlertButton"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoCaption, RyogoH2, RyogoSmall } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { PREMIUM_TRIAL_DAYS } from "@ryogo-travel-app/api/apiConfig"
import { ArrowRight, ChevronDown, Gift } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Image from "next/image"
import Link from "next/link"

export default async function TrySubscriptionComponent({
  agencyId,
}: {
  agencyId: string
}) {
  const t = await getTranslations("Dashboard.AccountSubscription.Try")
  return (
    <div className="w-full flex flex-col shrink-0 lg:flex-row lg:justify-between lg:items-center gap-3 md:gap-4 lg:gap-5 rounded-lg px-6 md:px-8 py-12 md:py-16 bg-linear-to-b from-sky-900 dark:from-sky-50 to-sky-700 dark:to-sky-200">
      <div className="flex flex-col gap-4 md:gap-5 lg:gap-6 w-full">
        <div className="bg-linear-to-r from-sky-700/30 dark:from-sky-200/30 to-sky-600/30 dark:to-sky-300/30 border border-sky-700 dark:border-sky-200 flex items-center gap-1.5 md:gap-2 rounded-full px-2 py-1 md:px-3 md:py-1.5 lg:px-4 lg:py-2 self-start">
          <RyogoIcon color="white" size="sm" icon={Gift} />
          <RyogoCaption color="white">{t("Tag")}</RyogoCaption>
        </div>
        <RyogoH2 color="white" weight="font-bold">
          {t("Title")}
        </RyogoH2>
        <RyogoSmall color="white">
          {t("Description", { trialDays: PREMIUM_TRIAL_DAYS })}
        </RyogoSmall>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 lg:gap-4">
          <TryPremiumAlertButton
            agencyId={agencyId}
            displayButton={
              <Button variant={"white"} size="lg" className="w-full sm:w-auto">
                <RyogoSmall color="brand">{t("TryCTA")}</RyogoSmall>
                <RyogoIcon icon={ArrowRight} size="sm" color="brand" thick />
              </Button>
            }
          />
          <Link href="#PremiumAdvantageInfo" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full">
              <RyogoSmall color="white">{t("ViewFeatures")}</RyogoSmall>
              <RyogoIcon icon={ChevronDown} size="sm" color="white" thick />
            </Button>
          </Link>
        </div>
      </div>
      {/* //TODO: Try Premium Image */}
      <div className="hidden lg:flex lg:w-2/5 lg:max-w-sm relative aspect-square">
        <Image
          className="object-cover"
          loading="eager"
          src="/logoPWA.png"
          alt=""
          fill
          sizes="384px"
        />
      </div>
    </div>
  )
}
