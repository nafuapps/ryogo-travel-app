import { RyogoP, RyogoH1 } from "@/components/typography"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"
import { FAQItem, FAQWrapper } from "@/components/flows/landing/faqWrapper"
import { getTranslations } from "next-intl/server"

export default async function ResourcesFAQSection() {
  const t = await getTranslations("Landing.Resources.FAQ")
  return (
    <LandingSectionWrapper id="faq" className="bg-white">
      <LandingContentWrapper>
        <RyogoH1 weight="font-bold" className="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="slate" className="max-w-4xl text-center">
          {t("Subtitle")}
        </RyogoP>
        <FAQWrapper>
          <FAQItem
            question={t("Training.Question")}
            answer={t("Training.Answer")}
          />
          <FAQItem
            question={t("FeatureRequest.Question")}
            answer={t("FeatureRequest.Answer")}
          />
          <FAQItem
            question={t("Language.Question")}
            answer={t("Language.Answer")}
          />
          <FAQItem
            question={t("NewFeatures.Question")}
            answer={t("NewFeatures.Answer")}
          />
        </FAQWrapper>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
