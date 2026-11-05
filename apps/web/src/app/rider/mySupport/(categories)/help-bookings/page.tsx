import SupportContentCTALinkButton from "@/components/flows/support/supportContentCTALink"
import SupportContentHeader, {
  SupportContentSectionWrapper,
} from "@/components/flows/support/supportContentHeader"
import {
  SupportFAQItem,
  SupportFAQItemType,
  SupportFAQWrapper,
} from "@/components/flows/support/supportFAQWrapper"
import {
  SupportListItem,
  SupportListWrapper,
} from "@/components/flows/support/supportListWrapper"
import SupportQuickActionLinkButton, {
  SupportQuickActionType,
} from "@/components/flows/support/supportQuickActionLink"
import SupportRelatedArticleLinkButton, {
  SupportRelatedArticleType,
} from "@/components/flows/support/supportRelatedArticleType"
import SupportSectionHeader from "@/components/flows/support/supportSectionHeader"
import SupportSideAccordionWrapper from "@/components/flows/support/supportSideAccordionWrapper"
import SupportTableOfContentLinkButton, {
  SupportContentItemType,
} from "@/components/flows/support/supportTableOfContentLink"
import {
  SupportTableStatusRow,
  SupportTableTextRow,
  SupportTableWrapper,
} from "@/components/flows/support/supportTableWrapper"
import { SupportWarningWrapper } from "@/components/flows/support/supportWarningWrapper"
import RiderHeader from "@/components/header/riderHeader"
import ExpenseIcon from "@/components/icons/expenseIcon"
import { RyogoImage } from "@/components/images/ryogoImage"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import {
  DoubleContentWrapper,
  MainWrapper,
  PageWrapper,
  SectionWrapper,
  SideWrapper,
} from "@/components/page/pageWrappers"
import {
  BookingStatusPill,
  TripLogStatusPill,
} from "@/components/pills/ryogoPills"
import { RyogoCaption } from "@/components/typography"
import { Separator } from "@/components/ui/separator"
import { RyogoSupportVideo } from "@/components/video/ryogoVideo"
import {
  BookingStatusEnum,
  ExpenseTypesEnum,
  TripLogTypesEnum,
} from "@ryogo-travel-app/db/schema"
import {
  BanknoteArrowDown,
  CalendarCheck,
  ChevronRight,
  ClipboardCopy,
  Logs,
  PhoneCall,
  Tickets,
  Waypoints,
} from "lucide-react"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

/*
  - Booking Overview
  - Assignment (How to get booking)
  - Execution of a Booking
  - Completed Bookings
  - Expenses
  - Trip logs
  - Communication
*/

export const metadata: Metadata = {
  title: `My Bookings Help - ${pageTitle}`,
  description: pageDescription,
}

export default async function MySupportHelpBookingsPage() {
  const t = await getTranslations("Rider.MySupportBookingsHelp")

  const contentItems: SupportContentItemType[] = [
    {
      id: "overview",
      title: t("Overview.Title"),
      icon: Tickets,
      content: <OverviewContent />,
    },
    {
      id: "assignment",
      title: t("Assignment.Title"),
      icon: ClipboardCopy,
      content: <AssignmentContent />,
    },
    {
      id: "execution",
      title: t("Execution.Title"),
      icon: Waypoints,
      content: <ExecutionContent />,
    },
    {
      id: "completed",
      title: t("Completed.Title"),
      icon: CalendarCheck,
      content: <CompletedContent />,
    },
    {
      id: "expenses",
      title: t("Expenses.Title"),
      icon: BanknoteArrowDown,
      content: <ExpensesContent />,
    },
    {
      id: "tripLogs",
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
  ]

  const faqItems: SupportFAQItemType[] = [
    {
      question: t("FAQs.Reassign.Question"),
      answer: t("FAQs.Reassign.Answer"),
    },
    {
      question: t("FAQs.Expenses.Question"),
      answer: t("FAQs.Expenses.Answer"),
    },
    {
      question: t("FAQs.Odometer.Question"),
      answer: t("FAQs.Odometer.Answer"),
    },
  ]

  const quickActions: SupportQuickActionType[] = [
    {
      label: t("QuickActions.AllBookings"),
      href: "/rider/myBookings",
      icon: ChevronRight,
    },
  ]

  const relatedArticles: SupportRelatedArticleType[] = [
    {
      label: t("RelatedArticles.Vehicle"),
      href: "/rider/mySupport/help-vehicle",
    },
    {
      label: t("RelatedArticles.Missions"),
      href: "/rider/mySupport/help-missions",
    },
  ]
  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/mySupport/help-bookings"} />
      <DoubleContentWrapper sideOnTop>
        <PageWrapper id="MySupportHelpBookingsPage" disableScrollInMobile>
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
  const t = await getTranslations("Rider.MySupportBookingsHelp.Overview")
  return (
    <>
      <SupportContentSectionWrapper title={t("WhatIsBooking.Title")}>
        <RyogoCaption color="slate">
          {t("WhatIsBooking.Description")}
        </RyogoCaption>
        <RyogoSupportVideo src="/rider/booking_details.webm" mobile />
        <SupportContentCTALinkButton
          href={"/rider/myBookings"}
          label={t("WhatIsBooking.CTA")}
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Elements.Title")}>
        <RyogoCaption color="slate">{t("Elements.Description")}</RyogoCaption>
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

async function AssignmentContent() {
  const t = await getTranslations("Rider.MySupportBookingsHelp.Assignment")
  return (
    <>
      <SupportContentSectionWrapper title={t("BookingAssignment.Title")}>
        <RyogoCaption color="slate">
          {t("BookingAssignment.Description")}
        </RyogoCaption>
        <RyogoSupportVideo src="/rider/upcoming.webm" mobile />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("CurrentBooking.Title")}>
        <RyogoCaption color="slate">
          {t("CurrentBooking.Description")}
        </RyogoCaption>
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("UpcomingBookings.Title")}>
        <RyogoCaption color="slate">
          {t("UpcomingBookings.Description")}
        </RyogoCaption>
      </SupportContentSectionWrapper>
    </>
  )
}
async function ExecutionContent() {
  const t = await getTranslations("Rider.MySupportBookingsHelp.Execution")
  return (
    <>
      <SupportContentSectionWrapper title={t("AccessingCurrent.Title")}>
        <RyogoCaption color="slate">
          {t("AccessingCurrent.Description")}
        </RyogoCaption>
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Steps.Title")}>
        <RyogoCaption color="slate">{t("Steps.Description")}</RyogoCaption>
        <SupportTableWrapper label={t("Steps.Caption")}>
          <SupportTableStatusRow desc={t("Steps.Started")}>
            <TripLogStatusPill status={TripLogTypesEnum.STARTED} />
          </SupportTableStatusRow>
          <SupportTableStatusRow desc={t("Steps.Arrived")}>
            <TripLogStatusPill status={TripLogTypesEnum.ARRIVED} />
          </SupportTableStatusRow>
          <SupportTableStatusRow desc={t("Steps.PickedUp")}>
            <TripLogStatusPill status={TripLogTypesEnum.PICKED_UP} />
          </SupportTableStatusRow>
          <SupportTableStatusRow desc={t("Steps.Dropped")}>
            <TripLogStatusPill status={TripLogTypesEnum.DROPPED} />
          </SupportTableStatusRow>
          <SupportTableStatusRow desc={t("Steps.Ended")}>
            <TripLogStatusPill status={TripLogTypesEnum.ENDED} />
          </SupportTableStatusRow>
          <SupportTableStatusRow desc={t("Steps.Other")}>
            <TripLogStatusPill status={TripLogTypesEnum.OTHER} />
          </SupportTableStatusRow>
        </SupportTableWrapper>
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("StartTrip.Title")}>
        <RyogoCaption color="slate">{t("StartTrip.Description")}</RyogoCaption>
        <RyogoCaption color="slate">{t("StartTrip.Input")}</RyogoCaption>
        <RyogoSupportVideo src="/rider/start_trip.webm" mobile />

        <SupportWarningWrapper text={t("StartTrip.Warning")} />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Arrived.Title")}>
        <RyogoCaption color="slate">{t("Arrived.Description")}</RyogoCaption>
        <RyogoCaption color="slate">{t("Arrived.Input")}</RyogoCaption>
        <RyogoSupportVideo src="/rider/arrived.webm" mobile />

        <SupportWarningWrapper text={t("Arrived.Warning")} />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("PickedUp.Title")}>
        <RyogoCaption color="slate">{t("PickedUp.Description")}</RyogoCaption>
        <RyogoCaption color="slate">{t("PickedUp.Input")}</RyogoCaption>
        <RyogoSupportVideo src="/rider/pickedUp.webm" mobile />

        <SupportWarningWrapper text={t("PickedUp.Warning")} />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Dropped.Title")}>
        <RyogoCaption color="slate">{t("Dropped.Description")}</RyogoCaption>
        <RyogoCaption color="slate">{t("Dropped.Input")}</RyogoCaption>
        <RyogoSupportVideo src="/rider/dropped.webm" mobile />

        <SupportWarningWrapper text={t("Dropped.Warning")} />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("Ended.Title")}>
        <RyogoCaption color="slate">{t("Ended.Description")}</RyogoCaption>
        <RyogoCaption color="slate">{t("Ended.Input")}</RyogoCaption>
        <RyogoCaption color="slate">{t("Ended.Rating")}</RyogoCaption>
        <RyogoSupportVideo src="/rider/end_trip.webm" mobile />

        <SupportWarningWrapper text={t("Ended.Warning")} />
      </SupportContentSectionWrapper>
    </>
  )
}
async function CompletedContent() {
  const t = await getTranslations("Rider.MySupportBookingsHelp.Completed")
  return (
    <SupportContentSectionWrapper title={t("CompletedBookings.Title")}>
      <RyogoCaption color="slate">
        {t("CompletedBookings.Description")}
      </RyogoCaption>
      <RyogoSupportVideo src="/rider/completed.webm" mobile />
    </SupportContentSectionWrapper>
  )
}
async function ExpensesContent() {
  const t = await getTranslations("Rider.MySupportBookingsHelp.Expenses")
  return (
    <>
      <SupportContentSectionWrapper title={t("WhatIsExpense.Title")}>
        <RyogoCaption color="slate">
          {t("WhatIsExpense.Definition")}
        </RyogoCaption>
        <RyogoCaption color="slate">
          {t("WhatIsExpense.Description")}
        </RyogoCaption>
        <RyogoSupportVideo src="/rider/expenses.webm" mobile />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("AddingExpense.Title")}>
        <RyogoCaption color="slate">
          {t("AddingExpense.Description")}
        </RyogoCaption>
        <RyogoCaption color="slate">{t("AddingExpense.Process")}</RyogoCaption>
        <RyogoSupportVideo src="/rider/add_expense.webm" mobile />

        <SupportWarningWrapper text={t("AddingExpense.Warning")} />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("ModifyingExpense.Title")}>
        <RyogoCaption color="slate">
          {t("ModifyingExpense.Description")}
        </RyogoCaption>
        <RyogoSupportVideo src="/rider/expense_edit.webm" mobile />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("ExpenseTypes.Title")}>
        <RyogoCaption color="slate">
          {t("ExpenseTypes.Description")}
        </RyogoCaption>
        <SupportListWrapper>
          <SupportListItem label={t("ExpenseTypes.Fuel")}>
            <ExpenseIcon type={ExpenseTypesEnum.FUEL} size="sm" />
          </SupportListItem>
          <SupportListItem label={t("ExpenseTypes.Toll")}>
            <ExpenseIcon type={ExpenseTypesEnum.TOLL} size="sm" />
          </SupportListItem>
          <SupportListItem label={t("ExpenseTypes.Parking")}>
            <ExpenseIcon type={ExpenseTypesEnum.PARKING} size="sm" />
          </SupportListItem>
          <SupportListItem label={t("ExpenseTypes.Maintenance")}>
            <ExpenseIcon type={ExpenseTypesEnum.MAINTENANCE} size="sm" />
          </SupportListItem>
          <SupportListItem label={t("ExpenseTypes.AC")}>
            <ExpenseIcon type={ExpenseTypesEnum.AC} size="sm" />
          </SupportListItem>
          <SupportListItem label={t("ExpenseTypes.Food")}>
            <ExpenseIcon type={ExpenseTypesEnum.FOOD} size="sm" />
          </SupportListItem>
          <SupportListItem label={t("ExpenseTypes.Other")}>
            <ExpenseIcon type={ExpenseTypesEnum.OTHER} size="sm" />
          </SupportListItem>
        </SupportListWrapper>
      </SupportContentSectionWrapper>
    </>
  )
}

async function TripLogsContent() {
  const t = await getTranslations("Rider.MySupportBookingsHelp.TripLogs")
  return (
    <>
      <SupportContentSectionWrapper title={t("WhatIsTripLog.Title")}>
        <RyogoCaption color="slate">
          {t("WhatIsTripLog.Definition")}
        </RyogoCaption>
        <RyogoCaption color="slate">
          {t("WhatIsTripLog.Description")}
        </RyogoCaption>
        <RyogoSupportVideo src="/rider/tripLogs.webm" mobile />
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
  const t = await getTranslations("Rider.MySupportBookingsHelp.Communication")
  return (
    <>
      <SupportContentSectionWrapper title={t("Integration.Title")}>
        <RyogoCaption color="slate">
          {t("Integration.Description")}
        </RyogoCaption>
        <RyogoCaption color="slate">{t("Integration.Whatsapp")}</RyogoCaption>
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
      <SupportContentSectionWrapper title={t("Agency.Title")}>
        <RyogoCaption color="slate">{t("Agency.Description")}</RyogoCaption>
      </SupportContentSectionWrapper>
    </>
  )
}
