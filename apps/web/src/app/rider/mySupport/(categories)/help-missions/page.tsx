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
import {
  Telescope,
  SquarePen,
  BellPlus,
  Plus,
  ChevronRight,
} from "lucide-react"
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
  - Overview What is mission?
  - How to get and know alerts?
  - Custom mission
*/

export const metadata: Metadata = {
  title: `My Missions Help - ${pageTitle}`,
  description: pageDescription,
}

export default async function MySupportHelpMissionsPage() {
  const t = await getTranslations("Rider.MySupportMissionsHelp")

  const contentItems: SupportContentItemType[] = [
    {
      id: "overview",
      title: t("Overview.Title"),
      icon: Telescope,
      content: <OverviewContent />,
    },
    {
      id: "managing",
      title: t("Managing.Title"),
      icon: SquarePen,
      content: <ManagingContent />,
    },
    {
      id: "custom",
      title: t("Custom.Title"),
      icon: BellPlus,
      content: <CustomContent />,
    },
  ]

  const faqItems: SupportFAQItemType[] = [
    {
      question: t("FAQs.WhatMission.Question"),
      answer: t("FAQs.WhatMission.Answer"),
    },
    {
      question: t("FAQs.Custom.Question"),
      answer: t("FAQs.Custom.Answer"),
    },
  ]

  const quickActions: SupportQuickActionType[] = [
    {
      href: `/rider/myMissions/add`,
      icon: Plus,
      label: t("QuickActions.CreateCustomMission"),
    },
    {
      href: `/rider/myMissions`,
      icon: ChevronRight,
      label: t("QuickActions.ViewMissions"),
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
      label: t("RelatedArticles.Videos"),
      href: "/rider/mySupport/help-videos",
    },
  ]

  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/mySupport/help-missions"} />
      <DoubleContentWrapper sideOnTop>
        <PageWrapper id="MySupportHelpMissionsPage" disableScrollInMobile>
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
  const t = await getTranslations("Rider.MySupportMissionsHelp.Overview")
  return (
    <>
      <SupportContentSectionWrapper title={t("WhatAreMissions.Title")}>
        <RyogoCaption color="slate">
          {t("WhatAreMissions.Description")}
        </RyogoCaption>
        <RyogoCaption color="slate">
          {t("WhatAreMissions.AllMissions")}
        </RyogoCaption>
        {/* //TODO: Add MissionControl snapshot */}
        <RyogoImage
          alt="MissionControl"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
        <SupportContentCTALinkButton
          href={"/rider/myMissions"}
          label={t("WhatAreMissions.CTA")}
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Elements.Title")}>
        <RyogoCaption color="slate">{t("Elements.Description")}</RyogoCaption>
        <SupportTableWrapper label={t("Elements.Caption")}>
          <SupportTableTextRow
            label={t("Elements.Entity")}
            desc={t("Elements.EntityDesc")}
          />
          <SupportTableTextRow
            label={t("Elements.Message")}
            desc={t("Elements.MessageDesc")}
          />
          <SupportTableTextRow
            label={t("Elements.Actions")}
            desc={t("Elements.ActionsDesc")}
          />
          <SupportTableTextRow
            label={t("Elements.DueDate")}
            desc={t("Elements.DueDateDesc")}
          />
          <SupportTableTextRow
            label={t("Elements.Status")}
            desc={t("Elements.StatusDesc")}
          />
        </SupportTableWrapper>
      </SupportContentSectionWrapper>
    </>
  )
}
async function ManagingContent() {
  const t = await getTranslations("Rider.MySupportMissionsHelp.Managing")
  return (
    <>
      <SupportContentSectionWrapper title={t("ReadingMission.Title")}>
        <RyogoCaption color="slate">
          {t("ReadingMission.Description")}
        </RyogoCaption>
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("ActingMission.Title")}>
        <RyogoCaption color="slate">
          {t("ActingMission.Description")}
        </RyogoCaption>
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("ExpiryAlerts.Title")}>
        <RyogoCaption color="slate">
          {t("ExpiryAlerts.Description")}
        </RyogoCaption>
        <RyogoCaption color="slate">{t("ExpiryAlerts.Items")}</RyogoCaption>
      </SupportContentSectionWrapper>
    </>
  )
}
async function CustomContent() {
  const t = await getTranslations("Rider.MySupportMissionsHelp.Custom")
  return (
    <>
      <SupportContentSectionWrapper title={t("WhatIsCustomMission.Title")}>
        <RyogoCaption color="slate">
          {t("WhatIsCustomMission.Description")}
        </RyogoCaption>
        <RyogoCaption color="slate">
          {t("WhatIsCustomMission.Need")}
        </RyogoCaption>
        <RyogoCaption color="slate">
          {t("WhatIsCustomMission.ViewCustomMissions")}
        </RyogoCaption>
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("CreatingCustom.Title")}>
        <RyogoCaption color="slate">
          {t("CreatingCustom.Description")}
        </RyogoCaption>
        <RyogoCaption color="slate">{t("CreatingCustom.Fields")}</RyogoCaption>
        {/* //TODO: Add CreatingCustom snapshot */}
        <RyogoImage
          alt="CreatingCustom"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
        <SupportContentCTALinkButton
          href={"/rider/myMissions/add"}
          label={t("CreatingCustom.CTA")}
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("ModifyingCustom.Title")}>
        <RyogoCaption color="slate">
          {t("ModifyingCustom.Description")}
        </RyogoCaption>
        <RyogoCaption color="slate">{t("ModifyingCustom.Fields")}</RyogoCaption>
        {/* //TODO: Add ModifyingCustom snapshot */}
        <RyogoImage
          alt="ModifyingCustom"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
      </SupportContentSectionWrapper>
    </>
  )
}
