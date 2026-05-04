import { SubmitEventHandler } from "react"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"

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
  children: React.ReactNode
}) {
  return (
    <div id={props.headerId} className="flex flex-col gap-1.5 lg:gap-2 w-full">
      {props.children}
    </div>
  )
}

export function OnboardingStepHeaderTopLine(props: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-row gap-3 justify-between items-center">
      {props.children}
      <SidebarTrigger className="md:hidden" />
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

const buttonClassName = "flex flex-row justify-center items-center gap-4 w-full"
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
      {props.children}
    </Button>
  )
}

export type OnboardingStepSecondaryActionProps = {
  children: React.ReactNode
  disabled: boolean
  onClick?: () => void
}
export function OnboardingStepSecondaryAction(
  props: OnboardingStepSecondaryActionProps,
) {
  return (
    <Button
      variant={"secondary"}
      size={"lg"}
      onClick={props.onClick}
      className={buttonClassName}
      disabled={props.disabled}
    >
      {props.children}
    </Button>
  )
}

export type OnboardingSuccessIconProps = {
  iconId: string
}
export function OnboardingSuccessIcon(props: OnboardingSuccessIconProps) {
  return (
    <div
      id={props.iconId}
      className="bg-slate-950 rounded-full size-12 lg:size-16 flex justify-center items-center"
    >
      <Check className="size-8 lg:size-10 text-white" />
    </div>
  )
}
