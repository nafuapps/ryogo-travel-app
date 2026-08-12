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
  ChevronRight,
  PhoneCall,
  Plus,
  SquarePen,
  Telescope,
  Tickets,
  UserRoundPlus,
  UserRoundSearch,
} from "lucide-react"
import { getTranslations } from "next-intl/server"
import { pageTitle, pageDescription } from "@/components/page/pageCommons"
import { Metadata } from "next"
import SupportContentCTALinkButton from "@/components/flows/support/supportContentCTALink"
import { RyogoImage } from "@/components/images/ryogoImage"
import {
  SupportTableWrapper,
  SupportTableStatusRow,
} from "@/components/flows/support/supportTableWrapper"
import { CustomerStatusPill } from "@/components/pills/ryogoPills"
import { CustomerStatusEnum } from "@ryogo-travel-app/db/schema"
import SupportRelatedArticleLinkButton, {
  SupportRelatedArticleType,
} from "@/components/flows/support/supportRelatedArticleType"

/*
  - Details
  - Adding
  - Modifying
  - Communication
  - Search
  - 
*/

export const metadata: Metadata = {
  title: `Customers Help - ${pageTitle}`,
  description: pageDescription,
}

export default async function SupportHelpCustomersPage() {
  const t = await getTranslations("Dashboard.SupportCustomersHelp")

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
      id: "bookings",
      title: t("Bookings.Title"),
      icon: Tickets,
      content: <BookingsContent />,
    },
    {
      id: "communication",
      title: t("Communication.Title"),
      icon: PhoneCall,
      content: <CommunicationContent />,
    },
    {
      id: "search",
      title: t("Search.Title"),
      icon: UserRoundSearch,
      content: <SearchContent />,
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
      label: t("RelatedArticles.Bookings"),
      href: "/dashboard/support/help-bookings",
    },
    {
      label: t("RelatedArticles.Videos"),
      href: "/dashboard/support/help-videos",
    },
  ]

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/support/help-customers"} />
      <DoubleContentWrapper sideOnTop>
        <PageWrapper id="SupportHelpCustomersPage" disableScrollInMobile>
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
          <SupportSideAccordionWrapper label={t("RelatedArticles.Title")}>
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
  const t = await getTranslations("Dashboard.SupportCustomersHelp.Overview")
  return (
    <>
      <SupportContentSectionWrapper title={t("KnowCustomer.Title")}>
        <RyogoCaption color="slate">
          {t("KnowCustomer.Description")}
        </RyogoCaption>
        <RyogoCaption color="slate">
          {t("KnowCustomer.AllCustomers")}
        </RyogoCaption>
        {/* //TODO: Add all customers page snapshot */}
        <RyogoImage
          alt="Customers overview"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
        <SupportContentCTALinkButton
          href={"/dashboard/customers"}
          label={t("KnowCustomer.CTA")}
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("CustomerDetails.Title")}>
        <RyogoCaption color="slate">
          {t("CustomerDetails.Description")}
        </RyogoCaption>
        <RyogoCaption color="slate">
          {t("CustomerDetails.Elements")}
        </RyogoCaption>
        {/* //TODO: Add customer details page snapshot */}
        <RyogoImage
          alt="Customer details"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("StatusList.Title")}>
        <RyogoCaption color="slate">{t("StatusList.Description")}</RyogoCaption>
        <SupportTableWrapper label={t("StatusList.Caption")}>
          <SupportTableStatusRow desc={t("StatusList.Active")}>
            <CustomerStatusPill status={CustomerStatusEnum.ACTIVE} />
          </SupportTableStatusRow>
          <SupportTableStatusRow desc={t("StatusList.Inactive")}>
            <CustomerStatusPill status={CustomerStatusEnum.INACTIVE} />
          </SupportTableStatusRow>
          <SupportTableStatusRow desc={t("StatusList.Suspended")}>
            <CustomerStatusPill status={CustomerStatusEnum.SUSPENDED} />
          </SupportTableStatusRow>
        </SupportTableWrapper>
      </SupportContentSectionWrapper>
    </>
  )
}
async function AddingContent() {
  const t = await getTranslations("Dashboard.SupportCustomersHelp.Adding")
  return (
    <>
      <SupportContentSectionWrapper title={t("AddingCustomer.Title")}>
        <RyogoCaption color="slate">
          {t("AddingCustomer.Description")}
        </RyogoCaption>
        {/* //TODO: Add New customer page snapshot */}
        <RyogoImage
          alt="Add Customer"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
        <SupportContentCTALinkButton
          href={"/dashboard/customers/new"}
          label={t("AddingCustomer.CTA")}
        />
      </SupportContentSectionWrapper>
      <SupportContentSectionWrapper title={t("AddingInBooking.Title")}>
        <RyogoCaption color="slate">
          {t("AddingInBooking.Description")}
        </RyogoCaption>
        <RyogoCaption color="slate">
          {t("AddingInBooking.Required")}
        </RyogoCaption>
        {/* //TODO: Add New booking - new customer page snapshot */}
        <RyogoImage
          alt="Create Customer - New booking"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
      </SupportContentSectionWrapper>
    </>
  )
}
async function EditingContent() {
  const t = await getTranslations("Dashboard.SupportCustomersHelp.Editing")
  return (
    <SupportContentSectionWrapper title={t("EditingCustomer.Title")}>
      <RyogoCaption color="slate">
        {t("EditingCustomer.Description")}
      </RyogoCaption>
      {/* //TODO: Add Modify customer page snapshot */}
      <RyogoImage
        alt="Edit Customer"
        imageSize="xl"
        src="/logoPWA.png"
        className="self-center"
      />
    </SupportContentSectionWrapper>
  )
}
async function BookingsContent() {
  const t = await getTranslations("Dashboard.SupportCustomersHelp.Bookings")
  return (
    <>
      <SupportContentSectionWrapper title={t("UpcomingBookings.Title")}>
        <RyogoCaption color="slate">
          {t("UpcomingBookings.Description")}
        </RyogoCaption>
        {/* //TODO: Add Upcoming Bookings page snapshot */}
        <RyogoImage
          alt="Customer UpcomingBookings"
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
          alt="Customer CompletedBookings"
          imageSize="xl"
          src="/logoPWA.png"
          className="self-center"
        />
      </SupportContentSectionWrapper>
    </>
  )
}
async function CommunicationContent() {
  const t = await getTranslations(
    "Dashboard.SupportCustomersHelp.Communication",
  )
  return (
    <SupportContentSectionWrapper title={t("ContactingCustomer.Title")}>
      <RyogoCaption color="slate">
        {t("ContactingCustomer.Description")}
      </RyogoCaption>
      <RyogoCaption color="slate">
        {t("ContactingCustomer.Contact")}
      </RyogoCaption>
      {/* //TODO: Add Connect with customer page snapshot */}
      <RyogoImage
        alt="Contact Customer"
        imageSize="xl"
        src="/logoPWA.png"
        className="self-center"
      />
    </SupportContentSectionWrapper>
  )
}
async function SearchContent() {
  const t = await getTranslations("Dashboard.SupportCustomersHelp.Search")
  return (
    <SupportContentSectionWrapper title={t("SearchingCustomer.Title")}>
      <RyogoCaption color="slate">
        {t("SearchingCustomer.Description")}
      </RyogoCaption>
      {/* //TODO: Add Search customer page snapshot */}
      <RyogoImage
        alt="Search Customer"
        imageSize="xl"
        src="/logoPWA.png"
        className="self-center"
      />
    </SupportContentSectionWrapper>
  )
}
