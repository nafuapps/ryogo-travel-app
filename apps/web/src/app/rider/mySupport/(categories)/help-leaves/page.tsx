import {
  DoubleContentWrapper,
  MainWrapper,
  PageWrapper,
  SectionWrapper,
  SideWrapper,
} from "@/components/page/pageWrappers"
import RiderHeader from "@/components/header/riderHeader"
import { ChevronRight, TreePalm, Telescope } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import SupportSectionHeader from "@/components/flows/support/supportSectionHeader"
import SupportQuickActionLinkButton, {
  SupportQuickActionType,
} from "@/components/flows/support/supportQuickActionLink"
import SupportContentHeader, {
  SupportContentSectionWrapper,
} from "@/components/flows/support/supportContentHeader"
import {
  SupportFAQItemType,
  SupportFAQWrapper,
  SupportFAQItem,
} from "@/components/flows/support/supportFAQWrapper"
import SupportSideAccordionWrapper from "@/components/flows/support/supportSideAccordionWrapper"
import SupportTableOfContentLinkButton, {
  SupportContentItemType,
} from "@/components/flows/support/supportTableOfContentLink"
import { getTranslations } from "next-intl/server"
import { RyogoCaption } from "@/components/typography"
import { pageTitle, pageDescription } from "@/components/page/pageCommons"
import { Metadata } from "next"
import { RyogoImage } from "@/components/images/ryogoImage"
import SupportRelatedArticleLinkButton, {
  SupportRelatedArticleType,
} from "@/components/flows/support/supportRelatedArticleType"
import { SupportWarningWrapper } from "@/components/flows/support/supportWarningWrapper"
import SupportContentCTALinkButton from "@/components/flows/support/supportContentCTALink"

/*
  - Overview
  - Marking Leave
*/

export const metadata: Metadata = {
  title: `My Leave Help - ${pageTitle}`,
  description: pageDescription,
}

export default async function MySupportHelpLeavePage() {
  const t = await getTranslations("Rider.MySupportLeavesHelp")

  const contentItems: SupportContentItemType[] = [
    {
      id: "overview",
      title: t("Overview.Title"),
      icon: Telescope,
      content: <OverviewContent />,
    },
    {
      id: "marking",
      title: t("Marking.Title"),
      icon: TreePalm,
      content: <MarkingContent />,
    },
  ]

  const faqItems: SupportFAQItemType[] = [
    {
      question: t("FAQs.Creating.Question"),
      answer: t("FAQs.Creating.Answer"),
    },
    {
      question: t("FAQs.GoingOnLeave.Question"),
      answer: t("FAQs.GoingOnLeave.Answer"),
    },
    {
      question: t("FAQs.BackFromLeave.Question"),
      answer: t("FAQs.BackFromLeave.Answer"),
    },
  ]

  const quickActions: SupportQuickActionType[] = [
    {
      label: t("QuickActions.ViewLeaves"),
      href: "/rider/myLeaves",
      icon: ChevronRight,
    },
  ]

  const relatedArticles: SupportRelatedArticleType[] = [
    {
      label: t("RelatedArticles.Account"),
      href: "/rider/mySupport/help-account",
    },
    {
      label: t("RelatedArticles.Videos"),
      href: "/rider/mySupport/help-videos",
    },
  ]

  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/mySupport/help-leaves"} />
      <DoubleContentWrapper sideOnTop>
        <PageWrapper id="MySupportHelpLeavesPage" disableScrollInMobile>
          <SupportSectionHeader
            title={t("Title")}
            description={t("Description")}
          />
          {contentItems.map((item) => (
            <SectionWrapper key={item.id} id={item.id}>
              <SupportContentHeader icon={item.icon} title={item.title} />
              {item.content}
            </SectionWrapper>
          ))}
          <Separator />
          <SupportSectionHeader
            title={t("FAQs.Title")}
            description={t("FAQs.Description")}
          />
          <SupportFAQWrapper>
            {faqItems.map((item) => (
              <SupportFAQItem
                key={item.question}
                question={item.question}
                answer={item.answer}
              />
            ))}
          </SupportFAQWrapper>
        </PageWrapper>
        <SideWrapper>
          <SupportSideAccordionWrapper label={"TableOfContent"}>
            {contentItems.map((item) => (
              <SupportTableOfContentLinkButton
                key={item.id}
                href={`#${item.id}`}
                label={item.title}
                icon={item.icon}
              />
            ))}
          </SupportSideAccordionWrapper>
          <SupportSideAccordionWrapper label={"QuickActions"}>
            {quickActions.map((item) => (
              <SupportQuickActionLinkButton
                key={item.label}
                href={item.href}
                icon={item.icon}
                label={item.label}
              />
            ))}
          </SupportSideAccordionWrapper>
          <SupportSideAccordionWrapper label={"RelatedArticles"}>
            {relatedArticles.map((item) => (
              <SupportRelatedArticleLinkButton
                key={item.label}
                href={item.href}
                label={item.label}
              />
            ))}
          </SupportSideAccordionWrapper>
        </SideWrapper>
      </DoubleContentWrapper>
    </MainWrapper>
  )
}

async function OverviewContent() {
  const t = await getTranslations("Rider.MySupportLeavesHelp.Overview")
  return (
    <>
      <SupportContentSectionWrapper title={t("KnowLeave.Title")}>
        <RyogoCaption color="slate">{t("KnowLeave.Description")}</RyogoCaption>
        <RyogoCaption color="slate">{t("KnowLeave.AllLeaves")}</RyogoCaption>
        {/* //TODO: All leaves page snapshot */}
        <RyogoImage
          alt="Leaves"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
        <SupportContentCTALinkButton
          href={"/rider/myLeaves"}
          label={t("KnowLeave.CTA")}
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("LeaveDetails.Title")}>
        <RyogoCaption color="slate">
          {t("LeaveDetails.Description")}
        </RyogoCaption>
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("LeaveCreation.Title")}>
        <RyogoCaption color="slate">
          {t("LeaveCreation.Description")}
        </RyogoCaption>
      </SupportContentSectionWrapper>
    </>
  )
}
async function MarkingContent() {
  const t = await getTranslations("Rider.MySupportLeavesHelp.Marking")
  return (
    <>
      <SupportContentSectionWrapper title={t("GoingOnLeave.Title")}>
        <RyogoCaption color="slate">
          {t("GoingOnLeave.Description")}
        </RyogoCaption>
        <RyogoCaption color="slate">{t("GoingOnLeave.Process")}</RyogoCaption>
        {/* //TODO: Add start leave snapshot */}
        <RyogoImage
          alt="GoingOnLeave"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
        <SupportWarningWrapper text={t("GoingOnLeave.Warning")} />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("BackFromLeave.Title")}>
        <RyogoCaption color="slate">
          {t("BackFromLeave.Description")}
        </RyogoCaption>
        <RyogoCaption color="slate">{t("BackFromLeave.Process")}</RyogoCaption>
        {/* //TODO: Add end leave snapshot */}
        <RyogoImage
          alt="BackFromLeave"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
        <SupportWarningWrapper text={t("BackFromLeave.Warning")} />
      </SupportContentSectionWrapper>
    </>
  )
}
