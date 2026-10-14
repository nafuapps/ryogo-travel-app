import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { SectionRowWrapper } from "@/components/page/pageWrappers"
import { RyogoCaption, RyogoP, RyogoSmall } from "@/components/typography"
import {
  Infinity as InfinityIcon,
  ChartSpline,
  LucideIcon,
  Zap,
  Expand,
  Sparkle,
  Brush,
  Timeline,
} from "lucide-react"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { getTranslations } from "next-intl/server"

export default async function PremiumAdvantageSection() {
  const t = await getTranslations("Dashboard.AccountSubscription")

  return (
    <div
      id="PremiumAdvantageInfo"
      className="w-full shrink-0 shadow rounded-lg overflow-hidden bg-white dark:bg-slate-800 relative flex flex-col gap-4 md:gap-6 items-center px-6 md:px-8 py-12 md:py-16"
    >
      <div className="bg-linear-to-b from-sky-900 dark:from-sky-100 to-sky-700 dark:to-sky-300 rounded-full size-20 md:size-28 lg:size-32 absolute -left-10 -top-10 md:-left-14 md:-top-14 lg:-left-16 lg:-top-16"></div>
      <div className="bg-linear-to-b from-sky-900 dark:from-sky-100 to-sky-700 dark:to-sky-300 rounded-full size-20 md:size-28 lg:size-32 absolute -right-10 -top-10 md:-right-14 md:-top-14 lg:-right-16 lg:-top-16"></div>
      <div className="bg-linear-to-b from-sky-700 dark:from-sky-300 to-sky-500 dark:to-sky-500 rounded-full size-20 md:size-28 lg:size-32 absolute -left-10 -bottom-10 md:-left-14 md:-bottom-14 lg:-left-16 lg:-bottom-16"></div>
      <div className="bg-linear-to-b from-sky-700 dark:from-sky-300 to-sky-500 dark:to-sky-500 rounded-full size-20 md:size-28 lg:size-32 absolute -right-10 -bottom-10 md:-right-14 md:-bottom-14 lg:-right-16 lg:-bottom-16"></div>
      <SectionRowWrapper className="items-center">
        <RyogoIcon color="brand" size="sm" icon={Sparkle} thick />
        <RyogoP
          color="brand"
          weight="font-bold"
          className="text-center text-nowrap"
        >
          {t("PremiumAdvantage")}
        </RyogoP>
        <RyogoIcon color="brand" size="sm" icon={Sparkle} thick />
      </SectionRowWrapper>
      <RyogoSmall color="light" className="text-center">
        {t("PremiumSubtitle")}
      </RyogoSmall>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 w-full">
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
    <div className="flex flex-col gap-2 lg:gap-3 p-2 lg:p-3 rounded-lg w-full">
      <SectionRowWrapper className="items-center justify-start">
        <RyogoEnclosedIcon
          icon={icon}
          color="brand"
          bgColor="brand"
          size="sm"
          thick
        />
        <RyogoP color="brand" weight="font-medium">
          {title}
        </RyogoP>
      </SectionRowWrapper>
      <RyogoCaption color="slate">{subtitle}</RyogoCaption>
    </div>
  )
}
