import QuickActionLinkButton, {
  QuickActionType,
} from "@/components/flows/support/quickActionLink"
import SupportContentHeader from "@/components/flows/support/supportContentHeader"
import {
  SupportFAQWrapper,
  SupportFAQItem,
  SupportFAQItemType,
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
import { RyogoCaption, RyogoSmall } from "@/components/typography"
import { Separator } from "@/components/ui/separator"
import {
  Tickets,
  Plus,
  ChevronRight,
  MapPlus,
  CalendarCheck,
  ScanEye,
  IndianRupee,
  BanknoteArrowDown,
  ArrowLeftRight,
  Logs,
  PhoneCall,
  StickyNotes,
  BadgeInfo,
  CalendarX,
  ListTodo,
} from "lucide-react"
import { getTranslations } from "next-intl/server"
/*
  - Overview
  - Creation
  - Price & Commission
  - Confirmation
  - Cancellation
  - Reconciling
  - Assignment
  - Transactions
  - Expenses
  - Trip Logs
  - Communicating with customer and driver
  - Documents (invoice, lead, confirmation, etc)
  - Recommendations & Suggestions
*/

export default async function SupportHelpBookingsPage() {
  const t = await getTranslations("Dashboard.SupportBookingsHelp")

  const contentItems: SupportContentItemType[] = [
    {
      id: "overview",
      title: t("Overview.Title"),
      icon: Tickets,
      content: <OverviewContent />,
    },
    {
      id: "creation",
      title: t("Creation.Title"),
      icon: MapPlus,
      content: <CreationContent />,
    },
    {
      id: "price",
      title: t("Price.Title"),
      icon: IndianRupee,
      content: <PriceContent />,
    },
    {
      id: "confirmation",
      title: t("Confirmation.Title"),
      icon: CalendarCheck,
      content: <ConfirmationContent />,
    },
    {
      id: "cancellation",
      title: t("Cancellation.Title"),
      icon: CalendarX,
      content: <CancellationContent />,
    },
    {
      id: "reconciling",
      title: t("Reconciling.Title"),
      icon: ScanEye,
      content: <ReconcilingContent />,
    },
    {
      id: "assignment",
      title: t("Assignment.Title"),
      icon: ListTodo,
      content: <AssignmentContent />,
    },
    {
      id: "transactions",
      title: t("Transactions.Title"),
      icon: ArrowLeftRight,
      content: <TransactionsContent />,
    },
    {
      id: "expenses",
      title: t("Expenses.Title"),
      icon: BanknoteArrowDown,
      content: <ExpensesContent />,
    },
    {
      id: "trip-logs",
      title: t("TripLogs.Title"),
      icon: Logs,
      content: <TripLogsContent />,
    },
    {
      id: "communication",
      title: t("Communication.Title"),
      icon: PhoneCall,
      content: <CommunicationContent />,
    },
    {
      id: "documents",
      title: t("Documents.Title"),
      icon: StickyNotes,
      content: <DocumentsContent />,
    },
    {
      id: "recommendations",
      title: t("Recommendations.Title"),
      icon: BadgeInfo,
      content: <RecommendationsContent />,
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
      label: t("QuickActions.NewBooking"),
      href: "/dashboard/bookings/new",
      icon: Plus,
    },
    {
      label: t("QuickActions.AllBookings"),
      href: "/dashboard/bookings",
      icon: ChevronRight,
    },
  ]

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/support/help-bookings"} />
      <DoubleContentWrapper sideOnTop>
        <PageWrapper id="SupportHelpBookingsPage" disableScrollInMobile>
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
  const t = await getTranslations("Dashboard.SupportBookingsHelp.Overview")
  return (
    <>
      <RyogoCaption color="slate">{t("Definition")}</RyogoCaption>
      <RyogoCaption color="slate" weight="font-bold">
        {t("Elements")}
      </RyogoCaption>
    </>
  )
}

async function CreationContent() {
  const t = await getTranslations("Dashboard.SupportBookingsHelp.Creation")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
      <RyogoSmall color="slate" weight="font-bold">
        {t("Steps.Title")}
      </RyogoSmall>
      <RyogoCaption color="slate">{t("Lead")}</RyogoCaption>
    </>
  )
}

async function PriceContent() {
  const t = await getTranslations("Dashboard.SupportBookingsHelp.Price")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}

async function ConfirmationContent() {
  const t = await getTranslations("Dashboard.SupportBookingsHelp.Confirmation")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}

async function CancellationContent() {
  const t = await getTranslations("Dashboard.SupportBookingsHelp.Cancellation")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}

async function ReconcilingContent() {
  const t = await getTranslations("Dashboard.SupportBookingsHelp.Reconciling")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}

async function AssignmentContent() {
  const t = await getTranslations("Dashboard.SupportBookingsHelp.Assignment")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}

async function TransactionsContent() {
  const t = await getTranslations("Dashboard.SupportBookingsHelp.Transactions")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}

async function ExpensesContent() {
  const t = await getTranslations("Dashboard.SupportBookingsHelp.Expenses")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}

async function TripLogsContent() {
  const t = await getTranslations("Dashboard.SupportBookingsHelp.TripLogs")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}

async function CommunicationContent() {
  const t = await getTranslations("Dashboard.SupportBookingsHelp.Communication")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
      <RyogoCaption color="slate">{t("Driver")}</RyogoCaption>
      <RyogoCaption color="slate">{t("Customer")}</RyogoCaption>{" "}
    </>
  )
}

async function DocumentsContent() {
  const t = await getTranslations("Dashboard.SupportBookingsHelp.Documents")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}

async function RecommendationsContent() {
  const t = await getTranslations(
    "Dashboard.SupportBookingsHelp.Recommendations",
  )
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}
