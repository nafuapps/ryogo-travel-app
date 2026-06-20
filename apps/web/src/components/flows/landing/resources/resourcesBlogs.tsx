import { RyogoP, RyogoH1 } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"

export default async function ResourcesBlogsSection() {
  const t = await getTranslations("Landing.Resources.Blogs")
  return (
    <LandingSectionWrapper id="blogs" className="bg-white">
      <LandingContentWrapper>
        <RyogoH1 weight="font-bold" className="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="slate" className="max-w-4xl text-center">
          {t("Subtitle")}
        </RyogoP>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
