import { getTranslations } from "next-intl/server"
import { PageWrapper, SectionWrapper } from "@/components/page/pageWrappers"
import { RyogoCaption, RyogoP, RyogoSmall } from "@/components/typography"
import SupportCategoryCard from "@/components/flows/support/supportCategoryCard"
import { Car, ChevronRight, Play, Plus, Tickets, User } from "lucide-react"
import { UrlObject } from "url"
import { Separator } from "@/components/ui/separator"
import { FAQItem, FAQWrapper } from "@/components/flows/landing/faqWrapper"
import RyogoPhoneButton from "@/components/buttons/phone/ryogoPhoneButton"
import {
  SUPPORT_CHAT_NUMBER,
  SUPPORT_EMAIL,
  SUPPORT_HELPLINE_NUMBER,
} from "@/lib/uiConfig"
import RyogoChatButton from "@/components/buttons/chat/ryogoChatButton"
import RyogoMailButton from "@/components/buttons/mail/ryogoMailButton"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { RyogoIcon } from "@/components/icons/ryogoIcon"

export default async function MySupportPageComponent({
  isPremium,
}: {
  isPremium: boolean
}) {
  const t = await getTranslations("Rider.MySupport")

  return (
    <PageWrapper id="RiderSupportPage">
      <RyogoP>{t("Title")}</RyogoP>
      <RyogoSmall color="light">{t("Description")}</RyogoSmall>
      <div className="grid gap-5 lg:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        <SupportCategoryCard
          title={t("Started.Title")}
          description={t("Started.Description")}
          icon={Play}
          link={"/rider/mySupport/help-started" as any as UrlObject}
        />
        <SupportCategoryCard
          title={t("Account.Title")}
          description={t("Account.Description")}
          icon={User}
          link={"/rider/mySupport/help-account" as any as UrlObject}
        />
        <SupportCategoryCard
          title={t("Vehicle.Title")}
          description={t("Vehicle.Description")}
          icon={Car}
          link={"/rider/mySupport/help-vehicle" as any as UrlObject}
        />
        <SupportCategoryCard
          title={t("Bookings.Title")}
          description={t("Bookings.Description")}
          icon={Tickets}
          link={"/rider/mySupport/help-bookings" as any as UrlObject}
        />
        <SupportCategoryCard
          title={t("Missions.Title")}
          description={t("Missions.Description")}
          icon={User}
          link={"/rider/mySupport/help-missions" as any as UrlObject}
        />
        <SupportCategoryCard
          title={t("Videos.Title")}
          description={t("Videos.Description")}
          icon={User}
          link={"/rider/mySupport/help-videos" as any as UrlObject}
        />
      </div>
      <Separator />
      <RyogoP>{t("FAQs.Title")}</RyogoP>
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
        <RyogoSmall color="light">{t("Contact.Description")}</RyogoSmall>
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
          <Link href="/rider/mySupport/tickets">
            <Button>
              <RyogoCaption color="white">{t("Tickets.ViewCTA")}</RyogoCaption>
              <RyogoIcon icon={ChevronRight} size="sm" color="white" />
            </Button>
          </Link>
          <Link href="/rider/mySupport/tickets/add">
            <Button variant={"outline"}>
              <RyogoIcon icon={Plus} size="sm" />
              <RyogoCaption>{t("Tickets.CreateCTA")}</RyogoCaption>
            </Button>
          </Link>
        </SectionWrapper>
      )}
    </PageWrapper>
  )
}
