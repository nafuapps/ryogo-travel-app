import {
  DoubleContentWrapper,
  MainWrapper,
  PageWrapper,
  SectionWrapper,
  SideWrapper,
} from "@/components/page/pageWrappers"
import RiderHeader from "@/components/header/riderHeader"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronRight, FileClock, ListTodo, Telescope } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import SupportSectionHeader from "@/components/flows/support/supportSectionHeader"
import QuickActionLinkButton, {
  QuickActionType,
} from "@/components/flows/support/quickActionLink"
import SupportContentHeader from "@/components/flows/support/supportContentHeader"
import {
  SupportFAQItemType,
  SupportFAQWrapper,
  SupportFAQItem,
} from "@/components/flows/support/supportFAQWrapper"
import SupportSideAccordionWrapper from "@/components/flows/support/supportSideAccordionWrapper"
import TableContentLinkButton, {
  SupportContentItemType,
} from "@/components/flows/support/tableContentLink"
import { getTranslations } from "next-intl/server"
import { RyogoCaption } from "@/components/typography"

/*
  TODO
  - Overview
  - Vehicle assignment
  - Documentation

*/

export default async function MySupportHelpVehiclePage() {
  const t = await getTranslations("Rider.MySupportVehicleHelp")

  const contentItems: SupportContentItemType[] = [
    {
      id: "overview",
      title: t("Overview.Title"),
      icon: Telescope,
      content: <OverviewContent />,
    },

    {
      id: "assignment",
      title: t("Assignment.Title"),
      icon: ListTodo,
      content: <AssignmentContent />,
    },

    {
      id: "documents",
      title: t("Documents.Title"),
      icon: FileClock,
      content: <DocumentsContent />,
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
      label: t("QuickActions.ViewVehicle"),
      href: "/rider/myVehicle",
      icon: ChevronRight,
    },
  ]
  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/mySupport/help-vehicle"} />
      <DoubleContentWrapper sideOnTop>
        <PageWrapper id="MySupportHelpVehiclesPage" disableScrollInMobile>
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
            {faqItems.map((item, index) => (
              <SupportFAQItem
                key={index}
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
            {quickActions.map((item) => (
              <QuickActionLinkButton
                key={item.label}
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
  const t = await getTranslations("Rider.MySupportVehicleHelp.Overview")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}
async function AssignmentContent() {
  const t = await getTranslations("Rider.MySupportVehicleHelp.Assignment")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}
async function DocumentsContent() {
  const t = await getTranslations("Rider.MySupportVehicleHelp.Documents")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}
