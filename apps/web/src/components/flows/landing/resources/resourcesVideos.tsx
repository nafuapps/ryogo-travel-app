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
      title: t("KnowRyoGo.Title"),
      desc: t("KnowRyoGo.Description"),
      src: "https://www.youtube.com/embed/1MobY_vR7-g",
    },
    {
      title: t("Onboarding.Title"),
      desc: t("Onboarding.Description"),
      src: "https://www.youtube.com/embed/bMCiAKNUpTY",
    },
    {
      title: t("CreateBooking.Title"),
      desc: t("CreateBooking.Description"),
      src: "https://www.youtube.com/embed/1MobY_vR7-g",
    },
    {
      title: t("ManageBooking.Title"),
      desc: t("ManageBooking.Description"),
      src: "https://www.youtube.com/embed/bMCiAKNUpTY",
    },
    {
      title: t("ManageAccount.Title"),
      desc: t("ManageAccount.Description"),
      src: "https://www.youtube.com/embed/bMCiAKNUpTY",
    },
    {
      title: t("AddDriver.Title"),
      desc: t("AddDriver.Description"),
      src: "https://www.youtube.com/embed/1MobY_vR7-g",
    },
    {
      title: t("DriverApp.Title"),
      desc: t("DriverApp.Description"),
      src: "https://www.youtube.com/embed/bMCiAKNUpTY",
    },
    {
      title: t("AddVehicle.Title"),
      desc: t("AddVehicle.Description"),
      src: "https://www.youtube.com/embed/1MobY_vR7-g",
    },
    {
      title: t("AddAgent.Title"),
      desc: t("AddAgent.Description"),
      src: "https://www.youtube.com/embed/bMCiAKNUpTY",
    },
    {
      title: t("Analytics.Title"),
      desc: t("Analytics.Description"),
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
        <CarouselWrapper count={t("Count", { count: items.length })}>
          {items.map((item, index) => (
            <VideoCarouselItem
              key={index}
              title={item.title}
              desc={item.desc}
              src={item.src}
              index={index + 1}
            />
          ))}
        </CarouselWrapper>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
