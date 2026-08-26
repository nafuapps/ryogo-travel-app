import RyogoChatButton from "@/components/buttons/chat/ryogoChatButton"
import RyogoMailButton from "@/components/buttons/mail/ryogoMailButton"
import RyogoPhoneButton from "@/components/buttons/phone/ryogoPhoneButton"
import { RyogoWhiteButton } from "@/components/buttons/ryogoButtons"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { SectionWrapper, SideWrapper } from "@/components/page/pageWrappers"
import { RyogoP, RyogoCaption } from "@/components/typography"
import {
  SUPPORT_HELPLINE_NUMBER,
  SUPPORT_CHAT_NUMBER,
  SUPPORT_EMAIL,
} from "@/lib/uiConfig"
import { ChevronRight } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

export default async function SupportSideComponent({
  isOwner,
  isPremium,
}: {
  isOwner: boolean
  isPremium: boolean
}) {
  const t = await getTranslations("Dashboard.Support")

  return (
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
      <SectionWrapper id="Tickets" center bgColor="bg-slate-900 dark:bg-white">
        {isPremium ? (
          <>
            <RyogoP weight="font-bold" color="white">
              {t("Tickets.Title")}
            </RyogoP>
            <RyogoCaption color="white" className="text-center">
              {t("Tickets.Description")}
            </RyogoCaption>
            <Link href="/dashboard/support/tickets">
              <RyogoWhiteButton label={t("Tickets.ViewCTA")}>
                <RyogoIcon icon={ChevronRight} size="sm" color="slate" />
              </RyogoWhiteButton>
            </Link>
          </>
        ) : (
          <>
            <RyogoP weight="font-bold" color="white">
              {t("Tickets.Premium.Title")}
            </RyogoP>
            <RyogoCaption color="white" className="text-center">
              {t("Tickets.Premium.Description")}
            </RyogoCaption>
            {isOwner && (
              <Link href="/dashboard/account/subscription">
                <RyogoWhiteButton label={t("Tickets.Premium.CTA")}>
                  <RyogoIcon
                    icon={ChevronRight}
                    size="sm"
                    color="slate"
                    thick
                  />
                </RyogoWhiteButton>
              </Link>
            )}
          </>
        )}
      </SectionWrapper>
    </SideWrapper>
  )
}
