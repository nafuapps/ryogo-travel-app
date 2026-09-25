import StepsTracker from "@/components/form/stepsTracker"
import {
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import { RyogoH2, RyogoCaption } from "@/components/typography"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { HelpIconButton } from "@/components/flows/support/helpButtons"
import { Route } from "next"
import { RyogoDialogVideo } from "@/components/video/ryogoVideo"

export default function OnboardingStepHeader({
  title,
  stepLabel,
  totalSteps,
  currentStepIndex,
  href,
}: {
  title: string
  stepLabel: string
  totalSteps: number
  currentStepIndex: number
  href: string
}) {
  return (
    <SectionColWrapper small>
      <SectionRowWrapper className="items-center justify-between">
        <RyogoH2>{title}</RyogoH2>
        <SectionRowWrapper className="items-center justify-end">
          <SidebarTrigger className="md:hidden" />
          <RyogoDialogVideo
            src={href}
            title={title}
            className="w-full aspect-video"
          >
            <HelpIconButton href={"" as Route} />
          </RyogoDialogVideo>
        </SectionRowWrapper>
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
