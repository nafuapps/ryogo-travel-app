import {
  DoubleContentWrapper,
  MainWrapper,
  PageWrapper,
  SideWrapper,
} from "@/components/page/pageWrappers"
import RiderHeader from "@/components/header/riderHeader"
import {
  SupportVideoItem,
  SupportVideoItemType,
} from "@/components/flows/support/supportVideoItem"
import { getTranslations } from "next-intl/server"
import {
  SupportSMLink,
  SupportSMLinkType,
} from "@/components/flows/support/supportSMLink"
import QuickActionLinkButton, {
  QuickActionType,
} from "@/components/flows/support/quickActionLink"
import { YT_LINK, IG_LINK, FB_LINK, LI_LINK } from "@/lib/uiConfig"
import { ChevronRight } from "lucide-react"
import SupportSectionHeader from "@/components/flows/support/supportSectionHeader"
import SupportSideAccordionWrapper from "@/components/flows/support/supportSideAccordionWrapper"

/*
  - Videos
  - Social media
*/

export default async function MySupportHelpVideosPage() {
  const t = await getTranslations("Rider.MySupportVideosHelp")

  const videoItems: SupportVideoItemType[] = [
    {
      title: t("MyBookings.Title"),
      desc: t("MyBookings.Description"),
      src: "https://www.youtube.com/embed/1MobY_vR7-g",
    },
    {
      title: t("ExecutingTrip.Title"),
      desc: t("ExecutingTrip.Description"),
      src: "https://www.youtube.com/embed/bMCiAKNUpTY",
    },
    {
      title: t("MyVehicle.Title"),
      desc: t("MyVehicle.Description"),
      src: "https://www.youtube.com/embed/1MobY_vR7-g",
    },
    {
      title: t("DriverApp.Title"),
      desc: t("DriverApp.Description"),
      src: "https://www.youtube.com/embed/bMCiAKNUpTY",
    },
    {
      title: t("MyProfile.Title"),
      desc: t("MyProfile.Description"),
      src: "https://www.youtube.com/embed/bMCiAKNUpTY",
    },
    {
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

  const quickActions: QuickActionType[] = [
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
              <QuickActionLinkButton
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
