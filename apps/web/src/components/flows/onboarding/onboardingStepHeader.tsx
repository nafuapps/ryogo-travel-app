import StepsTracker from "@/components/form/stepsTracker"
import {
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import { RyogoH2, RyogoCaption } from "@/components/typography"
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function OnboardingStepHeader({
  title,
  stepLabel,
  totalSteps,
  currentStepIndex,
}: {
  title: string
  stepLabel: string
  totalSteps: number
  currentStepIndex: number
}) {
  return (
    <SectionColWrapper small>
      <SectionRowWrapper className="items-center">
        <RyogoH2>{title}</RyogoH2>
        <SidebarTrigger className="md:hidden" />
      </SectionRowWrapper>
      <StepsTracker steps={totalSteps} current={currentStepIndex} />
      <SectionColWrapper>
        <RyogoCaption color="light" weight="font-bold">
          {stepLabel}
        </RyogoCaption>
      </SectionColWrapper>
    </SectionColWrapper>
  )
}
