import { HelpIconButton } from "@/components/flows/support/helpButtons"
import StepsTracker from "@/components/form/stepsTracker"
import {
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import { RyogoCaption, RyogoH3, RyogoTiny } from "@/components/typography"

export default function FormStepHeader({
  title,
  stepLabel,
  totalSteps,
  currentStepIndex,
  description,
  href,
}: {
  title: string
  stepLabel: string
  totalSteps: number
  currentStepIndex: number
  description: string
  href: React.ComponentProps<typeof HelpIconButton>["href"]
}) {
  return (
    <SectionColWrapper small>
      <SectionRowWrapper small className="items-center justify-between">
        <RyogoH3>{title}</RyogoH3>
        <HelpIconButton href={href} />
      </SectionRowWrapper>
      <StepsTracker steps={totalSteps} current={currentStepIndex} />
      <SectionRowWrapper small className="items-start justify-between">
        <RyogoCaption color="light">{description}</RyogoCaption>
        <RyogoTiny color="light" weight="font-bold">
          {stepLabel}
        </RyogoTiny>
      </SectionRowWrapper>
    </SectionColWrapper>
  )
}
