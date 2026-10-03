import { RyogoBrandButton } from "@/components/buttons/ryogoButtons"
import { SectionColWrapper } from "@/components/page/pageWrappers"
import { RyogoCaption } from "@/components/typography"
import Link from "next/link"

export default function SubscriptionWarningCard({
  warningText,
  ctaText,
}: {
  warningText: string
  ctaText: string
}) {
  return (
    <SectionColWrapper className="border p-4 lg:p-5 rounded-lg items-center justify-center">
      <RyogoCaption color="yellow" className="text-center lg:max-w-3/4">
        {warningText}
      </RyogoCaption>
      <Link href="/dashboard/account/subscription">
        <RyogoBrandButton label={ctaText} />
      </Link>
    </SectionColWrapper>
  )
}
