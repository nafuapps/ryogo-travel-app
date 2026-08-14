import SupportQuickActionLinkButton, {
  SupportQuickActionType,
} from "@/components/flows/support/supportQuickActionLink"
import SupportContentHeader, {
  SupportContentSectionWrapper,
} from "@/components/flows/support/supportContentHeader"
import SupportContentCTALinkButton from "@/components/flows/support/supportContentCTALink"
import {
  SupportFAQWrapper,
  SupportFAQItem,
  SupportFAQItemType,
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
import { SESSION_COOKIE_EXPIRATION_DAYS } from "@ryogo-travel-app/api/apiConfig"
import {
  AgencyStatusEnum,
  UserRolesEnum,
  UserStatusEnum,
} from "@ryogo-travel-app/db/schema"
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
import {
  SupportTableStatusRow,
  SupportTableTextRow,
  SupportTableWrapper,
} from "@/components/flows/support/supportTableWrapper"
import { AgencyStatusPill, UserStatusPill } from "@/components/pills/ryogoPills"
import { RyogoImage } from "@/components/images/ryogoImage"
import { SupportWarningWrapper } from "@/components/flows/support/supportWarningWrapper"
import { pageTitle, pageDescription } from "@/components/page/pageCommons"
import { Metadata } from "next"
import SupportRelatedArticleLinkButton, {
  SupportRelatedArticleType,
} from "@/components/flows/support/supportRelatedArticleType"

/*
  - Account Overview (Name, Email, Pwd)
  - Account Security (login, logout)
  - Account settings
  - Agency
  - Subscription (in detail for owner)
*/

export const metadata: Metadata = {
  title: `Account Help - ${pageTitle}`,
  description: pageDescription,
}

export default async function SupportHelpAccountPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }
  const isOwner = currentUser.userRole === UserRolesEnum.OWNER

  const t = await getTranslations("Dashboard.SupportAccountHelp")

  const contentItems: SupportContentItemType[] = [
    {
      id: "overview",
      title: t("Overview.Title"),
      icon: ReceiptText,
      content: <OverviewContent />,
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

  const quickActions: SupportQuickActionType[] = [
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

  const relatedArticles: SupportRelatedArticleType[] = [
    {
      label: t("RelatedArticles.Users"),
      href: "/dashboard/support/help-users",
    },
    {
      label: t("RelatedArticles.Videos"),
      href: "/dashboard/support/help-videos",
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
            {quickActions.map((item, index) => (
              <SupportQuickActionLinkButton
                key={index}
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
  const t = await getTranslations("Dashboard.SupportAccountHelp.Overview")
  return (
    <>
      <SupportContentSectionWrapper title={t("ViewDetails.Title")}>
        <RyogoCaption color="slate">
          {t("ViewDetails.Description")}
        </RyogoCaption>
        {/* //TODO: Add details page snapshot */}
        <RyogoImage
          alt="View Details"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
        <SupportContentCTALinkButton
          href={"/dashboard/account"}
          label={t("ViewDetails.CTA")}
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("EditDetails.Title")}>
        <RyogoCaption color="slate">
          {t("EditDetails.Description")}
        </RyogoCaption>
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

async function SecurityContent({ isOwner }: { isOwner: boolean }) {
  const t = await getTranslations("Dashboard.SupportAccountHelp.Security")
  return (
    <>
      <SupportContentSectionWrapper title={t("ChangePassword.Title")}>
        <RyogoCaption color="slate">
          {t("ChangePassword.Description")}
        </RyogoCaption>
        {/* //TODO: Add change password page snapshot */}
        <RyogoImage
          alt="Change Password"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
        <SupportContentCTALinkButton
          href={"/dashboard/account/change-password"}
          label={t("ChangePassword.CTA")}
        />
        <RyogoCaption color="slate">
          {isOwner
            ? t("ChangePassword.ChangePhoneOwner")
            : t("ChangePassword.ChangePhoneOthers")}
        </RyogoCaption>
        <SupportWarningWrapper
          text={t("ChangePassword.PasswordBestPractice")}
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Login.Title")}>
        <RyogoCaption color="slate">{t("Login.Description")}</RyogoCaption>
        <RyogoCaption color="slate">
          {t("Login.Session", {
            days: SESSION_COOKIE_EXPIRATION_DAYS,
          })}
        </RyogoCaption>
        <RyogoCaption color="slate">{t("Login.Logout")}</RyogoCaption>
      </SupportContentSectionWrapper>
    </>
  )
}

async function SettingsContent() {
  const t = await getTranslations("Dashboard.SupportAccountHelp.Settings")
  return (
    <SupportContentSectionWrapper title={t("ChangePreferences.Title")}>
      <RyogoCaption color="slate">
        {t("ChangePreferences.Description")}
      </RyogoCaption>
      {/* //TODO: Add settings page snapshot */}
      <RyogoImage
        alt="Change Preferences"
        imageSize="xl"
        src="/logoPWA.png"
        className="self-center"
      />
      <SupportContentCTALinkButton
        href={"/dashboard/account/settings"}
        label={t("ChangePreferences.CTA")}
      />
    </SupportContentSectionWrapper>
  )
}

async function AgencyContent({ isOwner }: { isOwner: boolean }) {
  const t = await getTranslations("Dashboard.SupportAccountHelp.Agency")
  return (
    <>
      <SupportContentSectionWrapper title={t("AgencyDetails.Title")}>
        <RyogoCaption color="slate">
          {t("AgencyDetails.Description")}
        </RyogoCaption>
        {isOwner && (
          <RyogoCaption color="slate">{t("AgencyDetails.Change")}</RyogoCaption>
        )}
        {/* //TODO: Add agency details page snapshot */}
        <RyogoImage
          alt="Agency Details"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
        <SupportContentCTALinkButton
          href={"/dashboard/account/agency"}
          label={t("AgencyDetails.CTA")}
        />
      </SupportContentSectionWrapper>
      {isOwner && (
        <SupportContentSectionWrapper title={t("StatusList.Title")}>
          <RyogoCaption color="slate">
            {t("StatusList.Description")}
          </RyogoCaption>
          <SupportTableWrapper label={t("StatusList.Caption")}>
            <SupportTableStatusRow desc={t("StatusList.New")}>
              <AgencyStatusPill status={AgencyStatusEnum.NEW} />
            </SupportTableStatusRow>
            <SupportTableStatusRow desc={t("StatusList.Active")}>
              <AgencyStatusPill status={AgencyStatusEnum.ACTIVE} />
            </SupportTableStatusRow>
            <SupportTableStatusRow desc={t("StatusList.Inactive")}>
              <AgencyStatusPill status={AgencyStatusEnum.INACTIVE} />
            </SupportTableStatusRow>
            <SupportTableStatusRow desc={t("StatusList.Suspended")}>
              <AgencyStatusPill status={AgencyStatusEnum.SUSPENDED} />
            </SupportTableStatusRow>
          </SupportTableWrapper>
        </SupportContentSectionWrapper>
      )}
    </>
  )
}

async function SubscriptionContent({ isOwner }: { isOwner: boolean }) {
  const t = await getTranslations("Dashboard.SupportAccountHelp.Subscription")
  return (
    <>
      <SupportContentSectionWrapper title={t("PlanDetails.Title")}>
        <RyogoCaption color="slate">
          {t("PlanDetails.Description")}
        </RyogoCaption>
        {/* //TODO: Add subscription page snapshot */}
        <RyogoImage
          alt="Subscription Details"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
        <SupportContentCTALinkButton
          href={"/dashboard/account/subscription"}
          label={t("PlanDetails.CTA")}
        />
      </SupportContentSectionWrapper>
      {isOwner && (
        <SupportContentSectionWrapper title={t("GettingSubscription.Title")}>
          <RyogoCaption color="slate">
            {t("GettingSubscription.Description")}
          </RyogoCaption>
          <RyogoCaption color="slate">
            {t("GettingSubscription.PlanTerms")}
          </RyogoCaption>
          {/* //TODO: Add subscription buy page snapshot */}
          <RyogoImage
            alt="Subscription Details"
            imageSize="xl"
            src="/logoPWA.png"
            className="self-center"
          />
          <SupportContentCTALinkButton
            href={"/dashboard/account/subscription#getPremium"}
            label={t("GettingSubscription.CTA")}
          />
        </SupportContentSectionWrapper>
      )}
      <SupportContentSectionWrapper title={t("PlanList.Title")}>
        <RyogoCaption color="slate">{t("PlanList.Description")}</RyogoCaption>
        <SupportTableWrapper label={t("PlanList.Caption")}>
          <SupportTableTextRow
            label={t("PlanList.Basic")}
            desc={t("PlanList.BasicDescription")}
          />
          <SupportTableTextRow
            label={t("PlanList.Premium")}
            desc={t("PlanList.PremiumDescription")}
          />
        </SupportTableWrapper>
      </SupportContentSectionWrapper>
    </>
  )
}
