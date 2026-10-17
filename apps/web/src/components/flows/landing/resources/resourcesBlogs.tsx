import { RyogoP, RyogoH1 } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"
import {
  BlogCarouselItem,
  BlogCarouselItemType,
} from "@/components/flows/landing/carouselWrapper"
import { RyogoCarouselWrapper } from "@/components/carousel/ryogoCarousel"

export default async function ResourcesBlogsSection() {
  const t = await getTranslations("Landing.Resources.Blogs")

  const b = await getTranslations("Blogs")

  //TODO: Add blog images
  const items: BlogCarouselItemType[] = [
    {
      blogId: b("Blog1.Id"),
      title: b("Blog1.Heading"),
      imageSrc: "/logoPWA.png",
      type: b("Blog1.Category"),
    },
    {
      blogId: b("Blog2.Id"),
      title: b("Blog2.Heading"),
      imageSrc: "/logoPWA.png",
      type: b("Blog2.Category"),
    },
    {
      blogId: b("Blog3.Id"),
      title: b("Blog3.Heading"),
      imageSrc: "/logoPWA.png",
      type: b("Blog3.Category"),
    },
  ]

  return (
    <LandingSectionWrapper id="blogs">
      <LandingContentWrapper>
        <RyogoH1 weight="font-bold" className="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="light" className="max-w-4xl text-center">
          {t("Subtitle")}
        </RyogoP>
        <RyogoCarouselWrapper count={t("Count", { count: items.length })}>
          {items.map((item) => (
            <BlogCarouselItem
              key={item.blogId}
              title={item.title}
              imageSrc={item.imageSrc}
              type={item.type}
              blogId={item.blogId}
            />
          ))}
        </RyogoCarouselWrapper>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
