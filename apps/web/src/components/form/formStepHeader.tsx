import StepsTracker from "@/components/form/stepsTracker"
import {
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import { RyogoH3, RyogoCaption, RyogoSmall } from "@/components/typography"

export default function FormStepHeader({
  title,
  stepLabel,
  totalSteps,
  currentStepIndex,
  description,
}: {
  title: string
  stepLabel: string
  totalSteps: number
  currentStepIndex: number
  description?: string
}) {
  return (
    <SectionColWrapper small>
      <SectionRowWrapper center small>
        <RyogoH3>{title}</RyogoH3>
        <RyogoCaption color="light" weight="font-bold">
          {stepLabel}
        </RyogoCaption>
      </SectionRowWrapper>
      <StepsTracker steps={totalSteps} current={currentStepIndex} />
      {description && <RyogoSmall color="light">{description}</RyogoSmall>}
    </SectionColWrapper>
  )
}
