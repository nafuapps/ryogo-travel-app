import { SubmitEventHandler } from "react"
import { Button } from "@/components/ui/button"
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

export function OnboardingStepPage(props: {
  pageId: string
  children: React.ReactNode
}) {
  return (
    <div
      id={props.pageId}
      className="flex flex-col gap-4 lg:gap-5 w-full h-full overflow-y-scroll no-scrollbar md:w-1/2 px-8 py-10 md:px-10 md:py-12"
    >
      {props.children}
    </div>
  )
}

export function OnboardingStepHeader(props: {
  headerId: string
  title: string
  stepLabel: string
  totalSteps?: number
  currentStepIndex?: number
}) {
  return (
    <div id={props.headerId} className="flex flex-col gap-1.5 lg:gap-2 w-full">
      <div className="flex flex-row gap-3 justify-between items-center">
        <RyogoH2>{props.title}</RyogoH2>
        <SidebarTrigger className="md:hidden" />
      </div>
      {props.totalSteps !== undefined &&
        props.currentStepIndex !== undefined && (
          <StepsTracker
            steps={props.totalSteps}
            current={props.currentStepIndex}
          />
        )}
      <RyogoCaption color="light" weight="font-bold">
        {props.stepLabel}
      </RyogoCaption>
    </div>
  )
}

export function OnboardingStepForm(props: {
  formId: string
  children: React.ReactNode
  submit?: SubmitEventHandler<HTMLFormElement> | undefined
}) {
  return (
    <form
      id={props.formId}
      onSubmit={props.submit}
      className="flex flex-col gap-4 lg:gap-5 w-full h-full justify-between"
    >
      {props.children}
    </form>
  )
}

export function OnboardingStepContent(props: {
  contentId: string
  children: React.ReactNode
  success?: boolean
}) {
  return (
    <div
      id={props.contentId}
      className={
        props.success
          ? "flex flex-col gap-3 lg:gap-4 w-full items-center text-center my-20 lg:my-24"
          : "flex flex-col gap-3 lg:gap-4 w-full"
      }
    >
      {props.children}
    </div>
  )
}

export function OnboardingStepActions(props: {
  actionsId: string
  children: React.ReactNode
}) {
  return (
    <div
      id={props.actionsId}
      className="flex flex-col gap-3 lg:gap-4 w-full mt-auto justify-end"
    >
      {props.children}
    </div>
  )
}

const buttonClassName = "w-full"
export function OnboardingStepPrimaryAction(props: {
  children: React.ReactNode
  disabled: boolean
}) {
  return (
    <Button
      variant={"default"}
      size={"lg"}
      type="submit"
      className={buttonClassName}
      disabled={props.disabled}
    >
      <RyogoCaption color="white" className="items-center gap-2">
        {props.children}
      </RyogoCaption>
    </Button>
  )
}

export function OnboardingStepSecondaryAction(props: {
  children: React.ReactNode
  disabled?: boolean
  onClick?: () => void
}) {
  return (
    <Button
      variant={"outline"}
      size={"lg"}
      onClick={props.onClick}
      className={buttonClassName}
      disabled={props.disabled}
    >
      <RyogoCaption color="light">{props.children}</RyogoCaption>
    </Button>
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
