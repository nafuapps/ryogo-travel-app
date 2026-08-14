import SupportQuickActionLinkButton, {
  SupportQuickActionType,
} from "@/components/flows/support/supportQuickActionLink"
import SupportContentHeader, {
  SupportContentSectionWrapper,
} from "@/components/flows/support/supportContentHeader"
import {
  SupportFAQItemType,
  SupportFAQWrapper,
  SupportFAQItem,
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
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import {
  BadgeQuestionMark,
  ChevronRight,
  LayoutGrid,
  Play,
  Telescope,
} from "lucide-react"
import { getTranslations } from "next-intl/server"
import { redirect, RedirectType } from "next/navigation"
import { pageTitle, pageDescription } from "@/components/page/pageCommons"
import { Metadata } from "next"
import SupportRelatedArticleLinkButton, {
  SupportRelatedArticleType,
} from "@/components/flows/support/supportRelatedArticleType"
import SupportContentCTALinkButton from "@/components/flows/support/supportContentCTALink"
import { RyogoImage } from "@/components/images/ryogoImage"
import { RyogoVideo } from "@/components/video/ryogoVideo"
import {
  SupportTableWrapper,
  SupportTableTextRow,
} from "@/components/flows/support/supportTableWrapper"

/*
  - What and why is ryogo?
  - App overview with guided tutorial
  - Onboarding guide
  - various entities, and how they work together
  - 
*/

export const metadata: Metadata = {
  title: `Get Started Help - ${pageTitle}`,
  description: pageDescription,
}

export default async function SupportHelpStartedPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }
  const isOwner = currentUser.userRole === UserRolesEnum.OWNER

  const t = await getTranslations("Dashboard.SupportStartedHelp")

  const contentItems: SupportContentItemType[] = [
    {
      id: "about",
      title: t("About.Title"),
      icon: BadgeQuestionMark,
      content: <AboutContent />,
    },
    {
      id: "onboarding",
      title: t("Onboarding.Title"),
      icon: Play,
      content: <OnboardingContent isOwner={isOwner} />,
    },
    {
      id: "overview",
      title: t("Overview.Title"),
      icon: Telescope,
      content: <OverviewContent isOwner={isOwner} />,
    },
    {
      id: "entities",
      title: t("Entities.Title"),
      icon: LayoutGrid,
      content: <EntitiesContent />,
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
      href: `/dashboard/account`,
      icon: ChevronRight,
      label: t("QuickActions.ViewAccount"),
    },
    {
      href: `/dashboard/bookings`,
      icon: ChevronRight,
      label: t("QuickActions.ViewBookings"),
    },
    {
      href: `/dashboard/drivers`,
      icon: ChevronRight,
      label: t("QuickActions.ViewDrivers"),
    },
    {
      href: `/dashboard/vehicles`,
      icon: ChevronRight,
      label: t("QuickActions.ViewVehicles"),
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
      label: t("RelatedArticles.Drivers"),
      href: "/dashboard/support/help-drivers",
    },
    {
      label: t("RelatedArticles.Vehicles"),
      href: "/dashboard/support/help-vehicles",
    },
    {
      label: t("RelatedArticles.Videos"),
      href: "/dashboard/support/help-videos",
    },
  ]

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/support/help-started"} />
      <DoubleContentWrapper sideOnTop>
        <PageWrapper id="SupportHelpStartedPage" disableScrollInMobile>
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

async function AboutContent() {
  const t = await getTranslations("Dashboard.SupportStartedHelp.About")
  return (
    <>
      <SupportContentSectionWrapper title={t("WhatIsRyogo.Title")}>
        <RyogoCaption color="slate">
          {t("WhatIsRyogo.Description")}
        </RyogoCaption>
        <RyogoCaption color="slate">{t("WhatIsRyogo.ValueProp")}</RyogoCaption>
        <RyogoCaption color="slate">{t("WhatIsRyogo.Headline")}</RyogoCaption>
        {/* //TODO: Add what is ryogo video */}
        <RyogoVideo
          src="https://www.youtube.com/embed/1MobY_vR7-g"
          className="w-full aspect-video rounded-lg"
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("WhyNeedRyogo.Title")}>
        <RyogoCaption color="slate">
          {t("WhyNeedRyogo.Description")}
        </RyogoCaption>
        <RyogoCaption color="slate">{t("WhyNeedRyogo.Solution")}</RyogoCaption>
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("WhenUseRyogo.Title")}>
        <RyogoCaption color="slate">
          {t("WhenUseRyogo.Description")}
        </RyogoCaption>
        <RyogoCaption color="slate">{t("WhenUseRyogo.Growing")}</RyogoCaption>
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Features.Title")}>
        <RyogoCaption color="slate">{t("Features.Description")}</RyogoCaption>
        {/* //TODO: Add ryogo features video */}
        <RyogoVideo
          src="https://www.youtube.com/embed/1MobY_vR7-g"
          className="w-full aspect-video rounded-lg"
        />
        <SupportTableWrapper label={t("Features.Caption")}>
          <SupportTableTextRow
            label={t("Features.Feature1")}
            desc={t("Features.Feature1Desc")}
          />
          <SupportTableTextRow
            label={t("Features.Feature2")}
            desc={t("Features.Feature2Desc")}
          />
          <SupportTableTextRow
            label={t("Features.Feature3")}
            desc={t("Features.Feature3Desc")}
          />
          <SupportTableTextRow
            label={t("Features.Feature4")}
            desc={t("Features.Feature4Desc")}
          />
          <SupportTableTextRow
            label={t("Features.Feature5")}
            desc={t("Features.Feature5Desc")}
          />
          <SupportTableTextRow
            label={t("Features.Feature6")}
            desc={t("Features.Feature6Desc")}
          />
          <SupportTableTextRow
            label={t("Features.Feature7")}
            desc={t("Features.Feature7Desc")}
          />
        </SupportTableWrapper>
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Benefits.Title")}>
        <RyogoCaption color="slate">{t("Benefits.Description")}</RyogoCaption>
        <RyogoCaption color="slate">{t("Benefits.Benefit1")}</RyogoCaption>
        <RyogoCaption color="slate">{t("Benefits.Benefit2")}</RyogoCaption>
        <RyogoCaption color="slate">{t("Benefits.Benefit3")}</RyogoCaption>
        <RyogoCaption color="slate">{t("Benefits.Benefit4")}</RyogoCaption>
        <RyogoCaption color="slate">{t("Benefits.Benefit5")}</RyogoCaption>
        <RyogoCaption color="slate">{t("Benefits.Benefit6")}</RyogoCaption>
      </SupportContentSectionWrapper>
    </>
  )
}

async function OnboardingContent({ isOwner }: { isOwner: boolean }) {
  const t = await getTranslations("Dashboard.SupportStartedHelp.Onboarding")
  return (
    <>
      {isOwner && (
        <SupportContentSectionWrapper title={t("Owner.Title")}>
          <RyogoCaption color="slate">{t("Owner.Description")}</RyogoCaption>
        </SupportContentSectionWrapper>
      )}
      <SupportContentSectionWrapper title={t("Agent.Title")}>
        <RyogoCaption color="slate">{t("Agent.Description")}</RyogoCaption>
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Driver.Title")}>
        <RyogoCaption color="slate">{t("Driver.Description")}</RyogoCaption>
      </SupportContentSectionWrapper>
      {/* //TODO: Add dashboard app tutorial video */}
      <RyogoVideo
        src="https://www.youtube.com/embed/1MobY_vR7-g"
        className="w-full aspect-video rounded-lg"
      />
    </>
  )
}

async function OverviewContent({ isOwner }: { isOwner: boolean }) {
  const t = await getTranslations("Dashboard.SupportStartedHelp.Overview")
  return (
    <>
      <SupportContentSectionWrapper title={t("Dashboard.Title")}>
        <RyogoCaption color="slate">{t("Dashboard.Description")}</RyogoCaption>
        {/* //TODO: Add Dashboard snapshot */}
        <RyogoImage
          alt="Dashboard"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Sidebar.Title")}>
        <RyogoCaption color="slate">{t("Sidebar.Description")}</RyogoCaption>
        {/* //TODO: Add Sidebar snapshot */}
        <RyogoImage
          alt="Sidebar"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Header.Title")}>
        <RyogoCaption color="slate">{t("Header.Description")}</RyogoCaption>
        {/* //TODO: Add Header snapshot */}
        <RyogoImage
          alt="Header"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Navigation.Title")}>
        <RyogoCaption color="slate">{t("Navigation.Description")}</RyogoCaption>
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Home.Title")}>
        <RyogoCaption color="slate">{t("Home.Description")}</RyogoCaption>
        {/* //TODO: Add Home snapshot */}
        <RyogoImage
          alt="Home"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
        <SupportContentCTALinkButton
          href={"/dashboard"}
          label={t("Home.CTA")}
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Bookings.Title")}>
        <RyogoCaption color="slate">{t("Bookings.Description")}</RyogoCaption>
        {/* //TODO: Add Bookings snapshot */}
        <RyogoImage
          alt="Bookings"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
        <SupportContentCTALinkButton
          href={"/dashboard/bookings"}
          label={t("Bookings.CTA")}
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Vehicles.Title")}>
        <RyogoCaption color="slate">{t("Vehicles.Description")}</RyogoCaption>
        {/* //TODO: Add Vehicles snapshot */}
        <RyogoImage
          alt="Vehicles"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
        <SupportContentCTALinkButton
          href={"/dashboard/vehicles"}
          label={t("Vehicles.CTA")}
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Drivers.Title")}>
        <RyogoCaption color="slate">{t("Drivers.Description")}</RyogoCaption>
        {/* //TODO: Add Drivers snapshot */}
        <RyogoImage
          alt="Drivers"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
        <SupportContentCTALinkButton
          href={"/dashboard/drivers"}
          label={t("Drivers.CTA")}
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Customers.Title")}>
        <RyogoCaption color="slate">{t("Customers.Description")}</RyogoCaption>
        {/* //TODO: Add Customers snapshot */}
        <RyogoImage
          alt="Customers"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
        <SupportContentCTALinkButton
          href={"/dashboard/customers"}
          label={t("Customers.CTA")}
        />
      </SupportContentSectionWrapper>
      {isOwner && (
        <SupportContentSectionWrapper title={t("Users.Title")}>
          <RyogoCaption color="slate">{t("Users.Description")}</RyogoCaption>
          {/* //TODO: Add Users snapshot */}
          <RyogoImage
            alt="Users"
            imageSize="xl"
            src="/logoPWA.png"
            className="self-center"
          />
          <SupportContentCTALinkButton
            href={"/dashboard/users"}
            label={t("Users.CTA")}
          />
        </SupportContentSectionWrapper>
      )}
      {isOwner && (
        <SupportContentSectionWrapper title={t("Analytics.Title")}>
          <RyogoCaption color="slate">
            {t("Analytics.Description")}
          </RyogoCaption>
          {/* //TODO: Add Analytics snapshot */}
          <RyogoImage
            alt="Analytics"
            imageSize="xl"
            src="/logoPWA.png"
            className="self-center"
          />
          <SupportContentCTALinkButton
            href={"/dashboard/analytics"}
            label={t("Analytics.CTA")}
          />
        </SupportContentSectionWrapper>
      )}
      <SupportContentSectionWrapper title={t("Search.Title")}>
        <RyogoCaption color="slate">{t("Search.Description")}</RyogoCaption>
        {/* //TODO: Add Search snapshot */}
        <RyogoImage
          alt="Search"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
        <SupportContentCTALinkButton
          href={"/dashboard/search"}
          label={t("Search.CTA")}
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Feed.Title")}>
        <RyogoCaption color="slate">{t("Feed.Description")}</RyogoCaption>
        {/* //TODO: Add Feed snapshot */}
        <RyogoImage
          alt="Feed"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
        <SupportContentCTALinkButton
          href={"/dashboard/feed"}
          label={t("Feed.CTA")}
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Support.Title")}>
        <RyogoCaption color="slate">{t("Support.Description")}</RyogoCaption>
        {/* //TODO: Add Support snapshot */}
        <RyogoImage
          alt="Support"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
        <SupportContentCTALinkButton
          href={"/dashboard/support"}
          label={t("Support.CTA")}
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Account.Title")}>
        <RyogoCaption color="slate">{t("Account.Description")}</RyogoCaption>
        {/* //TODO: Add Account snapshot */}
        <RyogoImage
          alt="Account"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
        <SupportContentCTALinkButton
          href={"/dashboard/account"}
          label={t("Account.CTA")}
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Missions.Title")}>
        <RyogoCaption color="slate">{t("Missions.Description")}</RyogoCaption>
        {/* //TODO: Add Missions snapshot */}
        <RyogoImage
          alt="Missions"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
        <SupportContentCTALinkButton
          href={"/dashboard/mission-control"}
          label={t("Missions.CTA")}
        />
      </SupportContentSectionWrapper>
    </>
  )
}

async function EntitiesContent() {
  const t = await getTranslations("Dashboard.SupportStartedHelp.Entities")
  return (
    <>
      <SupportContentSectionWrapper title={t("WhatIsEntity.Title")}>
        <RyogoCaption color="slate">
          {t("WhatIsEntity.Description")}
        </RyogoCaption>
        {/* //TODO: Add entities video */}
        <RyogoVideo
          src="https://www.youtube.com/embed/1MobY_vR7-g"
          className="w-full aspect-video rounded-lg"
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Users.Title")}>
        <RyogoCaption color="slate">{t("Users.Description")}</RyogoCaption>
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Drivers.Title")}>
        <RyogoCaption color="slate">{t("Drivers.Description")}</RyogoCaption>
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Vehicles.Title")}>
        <RyogoCaption color="slate">{t("Vehicles.Description")}</RyogoCaption>
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Customers.Title")}>
        <RyogoCaption color="slate">{t("Customers.Description")}</RyogoCaption>
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Bookings.Title")}>
        <RyogoCaption color="slate">{t("Bookings.Description")}</RyogoCaption>
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Others.Title")}>
        <RyogoCaption color="slate">{t("Others.Description")}</RyogoCaption>
      </SupportContentSectionWrapper>
    </>
  )
}
