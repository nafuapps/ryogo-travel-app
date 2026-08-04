import QuickActionLinkButton, {
  QuickActionType,
} from "@/components/flows/support/quickActionLink"
import SupportSectionHeader from "@/components/flows/support/supportSectionHeader"
import SupportSideAccordionWrapper from "@/components/flows/support/supportSideAccordionWrapper"
import {
  SupportVideoItem,
  SupportVideoItemType,
} from "@/components/flows/support/SupportVideoItem"
import DashboardHeader from "@/components/header/dashboardHeader"
import {
  DoubleContentWrapper,
  MainWrapper,
  PageWrapper,
  SideWrapper,
} from "@/components/page/pageWrappers"
import { Separator } from "@/components/ui/separator"
import { Plus, ChevronRight } from "lucide-react"
import { getTranslations } from "next-intl/server"

/*
  - Videos
  - Link to YT and social media

*/

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

  const quickActions: QuickActionType[] = [
    {
      label: t("QuickActions.NewBooking"),
      href: "/dashboard/bookings/new",
      icon: Plus,
    },
    {
      label: t("QuickActions.AllBookings"),
      href: "/dashboard/bookings",
      icon: ChevronRight,
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
          <Separator />
        </PageWrapper>
        <SideWrapper>
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
