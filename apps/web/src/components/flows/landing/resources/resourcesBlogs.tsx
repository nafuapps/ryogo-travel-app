import { RyogoP, RyogoH1 } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"
import { BlogCarouselItem } from "@/components/flows/landing/carouselWrapper"
import { RyogoCarouselWrapper } from "@/components/carousel/ryogoCarousel"

export default async function ResourcesBlogsSection() {
  const t = await getTranslations("Landing.Resources.Blogs")

  //TODO: Replace with actual blog data
  const items = [
    {
      index: "1",
      title: t("Blog1.Title"),
      imageSrc: "/logoPWA.png",
      type: t("Blog1.Type"),
    },
    {
      index: "2",
      title: t("Blog2.Title"),
      imageSrc: "/logoPWA.png",
      type: t("Blog2.Type"),
    },
  ]

  return (
    <LandingSectionWrapper id="blogs" className="bg-white dark:bg-slate-950">
      <LandingContentWrapper>
        <RyogoH1 weight="font-bold" className="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="light" className="max-w-4xl text-center">
          {t("Subtitle")}
        </RyogoP>
        <RyogoCarouselWrapper count={t("Count", { count: items.length })}>
          {items.map((item, index) => (
            <BlogCarouselItem
              key={index}
              title={item.title}
              imageSrc={item.imageSrc}
              type={item.type}
              blogLink={item.index}
            />
          ))}
        </RyogoCarouselWrapper>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
