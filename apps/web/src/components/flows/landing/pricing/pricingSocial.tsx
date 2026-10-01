import { RyogoH1, RyogoP, RyogoCaption } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"

export default async function PricingSocialSection() {
  const t = await getTranslations("Landing.Pricing.Social")
  return (
    <LandingSectionWrapper id="social" shrink>
      <LandingContentWrapper>
        <RyogoH1 weight="font-bold" className="max-w-4xl text-center">
          {t("Title")}
        </RyogoH1>
        <div className="flex flex-col gap-1 lg:gap-1.5 items-center max-w-4xl rounded-lg p-6 lg:p-8 bg-sky-100 dark:bg-sky-900 text-center">
          <RyogoP color="brand" className="italic">
            {t("Testimonial")}
          </RyogoP>
          <RyogoP color="slate" weight="font-bold">
            {t("Author")}
          </RyogoP>
          <RyogoCaption color="light">{t("Role")}</RyogoCaption>
        </div>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
