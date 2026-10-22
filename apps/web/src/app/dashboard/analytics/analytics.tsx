import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { PageWrapper, SectionWrapper } from "@/components/page/pageWrappers"
import { RyogoP } from "@/components/typography"
import { Construction } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

export default async function AnalyticsPageComponent() {
  const t = await getTranslations("Dashboard.Analytics")

  //TODO: Add Analytics feature
  return (
    <PageWrapper id="AnalyticsPage">
      <SectionWrapper id="ComingSoonSection" className="items-center">
        <RyogoEnclosedIcon
          icon={Construction}
          size="md"
          color="brand"
          bgColor="brand"
        />
        <RyogoP className="text-center">{t("ComingSoon")}</RyogoP>
        <Link href="/dashboard/home">
          <RyogoOutlineButton label={t("Back")} />
        </Link>
      </SectionWrapper>
    </PageWrapper>
  )
}
