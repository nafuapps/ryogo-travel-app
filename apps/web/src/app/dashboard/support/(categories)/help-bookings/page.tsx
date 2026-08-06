import SupportQuickActionLinkButton, {
  QuickActionType,
} from "@/components/flows/support/supportQuickActionLink"
import SupportContentHeader, {
  SupportContentSectionWrapper,
} from "@/components/flows/support/supportContentHeader"
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
import {
  SupportTableStatusRow,
  SupportTableTextRow,
  SupportTableWrapper,
} from "@/components/flows/support/supportTableWrapper"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"
import { BookingStatusPill } from "@/components/pills/ryogoPills"
import { RyogoImage } from "@/components/images/ryogoImage"
import SupportContentCTALinkButton from "@/components/flows/support/supportContentCTALink"
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
  const t = await getTranslations("Dashboard.SupportBookingsHelp.Overview")
  return (
    <>
      <SupportContentSectionWrapper title={t("WhatIsBooking.Title")}>
        <RyogoCaption color="slate">
          {t("WhatIsBooking.Description")}
        </RyogoCaption>
        <RyogoImage
          alt="Booking overview"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
        <SupportContentCTALinkButton
          href={"/dashboard/bookings"}
          label={t("WhatIsBooking.CTA")}
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Elements.Title")}>
        <RyogoCaption color="slate">{t("Elements.Description")}</RyogoCaption>
        <SupportTableWrapper label={t("Elements.Caption")}>
          <SupportTableTextRow
            label={t("Elements.Customer")}
            desc={t("Elements.CustomerDesc")}
          />
          <SupportTableTextRow
            label={t("Elements.TripDetails")}
            desc={t("Elements.TripDetailsDesc")}
          />
          <SupportTableTextRow
            label={t("Elements.Assignment")}
            desc={t("Elements.AssignmentDesc")}
          />
          <SupportTableTextRow
            label={t("Elements.Variables")}
            desc={t("Elements.VariablesDesc")}
          />
          <SupportTableTextRow
            label={t("Elements.Price")}
            desc={t("Elements.PriceDesc")}
          />
          <SupportTableTextRow
            label={t("Elements.Expenses")}
            desc={t("Elements.ExpensesDesc")}
          />
          <SupportTableTextRow
            label={t("Elements.Transactions")}
            desc={t("Elements.TransactionsDesc")}
          />
          <SupportTableTextRow
            label={t("Elements.TripLogs")}
            desc={t("Elements.TripLogsDesc")}
          />
        </SupportTableWrapper>
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("StatusList.Title")}>
        <RyogoCaption color="slate">{t("StatusList.Description")}</RyogoCaption>
        <SupportTableWrapper label={t("StatusList.Caption")}>
          <SupportTableStatusRow desc={t("StatusList.Lead")}>
            <BookingStatusPill status={BookingStatusEnum.LEAD} />
          </SupportTableStatusRow>
          <SupportTableStatusRow desc={t("StatusList.Confirmed")}>
            <BookingStatusPill status={BookingStatusEnum.CONFIRMED} />
          </SupportTableStatusRow>
          <SupportTableStatusRow desc={t("StatusList.InProgress")}>
            <BookingStatusPill status={BookingStatusEnum.IN_PROGRESS} />
          </SupportTableStatusRow>
          <SupportTableStatusRow desc={t("StatusList.Completed")}>
            <BookingStatusPill status={BookingStatusEnum.COMPLETED} />
          </SupportTableStatusRow>
          <SupportTableStatusRow desc={t("StatusList.Cancelled")}>
            <BookingStatusPill status={BookingStatusEnum.CANCELLED} />
          </SupportTableStatusRow>
        </SupportTableWrapper>
      </SupportContentSectionWrapper>
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
