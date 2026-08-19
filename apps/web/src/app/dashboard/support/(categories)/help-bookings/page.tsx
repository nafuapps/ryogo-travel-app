import SupportQuickActionLinkButton, {
  SupportQuickActionType,
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
  Tickets,
  Plus,
  ChevronRight,
  MapPlus,
  CalendarCheck,
  ScanEye,
  IndianRupee,
  BanknoteArrowDown,
  ArrowLeftRight,
  Logs,
  PhoneCall,
  StickyNotes,
  BadgeInfo,
  CalendarX,
  ListTodo,
} from "lucide-react"
import { getTranslations } from "next-intl/server"
import {
  SupportTableStatusRow,
  SupportTableTextRow,
  SupportTableWrapper,
} from "@/components/flows/support/supportTableWrapper"
import {
  BookingStatusEnum,
  ExpenseTypesEnum,
  TripLogTypesEnum,
  UserRolesEnum,
} from "@ryogo-travel-app/db/schema"
import {
  BookingStatusPill,
  TripLogStatusPill,
} from "@/components/pills/ryogoPills"
import { RyogoImage } from "@/components/images/ryogoImage"
import SupportContentCTALinkButton from "@/components/flows/support/supportContentCTALink"
import { SupportWarningWrapper } from "@/components/flows/support/supportWarningWrapper"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import ExpenseIcon from "@/components/icons/expenseIcon"
import {
  SupportListItem,
  SupportListWrapper,
} from "@/components/flows/support/supportListWrapper"
import { pageTitle, pageDescription } from "@/components/page/pageCommons"
import { Metadata } from "next"
import SupportRelatedArticleLinkButton, {
  SupportRelatedArticleType,
} from "@/components/flows/support/supportRelatedArticleType"
import { OLD_LEAD_AUTO_CANCEL_DAYS } from "@/lib/uiConfig"
/*
  - Overview
  - Creation
  - Price & Commission
  - Confirmation
  - Cancellation
  - Reconciling
  - Assignment
  - Transactions
  - Expenses
  - Trip Logs
  - Communicating with customer and driver
  - Documents (invoice, lead, confirmation, etc)
*/

export const metadata: Metadata = {
  title: `Bookings Help - ${pageTitle}`,
  description: pageDescription,
}

export default async function SupportHelpBookingsPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }
  const isOwner = currentUser.userRole === UserRolesEnum.OWNER
  const t = await getTranslations("Dashboard.SupportBookingsHelp")

  const contentItems: SupportContentItemType[] = [
    {
      id: "overview",
      title: t("Overview.Title"),
      icon: Tickets,
      content: <OverviewContent />,
    },
    {
      id: "creation",
      title: t("Creation.Title"),
      icon: MapPlus,
      content: <CreationContent />,
    },
    {
      id: "price",
      title: t("Price.Title"),
      icon: IndianRupee,
      content: <PriceContent />,
    },
    {
      id: "confirmation",
      title: t("Confirmation.Title"),
      icon: CalendarCheck,
      content: <ConfirmationContent />,
    },
    {
      id: "cancellation",
      title: t("Cancellation.Title"),
      icon: CalendarX,
      content: <CancellationContent />,
    },
    {
      id: "reconciling",
      title: t("Reconciling.Title"),
      icon: ScanEye,
      content: <ReconcilingContent isOwner={isOwner} />,
    },
    {
      id: "assignment",
      title: t("Assignment.Title"),
      icon: ListTodo,
      content: <AssignmentContent isOwner={isOwner} />,
    },
    {
      id: "transactions",
      title: t("Transactions.Title"),
      icon: ArrowLeftRight,
      content: <TransactionsContent />,
    },
    {
      id: "expenses",
      title: t("Expenses.Title"),
      icon: BanknoteArrowDown,
      content: <ExpensesContent />,
    },
    {
      id: "trip-logs",
      title: t("TripLogs.Title"),
      icon: Logs,
      content: <TripLogsContent />,
    },
    {
      id: "communication",
      title: t("Communication.Title"),
      icon: PhoneCall,
      content: <CommunicationContent />,
    },
    {
      id: "documents",
      title: t("Documents.Title"),
      icon: StickyNotes,
      content: <DocumentsContent />,
    },
  ]

  const faqItems: SupportFAQItemType[] = [
    {
      question: t("FAQs.Reassign.Question"),
      answer: t("FAQs.Reassign.Answer"),
    },
    {
      question: t("FAQs.Lead.Question"),
      answer: t("FAQs.Lead.Answer", { days: OLD_LEAD_AUTO_CANCEL_DAYS }),
    },
    {
      question: t("FAQs.Price.Question"),
      answer: t("FAQs.Price.Answer"),
    },
    {
      question: t("FAQs.Expenses.Question"),
      answer: t("FAQs.Expenses.Answer"),
    },
    {
      question: t("FAQs.Transactions.Question"),
      answer: t("FAQs.Transactions.Answer"),
    },
  ]

  const quickActions: SupportQuickActionType[] = [
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

  const relatedArticles: SupportRelatedArticleType[] = [
    {
      label: t("RelatedArticles.Drivers"),
      href: "/dashboard/support/help-drivers",
    },
    {
      label: t("RelatedArticles.Vehicles"),
      href: "/dashboard/support/help-vehicles",
    },
    {
      label: t("RelatedArticles.Customers"),
      href: "/dashboard/support/help-customers",
    },
    {
      label: t("RelatedArticles.Missions"),
      href: "/dashboard/support/help-missions",
    },
  ]

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/support/help-bookings"} />
      <DoubleContentWrapper sideOnTop>
        <PageWrapper id="SupportHelpBookingsPage" disableScrollInMobile>
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
  const t = await getTranslations("Dashboard.SupportBookingsHelp.Overview")
  return (
    <>
      <SupportContentSectionWrapper title={t("WhatIsBooking.Title")}>
        <RyogoCaption color="slate">
          {t("WhatIsBooking.Description")}
        </RyogoCaption>
        <RyogoCaption color="slate">
          {t("WhatIsBooking.AllBookings")}
        </RyogoCaption>
        {/* //TODO: Add all bookings page snapshot */}
        <RyogoImage
          alt="All Bookings"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
        <SupportContentCTALinkButton
          href={"/dashboard/bookings"}
          label={t("WhatIsBooking.CTA")}
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Elements.Title")}>
        <RyogoCaption color="slate">{t("Elements.Description")}</RyogoCaption>
        {/* //TODO: Add booking details page snapshot */}
        <RyogoImage
          alt="Booking details"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
        <SupportTableWrapper label={t("Elements.Caption")}>
          <SupportTableTextRow
            label={t("Elements.BasicInfo")}
            desc={t("Elements.BasicInfoDesc")}
          />
          <SupportTableTextRow
            label={t("Elements.Customer")}
            desc={t("Elements.CustomerDesc")}
          />
          <SupportTableTextRow
            label={t("Elements.TripDetails")}
            desc={t("Elements.TripDetailsDesc")}
          />
          <SupportTableTextRow
            label={t("Elements.Assignment")}
            desc={t("Elements.AssignmentDesc")}
          />
          <SupportTableTextRow
            label={t("Elements.Variables")}
            desc={t("Elements.VariablesDesc")}
          />
          <SupportTableTextRow
            label={t("Elements.Price")}
            desc={t("Elements.PriceDesc")}
          />
          <SupportTableTextRow
            label={t("Elements.Expenses")}
            desc={t("Elements.ExpensesDesc")}
          />
          <SupportTableTextRow
            label={t("Elements.Transactions")}
            desc={t("Elements.TransactionsDesc")}
          />
          <SupportTableTextRow
            label={t("Elements.TripLogs")}
            desc={t("Elements.TripLogsDesc")}
          />
          <SupportTableTextRow
            label={t("Elements.Rating")}
            desc={t("Elements.RatingDesc")}
          />
        </SupportTableWrapper>
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("StatusList.Title")}>
        <RyogoCaption color="slate">{t("StatusList.Description")}</RyogoCaption>
        <SupportTableWrapper label={t("StatusList.Caption")}>
          <SupportTableStatusRow desc={t("StatusList.Lead")}>
            <BookingStatusPill status={BookingStatusEnum.LEAD} />
          </SupportTableStatusRow>
          <SupportTableStatusRow desc={t("StatusList.Confirmed")}>
            <BookingStatusPill status={BookingStatusEnum.CONFIRMED} />
          </SupportTableStatusRow>
          <SupportTableStatusRow desc={t("StatusList.InProgress")}>
            <BookingStatusPill status={BookingStatusEnum.IN_PROGRESS} />
          </SupportTableStatusRow>
          <SupportTableStatusRow desc={t("StatusList.Completed")}>
            <BookingStatusPill status={BookingStatusEnum.COMPLETED} />
          </SupportTableStatusRow>
          <SupportTableStatusRow desc={t("StatusList.Cancelled")}>
            <BookingStatusPill status={BookingStatusEnum.CANCELLED} />
          </SupportTableStatusRow>
        </SupportTableWrapper>
      </SupportContentSectionWrapper>
    </>
  )
}

async function CreationContent() {
  const t = await getTranslations("Dashboard.SupportBookingsHelp.Creation")
  return (
    <>
      <SupportContentSectionWrapper title={t("HowToCreate.Title")}>
        <RyogoCaption color="slate">
          {t("HowToCreate.Description")}
        </RyogoCaption>
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Step1.Title")}>
        <RyogoCaption color="slate">{t("Step1.Description")}</RyogoCaption>
        {/* //TODO: Add booking step1 page snapshot */}
        <RyogoImage
          alt="Booking step1"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
        <SupportContentCTALinkButton
          href={"/dashboard/bookings/new"}
          label={t("Step1.CTA")}
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Step2.Title")}>
        <RyogoCaption color="slate">{t("Step2.Description")}</RyogoCaption>
        {/* //TODO: Add booking step2 page snapshot */}
        <RyogoImage
          alt="Booking step2"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Step3.Title")}>
        <RyogoCaption color="slate">{t("Step3.Description")}</RyogoCaption>
        {/* //TODO: Add booking step3 page snapshot */}
        <RyogoImage
          alt="Booking step3"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Step4.Title")}>
        <RyogoCaption color="slate">{t("Step4.Description")}</RyogoCaption>
        {/* //TODO: Add booking step4 page snapshot */}
        <RyogoImage
          alt="Booking step4"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Step5.Title")}>
        <RyogoCaption color="slate">{t("Step5.Description")}</RyogoCaption>
        {/* //TODO: Add booking step5 page snapshot */}
        <RyogoImage
          alt="Booking step5"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
      </SupportContentSectionWrapper>
      <SupportWarningWrapper text={t("Lead")} />
      <SupportWarningWrapper text={t("ShareQuote")} />
      <SupportWarningWrapper text={t("Default")} />
    </>
  )
}

async function PriceContent() {
  const t = await getTranslations("Dashboard.SupportBookingsHelp.Price")
  return (
    <>
      <SupportContentSectionWrapper title={t("FinalPrice.Title")}>
        <RyogoCaption color="slate">{t("FinalPrice.Description")}</RyogoCaption>
        <RyogoCaption color="slate">{t("FinalPrice.Example")}</RyogoCaption>
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Elements.Title")}>
        <RyogoCaption color="slate">{t("Elements.Description")}</RyogoCaption>
        <SupportTableWrapper label={t("Elements.Caption")}>
          <SupportTableTextRow
            label={t("Elements.VehicleRate")}
            desc={t("Elements.VehicleRateDesc")}
          />
          <SupportTableTextRow
            label={t("Elements.DriverAllowance")}
            desc={t("Elements.DriverAllowanceDesc")}
          />
          <SupportTableTextRow
            label={t("Elements.ACCharge")}
            desc={t("Elements.ACChargeDesc")}
          />
          <SupportTableTextRow
            label={t("Elements.Commission")}
            desc={t("Elements.CommissionDesc")}
          />
        </SupportTableWrapper>
        <SupportWarningWrapper text={t("Elements.FuelCharges")} />
      </SupportContentSectionWrapper>
    </>
  )
}

async function ConfirmationContent() {
  const t = await getTranslations("Dashboard.SupportBookingsHelp.Confirmation")
  return (
    <SupportContentSectionWrapper title={t("Confirming.Title")}>
      <RyogoCaption color="slate">{t("Confirming.Description")}</RyogoCaption>
      <RyogoCaption color="slate">{t("Confirming.Step1")}</RyogoCaption>
      <RyogoCaption color="slate">{t("Confirming.Step2")}</RyogoCaption>
      {/* //TODO: Add confirm booking page snapshot */}
      <RyogoImage
        alt="Confirm booking"
        imageSize="xl"
        src="/logoPWA.png"
        className="self-center"
      />
      <SupportWarningWrapper text={t("Confirming.Share")} />
    </SupportContentSectionWrapper>
  )
}

async function CancellationContent() {
  const t = await getTranslations("Dashboard.SupportBookingsHelp.Cancellation")
  return (
    <SupportContentSectionWrapper title={t("Cancelling.Title")}>
      <RyogoCaption color="slate">{t("Cancelling.Description")}</RyogoCaption>
      <RyogoCaption color="slate">{t("Cancelling.Step")}</RyogoCaption>
      <SupportWarningWrapper text={t("Cancelling.Warning")} />
      <SupportWarningWrapper text={t("Cancelling.Share")} />
    </SupportContentSectionWrapper>
  )
}

async function ReconcilingContent({ isOwner }: { isOwner: boolean }) {
  const t = await getTranslations("Dashboard.SupportBookingsHelp.Reconciling")
  return (
    <>
      <SupportContentSectionWrapper title={t("WhyReconcile.Title")}>
        <RyogoCaption color="slate">
          {t("WhyReconcile.Description")}
        </RyogoCaption>
        <RyogoCaption color="slate">{t("WhyReconcile.Reason")}</RyogoCaption>
        <SupportWarningWrapper text={t("WhyReconcile.OnlyPremium")} />
      </SupportContentSectionWrapper>
      {isOwner && (
        <SupportContentSectionWrapper title={t("Reconciling.Title")}>
          <RyogoCaption color="slate">{t("Reconciling.Step")}</RyogoCaption>
          <RyogoCaption color="slate">{t("Reconciling.Process")}</RyogoCaption>
          {/* //TODO: Add reconciling page snapshot */}
          <RyogoImage
            alt="Booking step1"
            imageSize="xl"
            src="/logoPWA.png"
            className="self-center"
          />
        </SupportContentSectionWrapper>
      )}
    </>
  )
}

async function AssignmentContent({ isOwner }: { isOwner: boolean }) {
  const t = await getTranslations("Dashboard.SupportBookingsHelp.Assignment")
  return (
    <>
      <SupportContentSectionWrapper title={t("AssignVehicle.Title")}>
        <RyogoCaption color="slate">
          {t("AssignVehicle.Description")}
        </RyogoCaption>
        <RyogoCaption color="slate">{t("AssignVehicle.Reassign")}</RyogoCaption>
        {/* //TODO: Add assign vehicle snapshot */}
        <RyogoImage
          alt="Assign Vehicle"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("AssignDriver.Title")}>
        <RyogoCaption color="slate">
          {t("AssignDriver.Description")}
        </RyogoCaption>
        <RyogoCaption color="slate">{t("AssignDriver.Reassign")}</RyogoCaption>
        {/* //TODO: Add assign driver snapshot */}
        <RyogoImage
          alt="Assign Driver"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
      </SupportContentSectionWrapper>
      {isOwner && (
        <SupportContentSectionWrapper title={t("ReassignUser.Title")}>
          <RyogoCaption color="slate">
            {t("ReassignUser.Description")}
          </RyogoCaption>
          {/* //TODO: Add assign user snapshot */}
          <RyogoImage
            alt="Reassign User"
            imageSize="xl"
            src="/logoPWA.png"
            className="self-center"
          />
        </SupportContentSectionWrapper>
      )}
    </>
  )
}

async function TransactionsContent() {
  const t = await getTranslations("Dashboard.SupportBookingsHelp.Transactions")
  return (
    <>
      <SupportContentSectionWrapper title={t("WhatIsTransaction.Title")}>
        <RyogoCaption color="slate">
          {t("WhatIsTransaction.Definition")}
        </RyogoCaption>
        <RyogoCaption color="slate">
          {t("WhatIsTransaction.Description")}
        </RyogoCaption>
        {/* //TODO: Add All Transactions snapshot */}
        <RyogoImage
          alt="Transactions"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("AddingTransaction.Title")}>
        <RyogoCaption color="slate">
          {t("AddingTransaction.Description")}
        </RyogoCaption>
        <RyogoCaption color="slate">
          {t("AddingTransaction.Process")}
        </RyogoCaption>
        {/* //TODO: Add New Transaction snapshot */}
        <RyogoImage
          alt="New Transaction"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("ModifyingTransaction.Title")}>
        <RyogoCaption color="slate">
          {t("ModifyingTransaction.Description")}
        </RyogoCaption>
        {/* //TODO: Add New Transaction snapshot */}
        <RyogoImage
          alt="Modify Transaction"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("ApprovingTransaction.Title")}>
        <RyogoCaption color="slate">
          {t("ApprovingTransaction.Description")}
        </RyogoCaption>
        {/* //TODO: Add Approving Transaction snapshot */}
        <RyogoImage
          alt="Approving Transaction"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
      </SupportContentSectionWrapper>
    </>
  )
}

async function ExpensesContent() {
  const t = await getTranslations("Dashboard.SupportBookingsHelp.Expenses")
  return (
    <>
      <SupportContentSectionWrapper title={t("WhatIsExpense.Title")}>
        <RyogoCaption color="slate">
          {t("WhatIsExpense.Definition")}
        </RyogoCaption>
        <RyogoCaption color="slate">
          {t("WhatIsExpense.Description")}
        </RyogoCaption>
        {/* //TODO: Add All Expenses snapshot */}
        <RyogoImage
          alt="Expenses"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("AddingExpense.Title")}>
        <RyogoCaption color="slate">
          {t("AddingExpense.Description")}
        </RyogoCaption>
        <RyogoCaption color="slate">{t("AddingExpense.Process")}</RyogoCaption>
        {/* //TODO: Add New Expense snapshot */}
        <RyogoImage
          alt="New expense"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("ModifyingExpense.Title")}>
        <RyogoCaption color="slate">
          {t("ModifyingExpense.Description")}
        </RyogoCaption>
        {/* //TODO: Add New expense snapshot */}
        <RyogoImage
          alt="Modify expense"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("ApprovingExpense.Title")}>
        <RyogoCaption color="slate">
          {t("ApprovingExpense.Description")}
        </RyogoCaption>
        {/* //TODO: Add Approving Expense snapshot */}
        <RyogoImage
          alt="Approving Expense"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("ExpenseTypes.Title")}>
        <RyogoCaption color="slate">
          {t("ExpenseTypes.Description")}
        </RyogoCaption>
        <SupportListWrapper>
          <SupportListItem label={t("ExpenseTypes.Fuel")}>
            <ExpenseIcon type={ExpenseTypesEnum.FUEL} />
          </SupportListItem>
          <SupportListItem label={t("ExpenseTypes.Toll")}>
            <ExpenseIcon type={ExpenseTypesEnum.TOLL} />
          </SupportListItem>
          <SupportListItem label={t("ExpenseTypes.Parking")}>
            <ExpenseIcon type={ExpenseTypesEnum.PARKING} />
          </SupportListItem>
          <SupportListItem label={t("ExpenseTypes.Maintenance")}>
            <ExpenseIcon type={ExpenseTypesEnum.MAINTENANCE} />
          </SupportListItem>
          <SupportListItem label={t("ExpenseTypes.AC")}>
            <ExpenseIcon type={ExpenseTypesEnum.AC} />
          </SupportListItem>
          <SupportListItem label={t("ExpenseTypes.Food")}>
            <ExpenseIcon type={ExpenseTypesEnum.FOOD} />
          </SupportListItem>
          <SupportListItem label={t("ExpenseTypes.Other")}>
            <ExpenseIcon type={ExpenseTypesEnum.OTHER} />
          </SupportListItem>
        </SupportListWrapper>
      </SupportContentSectionWrapper>
    </>
  )
}

async function TripLogsContent() {
  const t = await getTranslations("Dashboard.SupportBookingsHelp.TripLogs")
  return (
    <>
      <SupportContentSectionWrapper title={t("WhatIsTripLog.Title")}>
        <RyogoCaption color="slate">
          {t("WhatIsTripLog.Definition")}
        </RyogoCaption>
        <RyogoCaption color="slate">
          {t("WhatIsTripLog.Description")}
        </RyogoCaption>
        {/* //TODO: Add All TripLog snapshot */}
        <RyogoImage
          alt="TripLogs"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("TypeList.Title")}>
        <RyogoCaption color="slate">{t("TypeList.Description")}</RyogoCaption>
        <SupportTableWrapper label={t("TypeList.Caption")}>
          <SupportTableStatusRow desc={t("TypeList.Started")}>
            <TripLogStatusPill status={TripLogTypesEnum.STARTED} />
          </SupportTableStatusRow>
          <SupportTableStatusRow desc={t("TypeList.Arrived")}>
            <TripLogStatusPill status={TripLogTypesEnum.ARRIVED} />
          </SupportTableStatusRow>
          <SupportTableStatusRow desc={t("TypeList.PickedUp")}>
            <TripLogStatusPill status={TripLogTypesEnum.PICKED_UP} />
          </SupportTableStatusRow>
          <SupportTableStatusRow desc={t("TypeList.Dropped")}>
            <TripLogStatusPill status={TripLogTypesEnum.DROPPED} />
          </SupportTableStatusRow>
          <SupportTableStatusRow desc={t("TypeList.Ended")}>
            <TripLogStatusPill status={TripLogTypesEnum.ENDED} />
          </SupportTableStatusRow>
        </SupportTableWrapper>
      </SupportContentSectionWrapper>
    </>
  )
}

async function CommunicationContent() {
  const t = await getTranslations("Dashboard.SupportBookingsHelp.Communication")
  return (
    <>
      <SupportContentSectionWrapper title={t("Integration.Title")}>
        <RyogoCaption color="slate">
          {t("Integration.Description")}
        </RyogoCaption>
        <RyogoCaption color="slate">{t("Integration.Whatsapp")}</RyogoCaption>
        <RyogoCaption color="slate">{t("Integration.Email")}</RyogoCaption>
        {/* //TODO: Add Booking Chat snapshot */}
        <RyogoImage
          alt="Communication"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Customer.Title")}>
        <RyogoCaption color="slate">{t("Customer.Description")}</RyogoCaption>
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Driver.Title")}>
        <RyogoCaption color="slate">{t("Driver.Description")}</RyogoCaption>
      </SupportContentSectionWrapper>
    </>
  )
}

async function DocumentsContent() {
  const t = await getTranslations("Dashboard.SupportBookingsHelp.Documents")
  return (
    <>
      <SupportContentSectionWrapper title={t("Sharing.Title")}>
        <RyogoCaption color="slate">{t("Sharing.Description")}</RyogoCaption>
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("BookingQuote.Title")}>
        <RyogoCaption color="slate">
          {t("BookingQuote.Description")}
        </RyogoCaption>

        {/* //TODO: Add quote sharing snapshot */}
        <RyogoImage
          alt="Documents"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("BookingConfirm.Title")}>
        <RyogoCaption color="slate">
          {t("BookingConfirm.Description")}
        </RyogoCaption>

        {/* //TODO: Add confirmation sharing snapshot */}
        <RyogoImage
          alt="Documents"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("BookingInvoice.Title")}>
        <RyogoCaption color="slate">
          {t("BookingInvoice.Description")}
        </RyogoCaption>

        {/* //TODO: Add invoice sharing snapshot */}
        <RyogoImage
          alt="Documents"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
      </SupportContentSectionWrapper>
    </>
  )
}
