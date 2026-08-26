import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"
import { SectionWrapper } from "@/components/page/pageWrappers"
import { RyogoCaption } from "@/components/typography"
import Link from "next/link"

export default function SubscriptionReminderButton({
  warningText,
  ctaText,
}: {
  warningText: string
  ctaText: string
}) {
  return (
    <SectionWrapper id="SubscribeAction">
      <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-2 lg:gap-3">
        <RyogoCaption color="yellow">{warningText}</RyogoCaption>
        <Link href="/dashboard/account/subscription">
          <RyogoOutlineButton label={ctaText} />
        </Link>
      </div>
    </SectionWrapper>
  )
}
