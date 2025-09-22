import { FormEventHandler } from "react";
import {
  formClassName,
  contentClassName,
  actionsClassName,
  successContentClassName,
  headerClassName,
  pageClassName,
  buttonClassName,
  iconContainerClassName,
  lucideIconClassName,
  sameLineClassName,
} from "./commonClassNames";
import { Button } from "@/components/ui/button";
import { LucideCheck } from "lucide-react";

export interface OnboardingStepPageProps {
  pageId: string;
  children: React.ReactNode;
}

export function OnboardingStepPage(props: OnboardingStepPageProps) {
  return (
    <div id={props.pageId} className={pageClassName}>
      {props.children}
    </div>
  );
}

export interface OnboardingStepHeaderProps {
  headerId: string;
  children: React.ReactNode;
}

export function OnboardingStepHeader(props: OnboardingStepHeaderProps) {
  return (
    <div id={props.headerId} className={headerClassName}>
      {props.children}
    </div>
  );
}

export interface OnboardingStepFormProps {
  formId: string;
  submit: FormEventHandler<HTMLFormElement> | undefined;
  children: React.ReactNode;
}

export function OnboardingStepForm(props: OnboardingStepFormProps) {
  return (
    <form id={props.formId} onSubmit={props.submit} className={formClassName}>
      {props.children}
    </form>
  );
}

export interface OnboardingStepFinishProps {
  formId: string;
  children: React.ReactNode;
}

export function OnboardingStepFinishForm(props: OnboardingStepFinishProps) {
  return (
    <div id={props.formId} className={formClassName}>
      {props.children}
    </div>
  );
}

export interface OnboardingStepContentProps {
  contentId: string;
  children: React.ReactNode;
}
export function OnboardingStepContent(props: OnboardingStepContentProps) {
  return (
    <div id={props.contentId} className={contentClassName}>
      {props.children}
    </div>
  );
}

export function OnboardingStepFinishContent(props: OnboardingStepContentProps) {
  return (
    <div id={props.contentId} className={successContentClassName}>
      {props.children}
    </div>
  );
}

export interface OnboardingStepActionsProps {
  actionsId: string;
  children: React.ReactNode;
}
export function OnboardingStepActions(props: OnboardingStepActionsProps) {
  return (
    <div id={props.actionsId} className={actionsClassName}>
      {props.children}
    </div>
  );
}

export interface OnboardingStepPrimaryActionProps {
  children: React.ReactNode;
  disabled: boolean;
}
export function OnboardingStepPrimaryAction(
  props: OnboardingStepPrimaryActionProps
) {
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
  );
}

export interface OnboardingStepSecondaryActionProps {
  children: React.ReactNode;
  disabled: boolean;
  onClick: () => void;
}
export function OnboardingStepSecondaryAction(
  props: OnboardingStepSecondaryActionProps
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
  );
}

export interface OnboardingSuccessIconProps {
  iconId: string;
}
export function OnboardingSuccessIcon(props: OnboardingSuccessIconProps) {
  return (
    <div id={props.iconId} className={iconContainerClassName}>
      <LucideCheck className={lucideIconClassName} />
    </div>
  );
}

// export interface OnboardingSameLineProps {
//   lineId: string
//   children: React.ReactNode
// }
// export function OnboardingStepSameLine(props: OnboardingSameLineProps) {
//   return <div id={props.lineId} className={sameLineClassName}>
//     {props.children}
//   </div>
// }
