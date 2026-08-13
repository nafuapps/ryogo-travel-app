import { SectionWrapper } from "@/components/page/pageWrappers"
import { RyogoCaption } from "@/components/typography"
import { Button } from "@/components/ui/button"
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
          <Button variant={"outline"}>
            <RyogoCaption color="light">{ctaText}</RyogoCaption>
          </Button>
        </Link>
      </div>
    </SectionWrapper>
  )
}
