import {
  DoubleContentWrapper,
  MainWrapper,
  PageWrapper,
  SectionWrapper,
  SideWrapper,
} from "@/components/page/pageWrappers"
import RiderHeader from "@/components/header/riderHeader"
import { ChevronRight, FileClock, Telescope } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import SupportSectionHeader from "@/components/flows/support/supportSectionHeader"
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
import SupportSideAccordionWrapper from "@/components/flows/support/supportSideAccordionWrapper"
import SupportTableOfContentLinkButton, {
  SupportContentItemType,
} from "@/components/flows/support/supportTableOfContentLink"
import { getTranslations } from "next-intl/server"
import { RyogoCaption } from "@/components/typography"
import { pageTitle, pageDescription } from "@/components/page/pageCommons"
import { Metadata } from "next"
import SupportContentCTALinkButton from "@/components/flows/support/supportContentCTALink"
import {
  SupportTableWrapper,
  SupportTableTextRow,
} from "@/components/flows/support/supportTableWrapper"
import { RyogoImage } from "@/components/images/ryogoImage"
import SupportRelatedArticleLinkButton, {
  SupportRelatedArticleType,
} from "@/components/flows/support/supportRelatedArticleType"

/*
  - Overview
  - Documentation
*/

export const metadata: Metadata = {
  title: `My Vehicle Help - ${pageTitle}`,
  description: pageDescription,
}

export default async function MySupportHelpVehiclePage() {
  const t = await getTranslations("Rider.MySupportVehicleHelp")

  const contentItems: SupportContentItemType[] = [
    {
      id: "overview",
      title: t("Overview.Title"),
      icon: Telescope,
      content: <OverviewContent />,
    },

    {
      id: "documents",
      title: t("Documents.Title"),
      icon: FileClock,
      content: <DocumentsContent />,
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
      label: t("QuickActions.ViewVehicle"),
      href: "/rider/myVehicle",
      icon: ChevronRight,
    },
  ]

  const relatedArticles: SupportRelatedArticleType[] = [
    {
      label: t("RelatedArticles.Bookings"),
      href: "/rider/mySupport/help-bookings",
    },
    {
      label: t("RelatedArticles.Videos"),
      href: "/rider/mySupport/help-videos",
    },
  ]

  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/mySupport/help-vehicle"} />
      <DoubleContentWrapper sideOnTop>
        <PageWrapper id="MySupportHelpVehiclesPage" disableScrollInMobile>
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
  const t = await getTranslations("Rider.MySupportVehicleHelp.Overview")
  return (
    <>
      <SupportContentSectionWrapper title={t("KnowVehicle.Title")}>
        <RyogoCaption color="slate">
          {t("KnowVehicle.Description")}
        </RyogoCaption>
        <RyogoCaption color="slate">
          {t("KnowVehicle.AllVehicles")}
        </RyogoCaption>
        {/* //TODO: Add my vehicle page snapshot */}
        <RyogoImage
          alt="Vehicles"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
        <SupportContentCTALinkButton
          href={"/rider/myVehicle"}
          label={t("KnowVehicle.CTA")}
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("VehicleDetails.Title")}>
        <RyogoCaption color="slate">
          {t("VehicleDetails.Description")}
        </RyogoCaption>
        {/* //TODO: Add VehicleDetails page snapshot */}
        <RyogoImage
          alt="VehicleDetails"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
        <SupportTableWrapper label={t("VehicleDetails.Caption")}>
          <SupportTableTextRow
            label={t("VehicleDetails.Basic")}
            desc={t("VehicleDetails.BasicDesc")}
          />
          <SupportTableTextRow
            label={t("VehicleDetails.Specific")}
            desc={t("VehicleDetails.SpecificDesc")}
          />
          <SupportTableTextRow
            label={t("VehicleDetails.Documents")}
            desc={t("VehicleDetails.DocumentsDesc")}
          />
          <SupportTableTextRow
            label={t("VehicleDetails.Type")}
            desc={t("VehicleDetails.TypeDesc")}
          />
          <SupportTableTextRow
            label={t("VehicleDetails.Rate")}
            desc={t("VehicleDetails.RateDesc")}
          />
          <SupportTableTextRow
            label={t("VehicleDetails.Rating")}
            desc={t("VehicleDetails.RatingDesc")}
          />
        </SupportTableWrapper>
      </SupportContentSectionWrapper>
    </>
  )
}
async function DocumentsContent() {
  const t = await getTranslations("Rider.MySupportVehicleHelp.Documents")
  return (
    <SupportContentSectionWrapper title={t("WhatIsDocument.Title")}>
      <RyogoCaption color="slate">
        {t("WhatIsDocument.Description")}
      </RyogoCaption>
      <RyogoCaption color="slate">
        {t("WhatIsDocument.ExpiryAlerts")}
      </RyogoCaption>
      {/* //TODO: Add expiry alert snapshot */}
      <RyogoImage
        alt="ExpiryAlert"
        imageSize="xl"
        src="/logoPWA.png"
        className="self-center"
      />
      <SupportContentCTALinkButton
        href={"/rider/myMissions"}
        label={t("WhatIsDocument.CTA")}
      />
    </SupportContentSectionWrapper>
  )
}
