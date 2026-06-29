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
  //TODO: Add product videos
  const items = [
    {
      title: t("V1.Title"),
      desc: t("V1.Description"),
      src: "https://www.youtube.com/embed/1MobY_vR7-g",
    },
    {
      title: t("V2.Title"),
      desc: t("V2.Description"),
      src: "https://www.youtube.com/embed/1MobY_vR7-g",
    },
    {
      title: t("V3.Title"),
      desc: t("V4.Description"),
      src: "https://www.youtube.com/embed/1MobY_vR7-g",
    },
    {
      title: t("V4.Title"),
      desc: t("V4.Description"),
      src: "https://www.youtube.com/embed/1MobY_vR7-g",
    },
  ]
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
          {items.map((item, index) => (
            <VideoCarouselItem
              key={index}
              title={item.title}
              desc={item.desc}
              src={item.src}
            />
          ))}
        </CarouselWrapper>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
