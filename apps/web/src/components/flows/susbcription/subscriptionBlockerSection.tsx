import { RyogoBrandButton } from "@/components/buttons/ryogoButtons"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { SectionWrapper } from "@/components/page/pageWrappers"
import { RyogoSmall, RyogoP } from "@/components/typography"
import { Hourglass } from "lucide-react"
import Link from "next/link"

export default function SubscriptionBlockerSection({
  warningText,
  actionText,
  ctaLabel,
  isOwner,
}: {
  warningText: string
  actionText: string
  ctaLabel?: string
  isOwner?: boolean
}) {
  return (
    <SectionWrapper id="SubscriptionBlockerSection" center>
      <RyogoEnclosedIcon
        icon={Hourglass}
        size="md"
        color="yellow"
        bgColor="yellow"
      />
      <RyogoSmall color="yellow" className="text-center">
        {warningText}
      </RyogoSmall>
      <RyogoP className="text-center">{actionText}</RyogoP>
      {isOwner && ctaLabel && (
        <Link href="/dashboard/account/subscription">
          <RyogoBrandButton size="lg" label={ctaLabel} />
        </Link>
      )}
    </SectionWrapper>
  )
}
