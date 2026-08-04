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
import { getCurrentUser } from "@/lib/auth"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import {
  Telescope,
  SquarePen,
  PhoneCall,
  Plus,
  ChevronRight,
  UserShield,
  Tickets,
} from "lucide-react"
import { getTranslations } from "next-intl/server"
import { redirect, RedirectType } from "next/navigation"

/*
  - User overview
  - User roles and permissions
  - User add and manage
  - Bookings
  - User communication
*/

export default async function SupportHelpUsersPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  // Only owner can access this page
  if (currentUser.userRole !== UserRolesEnum.OWNER) {
    redirect("/dashboard/support", RedirectType.replace)
  }

  const t = await getTranslations("Dashboard.SupportUsersHelp")

  const contentItems: SupportContentItemType[] = [
    {
      id: "overview",
      title: t("Overview.Title"),
      icon: Telescope,
      content: <OverviewContent />,
    },
    {
      id: "roles",
      title: t("Roles.Title"),
      icon: UserShield,
      content: <RolesContent />,
    },
    {
      id: "managing",
      title: t("Managing.Title"),
      icon: SquarePen,
      content: <ManagingContent />,
    },
    {
      id: "bookings",
      title: t("Bookings.Title"),
      icon: Tickets,
      content: <BookingsContent />,
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
      label: t("QuickActions.AddAgent"),
      href: "/dashboard/users/new",
      icon: Plus,
    },
    {
      label: t("QuickActions.AddDriver"),
      href: "/dashboard/drivers/new",
      icon: Plus,
    },
    {
      label: t("QuickActions.AllUsers"),
      href: "/dashboard/users",
      icon: ChevronRight,
    },
  ]

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/support/help-users"} />
      <DoubleContentWrapper sideOnTop>
        <PageWrapper id="SupportHelpUsersPage" disableScrollInMobile>
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
  const t = await getTranslations("Dashboard.SupportUsersHelp.Overview")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}
async function RolesContent() {
  const t = await getTranslations("Dashboard.SupportUsersHelp.Roles")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}
async function ManagingContent() {
  const t = await getTranslations("Dashboard.SupportUsersHelp.Managing")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}
async function BookingsContent() {
  const t = await getTranslations("Dashboard.SupportUsersHelp.Bookings")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}

async function CommunicationContent() {
  const t = await getTranslations("Dashboard.SupportUsersHelp.Communication")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}
