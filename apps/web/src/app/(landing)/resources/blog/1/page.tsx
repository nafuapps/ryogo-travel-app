import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import {
  BlogSection,
  BlogHeading,
  BlogParagraph,
  BlogParagraphBold,
  BlogCategories,
  BlogSubTitle,
  BlogImage,
} from "@/components/flows/landing/blogWrappers"
import {
  LandingSectionWrapper,
  LandingContentWrapper,
} from "@/components/flows/landing/landingWrappers"
import { RyogoP } from "@/components/typography"
import { Separator } from "@/components/ui/separator"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

export default async function Blog1Page() {
  const t = await getTranslations("Blogs.Blog1")

  return (
    <LandingSectionWrapper id="blog1">
      <LandingContentWrapper justifyStart className="md:max-w-3xl">
        <BlogSection>
          <BlogCategories labels={[t("Category")]} />
          <BlogHeading label={t("Heading")} />
          <BlogSubTitle date={t("Date")} readTime={t("ReadTime")} />
          <BlogImage src="/logoPWA.png" alt={t("Heading")} />
        </BlogSection>
        <BlogSection>
          <BlogParagraph label={t("Intro.P1")} />
          <BlogParagraph label={t("Intro.P2")} />
          <BlogParagraph label={t("Intro.P3")} />
          <BlogParagraph label={t("Intro.P4")} />
        </BlogSection>
        <BlogSection heading={t("Section1.Title")}>
          <BlogParagraph label={t("Section1.P1")} />
          <BlogParagraph label={t("Section1.P2")} />
          <BlogParagraphBold label={t("Section1.P3")} />
        </BlogSection>
        <BlogSection heading={t("Section2.Title")}>
          <BlogParagraph label={t("Section2.P1")} />
          <BlogParagraph label={t("Section2.P2")} />
          <BlogParagraphBold label={t("Section2.P3")} />
        </BlogSection>
        <BlogSection heading={t("Section3.Title")}>
          <BlogParagraph label={t("Section3.P1")} />
          <BlogParagraph label={t("Section3.P2")} />
          <BlogParagraphBold label={t("Section3.P3")} />
        </BlogSection>
        <BlogSection heading={t("Section4.Title")}>
          <BlogParagraph label={t("Section4.P1")} />
          <BlogParagraph label={t("Section4.P2")} />
          <BlogParagraphBold label={t("Section4.P3")} />
        </BlogSection>
        <BlogSection heading={t("Section5.Title")}>
          <BlogParagraph label={t("Section5.P1")} />
          <BlogParagraph label={t("Section5.P2")} />
          <BlogParagraphBold label={t("Section5.P3")} />
        </BlogSection>
        <BlogSection heading={t("Conclusion.Title")}>
          <BlogParagraph label={t("Conclusion.P1")} />
          <BlogParagraph label={t("Conclusion.P2")} />
          <BlogParagraph label={t("Conclusion.P3")} />
          <BlogParagraph label={t("Conclusion.P4")} />
        </BlogSection>
        <Separator />
        <RyogoP color="slate" className="italic">
          {t("CTA.Title")}
        </RyogoP>
        <Link href="/pricing#roi">
          <RyogoDefaultButton size="lg" label={t("CTA.Label")} />
        </Link>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
