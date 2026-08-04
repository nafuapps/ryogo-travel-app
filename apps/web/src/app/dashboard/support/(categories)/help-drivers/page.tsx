import QuickActionLinkButton, {
  QuickActionType,
} from "@/components/flows/support/quickActionLink"
import SupportContentHeader from "@/components/flows/support/supportContentHeader"
import {
  SupportFAQItem,
  SupportFAQItemType,
  SupportFAQWrapper,
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
  Telescope,
  UserRoundPlus,
  SquarePen,
  Plus,
  ChevronRight,
  Smartphone,
  TreePalm,
  ListTodo,
  Tickets,
} from "lucide-react"
import { getTranslations } from "next-intl/server"

/*
  - Overview
  - Add (with invite)
  - Modify
  - Assignment
  - Bookings
  - Leaves
  - Driver App
*/

export default async function SupportHelpDriversPage() {
  const t = await getTranslations("Dashboard.SupportDriversHelp")

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
      icon: UserRoundPlus,
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
      id: "leaves",
      title: t("Leaves.Title"),
      icon: TreePalm,
      content: <LeavesContent />,
    },
    {
      id: "driver-app",
      title: t("DriverApp.Title"),
      icon: Smartphone,
      content: <DriverAppContent />,
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
      label: t("QuickActions.AddCustomer"),
      href: "/dashboard/customers/new",
      icon: Plus,
    },
    {
      label: t("QuickActions.AllCustomers"),
      href: "/dashboard/customers",
      icon: ChevronRight,
    },
  ]
  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/support/help-drivers"} />
      <DoubleContentWrapper sideOnTop>
        <PageWrapper id="SupportHelpDriversPage" disableScrollInMobile>
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
  const t = await getTranslations("Dashboard.SupportDriversHelp.Overview")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}
async function AddingContent() {
  const t = await getTranslations("Dashboard.SupportDriversHelp.Adding")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}
async function EditingContent() {
  const t = await getTranslations("Dashboard.SupportDriversHelp.Editing")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}
async function AssignmentContent() {
  const t = await getTranslations("Dashboard.SupportDriversHelp.Assignment")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}
async function BookingsContent() {
  const t = await getTranslations("Dashboard.SupportDriversHelp.Bookings")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}
async function LeavesContent() {
  const t = await getTranslations("Dashboard.SupportDriversHelp.Leaves")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}
async function DriverAppContent() {
  const t = await getTranslations("Dashboard.SupportDriversHelp.DriverApp")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}
