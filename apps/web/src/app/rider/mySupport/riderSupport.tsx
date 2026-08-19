import { getTranslations } from "next-intl/server"
import {
  DoubleContentWrapper,
  PageWrapper,
  SectionWrapper,
  SideWrapper,
} from "@/components/page/pageWrappers"
import { RyogoCaption, RyogoP } from "@/components/typography"
import SupportCategoryCard from "@/components/flows/support/supportCategoryCard"
import { Car, ChevronRight, Play, Target, Tickets, User } from "lucide-react"
import { Separator } from "@/components/ui/separator"
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
import SupportSectionHeader from "@/components/flows/support/supportSectionHeader"
import {
  SupportFAQWrapper,
  SupportFAQItem,
  SupportFAQItemType,
} from "@/components/flows/support/supportFAQWrapper"

export default async function MySupportPageComponent({
  isPremium,
}: {
  isPremium: boolean
}) {
  const t = await getTranslations("Rider.MySupport")

  const faqItems: SupportFAQItemType[] = [
    {
      question: t("FAQs.GetHelp.Question"),
      answer: t("FAQs.GetHelp.Answer"),
    },
    {
      question: t("FAQs.Learn.Question"),
      answer: t("FAQs.Learn.Answer"),
    },
    {
      question: t("FAQs.Started.Question"),
      answer: t("FAQs.Started.Answer"),
    },
    {
      question: t("FAQs.Account.Question"),
      answer: t("FAQs.Account.Answer"),
    },
    {
      question: t("FAQs.Bookings.Question"),
      answer: t("FAQs.Bookings.Answer"),
    },
    {
      question: t("FAQs.Vehicle.Question"),
      answer: t("FAQs.Vehicle.Answer"),
    },
  ]

  return (
    <DoubleContentWrapper>
      <PageWrapper id="RiderSupportPage" disableScrollInMobile>
        <SupportSectionHeader
          title={t("Title")}
          description={t("Description")}
        />
        <div className="grid gap-5 lg:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          <SupportCategoryCard
            title={t("Started.Title")}
            description={t("Started.Description")}
            icon={Play}
            link={"/rider/mySupport/help-started"}
            highlight
          />
          <SupportCategoryCard
            title={t("Account.Title")}
            description={t("Account.Description")}
            icon={User}
            link={"/rider/mySupport/help-account"}
          />
          <SupportCategoryCard
            title={t("Bookings.Title")}
            description={t("Bookings.Description")}
            icon={Tickets}
            link={"/rider/mySupport/help-bookings"}
            highlight
          />
          <SupportCategoryCard
            title={t("Vehicle.Title")}
            description={t("Vehicle.Description")}
            icon={Car}
            link={"/rider/mySupport/help-vehicle"}
          />
          <SupportCategoryCard
            title={t("Missions.Title")}
            description={t("Missions.Description")}
            icon={Target}
            link={"/rider/mySupport/help-missions"}
          />
          <SupportCategoryCard
            title={t("Videos.Title")}
            description={t("Videos.Description")}
            icon={Play}
            link={"/rider/mySupport/help-videos"}
            highlight
          />
        </div>
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
        <SectionWrapper id="Contact" center>
          <RyogoP weight="font-bold">{t("Contact.Title")}</RyogoP>
          <RyogoCaption color="light" className="text-center">
            {t("Contact.Description")}
          </RyogoCaption>
          <div className="flex flex-col w-full gap-3 lg:gap-4">
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
        <SectionWrapper
          id="Tickets"
          center
          bgColor="bg-slate-950 dark:bg-white"
        >
          {isPremium ? (
            <>
              <RyogoP weight="font-bold" color="white">
                {t("Tickets.Title")}
              </RyogoP>
              <RyogoCaption color="light" className="text-center">
                {t("Tickets.Description")}
              </RyogoCaption>
              <Link href="/rider/mySupport/tickets">
                <Button variant="white">
                  <RyogoCaption color="slate">
                    {t("Tickets.ViewCTA")}
                  </RyogoCaption>
                  <RyogoIcon icon={ChevronRight} size="sm" color="slate" />
                </Button>
              </Link>
            </>
          ) : (
            <>
              <RyogoP weight="font-bold" color="white">
                {t("Tickets.Premium.Title")}
              </RyogoP>
              <RyogoCaption color="light" className="text-center">
                {t("Tickets.Premium.Description")}
              </RyogoCaption>
            </>
          )}
        </SectionWrapper>
      </SideWrapper>
    </DoubleContentWrapper>
  )
}
