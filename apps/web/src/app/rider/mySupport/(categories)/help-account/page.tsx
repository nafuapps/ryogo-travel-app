import {
  DoubleContentWrapper,
  MainWrapper,
  PageWrapper,
  SectionWrapper,
  SideWrapper,
} from "@/components/page/pageWrappers"
import RiderHeader from "@/components/header/riderHeader"
import SupportQuickActionLinkButton, {
  QuickActionType,
} from "@/components/flows/support/supportQuickActionLink"
import SupportContentHeader, {
  SupportContentSectionWrapper,
} from "@/components/flows/support/supportContentHeader"
import SupportContentCTALinkButton from "@/components/flows/support/supportContentCTALink"
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
import { SESSION_COOKIE_EXPIRATION_DAYS } from "@ryogo-travel-app/api/apiConfig"
import {
  ReceiptText,
  BrickWallShield,
  Settings,
  Building,
  Mail,
  KeyRound,
  UserCog,
  ChevronRight,
} from "lucide-react"
import { getTranslations } from "next-intl/server"
import { Separator } from "@/components/ui/separator"
import SupportSectionHeader from "@/components/flows/support/supportSectionHeader"
import { RyogoImage } from "@/components/images/ryogoImage"
import {
  SupportTableWrapper,
  SupportTableStatusRow,
} from "@/components/flows/support/supportTableWrapper"
import { UserStatusPill } from "@/components/pills/ryogoPills"
import { UserStatusEnum } from "@ryogo-travel-app/db/schema"
import { SupportWarningWrapper } from "@/components/flows/support/supportWarningWrapper"

/*
  - Account Overview (Name, Email, Pwd)
  - Account Security (login, logout)
  - Account settings
  - Agency
*/

export default async function MySupportHelpAccountPage() {
  const t = await getTranslations("Rider.MySupportAccountHelp")

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
              <SupportTableOfContentLinkButton
                key={item.id}
                href={`#${item.id}`}
                label={item.title}
                icon={item.icon}
              />
            ))}
          </SupportSideAccordionWrapper>
          <SupportSideAccordionWrapper label={t("QuickActions.Title")}>
            {quickActions.map((item, index) => (
              <SupportQuickActionLinkButton
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

async function OverviewContent() {
  const t = await getTranslations("Rider.MySupportAccountHelp.Overview")
  return (
    <>
      <SupportContentSectionWrapper title={t("ViewDetails.Title")}>
        <RyogoCaption color="slate">
          {t("ViewDetails.Description")}
        </RyogoCaption>
        {/* //TODO: Add rider myProfile page snapshot */}
        <RyogoImage
          alt="View Details"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
        <SupportContentCTALinkButton
          href={"/rider/myProfile"}
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

async function SecurityContent() {
  const t = await getTranslations("Rider.MySupportAccountHelp.Security")
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
          href={"/rider/myProfile/change-password"}
          label={t("ChangePassword.CTA")}
        />
        <RyogoCaption color="slate">
          {t("ChangePassword.ChangePhoneOthers")}
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
  const t = await getTranslations("Rider.MySupportAccountHelp.Settings")
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
        href={"/rider/myProfile/settings"}
        label={t("ChangePreferences.CTA")}
      />
    </SupportContentSectionWrapper>
  )
}

async function AgencyContent() {
  const t = await getTranslations("Rider.MySupportAccountHelp.Agency")
  return (
    <SupportContentSectionWrapper title={t("AgencyDetails.Title")}>
      <RyogoCaption color="slate">
        {t("AgencyDetails.Description")}
      </RyogoCaption>
      {/* //TODO: Add agency details page snapshot */}
      <RyogoImage
        alt="Agency Details"
        imageSize="xl"
        src="/logoPWA.png"
        className="self-center"
      />
      <SupportContentCTALinkButton
        href={"/rider/myProfile/agency"}
        label={t("AgencyDetails.CTA")}
      />
    </SupportContentSectionWrapper>
  )
}
