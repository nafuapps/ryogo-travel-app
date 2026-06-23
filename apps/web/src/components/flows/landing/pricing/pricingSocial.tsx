import {
  RyogoCaption,
  RyogoP,
  RyogoH2,
  RyogoSmall,
} from "@/components/typography"
import { getTranslations } from "next-intl/server"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"

//TODO: Create a section for social proof
export default async function PricingSocialSection() {
  const t = await getTranslations("Landing.Pricing.Social")
  return (
    <LandingSectionWrapper id="social" shrink>
      <LandingContentWrapper>
        <RyogoH2 weight="font-bold" className="max-w-4xl text-center">
          {t("Title")}
        </RyogoH2>
        <div className="flex flex-col gap-1 lg:gap-1.5 items-center max-w-4xl rounded-lg p-6 lg:p-8 bg-slate-50 text-center">
          <RyogoP color="brand" className="italic">
            {t("Testimonial")}
          </RyogoP>
          <RyogoSmall color="slate">{t("Author")}</RyogoSmall>
          <RyogoCaption color="light">{t("Role")}</RyogoCaption>
        </div>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
