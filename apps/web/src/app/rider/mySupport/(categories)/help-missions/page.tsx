import {
  DoubleContentWrapper,
  MainWrapper,
  PageWrapper,
  SectionWrapper,
  SideWrapper,
} from "@/components/page/pageWrappers"
import RiderHeader from "@/components/header/riderHeader"
import { Separator } from "@/components/ui/separator"
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
import {
  Telescope,
  SquarePen,
  BellPlus,
  Plus,
  ChevronRight,
} from "lucide-react"
import { getTranslations } from "next-intl/server"
import { RyogoCaption } from "@/components/typography"

/*
  - Overview What is mission?
  - How to get and know alerts?
  - Custom mission
  - 
*/

export default async function MySupportHelpMissionsPage() {
  const t = await getTranslations("Rider.MySupportMissionsHelp")

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
      href: `/rider/myMissions/add`,
      icon: Plus,
      label: t("QuickActions.CreateCustomMission"),
    },
    {
      href: `/rider/myMissions`,
      icon: ChevronRight,
      label: t("QuickActions.ViewMissions"),
    },
  ]
  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/mySupport/help-missions"} />
      <DoubleContentWrapper sideOnTop>
        <PageWrapper id="MySupportHelpMissionsPage" disableScrollInMobile>
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
  const t = await getTranslations("Rider.MySupportMissionsHelp.Overview")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}
async function ManagingContent() {
  const t = await getTranslations("Rider.MySupportMissionsHelp.Overview")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}
async function CustomContent() {
  const t = await getTranslations("Rider.MySupportMissionsHelp.Custom")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}
