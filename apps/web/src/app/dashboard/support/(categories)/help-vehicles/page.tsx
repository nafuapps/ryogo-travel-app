import SupportQuickActionLinkButton, {
  QuickActionType,
} from "@/components/flows/support/supportQuickActionLink"
import SupportContentHeader from "@/components/flows/support/supportContentHeader"
import {
  SupportFAQWrapper,
  SupportFAQItem,
  SupportFAQItemType,
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
  Telescope,
  SquarePen,
  ListTodo,
  Tickets,
  Plus,
  ChevronRight,
  SquarePlus,
  Wrench,
  FileClock,
} from "lucide-react"
import { getTranslations } from "next-intl/server"
import { pageTitle, pageDescription } from "@/components/page/pageCommons"
import { Metadata } from "next"

/*
  - Overview
  - Vehicles add 
  - Vehicle manage
  - Vehicle assignment
  - Bookings
  - Vehicle repairs
  - Documents

*/

export const metadata: Metadata = {
  title: `Vehicles Help - ${pageTitle}`,
  description: pageDescription,
}

export default async function SupportHelpVehiclesPage() {
  const t = await getTranslations("Dashboard.SupportVehiclesHelp")

  const contentItems: SupportContentItemType[] = [
    {
      id: "overview",
      title: t("Overview.Title"),
      icon: Telescope,
      content: <OverviewContent />,
    },
    {
      id: "adding",
      title: t("Adding.Title"),
      icon: SquarePlus,
      content: <AddingContent />,
    },
    {
      id: "editing",
      title: t("Editing.Title"),
      icon: SquarePen,
      content: <EditingContent />,
    },
    {
      id: "assignment",
      title: t("Assignment.Title"),
      icon: ListTodo,
      content: <AssignmentContent />,
    },
    {
      id: "bookings",
      title: t("Bookings.Title"),
      icon: Tickets,
      content: <BookingsContent />,
    },
    {
      id: "repairs",
      title: t("Repairs.Title"),
      icon: Wrench,
      content: <RepairsContent />,
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
      label: t("QuickActions.AddVehicle"),
      href: "/dashboard/vehicles/new",
      icon: Plus,
    },
    {
      label: t("QuickActions.AllVehicles"),
      href: "/dashboard/vehicles",
      icon: ChevronRight,
    },
  ]
  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/support/help-vehicles"} />
      <DoubleContentWrapper sideOnTop>
        <PageWrapper id="SupportHelpVehiclesPage" disableScrollInMobile>
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
              <SupportTableOfContentLinkButton
                key={item.id}
                href={`#${item.id}`}
                label={item.title}
                icon={item.icon}
              />
            ))}
          </SupportSideAccordionWrapper>
          <SupportSideAccordionWrapper label={t("QuickActions.Title")}>
            {quickActions.map((item) => (
              <SupportQuickActionLinkButton
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
  const t = await getTranslations("Dashboard.SupportVehiclesHelp.Overview")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}
async function AddingContent() {
  const t = await getTranslations("Dashboard.SupportVehiclesHelp.Adding")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}
async function EditingContent() {
  const t = await getTranslations("Dashboard.SupportVehiclesHelp.Editing")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}
async function AssignmentContent() {
  const t = await getTranslations("Dashboard.SupportVehiclesHelp.Assignment")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}
async function BookingsContent() {
  const t = await getTranslations("Dashboard.SupportVehiclesHelp.Bookings")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}
async function RepairsContent() {
  const t = await getTranslations("Dashboard.SupportVehiclesHelp.Repairs")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}
async function DocumentsContent() {
  const t = await getTranslations("Dashboard.SupportVehiclesHelp.Documents")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}
