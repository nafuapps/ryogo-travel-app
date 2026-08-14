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
import SupportSectionHeader from "@/components/flows/support/supportSectionHeader"
import SupportSideAccordionWrapper from "@/components/flows/support/supportSideAccordionWrapper"
import SupportTableOfContentLinkButton, {
  SupportContentItemType,
} from "@/components/flows/support/supportTableOfContentLink"
import DashboardHeader from "@/components/header/dashboardHeader"
import {
  DoubleContentWrapper,
  MainWrapper,
  PageWrapper,
  SectionWrapper,
  SideWrapper,
} from "@/components/page/pageWrappers"
import { RyogoCaption } from "@/components/typography"
import { Separator } from "@/components/ui/separator"
import {
  BellPlus,
  ChevronRight,
  Megaphone,
  Plus,
  SquarePen,
  Telescope,
} from "lucide-react"
import { getTranslations } from "next-intl/server"
import { pageTitle, pageDescription } from "@/components/page/pageCommons"
import { Metadata } from "next"
import { RyogoImage } from "@/components/images/ryogoImage"
import {
  SupportTableWrapper,
  SupportTableTextRow,
} from "@/components/flows/support/supportTableWrapper"
import SupportContentCTALinkButton from "@/components/flows/support/supportContentCTALink"
import SupportRelatedArticleLinkButton, {
  SupportRelatedArticleType,
} from "@/components/flows/support/supportRelatedArticleType"

/*
  - Overview (What is mission?)
  - How to get and know alerts?
  - Custom mission
  - Notification feed
  - 
*/

export const metadata: Metadata = {
  title: `Missions Help - ${pageTitle}`,
  description: pageDescription,
}

export default async function SupportHelpMissionsPage() {
  const t = await getTranslations("Dashboard.SupportMissionsHelp")

  const contentItems: SupportContentItemType[] = [
    {
      id: "overview",
      title: t("Overview.Title"),
      icon: Telescope,
      content: <OverviewContent />,
    },
    {
      id: "managing",
      title: t("Managing.Title"),
      icon: SquarePen,
      content: <ManagingContent />,
    },
    {
      id: "custom",
      title: t("Custom.Title"),
      icon: BellPlus,
      content: <CustomContent />,
    },
    {
      id: "feed",
      title: t("Feed.Title"),
      icon: Megaphone,
      content: <FeedContent />,
    },
  ]

  const faqItems: SupportFAQItemType[] = [
    {
      question: t("FAQs.Q1.Question"),
      answer: t("FAQs.Q1.Answer"),
    },
    {
      question: t("FAQs.Q2.Question"),
      answer: t("FAQs.Q2.Answer"),
    },
    {
      question: t("FAQs.Q3.Question"),
      answer: t("FAQs.Q3.Answer"),
    },
  ]

  const quickActions: SupportQuickActionType[] = [
    {
      href: `/dashboard/mission-control/add`,
      icon: Plus,
      label: t("QuickActions.CreateCustomMission"),
    },
    {
      href: `/dashboard/mission-control`,
      icon: ChevronRight,
      label: t("QuickActions.ViewMissions"),
    },
    {
      href: `/dashboard/feed`,
      icon: ChevronRight,
      label: t("QuickActions.ViewFeed"),
    },
  ]

  const relatedArticles: SupportRelatedArticleType[] = [
    {
      label: t("RelatedArticles.Account"),
      href: "/dashboard/support/help-account",
    },
    {
      label: t("RelatedArticles.Bookings"),
      href: "/dashboard/support/help-bookings",
    },
    {
      label: t("RelatedArticles.Videos"),
      href: "/dashboard/support/help-videos",
    },
  ]

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/support/help-missions"} />
      <DoubleContentWrapper sideOnTop>
        <PageWrapper id="SupportHelpMissionsPage" disableScrollInMobile>
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
            {quickActions.map((item, index) => (
              <SupportQuickActionLinkButton
                key={index}
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
  const t = await getTranslations("Dashboard.SupportMissionsHelp.Overview")
  return (
    <>
      <SupportContentSectionWrapper title={t("WhatAreMissions.Title")}>
        <RyogoCaption color="slate">
          {t("WhatAreMissions.Description")}
        </RyogoCaption>
        <RyogoCaption color="slate">
          {t("WhatAreMissions.AllMissions")}
        </RyogoCaption>
        {/* //TODO: Add MissionControl snapshot */}
        <RyogoImage
          alt="MissionControl"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
        <SupportContentCTALinkButton
          href={"/dashboard/mission-control"}
          label={t("WhatAreMissions.CTA")}
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Elements.Title")}>
        <RyogoCaption color="slate">{t("Elements.Description")}</RyogoCaption>
        <SupportTableWrapper label={t("Elements.Caption")}>
          <SupportTableTextRow
            label={t("Elements.Entity")}
            desc={t("Elements.EntityDesc")}
          />
          <SupportTableTextRow
            label={t("Elements.Message")}
            desc={t("Elements.MessageDesc")}
          />
          <SupportTableTextRow
            label={t("Elements.Actions")}
            desc={t("Elements.ActionsDesc")}
          />
          <SupportTableTextRow
            label={t("Elements.DueDate")}
            desc={t("Elements.DueDateDesc")}
          />
          <SupportTableTextRow
            label={t("Elements.Status")}
            desc={t("Elements.StatusDesc")}
          />
        </SupportTableWrapper>
      </SupportContentSectionWrapper>
    </>
  )
}
async function ManagingContent() {
  const t = await getTranslations("Dashboard.SupportMissionsHelp.Managing")
  return (
    <>
      <SupportContentSectionWrapper title={t("ReadingMission.Title")}>
        <RyogoCaption color="slate">
          {t("ReadingMission.Description")}
        </RyogoCaption>
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("ActingMission.Title")}>
        <RyogoCaption color="slate">
          {t("ActingMission.Description")}
        </RyogoCaption>
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("ExpiryAlerts.Title")}>
        <RyogoCaption color="slate">
          {t("ExpiryAlerts.Description")}
        </RyogoCaption>
        <RyogoCaption color="slate">{t("ExpiryAlerts.Items")}</RyogoCaption>
      </SupportContentSectionWrapper>
    </>
  )
}
async function CustomContent() {
  const t = await getTranslations("Dashboard.SupportMissionsHelp.Custom")
  return (
    <>
      <SupportContentSectionWrapper title={t("WhatIsCustomMission.Title")}>
        <RyogoCaption color="slate">
          {t("WhatIsCustomMission.Description")}
        </RyogoCaption>
        <RyogoCaption color="slate">
          {t("WhatIsCustomMission.ViewCustomMissions")}
        </RyogoCaption>
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("CreatingCustom.Title")}>
        <RyogoCaption color="slate">
          {t("CreatingCustom.Description")}
        </RyogoCaption>
        <RyogoCaption color="slate">{t("CreatingCustom.Fields")}</RyogoCaption>
        {/* //TODO: Add CreatingCustom snapshot */}
        <RyogoImage
          alt="CreatingCustom"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
        <SupportContentCTALinkButton
          href={"/dashboard/mission-control/add"}
          label={t("CreatingCustom.CTA")}
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("ModifyingCustom.Title")}>
        <RyogoCaption color="slate">
          {t("ModifyingCustom.Description")}
        </RyogoCaption>
        <RyogoCaption color="slate">{t("ModifyingCustom.Fields")}</RyogoCaption>
        {/* //TODO: Add ModifyingCustom snapshot */}
        <RyogoImage
          alt="ModifyingCustom"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
      </SupportContentSectionWrapper>
    </>
  )
}
async function FeedContent() {
  const t = await getTranslations("Dashboard.SupportMissionsHelp.Feed")
  return (
    <>
      <SupportContentSectionWrapper title={t("WhatIsFeed.Title")}>
        <RyogoCaption color="slate">{t("WhatIsFeed.Description")}</RyogoCaption>
        <RyogoCaption color="slate">{t("WhatIsFeed.ViewFeed")}</RyogoCaption>
        <RyogoCaption color="slate">{t("WhatIsFeed.FilterFeed")}</RyogoCaption>
        <RyogoCaption color="slate">{t("WhatIsFeed.Link")}</RyogoCaption>
        {/* //TODO: Add Feed snapshot */}
        <RyogoImage
          alt="Feed"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
        <SupportContentCTALinkButton
          href={"/dashboard/feed"}
          label={t("WhatIsFeed.CTA")}
        />
      </SupportContentSectionWrapper>
    </>
  )
}
