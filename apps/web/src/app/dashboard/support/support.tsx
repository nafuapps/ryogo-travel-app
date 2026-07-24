import { getTranslations } from "next-intl/server"
import { SectionWrapper, PageWrapper } from "@/components/page/pageWrappers"
import RyogoChatButton from "@/components/buttons/chat/ryogoChatButton"
import RyogoMailButton from "@/components/buttons/mail/ryogoMailButton"
import RyogoPhoneButton from "@/components/buttons/phone/ryogoPhoneButton"
import { FAQWrapper, FAQItem } from "@/components/flows/landing/faqWrapper"
import SupportCategoryCard from "@/components/flows/support/supportCategoryCard"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoP, RyogoSmall, RyogoCaption } from "@/components/typography"
import {
  SUPPORT_HELPLINE_NUMBER,
  SUPPORT_CHAT_NUMBER,
  SUPPORT_EMAIL,
} from "@/lib/uiConfig"
import { Play, User, Car, Tickets, ChevronRight } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function SupportPageComponent({
  isOwner,
  isPremium,
}: {
  isOwner: boolean
  isPremium: boolean
}) {
  const t = await getTranslations("Dashboard.Support")

  return (
    <PageWrapper id="DashboardSupportPage">
      <RyogoP className="mx-auto text-center mt-4 lg:mt-5">{t("Title")}</RyogoP>
      <RyogoSmall color="light" className="mx-auto text-center mb-4 lg:mb-5">
        {t("Description")}
      </RyogoSmall>
      <div className="grid gap-5 lg:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        <SupportCategoryCard
          title={t("Started.Title")}
          description={t("Started.Description")}
          icon={Play}
          link={"/dashboard/support/help-started"}
        />
        <SupportCategoryCard
          title={t("Account.Title")}
          description={t("Account.Description")}
          icon={User}
          link={"/dashboard/support/help-account"}
        />
        <SupportCategoryCard
          title={t("Bookings.Title")}
          description={t("Bookings.Description")}
          icon={Tickets}
          link={"/dashboard/support/help-bookings"}
        />
        <SupportCategoryCard
          title={t("Vehicles.Title")}
          description={t("Vehicles.Description")}
          icon={Car}
          link={"/dashboard/support/help-vehicles"}
        />
        <SupportCategoryCard
          title={t("Drivers.Title")}
          description={t("Drivers.Description")}
          icon={Car}
          link={"/dashboard/support/help-drivers"}
        />
        <SupportCategoryCard
          title={t("Customers.Title")}
          description={t("Customers.Description")}
          icon={Car}
          link={"/dashboard/support/help-customers"}
        />
        {isOwner && (
          <SupportCategoryCard
            title={t("Users.Title")}
            description={t("Users.Description")}
            icon={Car}
            link={"/dashboard/support/help-users"}
          />
        )}
        {isOwner && (
          <SupportCategoryCard
            title={t("Analytics.Title")}
            description={t("Analytics.Description")}
            icon={Car}
            link={"/dashboard/support/help-analytics"}
          />
        )}
        <SupportCategoryCard
          title={t("Missions.Title")}
          description={t("Missions.Description")}
          icon={User}
          link={"/dashboard/support/help-missions"}
        />
        <SupportCategoryCard
          title={t("Videos.Title")}
          description={t("Videos.Description")}
          icon={User}
          link={"/dashboard/support/help-videos"}
        />
      </div>
      <Separator />
      <RyogoP className="mx-auto text-center mt-4 lg:mt-5">
        {t("FAQs.Title")}
      </RyogoP>
      <RyogoSmall color="light" className="mx-auto text-center mb-4 lg:mb-5">
        {t("FAQs.Description")}
      </RyogoSmall>
      <FAQWrapper>
        <FAQItem
          question={t("FAQs.Q1.Question")}
          answer={t("FAQs.Q1.Answer")}
        />
        <FAQItem
          question={t("FAQs.Q2.Question")}
          answer={t("FAQs.Q2.Answer")}
        />
        <FAQItem
          question={t("FAQs.Q3.Question")}
          answer={t("FAQs.Q3.Answer")}
        />
      </FAQWrapper>
      <Separator />
      <SectionWrapper id="Contact" center>
        <RyogoP>{t("Contact.Title")}</RyogoP>
        <RyogoSmall color="light" className="text-center">
          {t("Contact.Description")}
        </RyogoSmall>
        <div className="flex flex-col lg:flex-row w-full lg:items-center lg:justify-center gap-3 lg:gap-4">
          <RyogoPhoneButton
            label={t("Contact.CallCTA")}
            phone={SUPPORT_HELPLINE_NUMBER}
          />
          <RyogoChatButton
            label={t("Contact.ChatCTA")}
            phone={SUPPORT_CHAT_NUMBER}
          />
          <RyogoMailButton
            label={t("Contact.EmailCTA")}
            email={SUPPORT_EMAIL}
          />
        </div>
      </SectionWrapper>
      {isPremium && (
        <SectionWrapper id="Tickets" center>
          <RyogoP>{t("Tickets.Title")}</RyogoP>
          <RyogoSmall color="light">{t("Tickets.Description")}</RyogoSmall>
          <Link href="/dashboard/support/tickets">
            <Button variant="outline">
              <RyogoCaption>{t("Tickets.ViewCTA")}</RyogoCaption>
              <RyogoIcon icon={ChevronRight} size="sm" />
            </Button>
          </Link>
        </SectionWrapper>
      )}
    </PageWrapper>
  )
}
