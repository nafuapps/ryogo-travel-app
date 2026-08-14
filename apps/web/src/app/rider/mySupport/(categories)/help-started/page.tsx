import {
  DoubleContentWrapper,
  MainWrapper,
  PageWrapper,
  SectionWrapper,
  SideWrapper,
} from "@/components/page/pageWrappers"
import RiderHeader from "@/components/header/riderHeader"
import { Separator } from "@/components/ui/separator"
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
import { RyogoCaption } from "@/components/typography"
import {
  BadgeQuestionMark,
  Telescope,
  LayoutGrid,
  ChevronRight,
} from "lucide-react"
import { getTranslations } from "next-intl/server"
import { pageTitle, pageDescription } from "@/components/page/pageCommons"
import { Metadata } from "next"
import SupportRelatedArticleLinkButton, {
  SupportRelatedArticleType,
} from "@/components/flows/support/supportRelatedArticleType"
import { RyogoImage } from "@/components/images/ryogoImage"
import SupportContentCTALinkButton from "@/components/flows/support/supportContentCTALink"
import { RyogoVideo } from "@/components/video/ryogoVideo"

/*
  TODO
  - what and why is ryogo?
  - Driver app overview with guided tutorial
  - various entities, and how they work together
  - 
*/

export const metadata: Metadata = {
  title: `Getting Started Help - ${pageTitle}`,
  description: pageDescription,
}

export default async function MySupportHelpStartedPage() {
  const t = await getTranslations("Rider.MySupportStartedHelp")

  const contentItems: SupportContentItemType[] = [
    {
      id: "about",
      title: t("About.Title"),
      icon: BadgeQuestionMark,
      content: <AboutContent />,
    },
    {
      id: "overview",
      title: t("Overview.Title"),
      icon: Telescope,
      content: <OverviewContent />,
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
      href: `/rider/myProfile`,
      icon: ChevronRight,
      label: t("QuickActions.ViewAccount"),
    },
  ]

  const relatedArticles: SupportRelatedArticleType[] = [
    {
      label: t("RelatedArticles.Account"),
      href: "/rider/mySupport/help-account",
    },
    {
      label: t("RelatedArticles.Bookings"),
      href: "/rider/mySupport/help-bookings",
    },
    {
      label: t("RelatedArticles.Vehicle"),
      href: "/rider/mySupport/help-vehicle",
    },
    {
      label: t("RelatedArticles.Videos"),
      href: "/rider/mySupport/help-videos",
    },
  ]

  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/mySupport/help-started"} />
      <DoubleContentWrapper sideOnTop>
        <PageWrapper id="MySupportHelpStartedPage" disableScrollInMobile>
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
  const t = await getTranslations("Rider.MySupportStartedHelp.About")
  return (
    <>
      <SupportContentSectionWrapper title={t("WhatIsRyogo.Title")}>
        <RyogoCaption color="slate">
          {t("WhatIsRyogo.Description")}
        </RyogoCaption>
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
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Features.Title")}>
        <RyogoCaption color="slate">{t("Features.Description")}</RyogoCaption>
        {/* //TODO: Add ryogo features video */}
        <RyogoVideo
          src="https://www.youtube.com/embed/1MobY_vR7-g"
          className="w-full aspect-video rounded-lg"
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Benefits.Title")}>
        <RyogoCaption color="slate">{t("Benefits.Description")}</RyogoCaption>
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("StartedDriver.Title")}>
        <RyogoCaption color="slate">
          {t("StartedDriver.Description")}
        </RyogoCaption>
        {/* //TODO: Add rider app tutorial video */}
        <RyogoVideo
          src="https://www.youtube.com/embed/1MobY_vR7-g"
          className="w-full aspect-video rounded-lg"
        />
      </SupportContentSectionWrapper>
    </>
  )
}

async function OverviewContent() {
  const t = await getTranslations("Rider.MySupportStartedHelp.Overview")
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
      <SupportContentSectionWrapper title={t("Vehicle.Title")}>
        <RyogoCaption color="slate">{t("Vehicle.Description")}</RyogoCaption>
        {/* //TODO: Add Vehicles snapshot */}
        <RyogoImage
          alt="Vehicles"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
        <SupportContentCTALinkButton
          href={"/dashboard/vehicles"}
          label={t("Vehicle.CTA")}
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
  const t = await getTranslations("Rider.MySupportStartedHelp.Entities")
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
