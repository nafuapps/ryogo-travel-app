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
import { RyogoCaption } from "@/components/typography"
import {
  BadgeQuestionMark,
  Telescope,
  LayoutGrid,
  ChevronRight,
} from "lucide-react"
import { getTranslations } from "next-intl/server"

/*
  TODO
  - what and why is ryogo?
  - Driver app overview with guided tutorial
  - various entities, and how they work together
  - 
*/

export default async function MySupportHelpStartedPage() {
  const t = await getTranslations("Rider.MySupportStartedHelp")

  const contentItems: SupportContentItemType[] = [
    {
      id: "about",
      title: t("About.Title"),
      icon: BadgeQuestionMark,
      content: <AboutContent />,
    },
    {
      id: "overview",
      title: t("Overview.Title"),
      icon: Telescope,
      content: <OverviewContent />,
    },
    {
      id: "entities",
      title: t("Entities.Title"),
      icon: LayoutGrid,
      content: <EntitiesContent />,
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
      href: `/rider/myProfile`,
      icon: ChevronRight,
      label: t("QuickActions.ViewAccount"),
    },
  ]
  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/mySupport/help-started"} />
      <DoubleContentWrapper sideOnTop>
        <PageWrapper id="MySupportHelpStartedPage" disableScrollInMobile>
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

async function AboutContent() {
  const t = await getTranslations("Rider.MySupportStartedHelp.About")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}

async function OverviewContent() {
  const t = await getTranslations("Rider.MySupportStartedHelp.Overview")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}

async function EntitiesContent() {
  const t = await getTranslations("Rider.MySupportStartedHelp.Entities")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}
