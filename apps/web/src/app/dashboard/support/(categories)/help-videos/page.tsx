import SupportQuickActionLinkButton, {
  SupportQuickActionType,
} from "@/components/flows/support/supportQuickActionLink"
import SupportSectionHeader from "@/components/flows/support/supportSectionHeader"
import SupportSideAccordionWrapper from "@/components/flows/support/supportSideAccordionWrapper"
import {
  SupportSMLink,
  SupportSMLinkType,
} from "@/components/flows/support/supportSMLink"
import {
  SupportVideoItem,
  SupportVideoItemType,
} from "@/components/flows/support/supportVideoItem"
import DashboardHeader from "@/components/header/dashboardHeader"
import { pageTitle, pageDescription } from "@/components/page/pageCommons"
import {
  DoubleContentWrapper,
  MainWrapper,
  PageWrapper,
  SideWrapper,
} from "@/components/page/pageWrappers"
import { FB_LINK, IG_LINK, LI_LINK, YT_LINK } from "@/lib/uiConfig"
import { Plus } from "lucide-react"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

/*
  - Videos
  - Social media
*/

export const metadata: Metadata = {
  title: `Videos Help - ${pageTitle}`,
  description: pageDescription,
}

export default async function SupportHelpVideosPage() {
  const t = await getTranslations("Dashboard.SupportVideosHelp")

  const videoItems: SupportVideoItemType[] = [
    {
      title: t("KnowRyoGo.Title"),
      desc: t("KnowRyoGo.Description"),
      src: "https://www.youtube.com/embed/1MobY_vR7-g",
    },
    {
      title: t("Onboarding.Title"),
      desc: t("Onboarding.Description"),
      src: "https://www.youtube.com/embed/bMCiAKNUpTY",
    },
    {
      title: t("CreateBooking.Title"),
      desc: t("CreateBooking.Description"),
      src: "https://www.youtube.com/embed/1MobY_vR7-g",
    },
    {
      title: t("ManageBooking.Title"),
      desc: t("ManageBooking.Description"),
      src: "https://www.youtube.com/embed/bMCiAKNUpTY",
    },
    {
      title: t("ManageAccount.Title"),
      desc: t("ManageAccount.Description"),
      src: "https://www.youtube.com/embed/bMCiAKNUpTY",
    },
    {
      title: t("AddDriver.Title"),
      desc: t("AddDriver.Description"),
      src: "https://www.youtube.com/embed/1MobY_vR7-g",
    },
    {
      title: t("DriverApp.Title"),
      desc: t("DriverApp.Description"),
      src: "https://www.youtube.com/embed/bMCiAKNUpTY",
    },
    {
      title: t("AddVehicle.Title"),
      desc: t("AddVehicle.Description"),
      src: "https://www.youtube.com/embed/1MobY_vR7-g",
    },
    {
      title: t("AddAgent.Title"),
      desc: t("AddAgent.Description"),
      src: "https://www.youtube.com/embed/bMCiAKNUpTY",
    },
    {
      title: t("Analytics.Title"),
      desc: t("Analytics.Description"),
      src: "https://www.youtube.com/embed/1MobY_vR7-g",
    },
  ]

  const socialMediaLinks: SupportSMLinkType[] = [
    {
      label: t("SM.Youtube"),
      href: YT_LINK,
    },
    {
      label: t("SM.Instagram"),
      href: IG_LINK,
    },
    {
      label: t("SM.Facebook"),
      href: FB_LINK,
    },
    {
      label: t("SM.Linkedin"),
      href: LI_LINK,
    },
  ]

  const quickActions: SupportQuickActionType[] = [
    {
      label: t("QuickActions.NewBooking"),
      href: "/dashboard/bookings/new",
      icon: Plus,
    },
    {
      label: t("QuickActions.AddDriver"),
      href: "/dashboard/drivers/new",
      icon: Plus,
    },
    {
      label: t("QuickActions.AddVehicle"),
      href: "/dashboard/vehicles/new",
      icon: Plus,
    },
  ]

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/support/help-videos"} />
      <DoubleContentWrapper sideOnTop>
        <PageWrapper id="SupportHelpVideosPage" disableScrollInMobile>
          <SupportSectionHeader
            title={t("Title")}
            description={t("Description")}
          />
          {videoItems.map((item, index) => (
            <SupportVideoItem key={item.title} {...item} index={index + 1} />
          ))}
        </PageWrapper>
        <SideWrapper>
          <SupportSideAccordionWrapper label={t("SM.Title")}>
            {socialMediaLinks.map((item, index) => (
              <SupportSMLink key={index} {...item} />
            ))}
          </SupportSideAccordionWrapper>
          <SupportSideAccordionWrapper label={t("QuickActions.Title")}>
            {quickActions.map((item) => (
              <SupportQuickActionLinkButton
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
