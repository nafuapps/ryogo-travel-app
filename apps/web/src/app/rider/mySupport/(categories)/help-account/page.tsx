import {
  DoubleContentWrapper,
  MainWrapper,
  PageWrapper,
  SectionWrapper,
  SideWrapper,
} from "@/components/page/pageWrappers"
import RiderHeader from "@/components/header/riderHeader"
import QuickActionLinkButton, {
  QuickActionType,
} from "@/components/flows/support/quickActionLink"
import SupportContentHeader from "@/components/flows/support/supportContentHeader"
import SupportContentLinkButton from "@/components/flows/support/supportContentLink"
import {
  SupportFAQItemType,
  SupportFAQWrapper,
  SupportFAQItem,
} from "@/components/flows/support/supportFAQWrapper"
import SupportSideAccordionWrapper from "@/components/flows/support/supportSideAccordionWrapper"
import TableContentLinkButton, {
  SupportContentItemType,
} from "@/components/flows/support/tableContentLink"
import { RyogoCaption } from "@/components/typography"
import { SESSION_COOKIE_EXPIRATION_DAYS } from "@ryogo-travel-app/api/apiConfig"
import {
  ReceiptText,
  BrickWallShield,
  Settings,
  Building,
  BadgeCheck,
  Mail,
  KeyRound,
  UserCog,
  ChevronRight,
} from "lucide-react"
import { getTranslations } from "next-intl/server"
import { Separator } from "@/components/ui/separator"
import SupportSectionHeader from "@/components/flows/support/supportSectionHeader"

/*
  - Account Details (Name, Email, Pwd)
  - Account Security (login, logout)
  - Account settings
  - Agency
  - Subscription (in brief)
*/

export default async function MySupportHelpAccountPage() {
  const t = await getTranslations("Rider.MySupportAccountHelp")

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
      content: <SecurityContent />,
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
      content: <AgencyContent />,
    },
    {
      id: "subscription",
      title: t("Subscription.Title"),
      icon: BadgeCheck,
      content: <SubscriptionContent />,
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
      href: `/rider/myProfile/change-email`,
      icon: Mail,
      label: t("QuickActions.ChangeEmail"),
    },
    {
      icon: KeyRound,
      href: `/rider/myProfile/change-password`,
      label: t("QuickActions.ChangePassword"),
    },
    {
      href: `/rider/myProfile/settings`,
      icon: UserCog,
      label: t("QuickActions.ChangeSettings"),
    },
    {
      href: `/rider/myProfile/agency`,
      icon: ChevronRight,
      label: t("QuickActions.ViewAgencyDetails"),
    },
  ]
  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/mySupport/help-account"} />
      <DoubleContentWrapper sideOnTop>
        <PageWrapper id="MySupportHelpAccountPage" disableScrollInMobile>
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
  const t = await getTranslations("Rider.MySupportAccountHelp.Details")
  return (
    <>
      <RyogoCaption color="slate">{t("ViewDetails")}</RyogoCaption>
      {/* //TODO: Add details page snapshot */}
      <SupportContentLinkButton href={"/rider/myProfile"} label={t("CTA")} />
    </>
  )
}

async function SecurityContent() {
  const t = await getTranslations("Rider.MySupportAccountHelp.Security")
  return (
    <>
      <RyogoCaption color="slate">{t("ChangePassword")}</RyogoCaption>
      {/* //TODO: Add change password page snapshot */}
      <RyogoCaption color="slate">{t("ChangePhoneOthers")}</RyogoCaption>
      <RyogoCaption color="slate">
        {t("Session", {
          days: SESSION_COOKIE_EXPIRATION_DAYS,
        })}
      </RyogoCaption>
      <SupportContentLinkButton
        href={"/rider/myProfile/change-password"}
        label={t("CTA")}
      />
    </>
  )
}

async function SettingsContent() {
  const t = await getTranslations("Rider.MySupportAccountHelp.Settings")
  return (
    <>
      <RyogoCaption color="slate">{t("ChangePreferences")}</RyogoCaption>
      {/* //TODO: Add settings page snapshot */}
      <SupportContentLinkButton
        href={"/rider/myProfile/settings"}
        label={t("CTA")}
      />
    </>
  )
}

async function AgencyContent() {
  const t = await getTranslations("Rider.MySupportAccountHelp.Agency")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>

      {/* //TODO: Add agency details page snapshot */}
      <SupportContentLinkButton
        href={"/rider/myProfile/agency"}
        label={t("CTA")}
      />
    </>
  )
}

async function SubscriptionContent() {
  const t = await getTranslations("Rider.MySupportAccountHelp.Subscription")
  return (
    <>
      <RyogoCaption color="slate">{t("Description")}</RyogoCaption>
    </>
  )
}
