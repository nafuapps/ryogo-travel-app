import SupportQuickActionLinkButton, {
  QuickActionType,
} from "@/components/flows/support/supportQuickActionLink"
import SupportContentHeader, {
  SupportContentSectionWrapper,
} from "@/components/flows/support/supportContentHeader"
import {
  SupportFAQWrapper,
  SupportFAQItem,
  SupportFAQItemType,
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
  SquarePen,
  ListTodo,
  Tickets,
  Plus,
  ChevronRight,
  SquarePlus,
  Wrench,
  FileClock,
} from "lucide-react"
import { getTranslations } from "next-intl/server"
import { pageTitle, pageDescription } from "@/components/page/pageCommons"
import { Metadata } from "next"
import SupportContentCTALinkButton from "@/components/flows/support/supportContentCTALink"
import {
  SupportTableWrapper,
  SupportTableTextRow,
  SupportTableStatusRow,
} from "@/components/flows/support/supportTableWrapper"
import { RyogoImage } from "@/components/images/ryogoImage"
import { VehicleStatusPill } from "@/components/pills/ryogoPills"
import { VehicleStatusEnum } from "@ryogo-travel-app/db/schema"

/*
  - Overview
  - Vehicles add 
  - Vehicle manage
  - Vehicle assignment
  - Bookings
  - Vehicle repairs
  - Documents

*/

export const metadata: Metadata = {
  title: `Vehicles Help - ${pageTitle}`,
  description: pageDescription,
}

export default async function SupportHelpVehiclesPage() {
  const t = await getTranslations("Dashboard.SupportVehiclesHelp")

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
      icon: SquarePlus,
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
      id: "repairs",
      title: t("Repairs.Title"),
      icon: Wrench,
      content: <RepairsContent />,
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

  const quickActions: QuickActionType[] = [
    {
      label: t("QuickActions.AddVehicle"),
      href: "/dashboard/vehicles/new",
      icon: Plus,
    },
    {
      label: t("QuickActions.AllVehicles"),
      href: "/dashboard/vehicles",
      icon: ChevronRight,
    },
  ]
  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/support/help-vehicles"} />
      <DoubleContentWrapper sideOnTop>
        <PageWrapper id="SupportHelpVehiclesPage" disableScrollInMobile>
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

async function OverviewContent() {
  const t = await getTranslations("Dashboard.SupportVehiclesHelp.Overview")
  return (
    <>
      <SupportContentSectionWrapper title={t("KnowVehicle.Title")}>
        <RyogoCaption color="slate">
          {t("KnowVehicle.Description")}
        </RyogoCaption>
        <RyogoCaption color="slate">
          {t("KnowVehicle.AllVehicles")}
        </RyogoCaption>
        {/* //TODO: Add all vehicles page snapshot */}
        <RyogoImage
          alt="Vehicles"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
        <SupportContentCTALinkButton
          href={"/dashboard/vehicles"}
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
      <SupportContentSectionWrapper title={t("StatusList.Title")}>
        <RyogoCaption color="slate">{t("StatusList.Description")}</RyogoCaption>
        <SupportTableWrapper label={t("StatusList.Caption")}>
          <SupportTableStatusRow desc={t("StatusList.Available")}>
            <VehicleStatusPill status={VehicleStatusEnum.AVAILABLE} />
          </SupportTableStatusRow>
          <SupportTableStatusRow desc={t("StatusList.OnTrip")}>
            <VehicleStatusPill status={VehicleStatusEnum.ON_TRIP} />
          </SupportTableStatusRow>
          <SupportTableStatusRow desc={t("StatusList.Repair")}>
            <VehicleStatusPill status={VehicleStatusEnum.REPAIR} />
          </SupportTableStatusRow>
          <SupportTableStatusRow desc={t("StatusList.Inactive")}>
            <VehicleStatusPill status={VehicleStatusEnum.INACTIVE} />
          </SupportTableStatusRow>
          <SupportTableStatusRow desc={t("StatusList.Suspended")}>
            <VehicleStatusPill status={VehicleStatusEnum.SUSPENDED} />
          </SupportTableStatusRow>
        </SupportTableWrapper>
      </SupportContentSectionWrapper>
    </>
  )
}
async function AddingContent() {
  const t = await getTranslations("Dashboard.SupportVehiclesHelp.Adding")
  return (
    <>
      <SupportContentSectionWrapper title={t("AddingVehicle.Title")}>
        <RyogoCaption color="slate">
          {t("AddingVehicle.Description")}
        </RyogoCaption>
        <SupportContentCTALinkButton
          href={"/dashboard/vehicles/new"}
          label={t("AddingVehicle.CTA")}
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Step1.Title")}>
        <RyogoCaption color="slate">{t("Step1.Description")}</RyogoCaption>
        {/* //TODO: Add vehicle step1 page snapshot */}
        <RyogoImage
          alt="vehicle step1"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Step2.Title")}>
        <RyogoCaption color="slate">{t("Step2.Description")}</RyogoCaption>
        {/* //TODO: Add vehicle step2 page snapshot */}
        <RyogoImage
          alt="vehicle step2"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Step3.Title")}>
        <RyogoCaption color="slate">{t("Step3.Description")}</RyogoCaption>
        {/* //TODO: Add vehicle step3 page snapshot */}
        <RyogoImage
          alt="vehicle step3"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Step4.Title")}>
        <RyogoCaption color="slate">{t("Step4.Description")}</RyogoCaption>
        {/* //TODO: Add vehicle step4 page snapshot */}
        <RyogoImage
          alt="vehicle step4"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Step5.Title")}>
        <RyogoCaption color="slate">{t("Step5.Description")}</RyogoCaption>
        {/* //TODO: Add vehicle step5 page snapshot */}
        <RyogoImage
          alt="vehicle step5"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
      </SupportContentSectionWrapper>
    </>
  )
}
async function EditingContent() {
  const t = await getTranslations("Dashboard.SupportVehiclesHelp.Editing")
  return (
    <SupportContentSectionWrapper title={t("ModifyingVehicle.Title")}>
      <RyogoCaption color="slate">
        {t("ModifyingVehicle.Description")}
      </RyogoCaption>
    </SupportContentSectionWrapper>
  )
}
async function AssignmentContent() {
  const t = await getTranslations("Dashboard.SupportVehiclesHelp.Assignment")
  return (
    <>
      <SupportContentSectionWrapper title={t("BookingAssignment.Title")}>
        <RyogoCaption color="slate">
          {t("BookingAssignment.Description")}
        </RyogoCaption>
        {/* //TODO: Add vehicle assignment page snapshot */}
        <RyogoImage
          alt="Assign Vehicle"
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
  const t = await getTranslations("Dashboard.SupportVehiclesHelp.Bookings")
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
async function RepairsContent() {
  const t = await getTranslations("Dashboard.SupportVehiclesHelp.Repairs")
  return (
    <>
      <SupportContentSectionWrapper title={t("WhatIsRepair.Title")}>
        <RyogoCaption color="slate">
          {t("WhatIsRepair.Description")}
        </RyogoCaption>
        <RyogoCaption color="slate">
          {t("WhatIsRepair.AllRepairs")}
        </RyogoCaption>
        {/* //TODO: Add All Vehicle repairs page snapshot */}
        <RyogoImage
          alt="AllVehicleRepairs"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("AddingVehicleRepair.Title")}>
        <RyogoCaption color="slate">
          {t("AddingVehicleRepair.Description")}
        </RyogoCaption>
        <RyogoCaption color="slate">
          {t("AddingVehicleRepair.Fields")}
        </RyogoCaption>
        {/* //TODO: Add AddingVehicleRepair page snapshot */}
        <RyogoImage
          alt="AddingVehicleRepair"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("EditingVehicleRepair.Title")}>
        <RyogoCaption color="slate">
          {t("EditingVehicleRepair.Description")}
        </RyogoCaption>
        {/* //TODO: Add EditingVehicleRepair page snapshot */}
        <RyogoImage
          alt="EditingVehicleRepair"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
      </SupportContentSectionWrapper>
    </>
  )
}
async function DocumentsContent() {
  const t = await getTranslations("Dashboard.SupportVehiclesHelp.Documents")
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
        href={"/dashboard/mission-control"}
        label={t("WhatIsDocument.CTA")}
      />
    </SupportContentSectionWrapper>
  )
}
