import QuickActionLinkButton, {
  QuickActionType,
} from "@/components/flows/support/quickActionLink"
import SupportContentHeader from "@/components/flows/support/supportContentHeader"
import {
  SupportFAQItemType,
  SupportFAQWrapper,
  SupportFAQItem,
} from "@/components/flows/support/supportFAQWrapper"
import SupportSectionHeader from "@/components/flows/support/supportSectionHeader"
import SupportSideAccordionWrapper from "@/components/flows/support/supportSideAccordionWrapper"
import TableContentLinkButton, {
  SupportContentItemType,
} from "@/components/flows/support/tableContentLink"
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

/*
  - Overview (What is mission?)
  - How to get and know alerts?
  - Custom mission
  - Notification feed
  - 
*/

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

  const quickActions: QuickActionType[] = [
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
          <SupportSideAccordionWrapper label={t("TableOfContent")}>
            {contentItems.map((item) => (
              <TableContentLinkButton
                key={item.id}
                href={`#${item.id}`}
                label={item.title}
                icon={item.icon}
              />
            ))}
          </SupportSideAccordionWrapper>
          <SupportSideAccordionWrapper label={t("QuickActions.Title")}>
            {quickActions.map((item, index) => (
              <QuickActionLinkButton
                key={index}
                href={item.href}
                icon={item.icon}
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
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}
async function ManagingContent() {
  const t = await getTranslations("Dashboard.SupportMissionsHelp.Overview")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}
async function CustomContent() {
  const t = await getTranslations("Dashboard.SupportMissionsHelp.Custom")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}
async function FeedContent() {
  const t = await getTranslations("Dashboard.SupportMissionsHelp.Feed")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}
