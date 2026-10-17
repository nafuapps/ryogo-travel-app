import {
  BlogSection,
  BlogHeading,
  BlogParagraph,
  BlogCategories,
  BlogSubTitle,
  BlogImage,
} from "@/components/flows/landing/blogWrappers"
import { getTranslations } from "next-intl/server"

//TODO : Blog content
export default async function Blog3Component({
  isLanding,
}: {
  isLanding?: boolean
}) {
  const t = await getTranslations("Blogs.Blog3")

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
      </BlogSection>
      {isLanding && <></>}
    </>
  )
}
