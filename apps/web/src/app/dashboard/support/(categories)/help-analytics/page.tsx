import SupportQuickActionLinkButton, {
  SupportQuickActionType,
} from "@/components/flows/support/supportQuickActionLink"
import SupportContentHeader from "@/components/flows/support/supportContentHeader"
import {
  SupportFAQItem,
  SupportFAQItemType,
  SupportFAQWrapper,
} from "@/components/flows/support/supportFAQWrapper"
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
import { getCurrentUser } from "@/lib/auth"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import {
  Car,
  ChevronRight,
  IdCard,
  IndianRupee,
  LineChart,
  Tickets,
  TrendingUpDown,
} from "lucide-react"
import { getTranslations } from "next-intl/server"
import { redirect, RedirectType } from "next/navigation"
import SupportSectionHeader from "@/components/flows/support/supportSectionHeader"
import { pageTitle, pageDescription } from "@/components/page/pageCommons"
import { Metadata } from "next"

/*
  TODO
  - Bookings
  - Vehicles
  - Drivers
  - Revenue
  - Reports
  - Prediction
*/

export const metadata: Metadata = {
  title: `Analytics Help - ${pageTitle}`,
  description: pageDescription,
}

export default async function SupportHelpAnalyticsPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  //Only owners can see analytics help page
  if (currentUser.userRole !== UserRolesEnum.OWNER) {
    redirect("/dashboard/support", RedirectType.replace)
  }

  const t = await getTranslations("Dashboard.SupportAnalyticsHelp")

  const contentItems: SupportContentItemType[] = [
    {
      id: "bookings",
      title: t("Bookings.Title"),
      icon: Tickets,
      content: <BookingsContent />,
    },
    {
      id: "vehicles",
      title: t("Vehicles.Title"),
      icon: Car,
      content: <VehiclesContent />,
    },
    {
      id: "drivers",
      title: t("Drivers.Title"),
      icon: IdCard,
      content: <DriversContent />,
    },
    {
      id: "revenue",
      title: t("Revenue.Title"),
      icon: IndianRupee,
      content: <RevenueContent />,
    },
    {
      id: "reports",
      title: t("Reports.Title"),
      icon: LineChart,
      content: <ReportsContent />,
    },
    {
      id: "predictions",
      title: t("Predictions.Title"),
      icon: TrendingUpDown,
      content: <PredictionsContent />,
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
      label: t("QuickActions.ViewAnalytics"),
      href: "/dashboard/analytics",
      icon: ChevronRight,
    },
  ]

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/support/help-analytics"} />
      <DoubleContentWrapper sideOnTop>
        <PageWrapper id="SupportHelpAnalyticsPage" disableScrollInMobile>
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

async function BookingsContent() {
  const t = await getTranslations("Dashboard.SupportAnalyticsHelp.Bookings")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}
async function VehiclesContent() {
  const t = await getTranslations("Dashboard.SupportAnalyticsHelp.Vehicles")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}
async function DriversContent() {
  const t = await getTranslations("Dashboard.SupportAnalyticsHelp.Drivers")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}
async function RevenueContent() {
  const t = await getTranslations("Dashboard.SupportAnalyticsHelp.Revenue")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}
async function ReportsContent() {
  const t = await getTranslations("Dashboard.SupportAnalyticsHelp.Reports")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}
async function PredictionsContent() {
  const t = await getTranslations("Dashboard.SupportAnalyticsHelp.Predictions")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}
