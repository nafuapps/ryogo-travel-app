import { RyogoP, RyogoH1 } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"
import {
  CarouselWrapper,
  VideoCarouselItem,
} from "@/components/flows/landing/carouselWrapper"

export default async function ResourcesVideosSection() {
  const t = await getTranslations("Landing.Resources.Videos")
  return (
    <LandingSectionWrapper id="videos" className="bg-white">
      <LandingContentWrapper>
        <RyogoH1 weight="font-bold" className="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="slate" className="max-w-4xl text-center">
          {t("Subtitle")}
        </RyogoP>
        <CarouselWrapper>
          <VideoCarouselItem title="1" />
          <VideoCarouselItem title="2" />
          <VideoCarouselItem title="3" />
          <VideoCarouselItem title="4" />
        </CarouselWrapper>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
