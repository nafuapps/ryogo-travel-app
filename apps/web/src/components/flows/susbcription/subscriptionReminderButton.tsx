import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"
import {
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
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
    <SectionWrapper id="SubscribeAction" className="py-3 lg:py-4">
      <SectionRowWrapper className="items-center justify-between">
        <RyogoCaption color="light">{warningText}</RyogoCaption>
        <Link href="/dashboard/account/subscription">
          <RyogoOutlineButton label={ctaText} />
        </Link>
      </SectionRowWrapper>
    </SectionWrapper>
  )
}
