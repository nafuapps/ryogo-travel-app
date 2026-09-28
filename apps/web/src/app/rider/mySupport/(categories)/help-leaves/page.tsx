import {
  DoubleContentWrapper,
  MainWrapper,
  PageWrapper,
  SectionWrapper,
  SideWrapper,
} from "@/components/page/pageWrappers"
import RiderHeader from "@/components/header/riderHeader"
import { ChevronRight, StickyNotes, Telescope } from "lucide-react"
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
import SupportContentCTALinkButton from "@/components/flows/support/supportContentCTALink"
import {
  SupportTableWrapper,
  SupportTableTextRow,
} from "@/components/flows/support/supportTableWrapper"
import { RyogoImage } from "@/components/images/ryogoImage"
import SupportRelatedArticleLinkButton, {
  SupportRelatedArticleType,
} from "@/components/flows/support/supportRelatedArticleType"

/* //TODO: Leave support page
  - Overview
  - Marking Leave
*/

export const metadata: Metadata = {
  title: `My Leave Help - ${pageTitle}`,
  description: pageDescription,
}

export default async function MySupportHelpLeavePage() {
  const t = await getTranslations("Rider.MySupportLeaveHelp")

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
      icon: StickyNotes,
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
  const t = await getTranslations("Rider.MySupportLeaveHelp.Overview")
  return (
    <>
      <SupportContentSectionWrapper title={t("KnowLeave.Title")}>
        <RyogoCaption color="slate">{t("KnowLeave.Description")}</RyogoCaption>
        <RyogoCaption color="slate">{t("KnowLeave.AllLeaves")}</RyogoCaption>
        {/* //TODO: Add my leaves page snapshot */}
        <RyogoImage
          alt="Leaves"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
        <SupportContentCTALinkButton
          href={"/rider/myLeave"}
          label={t("KnowLeave.CTA")}
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("LeaveDetails.Title")}>
        <RyogoCaption color="slate">
          {t("LeaveDetails.Description")}
        </RyogoCaption>
        {/* //TODO: Add LeaveDetails page snapshot */}
        <RyogoImage
          alt="LeaveDetails"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
        <SupportTableWrapper label={t("LeaveDetails.Caption")}>
          <SupportTableTextRow
            label={t("LeaveDetails.Basic")}
            desc={t("LeaveDetails.BasicDesc")}
          />
          <SupportTableTextRow
            label={t("LeaveDetails.Specific")}
            desc={t("LeaveDetails.SpecificDesc")}
          />
          <SupportTableTextRow
            label={t("LeaveDetails.Documents")}
            desc={t("LeaveDetails.DocumentsDesc")}
          />
          <SupportTableTextRow
            label={t("LeaveDetails.Type")}
            desc={t("LeaveDetails.TypeDesc")}
          />
          <SupportTableTextRow
            label={t("LeaveDetails.Rate")}
            desc={t("LeaveDetails.RateDesc")}
          />
          <SupportTableTextRow
            label={t("LeaveDetails.Rating")}
            desc={t("LeaveDetails.RatingDesc")}
          />
        </SupportTableWrapper>
      </SupportContentSectionWrapper>
    </>
  )
}
async function DocumentsContent() {
  const t = await getTranslations("Rider.MySupportLeaveHelp.Documents")
  return (
    <SupportContentSectionWrapper title={t("WhatIsDocument.Title")}>
      <RyogoCaption color="slate">
        {t("WhatIsDocument.Description")}
      </RyogoCaption>
      <RyogoCaption color="slate">
        {t("WhatIsDocument.ExpiryAlerts")}
      </RyogoCaption>
      {/* //TODO: Add expiry alert snapshot */}
      <RyogoImage
        alt="ExpiryAlert"
        imageSize="xl"
        src="/logoPWA.png"
        className="self-center"
      />
      <SupportContentCTALinkButton
        href={"/rider/myMissions"}
        label={t("WhatIsDocument.CTA")}
      />
    </SupportContentSectionWrapper>
  )
}
