import SupportQuickActionLinkButton, {
  SupportQuickActionType,
} from "@/components/flows/support/supportQuickActionLink"
import SupportContentHeader, {
  SupportContentSectionWrapper,
} from "@/components/flows/support/supportContentHeader"
import {
  SupportFAQItem,
  SupportFAQItemType,
  SupportFAQWrapper,
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
import {
  Telescope,
  UserRoundPlus,
  SquarePen,
  Plus,
  ChevronRight,
  Smartphone,
  TreePalm,
  ListTodo,
  Tickets,
} from "lucide-react"
import { getTranslations } from "next-intl/server"
import { pageTitle, pageDescription } from "@/components/page/pageCommons"
import { Metadata } from "next"
import SupportContentCTALinkButton from "@/components/flows/support/supportContentCTALink"
import {
  SupportTableWrapper,
  SupportTableStatusRow,
  SupportTableTextRow,
} from "@/components/flows/support/supportTableWrapper"
import { RyogoImage } from "@/components/images/ryogoImage"
import {
  CustomerStatusPill,
  DriverStatusPill,
} from "@/components/pills/ryogoPills"
import {
  CustomerStatusEnum,
  DriverStatusEnum,
} from "@ryogo-travel-app/db/schema"
import SupportRelatedArticleLinkButton, {
  SupportRelatedArticleType,
} from "@/components/flows/support/supportRelatedArticleType"

/*
  - Overview
  - Add (with invite)
  - Modify
  - Assignment
  - Bookings
  - Leaves
  - Driver App
*/

export const metadata: Metadata = {
  title: `Drivers Help - ${pageTitle}`,
  description: pageDescription,
}

export default async function SupportHelpDriversPage() {
  const t = await getTranslations("Dashboard.SupportDriversHelp")

  const contentItems: SupportContentItemType[] = [
    {
      id: "overview",
      title: t("Overview.Title"),
      icon: Telescope,
      content: <OverviewContent />,
    },
    {
      id: "adding",
      title: t("Adding.Title"),
      icon: UserRoundPlus,
      content: <AddingContent />,
    },
    {
      id: "editing",
      title: t("Editing.Title"),
      icon: SquarePen,
      content: <EditingContent />,
    },
    {
      id: "assignment",
      title: t("Assignment.Title"),
      icon: ListTodo,
      content: <AssignmentContent />,
    },
    {
      id: "bookings",
      title: t("Bookings.Title"),
      icon: Tickets,
      content: <BookingsContent />,
    },
    {
      id: "leaves",
      title: t("Leaves.Title"),
      icon: TreePalm,
      content: <LeavesContent />,
    },
    {
      id: "driver-app",
      title: t("DriverApp.Title"),
      icon: Smartphone,
      content: <DriverAppContent />,
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
      label: t("QuickActions.AddCustomer"),
      href: "/dashboard/customers/new",
      icon: Plus,
    },
    {
      label: t("QuickActions.AllCustomers"),
      href: "/dashboard/customers",
      icon: ChevronRight,
    },
  ]

  const relatedArticles: SupportRelatedArticleType[] = [
    {
      label: t("RelatedArticles.Vehicles"),
      href: "/dashboard/support/help-vehicles",
    },
    {
      label: t("RelatedArticles.Bookings"),
      href: "/dashboard/support/help-bookings",
    },
    {
      label: t("RelatedArticles.Users"),
      href: "/dashboard/support/help-users",
    },
  ]

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/support/help-drivers"} />
      <DoubleContentWrapper sideOnTop>
        <PageWrapper id="SupportHelpDriversPage" disableScrollInMobile>
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
  const t = await getTranslations("Dashboard.SupportDriversHelp.Overview")
  return (
    <>
      <SupportContentSectionWrapper title={t("KnowDriver.Title")}>
        <RyogoCaption color="slate">{t("KnowDriver.Description")}</RyogoCaption>
        <RyogoCaption color="slate">{t("KnowDriver.AllDrivers")}</RyogoCaption>
        {/* //TODO: Add all drivers page snapshot */}
        <RyogoImage
          alt="Drivers"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
        <SupportContentCTALinkButton
          href={"/dashboard/drivers"}
          label={t("KnowDriver.CTA")}
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("DriverDetails.Title")}>
        <RyogoCaption color="slate">
          {t("DriverDetails.Description")}
        </RyogoCaption>
        {/* //TODO: Add driver details page snapshot */}
        <RyogoImage
          alt="Driver details"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
        <SupportTableWrapper label={t("DriverDetails.Caption")}>
          <SupportTableTextRow
            label={t("DriverDetails.Basic")}
            desc={t("DriverDetails.BasicDesc")}
          />
          <SupportTableTextRow
            label={t("DriverDetails.License")}
            desc={t("DriverDetails.LicenseDesc")}
          />
          <SupportTableTextRow
            label={t("DriverDetails.Vehicles")}
            desc={t("DriverDetails.VehiclesDesc")}
          />
          <SupportTableTextRow
            label={t("DriverDetails.Allowance")}
            desc={t("DriverDetails.AllowanceDesc")}
          />
          <SupportTableTextRow
            label={t("DriverDetails.Rating")}
            desc={t("DriverDetails.RatingDesc")}
          />
        </SupportTableWrapper>
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("StatusList.Title")}>
        <RyogoCaption color="slate">{t("StatusList.Description")}</RyogoCaption>
        <SupportTableWrapper label={t("StatusList.Caption")}>
          <SupportTableStatusRow desc={t("StatusList.Available")}>
            <DriverStatusPill status={DriverStatusEnum.AVAILABLE} />
          </SupportTableStatusRow>
          <SupportTableStatusRow desc={t("StatusList.OnTrip")}>
            <DriverStatusPill status={DriverStatusEnum.ON_TRIP} />
          </SupportTableStatusRow>
          <SupportTableStatusRow desc={t("StatusList.Leave")}>
            <DriverStatusPill status={DriverStatusEnum.LEAVE} />
          </SupportTableStatusRow>
          <SupportTableStatusRow desc={t("StatusList.Inactive")}>
            <DriverStatusPill status={DriverStatusEnum.INACTIVE} />
          </SupportTableStatusRow>
          <SupportTableStatusRow desc={t("StatusList.Suspended")}>
            <DriverStatusPill status={DriverStatusEnum.SUSPENDED} />
          </SupportTableStatusRow>
        </SupportTableWrapper>
      </SupportContentSectionWrapper>
    </>
  )
}
async function AddingContent() {
  const t = await getTranslations("Dashboard.SupportDriversHelp.Adding")
  return (
    <>
      <SupportContentSectionWrapper title={t("AddingDriver.Title")}>
        <RyogoCaption color="slate">
          {t("AddingDriver.Description")}
        </RyogoCaption>
        <SupportContentCTALinkButton
          href={"/dashboard/drivers/new"}
          label={t("AddingDriver.CTA")}
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Step1.Title")}>
        <RyogoCaption color="slate">{t("Step1.Description")}</RyogoCaption>
        {/* //TODO: Add driver step1 page snapshot */}
        <RyogoImage
          alt="driver step1"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Step2.Title")}>
        <RyogoCaption color="slate">{t("Step2.Description")}</RyogoCaption>
        {/* //TODO: Add driver step2 page snapshot */}
        <RyogoImage
          alt="driver step2"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Step3.Title")}>
        <RyogoCaption color="slate">{t("Step3.Description")}</RyogoCaption>
        {/* //TODO: Add driver step3 page snapshot */}
        <RyogoImage
          alt="driver step3"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Step4.Title")}>
        <RyogoCaption color="slate">{t("Step4.Description")}</RyogoCaption>
        {/* //TODO: Add driver step4 page snapshot */}
        <RyogoImage
          alt="driver step4"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("DriverInvite.Title")}>
        <RyogoCaption color="slate">
          {t("DriverInvite.Description")}
        </RyogoCaption>
      </SupportContentSectionWrapper>
    </>
  )
}
async function EditingContent() {
  const t = await getTranslations("Dashboard.SupportDriversHelp.Editing")
  return (
    <SupportContentSectionWrapper title={t("ModifyingDriver.Title")}>
      <RyogoCaption color="slate">
        {t("ModifyingDriver.Description")}
      </RyogoCaption>
    </SupportContentSectionWrapper>
  )
}
async function AssignmentContent() {
  const t = await getTranslations("Dashboard.SupportDriversHelp.Assignment")
  return (
    <>
      <SupportContentSectionWrapper title={t("BookingAssignment.Title")}>
        <RyogoCaption color="slate">
          {t("BookingAssignment.Description")}
        </RyogoCaption>
        {/* //TODO: Add driver assignment page snapshot */}
        <RyogoImage
          alt="Assign Driver"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Selection.Title")}>
        <RyogoCaption color="slate">{t("Selection.Description")}</RyogoCaption>
        <RyogoCaption color="slate">{t("Selection.Score")}</RyogoCaption>
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Reassignment.Title")}>
        <RyogoCaption color="slate">
          {t("Reassignment.Description")}
        </RyogoCaption>
      </SupportContentSectionWrapper>
    </>
  )
}
async function BookingsContent() {
  const t = await getTranslations("Dashboard.SupportDriversHelp.Bookings")
  return (
    <>
      <SupportContentSectionWrapper title={t("UpcomingBookings.Title")}>
        <RyogoCaption color="slate">
          {t("UpcomingBookings.Description")}
        </RyogoCaption>
        {/* //TODO: Add Upcoming Bookings page snapshot */}
        <RyogoImage
          alt="UpcomingBookings"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("CompletedBookings.Title")}>
        <RyogoCaption color="slate">
          {t("CompletedBookings.Description")}
        </RyogoCaption>
        {/* //TODO: Add CompletedBookings page snapshot */}
        <RyogoImage
          alt="CompletedBookings"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
      </SupportContentSectionWrapper>
    </>
  )
}
async function LeavesContent() {
  const t = await getTranslations("Dashboard.SupportDriversHelp.Leaves")
  return (
    <>
      <SupportContentSectionWrapper title={t("WhatIsLeave.Title")}>
        <RyogoCaption color="slate">
          {t("WhatIsLeave.Description")}
        </RyogoCaption>
        <RyogoCaption color="slate">{t("WhatIsLeave.AllLeaves")}</RyogoCaption>
        {/* //TODO: Add All Driver leaves page snapshot */}
        <RyogoImage
          alt="AllDriverLeaves"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("AddingDriverLeave.Title")}>
        <RyogoCaption color="slate">
          {t("AddingDriverLeave.Description")}
        </RyogoCaption>
        <RyogoCaption color="slate">
          {t("AddingDriverLeave.Fields")}
        </RyogoCaption>
        {/* //TODO: Add AddingDriverLeave page snapshot */}
        <RyogoImage
          alt="AddingDriverLeave"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("EditingDriverLeave.Title")}>
        <RyogoCaption color="slate">
          {t("EditingDriverLeave.Description")}
        </RyogoCaption>
        {/* //TODO: Add EditingDriverLeave page snapshot */}
        <RyogoImage
          alt="EditingDriverLeave"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
      </SupportContentSectionWrapper>
    </>
  )
}
async function DriverAppContent() {
  const t = await getTranslations("Dashboard.SupportDriversHelp.DriverApp")
  return (
    <>
      <SupportContentSectionWrapper title={t("WhatIsDriverApp.Title")}>
        <RyogoCaption color="slate">
          {t("WhatIsDriverApp.Description")}
        </RyogoCaption>
        <RyogoCaption color="slate">{t("WhatIsDriverApp.Use")}</RyogoCaption>
        <RyogoCaption color="slate">
          {t("WhatIsDriverApp.Download")}
        </RyogoCaption>
        {/* //TODO: Add driver app snapshot */}
        <RyogoImage
          alt="DriverApp"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Features.Title")}>
        <RyogoCaption color="slate">{t("Features.Description")}</RyogoCaption>
        <SupportTableWrapper label={t("Features.Caption")}>
          <SupportTableTextRow
            label={t("Features.Bookings")}
            desc={t("Features.BookingsDesc")}
          />
          <SupportTableTextRow
            label={t("Features.Execution")}
            desc={t("Features.ExecutionDesc")}
          />
          <SupportTableTextRow
            label={t("Features.Profile")}
            desc={t("Features.ProfileDesc")}
          />
          <SupportTableTextRow
            label={t("Features.Vehicle")}
            desc={t("Features.VehicleDesc")}
          />
          <SupportTableTextRow
            label={t("Features.Expenses")}
            desc={t("Features.ExpensesDesc")}
          />
          <SupportTableTextRow
            label={t("Features.Communication")}
            desc={t("Features.CommunicationDesc")}
          />
          <SupportTableTextRow
            label={t("Features.Alerts")}
            desc={t("Features.AlertsDesc")}
          />
        </SupportTableWrapper>
      </SupportContentSectionWrapper>
    </>
  )
}
