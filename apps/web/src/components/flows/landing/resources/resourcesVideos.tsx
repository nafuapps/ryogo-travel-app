import { RyogoP, RyogoH1 } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"
import {
  VideoCarouselItem,
  VideoCarouselItemType,
} from "@/components/flows/landing/carouselWrapper"
import { RyogoCarouselWrapper } from "@/components/carousel/ryogoCarousel"

export default async function ResourcesVideosSection() {
  const t = await getTranslations("Landing.Resources.Videos")
  //TODO: Add product videos
  const items: VideoCarouselItemType[] = [
    {
      index: 1,
      title: t("KnowRyoGo.Title"),
      desc: t("KnowRyoGo.Description"),
      src: "https://www.youtube.com/embed/1MobY_vR7-g",
    },
    {
      index: 2,
      title: t("Onboarding.Title"),
      desc: t("Onboarding.Description"),
      src: "https://www.youtube.com/embed/bMCiAKNUpTY",
    },
    {
      index: 3,
      title: t("CreateBooking.Title"),
      desc: t("CreateBooking.Description"),
      src: "https://www.youtube.com/embed/1MobY_vR7-g",
    },
    {
      index: 4,
      title: t("ManageBooking.Title"),
      desc: t("ManageBooking.Description"),
      src: "https://www.youtube.com/embed/bMCiAKNUpTY",
    },
    {
      index: 5,
      title: t("ManageAccount.Title"),
      desc: t("ManageAccount.Description"),
      src: "https://www.youtube.com/embed/bMCiAKNUpTY",
    },
    {
      index: 6,
      title: t("AddDriver.Title"),
      desc: t("AddDriver.Description"),
      src: "https://www.youtube.com/embed/1MobY_vR7-g",
    },
    {
      index: 7,
      title: t("DriverApp.Title"),
      desc: t("DriverApp.Description"),
      src: "https://www.youtube.com/embed/bMCiAKNUpTY",
    },
    {
      index: 8,
      title: t("AddVehicle.Title"),
      desc: t("AddVehicle.Description"),
      src: "https://www.youtube.com/embed/1MobY_vR7-g",
    },
    {
      index: 9,
      title: t("AddAgent.Title"),
      desc: t("AddAgent.Description"),
      src: "https://www.youtube.com/embed/bMCiAKNUpTY",
    },
    {
      index: 10,
      title: t("Analytics.Title"),
      desc: t("Analytics.Description"),
      src: "https://www.youtube.com/embed/1MobY_vR7-g",
    },
  ]
  return (
    <LandingSectionWrapper id="videos" className="bg-white dark:bg-slate-950">
      <LandingContentWrapper>
        <RyogoH1 weight="font-bold" className="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="light" className="max-w-4xl text-center">
          {t("Subtitle")}
        </RyogoP>
        <RyogoCarouselWrapper count={t("Count", { count: items.length })}>
          {items.map((item) => (
            <VideoCarouselItem
              key={item.index}
              title={item.title}
              desc={item.desc}
              src={item.src}
              index={item.index}
            />
          ))}
        </RyogoCarouselWrapper>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
