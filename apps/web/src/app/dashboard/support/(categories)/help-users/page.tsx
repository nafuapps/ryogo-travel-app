import SupportQuickActionLinkButton, {
  SupportQuickActionType,
} from "@/components/flows/support/supportQuickActionLink"
import SupportContentHeader, {
  SupportContentSectionWrapper,
} from "@/components/flows/support/supportContentHeader"
import {
  SupportFAQItem,
  SupportFAQItemType,
  SupportFAQWrapper,
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
import { getCurrentUser } from "@/lib/auth"
import { UserRolesEnum, UserStatusEnum } from "@ryogo-travel-app/db/schema"
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
import { pageTitle, pageDescription } from "@/components/page/pageCommons"
import { Metadata } from "next"
import SupportContentCTALinkButton from "@/components/flows/support/supportContentCTALink"
import { RyogoImage } from "@/components/images/ryogoImage"
import {
  SupportTableWrapper,
  SupportTableTextRow,
  SupportTableStatusRow,
} from "@/components/flows/support/supportTableWrapper"
import { UserStatusPill } from "@/components/pills/ryogoPills"
import { SupportWarningWrapper } from "@/components/flows/support/supportWarningWrapper"
import SupportRelatedArticleLinkButton, {
  SupportRelatedArticleType,
} from "@/components/flows/support/supportRelatedArticleType"

/*
  - User overview
  - User roles and permissions
  - User add and manage
  - Bookings
  - User communication
*/

export const metadata: Metadata = {
  title: `Users Help - ${pageTitle}`,
  description: pageDescription,
}

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

  const quickActions: SupportQuickActionType[] = [
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

  const relatedArticles: SupportRelatedArticleType[] = [
    {
      label: t("RelatedArticles.Account"),
      href: "/dashboard/support/help-account",
    },
    {
      label: t("RelatedArticles.Bookings"),
      href: "/dashboard/support/help-bookings",
    },
    {
      label: t("RelatedArticles.Videos"),
      href: "/dashboard/support/help-videos",
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
          <SupportSideAccordionWrapper label={"RelatedArticles"}>
            {relatedArticles.map((item) => (
              <SupportRelatedArticleLinkButton
                key={item.label}
                href={item.href}
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
      <SupportContentSectionWrapper title={t("KnowUser.Title")}>
        <RyogoCaption color="slate">{t("KnowUser.Description")}</RyogoCaption>
        <RyogoCaption color="slate">{t("KnowUser.AllUsers")}</RyogoCaption>
        {/* //TODO: Add all users page snapshot */}
        <RyogoImage
          alt="Users"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
        <SupportContentCTALinkButton
          href={"/dashboard/users"}
          label={t("KnowUser.CTA")}
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("StatusList.Title")}>
        <RyogoCaption color="slate">{t("StatusList.Description")}</RyogoCaption>
        <SupportTableWrapper label={t("StatusList.Caption")}>
          <SupportTableStatusRow desc={t("StatusList.New")}>
            <UserStatusPill status={UserStatusEnum.NEW} />
          </SupportTableStatusRow>
          <SupportTableStatusRow desc={t("StatusList.Active")}>
            <UserStatusPill status={UserStatusEnum.ACTIVE} />
          </SupportTableStatusRow>
          <SupportTableStatusRow desc={t("StatusList.Inactive")}>
            <UserStatusPill status={UserStatusEnum.INACTIVE} />
          </SupportTableStatusRow>
          <SupportTableStatusRow desc={t("StatusList.Suspended")}>
            <UserStatusPill status={UserStatusEnum.SUSPENDED} />
          </SupportTableStatusRow>
        </SupportTableWrapper>
      </SupportContentSectionWrapper>
    </>
  )
}

async function RolesContent() {
  const t = await getTranslations("Dashboard.SupportUsersHelp.Roles")
  return (
    <>
      <SupportContentSectionWrapper title={t("WhatIsRole.Title")}>
        <RyogoCaption color="slate">{t("WhatIsRole.Description")}</RyogoCaption>
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("RoleList.Title")}>
        <RyogoCaption color="slate">{t("RoleList.Description")}</RyogoCaption>
        <SupportTableWrapper label={t("RoleList.Caption")}>
          <SupportTableTextRow
            label={t("RoleList.Owner")}
            desc={t("RoleList.OwnerDesc")}
          />
          <SupportTableTextRow
            label={t("RoleList.Agent")}
            desc={t("RoleList.AgentDesc")}
          />
          <SupportTableTextRow
            label={t("RoleList.Driver")}
            desc={t("RoleList.DriverDesc")}
          />
        </SupportTableWrapper>
      </SupportContentSectionWrapper>
      <SupportWarningWrapper text={t("DriverRole")} />
    </>
  )
}

async function ManagingContent() {
  const t = await getTranslations("Dashboard.SupportUsersHelp.Managing")
  return (
    <>
      <SupportContentSectionWrapper title={t("AddingAgent.Title")}>
        <RyogoCaption color="slate">
          {t("AddingAgent.Description")}
        </RyogoCaption>
        <RyogoCaption color="slate">{t("AddingAgent.Fields")}</RyogoCaption>
        {/* //TODO: Add add agent page snapshot */}
        <RyogoImage
          alt="AddAgent"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
        <SupportContentCTALinkButton
          href={"/dashboard/users/new"}
          label={t("AddingAgent.CTA")}
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("AddingDriver.Title")}>
        <RyogoCaption color="slate">
          {t("AddingDriver.Description")}
        </RyogoCaption>
        {/* //TODO: Add AddingDriver page snapshot */}
        <RyogoImage
          alt="AddingDriver"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
        <SupportContentCTALinkButton
          href={"/dashboard/drivers/new"}
          label={t("AddingDriver.CTA")}
        />
        <RyogoCaption color="slate">{t("AddingDriver.Help")}</RyogoCaption>
        <SupportContentCTALinkButton
          href={"/dashboard/support/help-drivers"}
          label={t("AddingDriver.HelpCTA")}
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("UserInvite.Title")}>
        <RyogoCaption color="slate">{t("UserInvite.Description")}</RyogoCaption>
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("ModifyingUser.Title")}>
        <RyogoCaption color="slate">
          {t("ModifyingUser.Description")}
        </RyogoCaption>
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Activity.Title")}>
        <RyogoCaption color="slate">{t("Activity.Description")}</RyogoCaption>
      </SupportContentSectionWrapper>
    </>
  )
}

async function BookingsContent() {
  const t = await getTranslations("Dashboard.SupportUsersHelp.Bookings")
  return (
    <>
      <SupportContentSectionWrapper title={t("AssignedBookings.Title")}>
        <RyogoCaption color="slate">
          {t("AssignedBookings.Description")}
        </RyogoCaption>
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("CompletedBookings.Title")}>
        <RyogoCaption color="slate">
          {t("CompletedBookings.Description")}
        </RyogoCaption>
      </SupportContentSectionWrapper>
    </>
  )
}

async function CommunicationContent() {
  const t = await getTranslations("Dashboard.SupportUsersHelp.Communication")
  return (
    <SupportContentSectionWrapper title={t("CommunicateUser.Title")}>
      <RyogoCaption color="slate">
        {t("CommunicateUser.Description")}
      </RyogoCaption>
    </SupportContentSectionWrapper>
  )
}
