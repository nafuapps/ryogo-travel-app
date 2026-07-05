import { RyogoP, RyogoH1 } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"
import {
  BlogCarouselItem,
  CarouselWrapper,
} from "@/components/flows/landing/carouselWrapper"

export default async function ResourcesBlogsSection() {
  const t = await getTranslations("Landing.Resources.Blogs")
  const items = [
    {
      title: t("Blog1.Title"),
      imageSrc: "/logoPWA.png",
      type: t("Blog1.Type"),
      blogLink: "1",
    },
    {
      title: t("Blog2.Title"),
      imageSrc: "/logoPWA.png",
      type: t("Blog2.Type"),
      blogLink: "2",
    },
  ]

  return (
    <LandingSectionWrapper id="blogs" className="bg-white">
      <LandingContentWrapper>
        <RyogoH1 weight="font-bold" className="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="slate" className="max-w-4xl text-center">
          {t("Subtitle")}
        </RyogoP>
        <CarouselWrapper count={t("Count", { count: items.length })}>
          {items.map((item, index) => (
            <BlogCarouselItem
              key={index}
              title={item.title}
              imageSrc={item.imageSrc}
              type={item.type}
              blogLink={item.blogLink}
            />
          ))}
        </CarouselWrapper>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
