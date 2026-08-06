import {
  DoubleContentWrapper,
  MainWrapper,
  PageWrapper,
  SectionWrapper,
  SideWrapper,
} from "@/components/page/pageWrappers"
import RiderHeader from "@/components/header/riderHeader"
import {
  BanknoteArrowDown,
  CalendarCheck,
  ChevronRight,
  Logs,
  PhoneCall,
  Tickets,
  UserRoundArrowLeft,
  Waypoints,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import SupportQuickActionLinkButton, {
  QuickActionType,
} from "@/components/flows/support/supportQuickActionLink"
import SupportContentHeader from "@/components/flows/support/supportContentHeader"
import {
  SupportFAQItemType,
  SupportFAQWrapper,
  SupportFAQItem,
} from "@/components/flows/support/supportFAQWrapper"
import SupportSideAccordionWrapper from "@/components/flows/support/supportSideAccordionWrapper"
import SupportTableOfContentLinkButton, {
  SupportContentItemType,
} from "@/components/flows/support/supportTableOfContentLink"
import { RyogoCaption } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import SupportSectionHeader from "@/components/flows/support/supportSectionHeader"

/*
  - Booking Overview
  - Assignment (How to get booking)
  - Execution of a Booking
  - Completed Bookings
  - Expenses
  - Trip Logs
  - Communication
*/

export default async function MySupportHelpBookingsPage() {
  const t = await getTranslations("Rider.MySupportBookingsHelp")

  const contentItems: SupportContentItemType[] = [
    {
      id: "overview",
      title: t("Overview.Title"),
      icon: Tickets,
      content: <OverviewContent />,
    },
    {
      id: "assignment",
      title: t("Assignment.Title"),
      icon: UserRoundArrowLeft,
      content: <AssignmentContent />,
    },
    {
      id: "execution",
      title: t("Execution.Title"),
      icon: Waypoints,
      content: <ExecutionContent />,
    },
    {
      id: "completed",
      title: t("Completed.Title"),
      icon: CalendarCheck,
      content: <CompletedContent />,
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
      label: t("QuickActions.AllBookings"),
      href: "/rider/myBookings",
      icon: ChevronRight,
    },
  ]
  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/mySupport/help-bookings"} />
      <DoubleContentWrapper sideOnTop>
        <PageWrapper id="MySupportHelpBookingsPage" disableScrollInMobile>
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
  const t = await getTranslations("Rider.MySupportBookingsHelp.Overview")
  return (
    <>
      <RyogoCaption color="slate">{t("Definition")}</RyogoCaption>
      <RyogoCaption color="slate" weight="font-bold">
        {t("Elements")}
      </RyogoCaption>
    </>
  )
}

async function AssignmentContent() {
  const t = await getTranslations("Rider.MySupportBookingsHelp.Assignment")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}
async function ExecutionContent() {
  const t = await getTranslations("Rider.MySupportBookingsHelp.Execution")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}
async function CompletedContent() {
  const t = await getTranslations("Rider.MySupportBookingsHelp.Completed")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}
async function ExpensesContent() {
  const t = await getTranslations("Rider.MySupportBookingsHelp.Expenses")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}

async function TripLogsContent() {
  const t = await getTranslations("Rider.MySupportBookingsHelp.TripLogs")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}

async function CommunicationContent() {
  const t = await getTranslations("Rider.MySupportBookingsHelp.Communication")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
      <RyogoCaption color="slate">{t("Driver")}</RyogoCaption>
      <RyogoCaption color="slate">{t("Customer")}</RyogoCaption>{" "}
    </>
  )
}
