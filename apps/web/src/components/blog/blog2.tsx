import {
  RyogoOutlineButton,
  RyogoDefaultButton,
} from "@/components/buttons/ryogoButtons"
import {
  BlogSection,
  BlogHeading,
  BlogParagraph,
  BlogParagraphBold,
  BlogCategories,
  BlogSubTitle,
  BlogImage,
  BlogLine,
} from "@/components/flows/landing/blogWrappers"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoP } from "@/components/typography"
import { Separator } from "@/components/ui/separator"
import { PREMIUM_TRIAL_DAYS } from "@ryogo-travel-app/api/apiConfig"
import { ChevronRight } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

export default async function Blog2Component({
  isLanding,
}: {
  isLanding?: boolean
}) {
  const t = await getTranslations("Blogs.Blog2")

  return (
    <>
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
      </BlogSection>
      <BlogSection heading={t("Section1.Title")}>
        <BlogParagraphBold label={t("Section1.Subtitle1")} />
        <BlogParagraph label={t("Section1.P1")} />
        <BlogParagraph label={t("Section1.P2")} />
        <BlogParagraphBold label={t("Section1.Subtitle2")} />
        <BlogParagraph label={t("Section1.S1")} />
        <BlogLine label={t("Section1.S2")} />
        <BlogLine label={t("Section1.S3")} />
        <BlogLine label={t("Section1.S4")} />
        <BlogParagraph label={t("Section1.S5")} />
      </BlogSection>
      <BlogSection heading={t("Section2.Title")}>
        <BlogParagraphBold label={t("Section2.Subtitle1")} />
        <BlogParagraph label={t("Section2.P1")} />
        <BlogParagraph label={t("Section2.P2")} />
        <BlogParagraphBold label={t("Section2.Subtitle2")} />
        <BlogParagraph label={t("Section2.S1")} />
        <BlogLine label={t("Section2.S2")} />
        <BlogLine label={t("Section2.S3")} />
        <BlogLine label={t("Section2.S4")} />
      </BlogSection>
      <BlogSection heading={t("Section3.Title")}>
        <BlogParagraphBold label={t("Section3.Subtitle1")} />
        <BlogParagraph label={t("Section3.P1")} />
        <BlogParagraph label={t("Section3.P2")} />
        <BlogParagraphBold label={t("Section3.Subtitle2")} />
        <BlogParagraph label={t("Section3.S1")} />
        <BlogLine label={t("Section3.S2")} />
        <BlogLine label={t("Section3.S3")} />
        <BlogLine label={t("Section3.S4")} />
      </BlogSection>
      <BlogSection heading={t("Section4.Title")}>
        <BlogParagraphBold label={t("Section4.Subtitle1")} />
        <BlogParagraph label={t("Section4.P1")} />
        <BlogParagraph label={t("Section4.P2")} />
        <BlogParagraphBold label={t("Section4.Subtitle2")} />
        <BlogParagraph label={t("Section4.S1")} />
        <BlogLine label={t("Section4.S2")} />
        <BlogLine label={t("Section4.S3")} />
        <BlogLine label={t("Section4.S4")} />
      </BlogSection>
      <BlogSection heading={t("Section5.Title")}>
        <BlogParagraphBold label={t("Section5.Subtitle1")} />
        <BlogParagraph label={t("Section5.P1")} />
        <BlogParagraph label={t("Section5.P2")} />
        <BlogParagraphBold label={t("Section5.Subtitle2")} />
        <BlogParagraph label={t("Section5.S1")} />
        <BlogLine label={t("Section5.S2")} />
        <BlogLine label={t("Section5.S3")} />
        <BlogLine label={t("Section5.S4")} />
      </BlogSection>
      <BlogSection heading={t("Conclusion.Title")}>
        <BlogParagraph label={t("Conclusion.P1")} />
        <BlogParagraph label={t("Conclusion.P2")} />
      </BlogSection>
      {isLanding && (
        <>
          <BlogSection>
            <BlogParagraphBold label={t("Conclusion.Subtitle")} />
            <BlogParagraph
              label={t("Conclusion.P3", { days: PREMIUM_TRIAL_DAYS })}
            />
            <Link href="/onboarding" className="self-center">
              <RyogoOutlineButton label={t("Conclusion.CTA")}>
                <RyogoIcon icon={ChevronRight} size="sm" color="slate" />
              </RyogoOutlineButton>
            </Link>
          </BlogSection>
          <Separator />
          <RyogoP color="slate" className="italic">
            {t("CTA.Title")}
          </RyogoP>
          <Link href="/how-it-works">
            <RyogoDefaultButton size="lg" label={t("CTA.Label")} />
          </Link>
        </>
      )}
    </>
  )
}
