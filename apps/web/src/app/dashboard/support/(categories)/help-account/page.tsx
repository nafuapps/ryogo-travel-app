import QuickActionLinkButton, {
  QuickActionType,
} from "@/components/flows/support/quickActionLink"
import SupportContentHeader from "@/components/flows/support/supportContentHeader"
import SupportContentLinkButton from "@/components/flows/support/supportContentLinkButton"
import {
  SupportFAQWrapper,
  SupportFAQItem,
  SupportFAQItemType,
} from "@/components/flows/support/supportFAQWrapper"
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
import { SESSION_COOKIE_EXPIRATION_DAYS } from "@ryogo-travel-app/api/apiConfig"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import {
  BadgeCheck,
  BrickWallShield,
  Building,
  ChevronRight,
  KeyRound,
  Mail,
  ReceiptText,
  Settings,
  UserCog,
} from "lucide-react"
import { getTranslations } from "next-intl/server"
import { redirect, RedirectType } from "next/navigation"
import SupportSectionHeader from "@/components/flows/support/supportSectionHeader"

/*
  - Account Details (Name, Email, Pwd)
  - Account Security (login, logout)
  - Account settings
  - Agency
  - Subscription (in detail for owner)
*/

export default async function SupportHelpAccountPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }
  const isOwner = currentUser.userRole === UserRolesEnum.OWNER

  const t = await getTranslations("Dashboard.SupportAccountHelp")

  const contentItems: SupportContentItemType[] = [
    {
      id: "details",
      title: t("Details.Title"),
      icon: ReceiptText,
      content: <DetailsContent />,
    },
    {
      id: "security",
      title: t("Security.Title"),
      icon: BrickWallShield,
      content: <SecurityContent isOwner={isOwner} />,
    },
    {
      id: "settings",
      title: t("Settings.Title"),
      icon: Settings,
      content: <SettingsContent />,
    },
    {
      id: "agency",
      title: t("Agency.Title"),
      icon: Building,
      content: <AgencyContent isOwner={isOwner} />,
    },
    {
      id: "subscription",
      title: t("Subscription.Title"),
      icon: BadgeCheck,
      content: <SubscriptionContent isOwner={isOwner} />,
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
      href: `/dashboard/account/change-email`,
      icon: Mail,
      label: t("QuickActions.ChangeEmail"),
    },
    {
      icon: KeyRound,
      href: `/dashboard/account/change-password`,
      label: t("QuickActions.ChangePassword"),
    },
    {
      href: `/dashboard/account/settings`,
      icon: UserCog,
      label: t("QuickActions.ChangeSettings"),
    },
    {
      href: `/dashboard/account/agency`,
      icon: ChevronRight,
      label: t("QuickActions.ViewAgencyDetails"),
    },
    {
      href: `/dashboard/account/subscription`,
      icon: ChevronRight,
      label: t("QuickActions.ViewSubscription"),
    },
  ]

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/support/help-account"} />
      <DoubleContentWrapper sideOnTop>
        <PageWrapper id="SupportHelpAccountPage" disableScrollInMobile>
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

async function DetailsContent() {
  const t = await getTranslations("Dashboard.SupportAccountHelp.Details")
  return (
    <>
      <RyogoCaption color="slate">{t("ViewDetails")}</RyogoCaption>
      {/* //TODO: Add details page snapshot */}
      <SupportContentLinkButton href={"/dashboard/account"} label={t("CTA")} />
    </>
  )
}

async function SecurityContent({ isOwner }: { isOwner: boolean }) {
  const t = await getTranslations("Dashboard.SupportAccountHelp.Security")
  return (
    <>
      <RyogoCaption color="slate">{t("ChangePassword")}</RyogoCaption>
      {/* //TODO: Add change password page snapshot */}
      <RyogoCaption color="slate">
        {isOwner ? t("ChangePhoneOwner") : t("ChangePhoneOthers")}
      </RyogoCaption>
      <RyogoCaption color="slate">
        {t("Session", {
          days: SESSION_COOKIE_EXPIRATION_DAYS,
        })}
      </RyogoCaption>
      <SupportContentLinkButton
        href={"/dashboard/account/change-password"}
        label={t("CTA")}
      />
    </>
  )
}

async function SettingsContent() {
  const t = await getTranslations("Dashboard.SupportAccountHelp.Settings")
  return (
    <>
      <RyogoCaption color="slate">{t("ChangePreferences")}</RyogoCaption>
      {/* //TODO: Add settings page snapshot */}
      <SupportContentLinkButton
        href={"/dashboard/account/settings"}
        label={t("CTA")}
      />
    </>
  )
}

async function AgencyContent({ isOwner }: { isOwner: boolean }) {
  const t = await getTranslations("Dashboard.SupportAccountHelp.Agency")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
      {isOwner && <RyogoCaption color="slate">{t("Change")}</RyogoCaption>}
      {/* //TODO: Add agency details page snapshot */}
      <SupportContentLinkButton
        href={"/dashboard/account/agency"}
        label={t("CTA")}
      />
    </>
  )
}

async function SubscriptionContent({ isOwner }: { isOwner: boolean }) {
  const t = await getTranslations("Dashboard.SupportAccountHelp.Subscription")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
      {isOwner && <RyogoCaption color="slate">{t("Buy")}</RyogoCaption>}
      {/* //TODO: Add subscription page snapshot */}
      <SupportContentLinkButton
        href={"/dashboard/account/subscription"}
        label={t("CTA")}
      />
    </>
  )
}
