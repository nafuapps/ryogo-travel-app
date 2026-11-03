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
import RiderHeader from "@/components/header/riderHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import {
  DoubleContentWrapper,
  MainWrapper,
  PageWrapper,
  SideWrapper,
} from "@/components/page/pageWrappers"
import { FB_LINK, IG_LINK, LI_LINK, YT_LINK } from "@/lib/uiConfig"
import { ChevronRight } from "lucide-react"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

/* //TODO: Add videos
  - Videos
  - Social media
*/

export const metadata: Metadata = {
  title: `Videos Help - ${pageTitle}`,
  description: pageDescription,
}

export default async function MySupportHelpVideosPage() {
  const t = await getTranslations("Rider.MySupportVideosHelp")

  const videoItems: SupportVideoItemType[] = [
    {
      index: 1,
      title: t("MyBookings.Title"),
      desc: t("MyBookings.Description"),
      src: "https://www.youtube.com/embed/1MobY_vR7-g",
    },
    {
      index: 2,
      title: t("ExecutingTrip.Title"),
      desc: t("ExecutingTrip.Description"),
      src: "https://www.youtube.com/embed/bMCiAKNUpTY",
    },
    {
      index: 3,
      title: t("MyVehicle.Title"),
      desc: t("MyVehicle.Description"),
      src: "https://www.youtube.com/embed/1MobY_vR7-g",
    },
    {
      index: 4,
      title: t("DriverApp.Title"),
      desc: t("DriverApp.Description"),
      src: "https://www.youtube.com/embed/bMCiAKNUpTY",
    },
    {
      index: 5,
      title: t("MyProfile.Title"),
      desc: t("MyProfile.Description"),
      src: "https://www.youtube.com/embed/bMCiAKNUpTY",
    },
    {
      index: 6,
      title: t("Communication.Title"),
      desc: t("Communication.Description"),
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
      label: t("QuickActions.ViewMyBookings"),
      href: "/rider/myBookings",
      icon: ChevronRight,
    },
    {
      label: t("QuickActions.ViewMyVehicle"),
      href: "/rider/myVehicle",
      icon: ChevronRight,
    },
  ]
  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/mySupport/help-videos"} />
      <DoubleContentWrapper sideOnTop>
        <PageWrapper id="MySupportHelpVideosPage" disableScrollInMobile>
          <SupportSectionHeader
            title={t("Title")}
            description={t("Description")}
          />
          {videoItems.map((item) => (
            <SupportVideoItem key={item.title} {...item} />
          ))}
        </PageWrapper>
        <SideWrapper>
          <SupportSideAccordionWrapper label={"SocialMedia"}>
            {socialMediaLinks.map((item) => (
              <SupportSMLink key={item.label} {...item} />
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
        </SideWrapper>
      </DoubleContentWrapper>
    </MainWrapper>
  )
}
