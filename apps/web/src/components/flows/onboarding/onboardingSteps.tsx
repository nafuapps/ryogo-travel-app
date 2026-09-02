import { SubmitEventHandler } from "react"
import { Check } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { RyogoCaption, RyogoH2 } from "@/components/typography"
import StepsTracker from "@/components/form/stepsTracker"

export const CreateAccountTotalSteps = 5
export const VerifyAccountTotalSteps = 1
export const AddVehicleTotalSteps = 5
export const AddDriverTotalSteps = 4
export const AddAgentTotalSteps = 2

export function OnboardingStepPage({
  pageId,
  children,
}: {
  pageId: string
  children: React.ReactNode
}) {
  return (
    <div
      id={pageId}
      className="flex flex-col gap-4 lg:gap-5 w-full h-full overflow-y-scroll no-scrollbar md:w-1/2 px-8 py-10 md:px-10 md:py-12"
    >
      {children}
    </div>
  )
}

export function OnboardingStepHeader({
  headerId,
  title,
  stepLabel,
  totalSteps,
  currentStepIndex,
}: {
  headerId: string
  title: string
  stepLabel: string
  totalSteps?: number
  currentStepIndex?: number
}) {
  return (
    <div id={headerId} className="flex flex-col gap-1.5 lg:gap-2 w-full">
      <div className="flex flex-row gap-3 justify-between items-center">
        <RyogoH2>{title}</RyogoH2>
        <SidebarTrigger className="md:hidden" />
      </div>
      {totalSteps !== undefined && currentStepIndex !== undefined && (
        <StepsTracker steps={totalSteps} current={currentStepIndex} />
      )}
      <RyogoCaption color="light" weight="font-bold">
        {stepLabel}
      </RyogoCaption>
    </div>
  )
}

export function OnboardingStepForm({
  formId,
  children,
  submit,
}: {
  formId: string
  children: React.ReactNode
  submit?: SubmitEventHandler<HTMLFormElement> | undefined
}) {
  return (
    <form
      id={formId}
      onSubmit={submit}
      className="flex flex-col gap-4 lg:gap-5 w-full h-full justify-between"
    >
      {children}
    </form>
  )
}

export function OnboardingStepContent({
  contentId,
  children,
  success,
}: {
  contentId: string
  children: React.ReactNode
  success?: boolean
}) {
  return (
    <div
      id={contentId}
      className={
        success
          ? "flex flex-col gap-3 lg:gap-4 w-full items-center text-center my-20 lg:my-24"
          : "flex flex-col gap-3 lg:gap-4 w-full"
      }
    >
      {children}
    </div>
  )
}

export function OnboardingStepActions({
  actionsId,
  children,
}: {
  actionsId: string
  children: React.ReactNode
}) {
  return (
    <div
      id={actionsId}
      className="flex flex-col gap-3 lg:gap-4 w-full mt-auto justify-end"
    >
      {children}
    </div>
  )
}

export function OnboardingSuccessIcon() {
  return (
    <RyogoEnclosedIcon
      icon={Check}
      size="md"
      color="white"
      bgColor="black"
      circular
    />
  )
}
